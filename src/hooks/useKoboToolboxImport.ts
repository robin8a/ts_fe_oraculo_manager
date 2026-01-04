import { useState, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { ImportProgress, ImportResult, Feature, Project } from '../types/koboToolbox';
import { fetchData, downloadAudioFile, isAudioColumn } from '../services/koboToolboxApi';
import { uploadAudioFile, blobToFile } from '../services/storageService';
import { listProjects, listFeatures, listRawData } from '../graphql/queries';
import { createProject, createFeature, createTree, createRawData } from '../graphql/mutations';

export interface UseKoboToolboxImportResult {
  importData: (config: {
    serverUrl: string;
    apiKey: string;
    projectUid: string;
    format: 'json' | 'csv';
    maxRows?: number;
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
      const listResponse: any = await API.graphql({ query: listProjects });
      const projects = listResponse.data?.listProjects?.items || [];
      const existingProject = projects.find((p: Project) => p.name === projectName);

      if (existingProject) {
        updateProgress({ message: `Using existing project: ${projectName}` });
        return existingProject.id;
      }

      // Create new project
      updateProgress({ message: `Creating project: ${projectName}` });
      const createResponse: any = await API.graphql({
        query: createProject,
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
      const listResponse: any = await API.graphql({ query: listFeatures });
      const features = listResponse.data?.listFeatures?.items || [];
      const existingFeature = features.find((f: Feature) => f.name === featureName);

      if (existingFeature) {
        return { id: existingFeature.id, created: false };
      }

      // Create new feature
      const createResponse: any = await API.graphql({
        query: createFeature,
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
    maxRows?: number;
  }): Promise<ImportResult> => {
    setLoading(true);
    setError(null);
    const result: ImportResult = {
      success: false,
      treesCreated: 0,
      rowsSkipped: 0,
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
        currentStep: 'Fetching data',
        stepNumber: 1,
        totalSteps: 5,
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

      // Apply row limit if specified
      const rowsToProcess = config.maxRows ? rows.slice(0, config.maxRows) : rows;
      const totalRowsAvailable = rows.length;
      const limitMessage = config.maxRows 
        ? ` (limited to first ${config.maxRows} of ${totalRowsAvailable} total rows)`
        : '';

      updateProgress({
        stage: 'parsing',
        message: `Parsed ${rowsToProcess.length} rows${limitMessage}`,
        totalRows: rowsToProcess.length,
        progress: 10,
        currentStep: 'Parsing data',
        stepNumber: 1,
        totalSteps: 6,
      });

      // Step 2: Find or create project
      updateProgress({
        stage: 'processing',
        message: 'Finding or creating project...',
        progress: 15,
        currentStep: 'Setting up project',
        stepNumber: 2,
        totalSteps: 6,
      });
      
      const projectId = await findOrCreateProject('Levantamiento Info Parcelas');
      result.projectId = projectId;

      // Step 3: Get all column names from first row
      const firstRow = rowsToProcess[0];
      const columnNames = Object.keys(firstRow).filter(
        key => !key.startsWith('_') && key !== '_id' && key !== '_uuid' && key !== '_submission_time'
      );

      updateProgress({
        stage: 'processing',
        message: `Processing ${columnNames.length} features...`,
        progress: 20,
        currentStep: 'Creating features',
        stepNumber: 3,
        totalSteps: 6,
        totalFeatures: columnNames.length,
        featuresProcessed: 0,
      });

      // Step 4: Create or find features for each column
      const featureMap = new Map<string, string>();
      const featureIsFloatMap = new Map<string, boolean>();

      for (let featureIndex = 0; featureIndex < columnNames.length; featureIndex++) {
        const columnName = columnNames[featureIndex];
        
        updateProgress({
          stage: 'processing',
          message: `Processing feature ${featureIndex + 1} of ${columnNames.length}: ${columnName}`,
          progress: 20 + (featureIndex / columnNames.length) * 10,
          currentStep: 'Creating features',
          stepNumber: 3,
          totalSteps: 6,
          currentFeature: columnName,
          featuresProcessed: featureIndex,
          totalFeatures: columnNames.length,
        });
        // Determine if this column is numeric by checking sample values
        let isFloat = false;
        for (const row of rowsToProcess.slice(0, 10)) { // Check first 10 rows
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
          
          updateProgress({
            stage: 'processing',
            message: `Processed feature ${featureIndex + 1} of ${columnNames.length}: ${columnName}`,
            progress: 20 + ((featureIndex + 1) / columnNames.length) * 10,
            currentStep: 'Creating features',
            stepNumber: 3,
            totalSteps: 6,
            featuresProcessed: featureIndex + 1,
            totalFeatures: columnNames.length,
          });
        } catch (err: any) {
          result.errors.push(`Failed to create feature ${columnName}: ${err.message}`);
        }
      }

      // Step 4.5: Create or find special feature for storing KoboToolbox _id
      updateProgress({
        stage: 'processing',
        message: 'Setting up duplicate detection...',
        progress: 30,
        currentStep: 'Setting up duplicate detection',
        stepNumber: 4,
        totalSteps: 6,
      });

      const KOBOTOOLBOX_ID_FEATURE_NAME = '_kobotoolbox_id';
      let kobotoolboxIdFeatureId: string;
      try {
        const { id } = await findOrCreateFeature(KOBOTOOLBOX_ID_FEATURE_NAME, false);
        kobotoolboxIdFeatureId = id;
      } catch (err: any) {
        throw new Error(`Failed to create ${KOBOTOOLBOX_ID_FEATURE_NAME} feature: ${err.message}`);
      }

      // Step 4.6: Query existing processed _id values
      updateProgress({
        stage: 'processing',
        message: 'Checking for already processed rows...',
        progress: 32,
        currentStep: 'Checking duplicates',
        stepNumber: 4,
        totalSteps: 6,
      });

      const processedIds = new Set<string>();
      try {
        // Query all RawData entries for the _kobotoolbox_id feature
        let nextToken: string | null = null;
        do {
          const rawDataResponse: any = await API.graphql({
            query: listRawData,
            variables: {
              filter: {
                featureRawDatasId: { eq: kobotoolboxIdFeatureId },
              },
              limit: 1000,
              nextToken,
            },
          });

          const rawDataItems = rawDataResponse.data?.listRawData?.items || [];
          for (const item of rawDataItems) {
            if (item.valueString) {
              processedIds.add(item.valueString);
            }
          }

          nextToken = rawDataResponse.data?.listRawData?.nextToken || null;
        } while (nextToken);

        updateProgress({
          stage: 'processing',
          message: `Found ${processedIds.size} already processed rows. Starting row processing...`,
          progress: 35,
          currentStep: 'Processing rows',
          stepNumber: 5,
          totalSteps: 6,
        });
      } catch (err: any) {
        console.warn('Failed to query existing processed IDs, continuing without duplicate check:', err);
        result.errors.push(`Warning: Could not check for duplicates: ${err.message}`);
      }

      // Step 5: Process each row (create Tree and RawData entries)
      updateProgress({
        stage: 'processing',
        message: `Starting to process ${rowsToProcess.length} rows...`,
        progress: 35,
        currentStep: 'Processing rows',
        stepNumber: 5,
        totalSteps: 6,
        treesProcessed: 0,
        rawDataProcessed: 0,
        audioFilesProcessed: 0,
        rowsSkipped: 0,
      });

      for (let rowIndex = 0; rowIndex < rowsToProcess.length; rowIndex++) {
        const row = rowsToProcess[rowIndex];
        
        // Check if this row has already been processed
        const rowId = row._id;
        if (rowId && processedIds.has(String(rowId))) {
          result.rowsSkipped++;
          updateProgress({
            stage: 'processing',
            message: `Skipping row ${rowIndex + 1} of ${rowsToProcess.length} (already processed: _id=${rowId})...`,
            currentRow: rowIndex + 1,
            totalRows: rowsToProcess.length,
            rowsSkipped: result.rowsSkipped,
            progress: 35 + ((rowIndex + 1) / rowsToProcess.length) * 60,
            currentStep: 'Processing rows',
            stepNumber: 5,
            totalSteps: 6,
            treesProcessed: result.treesCreated,
            rawDataProcessed: result.rawDataCreated,
            audioFilesProcessed: result.audioFilesUploaded,
          });
          continue; // Skip this row
        }
        
        updateProgress({
          stage: 'processing',
          message: `Processing row ${rowIndex + 1} of ${rowsToProcess.length}${limitMessage}...`,
          currentRow: rowIndex + 1,
          totalRows: rowsToProcess.length,
          rowsSkipped: result.rowsSkipped,
          progress: 35 + (rowIndex / rowsToProcess.length) * 60,
          currentStep: 'Processing rows',
          stepNumber: 5,
          totalSteps: 6,
          treesProcessed: result.treesCreated,
          rawDataProcessed: result.rawDataCreated,
          audioFilesProcessed: result.audioFilesUploaded,
        });

        try {
          // Create Tree for this row
          const treeName = `Tree ${rowIndex + 1}`;
          const treeResponse: any = await API.graphql({
            query: createTree,
            variables: {
              input: {
                name: treeName,
                status: 'active',
                projectTreesId: projectId,
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

                // Extract full download URL
                // According to KoboToolbox API docs, audio files should be at:
                // https://[server_url]/media/[username]/attachments/[filename]
                // Priority: 1) download_url from _attachments, 2) construct from filename
                let audioUrl = value;
                let audioFilename = value;
                console.log(`Audio column "${columnName}" value:`, value);
                console.log(`Row attachments:`, row._attachments);
                
                // First, check if _attachments array has a download_url (most reliable)
                if (row._attachments && Array.isArray(row._attachments)) {
                  // Try to find attachment by filename match
                  const attachment = row._attachments.find((att: any) => {
                    if (!att) return false;
                    const attFilename = att.filename || '';
                    const attUrl = att.download_url || '';
                    const valueStr = String(value);
                    return (
                      attFilename === valueStr ||
                      attFilename.includes(valueStr) ||
                      valueStr.includes(attFilename) ||
                      attUrl.includes(valueStr) ||
                      valueStr.includes(attUrl.split('/').pop() || '')
                    );
                  }) || row._attachments[0]; // Fallback to first attachment if no match
                  
                  if (attachment?.download_url) {
                    // Use the download_url directly (most reliable)
                    audioUrl = attachment.download_url;
                    audioFilename = attachment.filename || audioFilename;
                    console.log(`Found attachment download_url: ${audioUrl}`);
                  } else if (attachment?.filename) {
                    // Construct URL using proper KoboToolbox media format
                    // Format: https://[server_url]/media/[username]/attachments/[filename]
                    const baseUrl = config.serverUrl.startsWith('http') 
                      ? config.serverUrl.replace(/\/$/, '') // Remove trailing slash
                      : `https://${config.serverUrl}`;
                    
                    // Extract username from submission or use 'original' as fallback
                    // The username is typically in the submission metadata or can be derived
                    // For now, try 'original' which is a common path
                    const filename = attachment.filename;
                    audioFilename = filename;
                    
                    // Try the standard format first: /media/[username]/attachments/[filename]
                    // If we have the submission owner info, use it; otherwise try 'original'
                    audioUrl = `${baseUrl}/media/original/attachments/${filename}`;
                    console.log(`Constructed media URL from attachment filename: ${audioUrl}`);
                  }
                }
                
                // If still not a full URL, construct it using KoboToolbox media format
                if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
                  const baseUrl = config.serverUrl.startsWith('http') 
                    ? config.serverUrl.replace(/\/$/, '') // Remove trailing slash
                    : `https://${config.serverUrl}`;
                  
                  // KoboToolbox media URL format: /media/[username]/attachments/[filename]
                  if (audioUrl.startsWith('/')) {
                    // Already has leading slash, just prepend base URL
                    audioUrl = `${baseUrl}${audioUrl}`;
                  } else {
                    // Construct full path: /media/original/attachments/[filename]
                    audioUrl = `${baseUrl}/media/original/attachments/${audioUrl}`;
                  }
                  console.log(`Constructed media URL: ${audioUrl}`);
                }

                console.log(`Final audio URL: ${audioUrl}`);
                console.log(`Audio filename: ${audioFilename}`);

                // Download audio file (pass serverUrl for URL construction if needed)
                const audioBlob = await downloadAudioFile(audioUrl, config.apiKey, config.serverUrl);
                
                // Detect original file extension from filename, URL, or MIME type
                let fileExtension = 'm4a'; // Default to m4a for KoboToolbox audio
                
                // First, try to extract from filename
                if (audioFilename) {
                  const filenameLower = audioFilename.toLowerCase();
                  const extMatch = filenameLower.match(/\.(m4a|mp3|wav|ogg|aac|mp4)$/);
                  if (extMatch) {
                    fileExtension = extMatch[1] === 'mp4' ? 'm4a' : extMatch[1]; // mp4 audio is typically m4a
                  }
                }
                
                // If not found in filename, check URL
                if (fileExtension === 'm4a') {
                  const urlLower = audioUrl.toLowerCase();
                  if (urlLower.includes('.mp3')) {
                    fileExtension = 'mp3';
                  } else if (urlLower.includes('.wav')) {
                    fileExtension = 'wav';
                  } else if (urlLower.includes('.ogg')) {
                    fileExtension = 'ogg';
                  } else if (urlLower.includes('.aac')) {
                    fileExtension = 'aac';
                  } else if (urlLower.includes('.m4a')) {
                    fileExtension = 'm4a';
                  } else if (urlLower.includes('.mp4')) {
                    fileExtension = 'm4a'; // mp4 audio files are typically m4a
                  }
                }
                
                // If still default, check MIME type
                if (fileExtension === 'm4a' && audioBlob.type) {
                  const mimeType = audioBlob.type.toLowerCase();
                  if (mimeType.includes('mp3') || mimeType.includes('mpeg')) {
                    fileExtension = 'mp3';
                  } else if (mimeType.includes('wav') || mimeType.includes('wave')) {
                    fileExtension = 'wav';
                  } else if (mimeType.includes('ogg')) {
                    fileExtension = 'ogg';
                  } else if (mimeType.includes('aac')) {
                    fileExtension = 'aac';
                  } else if (mimeType.includes('m4a') || mimeType.includes('mp4') || mimeType.includes('x-m4a')) {
                    fileExtension = 'm4a';
                  }
                }
                
                console.log(`Detected file extension: ${fileExtension}, MIME type: ${audioBlob.type}`);
                const audioFile = blobToFile(audioBlob, `${columnName}_${rowIndex + 1}.${fileExtension}`);

                // Upload to S3
                updateProgress({
                  stage: 'uploading',
                  message: `Uploading audio file ${result.audioFilesUploaded + 1} to S3...`,
                  currentStep: 'Uploading audio',
                  stepNumber: 6,
                  totalSteps: 6,
                  audioFilesProcessed: result.audioFilesUploaded,
                });

                const s3Url = await uploadAudioFile(audioFile, treeId, columnName);
                result.audioFilesUploaded++;

                // Create RawData with S3 URL
                await API.graphql({
                  query: createRawData,
                  variables: {
                    input: {
                      name: columnName,
                      valueString: s3Url,
                      treeRawDataId: treeId,
                      featureRawDatasId: featureId,
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
                  query: createRawData,
                  variables: {
                    input: {
                      name: columnName,
                      valueFloat: isFloat && isNumeric(value) ? Number(value) : undefined,
                      valueString: !isFloat || !isNumeric(value) ? String(value) : undefined,
                      treeRawDataId: treeId,
                      featureRawDatasId: featureId,
                    },
                  },
                });

                result.rawDataCreated++;
              } catch (err: any) {
                result.errors.push(`Failed to create RawData for ${columnName} in row ${rowIndex + 1}: ${err.message}`);
              }
            }
          }

          // Store the KoboToolbox _id in RawData for duplicate detection
          if (rowId) {
            try {
              await API.graphql({
                query: createRawData,
                variables: {
                  input: {
                    name: KOBOTOOLBOX_ID_FEATURE_NAME,
                    valueString: String(rowId),
                    treeRawDataId: treeId,
                    featureRawDatasId: kobotoolboxIdFeatureId,
                  },
                },
              });
              result.rawDataCreated++;
              // Add to processedIds set to avoid duplicates within the same import session
              processedIds.add(String(rowId));
            } catch (err: any) {
              result.errors.push(`Failed to store _id for row ${rowIndex + 1}: ${err.message}`);
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

