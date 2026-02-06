import { useState, useCallback } from 'react';
import { API } from 'aws-amplify';
import { listFeatures, listRawData } from '../graphql/queries';
import type { TreeWithFeatures, FeatureInfo, RawDataInfo } from '../types/projectTreeFeature';

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

export interface UseProjectTreesResult {
  trees: TreeWithFeatures[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjectTrees(projectId: string | null): UseProjectTreesResult {
  const [trees, setTrees] = useState<TreeWithFeatures[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!projectId) {
      setTrees([]);
      setError('Select a project first');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const featuresResponse: any = await API.graphql({
        query: listFeatures,
      });
      const allFeatures = featuresResponse.data?.listFeatures?.items || [];
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

      const templateFeaturesResponse: any = await API.graphql({
        query: listTemplateFeaturesWithDetails,
      });
      const allTemplateFeatures =
        templateFeaturesResponse.data?.listTemplateFeatures?.items || [];
      const featuresByTemplate = new Map<string, Set<string>>();
      allTemplateFeatures.forEach((tf: any) => {
        if (tf.templateTemplateFeaturesId && tf.featureTemplateFeaturesId) {
          if (!featuresByTemplate.has(tf.templateTemplateFeaturesId)) {
            featuresByTemplate.set(tf.templateTemplateFeaturesId, new Set());
          }
          featuresByTemplate
            .get(tf.templateTemplateFeaturesId)!
            .add(tf.featureTemplateFeaturesId);
        }
      });

      const allTreesData: any[] = [];
      let nextToken: string | null | undefined = undefined;
      const pageSize = 100;

      do {
        const treesResponse: any = await API.graphql({
          query: listTreesWithRawData,
          variables: {
            filter: { projectTreesId: { eq: projectId } },
            limit: pageSize,
            nextToken: nextToken || undefined,
          },
        });

        const pageTrees = treesResponse.data?.listTrees?.items || [];
        allTreesData.push(...pageTrees);
        nextToken = treesResponse.data?.listTrees?.nextToken;
      } while (nextToken);

      const treesWithFeatures: TreeWithFeatures[] = [];

      for (const tree of allTreesData) {
        try {
          let rawDataItems = tree.rawData?.items || [];
          let rawDataNextToken = tree.rawData?.nextToken;

          if (rawDataNextToken) {
            const allRawDataItems = [...rawDataItems];
            while (rawDataNextToken) {
              try {
                const rawDataResponse: any = await API.graphql({
                  query: listRawData,
                  variables: {
                    filter: { treeRawDataId: { eq: tree.id } },
                    limit: 1000,
                    nextToken: rawDataNextToken,
                  },
                });
                const pageRawData =
                  rawDataResponse.data?.listRawData?.items || [];
                allRawDataItems.push(...pageRawData);
                rawDataNextToken =
                  rawDataResponse.data?.listRawData?.nextToken;
              } catch {
                break;
              }
            }
            rawDataItems = allRawDataItems;
          }

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
            }
          });

          const templateFeatureIds = tree.templateTreesId
            ? featuresByTemplate.get(tree.templateTreesId) || new Set<string>()
            : new Set<string>();

          const featuresMapForTree = new Map<string, FeatureInfo>();
          templateFeatureIds.forEach((featureId) => {
            if (featuresMap.has(featureId)) {
              const featureBase = featuresMap.get(featureId)!;
              featuresMapForTree.set(featureId, {
                ...featureBase,
                rawData: rawDataByFeature.get(featureId) || [],
              });
            }
          });
          rawDataByFeature.forEach((rawDataArray, featureId) => {
            if (
              featuresMap.has(featureId) &&
              !featuresMapForTree.has(featureId)
            ) {
              const featureBase = featuresMap.get(featureId)!;
              featuresMapForTree.set(featureId, {
                ...featureBase,
                rawData: rawDataArray,
              });
            }
          });

          const features = Array.from(featuresMapForTree.values());
          treesWithFeatures.push({
            id: tree.id,
            name: tree.name,
            status: tree.status || null,
            are_audios_processed: tree.are_audios_processed || null,
            projectTreesId: tree.projectTreesId || null,
            templateTreesId: tree.templateTreesId || null,
            createdAt: tree.createdAt || null,
            updatedAt: tree.updatedAt || null,
            features,
          });
        } catch (treeErr: any) {
          console.error(`Error processing tree ${tree.id}:`, treeErr);
        }
      }

      setTrees(treesWithFeatures);
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message ||
        err?.message ||
        'Failed to fetch trees for project';
      setError(errorMessage);
      setTrees([]);
      console.error('Error fetching project trees:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return { trees, loading, error, refetch };
}
