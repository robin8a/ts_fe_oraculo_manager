import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { useProjectTreeFeature } from '../../hooks/useProjectTreeFeature';
import { 
  deleteProject, 
  deleteTree, 
  deleteFeature, 
  deleteRawData 
} from '../../graphql/mutations';
import { listTrees, listRawData } from '../../graphql/queries';
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
  const { projects, loading, error, refetch } = useProjectTreeFeature();
  const [selectedItem, setSelectedItem] = useState<DeleteItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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
          const rawDataResponse: any = await API.graphql({
            query: listRawData,
            variables: {
              filter: { treeRawDataId: { eq: tree.id } },
            },
          });
          totalRawData += rawDataResponse.data?.listRawData?.items?.length || 0;
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
        const rawDataResponse: any = await API.graphql({
          query: listRawData,
          variables: {
            filter: { treeRawDataId: { eq: tree.id } },
          },
        });
        deleteItem.cascadeCount!.rawData = rawDataResponse.data?.listRawData?.items?.length || 0;
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
        const rawDataResponse: any = await API.graphql({
          query: listRawData,
          variables: {
            filter: { featureRawDatasId: { eq: feature.id } },
          },
        });
        deleteItem.cascadeCount!.rawData = rawDataResponse.data?.listRawData?.items?.length || 0;
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
        // First, get all trees in the project
        const treesResponse: any = await API.graphql({
          query: listTrees,
          variables: {
            filter: { projectTreesId: { eq: selectedItem.id } },
          },
        });

        const trees = treesResponse.data?.listTrees?.items || [];

        // Delete all RawData for all trees
        for (const tree of trees) {
          const rawDataResponse: any = await API.graphql({
            query: listRawData,
            variables: {
              filter: { treeRawDataId: { eq: tree.id } },
            },
          });

          const rawDataItems = rawDataResponse.data?.listRawData?.items || [];
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
        // First, get all RawData for this tree
        const rawDataResponse: any = await API.graphql({
          query: listRawData,
          variables: {
            filter: { treeRawDataId: { eq: selectedItem.id } },
          },
        });

        const rawDataItems = rawDataResponse.data?.listRawData?.items || [];
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
        // First, get all RawData for this feature
        const rawDataResponse: any = await API.graphql({
          query: listRawData,
          variables: {
            filter: { featureRawDatasId: { eq: selectedItem.id } },
          },
        });

        const rawDataItems = rawDataResponse.data?.listRawData?.items || [];
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

  // Collect all features from all projects/trees
  const allFeatures = new Map<string, FeatureInfo>();
  projects.forEach((project) => {
    project.trees.forEach((tree) => {
      tree.features.forEach((feature) => {
        if (!allFeatures.has(feature.id)) {
          allFeatures.set(feature.id, feature);
        }
      });
    });
  });

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
            {projects.length === 0 ? (
              <p className="text-gray-500 text-sm">No projects found</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentIcon className="h-6 w-6 text-green-500 mr-2" />
              Trees
            </h2>
            {projects.reduce((acc, p) => acc + p.trees.length, 0) === 0 ? (
              <p className="text-gray-500 text-sm">No trees found</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) =>
                  project.trees.map((tree) => (
                    <div
                      key={tree.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{tree.name}</div>
                        <div className="text-sm text-gray-500">
                          Project: {project.name} • {tree.features.length} {tree.features.length === 1 ? 'feature' : 'features'}
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
                  ))
                )}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CubeIcon className="h-6 w-6 text-purple-500 mr-2" />
              Features
            </h2>
            {allFeatures.size === 0 ? (
              <p className="text-gray-500 text-sm">No features found</p>
            ) : (
              <div className="space-y-2">
                {Array.from(allFeatures.values()).map((feature) => (
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

