import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import { listProjects, listTrees, listRawData, listFeatures } from '../graphql/queries';
import type { ProjectWithTrees, TreeWithFeatures, FeatureInfo } from '../types/projectTreeFeature';

export interface UseProjectTreeFeatureResult {
  projects: ProjectWithTrees[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjectTreeFeature(): UseProjectTreeFeatureResult {
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
      const featuresMap = new Map<string, FeatureInfo>();
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

      // Step 2: Fetch all Projects
      const projectsResponse: any = await API.graphql({
        query: listProjects,
      });

      const projectsData = projectsResponse.data?.listProjects?.items || [];
      if (projectsData.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      // Step 3: For each Project, fetch Trees and then RawData
      const projectsWithTrees: ProjectWithTrees[] = await Promise.all(
        projectsData.map(async (project: any) => {
          // Fetch Trees for this project
          const treesResponse: any = await API.graphql({
            query: listTrees,
            variables: {
              filter: {
                projectTreesId: { eq: project.id },
              },
            },
          });

          const treesData = treesResponse.data?.listTrees?.items || [];

          // Step 4: For each Tree, fetch RawData and match Features
          const treesWithFeatures: TreeWithFeatures[] = await Promise.all(
            treesData.map(async (tree: any) => {
              // Fetch RawData for this tree
              const rawDataResponse: any = await API.graphql({
                query: listRawData,
                variables: {
                  filter: {
                    treeRawDataId: { eq: tree.id },
                  },
                },
              });

              const rawDataItems = rawDataResponse.data?.listRawData?.items || [];

              // Extract unique Features from RawData entries using the features map
              const featureMap = new Map<string, FeatureInfo>();
              rawDataItems.forEach((rawData: any) => {
                if (rawData.featureRawDatasId && featuresMap.has(rawData.featureRawDatasId)) {
                  const featureId = rawData.featureRawDatasId;
                  if (!featureMap.has(featureId)) {
                    featureMap.set(featureId, featuresMap.get(featureId)!);
                  }
                }
              });

              return {
                id: tree.id,
                name: tree.name,
                status: tree.status || null,
                projectTreesId: tree.projectTreesId || null,
                templateTreesId: tree.templateTreesId || null,
                createdAt: tree.createdAt || null,
                updatedAt: tree.updatedAt || null,
                features: Array.from(featureMap.values()),
              };
            })
          );

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { projects, loading, error, refetch: fetchData };
}

