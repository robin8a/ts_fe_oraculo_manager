import { useState, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { ImportProgress, ImportResult, Feature, Project } from '../types/koboToolbox';
import { fetchData, downloadAudioFile, isAudioColumn } from '../services/koboToolboxApi';
import { uploadAudioFile, blobToFile } from '../services/storageService';

// GraphQL Queries
const LIST_PROJECTS = `
  query ListProjects {
    listProjects {
      items {
        id
        name
        status
      }
    }
  }
`;

const LIST_FEATURES = `
  query ListFeatures {
    listFeatures {
      items {
        id
        name
        feature_type
        is_float
      }
    }
  }
`;

// GraphQL Mutations
const CREATE_PROJECT = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      status
    }
  }
`;

const CREATE_FEATURE = `
  mutation CreateFeature($input: CreateFeatureInput!) {
    createFeature(input: $input) {
      id
      name
      feature_type
      is_float
    }
  }
`;

const CREATE_TREE = `
  mutation CreateTree($input: CreateTreeInput!) {
    createTree(input: $input) {
      id
      name
      status
      projectId
    }
  }
`;

const CREATE_RAW_DATA = `
  mutation CreateRawData($input: CreateRawDataInput!) {
    createRawData(input: $input) {
      id
      name
      valueFloat
      valueString
      featureId
      treeId
    }
  }
`;

export interface UseKoboToolboxImportResult {
  importData: (config: {
    serverUrl: string;
    apiKey: string;
    projectUid: string;
    format: 'json' | 'csv';
  }) => Promise<ImportResult>;
  progress: ImportProgress;
  loading: boolean;
  error: string | null;
}

export function useKoboToolboxImport(): UseKoboToolboxImportResult {
  const [progress, setProgress] = useState<ImportProgress>({
    stage: 'idle',
    message: 'Ready to import',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback((update: Partial<ImportProgress>) => {
    setProgress((prev) => ({ ...prev, ...update }));
  }, []);

  const findOrCreateProject = useCallback(async (projectName: string): Promise<string> => {
    try {
      // Try to find existing project
      const listResponse: any = await API.graphql({ query: LIST_PROJECTS });
      const projects = listResponse.data?.listProjects?.items || [];
      const existingProject = projects.find((p: Project) => p.name === projectName);

      if (existingProject) {
        updateProgress({ message: `Using existing project: ${projectName}` });
        return existingProject.id;
      }

      // Create new project
      updateProgress({ message: `Creating project: ${projectName}` });
      const createResponse: any = await API.graphql({
        query: CREATE_PROJECT,
        variables: {
          input: {
            name: projectName,
            status: 'active',
          },
        },
      });

      return createResponse.data?.createProject?.id;
    } catch (err: any) {
      throw new Error(`Failed to find or create project: ${err.message}`);
    }
  }, [updateProgress]);

  const findOrCreateFeature = useCallback(async (
    featureName: string,
    isFloat: boolean
  ): Promise<{ id: string; created: boolean }> => {
    try {
      // Try to find existing feature
      const listResponse: any = await API.graphql({ query: LIST_FEATURES });
      const features = listResponse.data?.listFeatures?.items || [];
      const existingFeature = features.find((f: Feature) => f.name === featureName);

      if (existingFeature) {
        return { id: existingFeature.id, created: false };
      }

      // Create new feature
      const createResponse: any = await API.graphql({
        query: CREATE_FEATURE,
        variables: {
          input: {
            name: featureName,
            feature_type: 'variable',
            is_float: isFloat,
          },
        },
      });

      return { id: createResponse.data?.createFeature?.id, created: true };
    } catch (err: any) {
      throw new Error(`Failed to find or create feature: ${err.message}`);
    }
  }, []);

  const isNumeric = useCallback((value: any): boolean => {
    if (value === null || value === undefined || value === '') return false;
    return !isNaN(Number(value)) && isFinite(Number(value));
  }, []);

  const importData = useCallback(async (config: {
    serverUrl: string;
    apiKey: string;
    projectUid: string;
    format: 'json' | 'csv';
  }): Promise<ImportResult> => {
    setLoading(true);
    setError(null);
    const result: ImportResult = {
      success: false,
      treesCreated: 0,
      featuresCreated: 0,
      featuresSkipped: 0,
      rawDataCreated: 0,
      audioFilesUploaded: 0,
      errors: [],
    };

    try {
      // Step 1: Fetch data from KoboToolbox
      updateProgress({
        stage: 'fetching',
        message: 'Fetching data from KoboToolbox...',
        progress: 0,
      });

      const rows = await fetchData(
        config.serverUrl,
        config.apiKey,
        config.projectUid,
        config.format
      );

      if (rows.length === 0) {
        throw new Error('No data found in KoboToolbox project');
      }

      updateProgress({
        stage: 'parsing',
        message: `Parsed ${rows.length} rows`,
        totalRows: rows.length,
        progress: 10,
      });

      // Step 2: Find or create project
      const projectId = await findOrCreateProject('Levantamiento Info Parcelas');
      result.projectId = projectId;

      // Step 3: Get all column names from first row
      const firstRow = rows[0];
      const columnNames = Object.keys(firstRow).filter(
        key => !key.startsWith('_') && key !== '_id' && key !== '_uuid' && key !== '_submission_time'
      );

      updateProgress({
        stage: 'processing',
        message: 'Processing features and trees...',
        progress: 20,
      });

      // Step 4: Create or find features for each column
      const featureMap = new Map<string, string>();
      const featureIsFloatMap = new Map<string, boolean>();

      for (const columnName of columnNames) {
        // Determine if this column is numeric by checking sample values
        let isFloat = false;
        for (const row of rows.slice(0, 10)) { // Check first 10 rows
          const value = row[columnName];
          if (value !== null && value !== undefined && value !== '') {
            isFloat = isNumeric(value);
            break;
          }
        }

        try {
          const { id: featureId, created } = await findOrCreateFeature(columnName, isFloat);
          featureMap.set(columnName, featureId);
          featureIsFloatMap.set(columnName, isFloat);
          
          if (created) {
            result.featuresCreated++;
          } else {
            result.featuresSkipped++;
          }
        } catch (err: any) {
          result.errors.push(`Failed to create feature ${columnName}: ${err.message}`);
        }
      }

      // Step 5: Process each row (create Tree and RawData entries)
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        
        updateProgress({
          stage: 'processing',
          message: `Processing row ${rowIndex + 1} of ${rows.length}...`,
          currentRow: rowIndex + 1,
          totalRows: rows.length,
          progress: 20 + (rowIndex / rows.length) * 60,
        });

        try {
          // Create Tree for this row
          const treeName = `Tree ${rowIndex + 1}`;
          const treeResponse: any = await API.graphql({
            query: CREATE_TREE,
            variables: {
              input: {
                name: treeName,
                status: 'active',
                projectId: projectId,
              },
            },
          });

          const treeId = treeResponse.data?.createTree?.id;
          if (!treeId) {
            throw new Error('Failed to create tree');
          }

          result.treesCreated++;

          // Create RawData entries for each column
          for (const columnName of columnNames) {
            const featureId = featureMap.get(columnName);
            if (!featureId) continue;

            const value = row[columnName];
            if (value === null || value === undefined || value === '') continue;

            const isFloat = featureIsFloatMap.get(columnName) || false;

            // Check if this is an audio column
            if (isAudioColumn(columnName, value)) {
              try {
                updateProgress({
                  message: `Downloading audio for ${columnName}...`,
                  currentFeature: columnName,
                });

                // Download audio file
                const audioBlob = await downloadAudioFile(value, config.apiKey);
                const audioFile = blobToFile(audioBlob, `${columnName}_${rowIndex + 1}.mp3`);

                // Upload to S3
                updateProgress({
                  message: `Uploading audio to S3...`,
                });

                const s3Url = await uploadAudioFile(audioFile, treeId, columnName);
                result.audioFilesUploaded++;

                // Create RawData with S3 URL
                await API.graphql({
                  query: CREATE_RAW_DATA,
                  variables: {
                    input: {
                      name: columnName,
                      valueString: s3Url,
                      featureId: featureId,
                      treeId: treeId,
                    },
                  },
                });

                result.rawDataCreated++;
              } catch (err: any) {
                result.errors.push(`Failed to process audio for ${columnName} in row ${rowIndex + 1}: ${err.message}`);
              }
            } else {
              // Create RawData entry with value
              try {
                await API.graphql({
                  query: CREATE_RAW_DATA,
                  variables: {
                    input: {
                      name: columnName,
                      valueFloat: isFloat && isNumeric(value) ? Number(value) : undefined,
                      valueString: !isFloat || !isNumeric(value) ? String(value) : undefined,
                      featureId: featureId,
                      treeId: treeId,
                    },
                  },
                });

                result.rawDataCreated++;
              } catch (err: any) {
                result.errors.push(`Failed to create RawData for ${columnName} in row ${rowIndex + 1}: ${err.message}`);
              }
            }
          }
        } catch (err: any) {
          result.errors.push(`Failed to process row ${rowIndex + 1}: ${err.message}`);
        }
      }

      updateProgress({
        stage: 'completed',
        message: 'Import completed successfully!',
        progress: 100,
      });

      result.success = true;
    } catch (err: any) {
      console.error('Import error:', err);
      const errorMessage = err.message || err.toString() || 'Import failed';
      const fullError = err.stack ? `${errorMessage}\n\nStack: ${err.stack}` : errorMessage;
      setError(fullError);
      updateProgress({
        stage: 'error',
        message: `Error: ${errorMessage}`,
      });
      result.errors.push(errorMessage);
    } finally {
      setLoading(false);
    }

    return result;
  }, [updateProgress, findOrCreateProject, findOrCreateFeature, isNumeric]);

  return { importData, progress, loading, error };
}

