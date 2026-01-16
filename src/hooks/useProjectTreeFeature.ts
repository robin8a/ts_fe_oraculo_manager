import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import { listFeatures, listProjects } from '../graphql/queries';
import type { ProjectWithTrees, TreeWithFeatures, FeatureInfo, RawDataInfo } from '../types/projectTreeFeature';

// Enhanced query to get Trees with RawData for a specific project
const listTreesWithRawData = /* GraphQL */ `
  query ListTreesWithRawData(
    $filter: ModelTreeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        are_audios_processed
        status
        templateTreesId
        projectTreesId
        createdAt
        updatedAt
        rawData {
          items {
            id
            name
            valueFloat
            valueString
            start_date
            end_date
            treeRawDataId
            featureRawDatasId
            createdAt
            updatedAt
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

// Enhanced query to get TemplateFeatures with feature details
const listTemplateFeaturesWithDetails = /* GraphQL */ `
  query ListTemplateFeaturesWithDetails(
    $filter: ModelTemplateFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplateFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        templateTemplateFeaturesId
        featureTemplateFeaturesId
        feature {
          id
          feature_type
          name
          description
          feature_group
          default_value
          is_float
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;

export interface UseProjectTreeFeatureResult {
  projects: ProjectWithTrees[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjectTreeFeature(treeLimit?: number): UseProjectTreeFeatureResult {
  const [projects, setProjects] = useState<ProjectWithTrees[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch all Features once (to avoid multiple queries)
      const featuresResponse: any = await API.graphql({
        query: listFeatures,
      });
      const allFeatures = featuresResponse.data?.listFeatures?.items || [];
      
      // Create a map of feature ID to feature data for quick lookup
      const featuresMap = new Map<string, Omit<FeatureInfo, 'rawData'>>();
      allFeatures.forEach((feature: any) => {
        featuresMap.set(feature.id, {
          id: feature.id,
          name: feature.name || '',
          feature_type: feature.feature_type || null,
          feature_group: feature.feature_group || null,
          description: feature.description || null,
          default_value: feature.default_value || null,
          is_float: feature.is_float || null,
        });
      });

      // Step 2: Fetch all TemplateFeatures with feature details
      const templateFeaturesResponse: any = await API.graphql({
        query: listTemplateFeaturesWithDetails,
      });
      const allTemplateFeatures = templateFeaturesResponse.data?.listTemplateFeatures?.items || [];
      
      // Group TemplateFeatures by template ID
      const featuresByTemplate = new Map<string, Set<string>>();
      allTemplateFeatures.forEach((tf: any) => {
        if (tf.templateTemplateFeaturesId && tf.featureTemplateFeaturesId) {
          if (!featuresByTemplate.has(tf.templateTemplateFeaturesId)) {
            featuresByTemplate.set(tf.templateTemplateFeaturesId, new Set());
          }
          featuresByTemplate.get(tf.templateTemplateFeaturesId)!.add(tf.featureTemplateFeaturesId);
        }
      });

      // Step 3: Fetch all Projects
      const projectsResponse: any = await API.graphql({
        query: listProjects,
      });

      const projectsData = projectsResponse.data?.listProjects?.items || [];
      console.log('Projects data:', projectsData);
      console.log('Number of projects:', projectsData.length);
      
      if (projectsData.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      // Step 4: For each Project, fetch Trees with RawData
      const projectsWithTrees: ProjectWithTrees[] = await Promise.all(
        projectsData.map(async (project: any) => {
          // Fetch Trees with RawData for this project
          const treesResponse: any = await API.graphql({
            query: listTreesWithRawData,
            variables: {
              filter: {
                projectTreesId: { eq: project.id },
              },
              limit: treeLimit || undefined,
            },
          });

          const treesData = treesResponse.data?.listTrees?.items || [];

        const treesWithFeatures: TreeWithFeatures[] = treesData.map((tree: any) => {
          // Get rawData items for this tree
          const rawDataItems = tree.rawData?.items || [];
          console.log(`Tree ${tree.id} (${tree.name}): ${rawDataItems.length} rawData items`);

          // Group RawData entries by featureId
          const rawDataByFeature = new Map<string, RawDataInfo[]>();
          rawDataItems.forEach((rawData: any) => {
            if (rawData.featureRawDatasId) {
              const featureId = rawData.featureRawDatasId;
              if (!rawDataByFeature.has(featureId)) {
                rawDataByFeature.set(featureId, []);
              }
              rawDataByFeature.get(featureId)!.push({
                id: rawData.id,
                name: rawData.name || null,
                valueFloat: rawData.valueFloat || null,
                valueString: rawData.valueString || null,
                start_date: rawData.start_date || null,
                end_date: rawData.end_date || null,
                createdAt: rawData.createdAt || null,
                updatedAt: rawData.updatedAt || null,
              });
            } else {
              console.warn('RawData item without featureRawDatasId:', rawData.id);
            }
          });

          // Get features from template if tree has a template
          const templateFeatureIds = tree.templateTreesId 
            ? featuresByTemplate.get(tree.templateTreesId) || new Set<string>()
            : new Set<string>();

          // Create FeatureInfo objects - include all features from template, merge RawData if available
          const featuresMapForTree = new Map<string, FeatureInfo>();
          
          // First, add all features from the template (even without RawData)
          templateFeatureIds.forEach((featureId) => {
            if (featuresMap.has(featureId)) {
              const featureBase = featuresMap.get(featureId)!;
              featuresMapForTree.set(featureId, {
                ...featureBase,
                rawData: rawDataByFeature.get(featureId) || [],
              });
            }
          });

          // Also include features that have RawData but might not be in template
          rawDataByFeature.forEach((rawDataArray, featureId) => {
            if (featuresMap.has(featureId) && !featuresMapForTree.has(featureId)) {
              const featureBase = featuresMap.get(featureId)!;
              featuresMapForTree.set(featureId, {
                ...featureBase,
                rawData: rawDataArray,
              });
            }
            // If feature already exists (from template), RawData was already set above
          });

          const features = Array.from(featuresMapForTree.values());

          return {
            id: tree.id,
            name: tree.name,
            status: tree.status || null,
            projectTreesId: tree.projectTreesId || null,
            templateTreesId: tree.templateTreesId || null,
            createdAt: tree.createdAt || null,
            updatedAt: tree.updatedAt || null,
            features: features,
          };
        });

          return {
            id: project.id,
            name: project.name,
            status: project.status,
            createdAt: project.createdAt || null,
            updatedAt: project.updatedAt || null,
            trees: treesWithFeatures,
          };
        })
      );

      setProjects(projectsWithTrees);
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message || err?.message || 'Failed to fetch Project Tree Feature data';
      setError(errorMessage);
      console.error('Error fetching Project Tree Feature data:', err);
    } finally {
      setLoading(false);
    }
  }, [treeLimit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { projects, loading, error, refetch: fetchData };
}

