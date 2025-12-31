import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { 
  deleteProject, 
  deleteTree, 
  deleteFeature, 
  deleteRawData 
} from '../../graphql/mutations';
import { listProjects, listTrees, listRawData, listFeatures } from '../../graphql/queries';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  TrashIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  DocumentIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { ProjectWithTrees, TreeWithFeatures, FeatureInfo } from '../../types/projectTreeFeature';

// Helper function to fetch all items with pagination
const fetchAllWithPagination = async <T,>(
  query: any,
  variables: any = {},
  extractItems: (response: any) => T[],
  getNextToken: (response: any) => string | null = (response) => {
    // Try to find nextToken in the response data
    const data = response.data || {};
    const firstKey = Object.keys(data)[0];
    return data[firstKey]?.nextToken || null;
  }
): Promise<T[]> => {
  const allItems: T[] = [];
  let nextToken: string | null = null;

  do {
    try {
      const response: any = await API.graphql({
        query,
        variables: {
          ...variables,
          limit: 1000, // Maximum items per page
          nextToken,
        },
      });

      // Check for GraphQL errors in the response
      if (response.errors && response.errors.length > 0) {
        console.error('GraphQL errors in pagination:', response.errors);
        // If it's a permission or data issue, return what we have so far
        // Don't break completely, just log and continue
        const errorMessage = response.errors[0]?.message || 'Unknown error';
        if (errorMessage.includes('Not Authorized') || errorMessage.includes('permission')) {
          console.warn('Authorization error, stopping pagination');
          break;
        }
      }

      // Check if data is null (can happen with errors)
      if (!response.data) {
        console.warn('No data in response, stopping pagination');
        break;
      }

      const items = extractItems(response);
      if (items && Array.isArray(items)) {
        allItems.push(...items);
      }

      nextToken = getNextToken(response);
    } catch (err: any) {
      console.error('Error in pagination:', err);
      // If it's a network error or similar, break
      // If it's a GraphQL error in the catch, it might have been handled above
      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0]?.message || 'Unknown error';
        if (errorMessage.includes('Not Authorized') || errorMessage.includes('permission')) {
          console.warn('Authorization error, stopping pagination');
        }
      }
      break;
    }
  } while (nextToken);

  return allItems;
};

type DeleteType = 'project' | 'tree' | 'feature';

interface DeleteItem {
  type: DeleteType;
  id: string;
  name: string;
  cascadeCount?: {
    trees?: number;
    rawData?: number;
    features?: number;
  };
}

export const DeleteProjectTreeFeature: React.FC = () => {
  const [allProjects, setAllProjects] = useState<ProjectWithTrees[]>([]);
  const [allTrees, setAllTrees] = useState<TreeWithFeatures[]>([]);
  const [allFeatures, setAllFeatures] = useState<FeatureInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DeleteItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  // Pagination state for trees
  const [treesPage, setTreesPage] = useState(1);
  const treesPerPage = 100;
  const [totalTreesCount, setTotalTreesCount] = useState(0);
  const [loadingTrees, setLoadingTrees] = useState(false);
  const [featuresMap, setFeaturesMap] = useState<Map<string, FeatureInfo>>(new Map());

  // Fetch projects and features (smaller datasets, load once)
  const fetchProjectsAndFeatures = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all projects with pagination
      const projects = await fetchAllWithPagination(
        listProjects,
        {},
        (response) => response.data?.listProjects?.items || []
      );

      // Fetch all features with pagination
      const features = await fetchAllWithPagination(
        listFeatures,
        {},
        (response) => response.data?.listFeatures?.items || []
      );

      // Create features map
      const map = new Map<string, FeatureInfo>();
      features.forEach((feature: any) => {
        map.set(feature.id, {
          id: feature.id,
          name: feature.name || '',
          feature_type: feature.feature_type || null,
          feature_group: feature.feature_group || null,
          description: feature.description || null,
          default_value: feature.default_value || null,
          is_float: feature.is_float || null,
        });
      });
      setFeaturesMap(map);

      // Store projects (without trees initially)
      const projectsData: ProjectWithTrees[] = projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        createdAt: project.createdAt || null,
        updatedAt: project.updatedAt || null,
        trees: [],
      }));
      setAllProjects(projectsData);

      // Get total count of trees across all projects
      let totalCount = 0;
      for (const project of projects) {
        const treesResponse: any = await API.graphql({
          query: listTrees,
          variables: {
            filter: { projectTreesId: { eq: project.id } },
            limit: 1, // Just to get count
          },
        });
        // Get total by checking if there's a nextToken or counting items
        // For now, we'll fetch trees page by page
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message || err?.message || 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trees for current page only (lazy loading)
  const fetchTreesPage = async (page: number) => {
    try {
      setLoadingTrees(true);
      
      // Fetch all projects first to get their IDs
      const projects = allProjects.length > 0 ? allProjects : await fetchAllWithPagination(
        listProjects,
        {},
        (response) => response.data?.listProjects?.items || []
      );

      // Collect all trees from all projects sequentially (to avoid too many concurrent requests)
      const allTreesList: (TreeWithFeatures & { projectId: string; projectName: string })[] = [];
      
      // Calculate how many trees we need
      const startIndex = (page - 1) * treesPerPage;
      const endIndex = startIndex + treesPerPage;
      let currentIndex = 0;
      
      // Fetch trees sequentially from each project until we have enough for the page
      for (const project of projects) {
        if (allTreesList.length >= treesPerPage) break;
        
        // Fetch trees for this project with pagination
        let projectNextToken: string | null = null;
        let projectTrees: any[] = [];
        
        do {
          try {
            const treesResponse: any = await API.graphql({
              query: listTrees,
              variables: {
                filter: { projectTreesId: { eq: project.id } },
                limit: 100,
                nextToken: projectNextToken,
              },
            });

            if (treesResponse.errors && treesResponse.errors.length > 0) {
              console.warn('Error fetching trees for project:', project.name, treesResponse.errors);
              break;
            }

            const trees = treesResponse.data?.listTrees?.items || [];
            projectTrees.push(...trees);
            projectNextToken = treesResponse.data?.listTrees?.nextToken || null;
          } catch (err) {
            console.error('Error fetching trees for project:', project.name, err);
            break;
          }
        } while (projectNextToken && allTreesList.length < endIndex);

        // Add trees from this project that fall within the current page range
        for (const tree of projectTrees) {
          if (currentIndex >= startIndex && currentIndex < endIndex) {
            allTreesList.push({
              id: tree.id,
              name: tree.name,
              status: tree.status || null,
              projectTreesId: tree.projectTreesId || null,
              templateTreesId: tree.templateTreesId || null,
              createdAt: tree.createdAt || null,
              updatedAt: tree.updatedAt || null,
              features: [], // Skip feature loading to reduce API calls
              projectId: project.id,
              projectName: project.name,
            });
          }
          currentIndex++;
          if (allTreesList.length >= treesPerPage) break;
        }
      }

      setAllTrees(allTreesList);
      // Estimate total count (we don't know exact count without fetching all)
      setTotalTreesCount(allTreesList.length < treesPerPage ? allTreesList.length : (page * treesPerPage) + 1);
    } catch (err: any) {
      console.error('Error fetching trees page:', err);
      setError(err?.errors?.[0]?.message || err?.message || 'Failed to fetch trees');
    } finally {
      setLoadingTrees(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProjectsAndFeatures();
  }, []);

  // Fetch trees when page changes
  useEffect(() => {
    if (allProjects.length > 0) {
      fetchTreesPage(treesPage);
    }
  }, [treesPage, allProjects.length]);

  const refetch = async () => {
    await fetchProjectsAndFeatures();
    await fetchTreesPage(treesPage);
  };

  const handleDeleteClick = async (type: DeleteType, item: ProjectWithTrees | TreeWithFeatures | FeatureInfo) => {
    let deleteItem: DeleteItem;

    if (type === 'project') {
      const project = item as ProjectWithTrees;
      deleteItem = {
        type: 'project',
        id: project.id,
        name: project.name,
        cascadeCount: {
          trees: project.trees.length,
          rawData: 0, // Will be calculated
        },
      };

      // Calculate total RawData count for all trees in this project
      let totalRawData = 0;
      for (const tree of project.trees) {
        try {
          const rawDataItems = await fetchAllWithPagination(
            listRawData,
            {
              filter: { treeRawDataId: { eq: tree.id } },
            },
            (response) => {
              if (!response.data || !response.data.listRawData) {
                return [];
              }
              return response.data.listRawData.items || [];
            }
          );
          totalRawData += rawDataItems.length;
        } catch (err) {
          console.error('Error fetching raw data:', err);
        }
      }
      deleteItem.cascadeCount!.rawData = totalRawData;
    } else if (type === 'tree') {
      const tree = item as TreeWithFeatures;
      deleteItem = {
        type: 'tree',
        id: tree.id,
        name: tree.name,
        cascadeCount: {
          rawData: 0, // Will be calculated
        },
      };

      // Calculate RawData count for this tree
      try {
        const rawDataItems = await fetchAllWithPagination(
          listRawData,
          {
            filter: { treeRawDataId: { eq: tree.id } },
          },
          (response) => {
            if (!response.data || !response.data.listRawData) {
              return [];
            }
            return response.data.listRawData.items || [];
          }
        );
        deleteItem.cascadeCount!.rawData = rawDataItems.length;
      } catch (err) {
        console.error('Error fetching raw data:', err);
      }
    } else {
      const feature = item as FeatureInfo;
      deleteItem = {
        type: 'feature',
        id: feature.id,
        name: feature.name,
        cascadeCount: {
          rawData: 0, // Will be calculated
        },
      };

      // Calculate RawData count for this feature
      try {
        const rawDataItems = await fetchAllWithPagination(
          listRawData,
          {
            filter: { featureRawDatasId: { eq: feature.id } },
          },
          (response) => {
            if (!response.data || !response.data.listRawData) {
              return [];
            }
            return response.data.listRawData.items || [];
          }
        );
        deleteItem.cascadeCount!.rawData = rawDataItems.length;
      } catch (err) {
        console.error('Error fetching raw data:', err);
      }
    }

    setSelectedItem(deleteItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    setDeleteStatus({ type: null, message: '' });

    try {
      if (selectedItem.type === 'project') {
        // Cascade delete: Project -> Trees -> RawData
        // First, get all trees in the project with pagination
        const trees = await fetchAllWithPagination(
          listTrees,
          {
            filter: { projectTreesId: { eq: selectedItem.id } },
          },
          (response) => response.data?.listTrees?.items || []
        );

        // Delete all RawData for all trees
        for (const tree of trees) {
          const rawDataItems = await fetchAllWithPagination(
            listRawData,
            {
              filter: { treeRawDataId: { eq: tree.id } },
            },
            (response) => {
              if (!response.data || !response.data.listRawData) {
                return [];
              }
              return response.data.listRawData.items || [];
            }
          );
          for (const rawData of rawDataItems) {
            await API.graphql({
              query: deleteRawData,
              variables: {
                input: { id: rawData.id },
              },
            });
          }

          // Delete the tree
          await API.graphql({
            query: deleteTree,
            variables: {
              input: { id: tree.id },
            },
          });
        }

        // Finally, delete the project
        await API.graphql({
          query: deleteProject,
          variables: {
            input: { id: selectedItem.id },
          },
        });
      } else if (selectedItem.type === 'tree') {
        // Cascade delete: Tree -> RawData
        // First, get all RawData for this tree with pagination
        const rawDataItems = await fetchAllWithPagination(
          listRawData,
          {
            filter: { treeRawDataId: { eq: selectedItem.id } },
          },
          (response) => {
            if (!response.data || !response.data.listRawData) {
              return [];
            }
            return response.data.listRawData.items || [];
          }
        );
        for (const rawData of rawDataItems) {
          await API.graphql({
            query: deleteRawData,
            variables: {
              input: { id: rawData.id },
            },
          });
        }

        // Delete the tree
        await API.graphql({
          query: deleteTree,
          variables: {
            input: { id: selectedItem.id },
          },
        });
      } else if (selectedItem.type === 'feature') {
        // Cascade delete: Feature -> RawData
        // First, get all RawData for this feature with pagination
        const rawDataItems = await fetchAllWithPagination(
          listRawData,
          {
            filter: { featureRawDatasId: { eq: selectedItem.id } },
          },
          (response) => {
            if (!response.data || !response.data.listRawData) {
              return [];
            }
            return response.data.listRawData.items || [];
          }
        );
        for (const rawData of rawDataItems) {
          await API.graphql({
            query: deleteRawData,
            variables: {
              input: { id: rawData.id },
            },
          });
        }

        // Delete the feature
        await API.graphql({
          query: deleteFeature,
          variables: {
            input: { id: selectedItem.id },
          },
        });
      }

      setDeleteStatus({
        type: 'success',
        message: `${selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} "${selectedItem.name}" and all related data have been deleted successfully.`,
      });

      // Refresh the data
      await refetch();
      
      // Refresh trees page after deletion
      if (selectedItem.type === 'tree') {
        await fetchTreesPage(treesPage);
      }

      // Close modal after a short delay
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        setDeleteStatus({ type: null, message: '' });
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message || err?.message || 'Failed to delete item';
      setDeleteStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      setDeleteStatus({ type: null, message: '' });
    }
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Delete Projects, Trees & Features</h1>
        <p className="mt-2 text-sm text-gray-600">
          Delete projects, trees, or features with cascade deletion. This action cannot be undone.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Projects Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FolderIcon className="h-6 w-6 text-blue-500 mr-2" />
              Projects
            </h2>
            {allProjects.length === 0 ? (
              <p className="text-gray-500 text-sm">No projects found</p>
            ) : (
              <div className="space-y-2">
                {allProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">
                        Status: {project.status} • {project.trees.length} {project.trees.length === 1 ? 'tree' : 'trees'}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick('project', project)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trees Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <DocumentIcon className="h-6 w-6 text-green-500 mr-2" />
                Trees
              </h2>
              {allTrees.length > 0 && (
                <div className="text-sm text-gray-500">
                  Showing {((treesPage - 1) * treesPerPage) + 1} - {Math.min(treesPage * treesPerPage, allTrees.length)} of {allTrees.length}
                </div>
              )}
            </div>
            {loadingTrees ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading trees...</p>
                </div>
              </div>
            ) : allTrees.length === 0 ? (
              <p className="text-gray-500 text-sm">No trees found</p>
            ) : (
              <>
                <div className="space-y-2">
                  {allTrees.map((tree) => {
                      const project = allProjects.find(p => p.id === (tree as any).projectId);
                      return (
                        <div
                          key={tree.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{tree.name}</div>
                      <div className="text-sm text-gray-500">
                        Project: {project?.name || (tree as any).projectName || 'Unknown'}
                      </div>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick('tree', tree)}
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      );
                    })}
                </div>
                
                {/* Pagination Controls */}
                {totalTreesCount > treesPerPage && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTreesPage(prev => Math.max(1, prev - 1))}
                        disabled={treesPage === 1 || loadingTrees}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {treesPage} {totalTreesCount > 0 && `(showing ${allTrees.length} trees)`}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTreesPage(prev => prev + 1)}
                        disabled={loadingTrees || allTrees.length < treesPerPage}
                      >
                        Next
                      </Button>
                      {allTrees.length === treesPerPage && (
                        <span className="text-xs text-gray-400 ml-2">(more available)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {treesPerPage} per page
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CubeIcon className="h-6 w-6 text-purple-500 mr-2" />
              Features
            </h2>
            {allFeatures.length === 0 ? (
              <p className="text-gray-500 text-sm">No features found</p>
            ) : (
              <div className="space-y-2">
                {allFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{feature.name}</div>
                      <div className="text-sm text-gray-500">
                        {feature.feature_type && `Type: ${feature.feature_type}`}
                        {feature.feature_group && ` • Group: ${feature.feature_group}`}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick('feature', feature)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        title="Confirm Deletion"
        size="lg"
      >
        {deleteStatus.type === null && (
          <div className="space-y-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold">{selectedItem?.name}</span>?
                </p>
                <p className="mt-2 text-sm text-red-600 font-medium">
                  This action cannot be undone!
                </p>
              </div>
            </div>

            {selectedItem && selectedItem.cascadeCount && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  The following related data will also be deleted:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {selectedItem.type === 'project' && (
                    <>
                      {selectedItem.cascadeCount.trees !== undefined && (
                        <li>• {selectedItem.cascadeCount.trees} {selectedItem.cascadeCount.trees === 1 ? 'tree' : 'trees'}</li>
                      )}
                      {selectedItem.cascadeCount.rawData !== undefined && (
                        <li>• {selectedItem.cascadeCount.rawData} {selectedItem.cascadeCount.rawData === 1 ? 'raw data entry' : 'raw data entries'}</li>
                      )}
                    </>
                  )}
                  {selectedItem.type === 'tree' && (
                    <>
                      {selectedItem.cascadeCount.rawData !== undefined && (
                        <li>• {selectedItem.cascadeCount.rawData} {selectedItem.cascadeCount.rawData === 1 ? 'raw data entry' : 'raw data entries'}</li>
                      )}
                    </>
                  )}
                  {selectedItem.type === 'feature' && (
                    <>
                      {selectedItem.cascadeCount.rawData !== undefined && (
                        <li>• {selectedItem.cascadeCount.rawData} {selectedItem.cascadeCount.rawData === 1 ? 'raw data entry' : 'raw data entries'}</li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        )}

        {deleteStatus.type === 'success' && (
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-gray-700">{deleteStatus.message}</p>
            </div>
          </div>
        )}

        {deleteStatus.type === 'error' && (
          <div className="space-y-4">
            <div className="flex items-start">
              <XCircleIcon className="h-6 w-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{deleteStatus.message}</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

