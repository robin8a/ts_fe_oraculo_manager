import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  LinkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useGetModelAI, useDeleteModelAI } from '../../hooks/useModelAI';
import { useSatelliteTopologyAssociations } from '../../hooks/useSatelliteTopologyModelAI';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const ModelAIDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { modelAI, loading, error } = useGetModelAI(id || '');
  const { deleteModelAI, loading: deleting } = useDeleteModelAI();
  const {
    associations: topologyAssociations,
    selection: topologySelection,
    load: loadTopologyAssociations,
    error: topologyError,
  } = useSatelliteTopologyAssociations();
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (id) loadTopologyAssociations(id);
  }, [id, loadTopologyAssociations]);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteModelAI(id);
      if (success) {
        navigate('/modelai');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !modelAI) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'ModelAI not found'}</p>
        <Button onClick={() => navigate('/modelai')} variant="outline" className="mt-2">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/modelai')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <div className="flex justify-between items-start">
          <div>
            {modelAI.modelAIParent && (
              <p className="text-sm text-gray-500 mb-1">
                <button
                  type="button"
                  onClick={() => navigate(`/modelai/${modelAI.modelAIParent!.id}`)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  {modelAI.modelAIParent.name}
                </button>
                <span className="mx-1">›</span>
                <span className="text-gray-700">{modelAI.name}</span>
              </p>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{modelAI.name}</h1>
            <p className="mt-1 text-sm text-gray-500">ModelAI Details</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/modelai/${id}/edit`)}
            >
              <PencilIcon className="h-5 w-5 mr-2 inline" />
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setDeleteModal(true)}
            >
              <TrashIcon className="h-5 w-5 mr-2 inline" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{modelAI.id}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Group</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {modelAI.group?.trim() ? modelAI.group : '—'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Latest</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  modelAI.is_latest
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {modelAI.is_latest ? 'Yes' : 'No'}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-700">Satellite topology (parent)</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {topologyError ? (
                <span className="text-red-600">{topologyError}</span>
              ) : topologySelection.parentId ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/satellite-topology/${topologySelection.parentId}`)
                  }
                  className="text-primary-600 hover:text-primary-900"
                >
                  {topologyAssociations.find(
                    (a) => a.satelliteTopology?.id === topologySelection.parentId
                  )?.satelliteTopology?.name ?? topologySelection.parentId}
                </button>
              ) : (
                <span className="text-gray-600">None</span>
              )}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-700">Satellite topology (children)</dt>
            <dd className="mt-1">
              {topologySelection.childIds.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {topologySelection.childIds.map((childId) => {
                    const link = topologyAssociations.find(
                      (a) => a.satelliteTopology?.id === childId
                    );
                    return (
                      <li key={childId}>
                        <button
                          type="button"
                          onClick={() => navigate(`/satellite-topology/${childId}`)}
                          className="text-primary-600 hover:text-primary-900 text-left"
                        >
                          {link?.satelliteTopology?.name ?? childId}
                          {link?.satelliteTopology?.type ? (
                            <span className="text-gray-500 ml-1">
                              ({link.satelliteTopology.type})
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-700">Parent (ModelAI)</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {modelAI.modelAIParent?.id ? (
                <button
                  type="button"
                  onClick={() => navigate(`/modelai/${modelAI.modelAIParent!.id}`)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  {modelAI.modelAIParent.name || modelAI.modelAIParent.id}
                </button>
              ) : (
                <span className="text-gray-600">None (root)</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  modelAI.is_approved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {modelAI.is_approved ? 'Approved' : 'Pending'}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{modelAI.description}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Version</dt>
            <dd className="mt-1 text-sm text-gray-900">{modelAI.version}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Tokens Cost</dt>
            <dd className="mt-1 text-sm text-gray-900">{modelAI.tokens_cost}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Cost Tokens</dt>
            <dd className="mt-1 text-sm text-gray-900">{modelAI.cost_tokens}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Document Link</dt>
            <dd className="mt-1">
              <a
                href={modelAI.document_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-900 flex items-center"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                {modelAI.document_link}
              </a>
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">API Link</dt>
            <dd className="mt-1">
              <a
                href={modelAI.api_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-900 flex items-center"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                {modelAI.api_link}
              </a>
            </dd>
          </div>

          {modelAI.createdAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(modelAI.createdAt).toLocaleString()}
              </dd>
            </div>
          )}

          {modelAI.updatedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(modelAI.updatedAt).toLocaleString()}
              </dd>
            </div>
          )}

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Child models</dt>
            <dd className="mt-1">
              {(modelAI.modelAIs?.length ?? 0) > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {modelAI.modelAIs!.map((child) => (
                    <li key={child.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/modelai/${child.id}`)}
                        className="text-primary-600 hover:text-primary-900 text-left"
                      >
                        {child.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500">None</span>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => navigate(`/modelai/create?parentId=${id}`)}
              >
                <PlusIcon className="h-4 w-4 mr-1 inline" />
                Add child
              </Button>
            </dd>
          </div>
        </dl>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete ModelAI"
        size="md"
      >
        <div className="mt-4">
          {(modelAI.modelAIs?.length ?? 0) > 0 && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              This model has <strong>{modelAI.modelAIs!.length} child model(s)</strong>. Delete or reassign them first.
            </p>
          )}
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{modelAI.name}</strong>? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleting}
              disabled={(modelAI.modelAIs?.length ?? 0) > 0}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};




