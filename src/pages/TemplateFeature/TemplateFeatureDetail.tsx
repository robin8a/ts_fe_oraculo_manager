import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useGetTemplateFeature, useDeleteTemplateFeature } from '../../hooks/useTemplateFeature';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const TemplateFeatureDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { templateFeature, loading, error, refetch } = useGetTemplateFeature(id || '');
  const { deleteTemplateFeature, loading: deleting } = useDeleteTemplateFeature();
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteTemplateFeature(id);
      if (success) {
        navigate('/templatefeatures');
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

  if (error || !templateFeature) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'TemplateFeature not found'}</p>
        <Button onClick={() => navigate('/templatefeatures')} variant="outline" className="mt-2">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/templatefeatures')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Template Feature Association</h1>
            <p className="mt-1 text-sm text-gray-500">View association details</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/templatefeatures/${id}/edit`)}
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

      <div className="space-y-6">
        {/* Template Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Information</h2>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Template Name</dt>
              <dd className="mt-1 text-sm text-gray-900 font-medium">
                {templateFeature.template?.name || 'N/A'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Template Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {templateFeature.template?.type !== undefined 
                  ? `Type ${templateFeature.template.type}`
                  : '-'
                }
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Version</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {templateFeature.template?.version || '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Is Latest</dt>
              <dd className="mt-1">
                {templateFeature.template?.is_latest ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    No
                  </span>
                )}
              </dd>
            </div>

            {templateFeature.template?.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {templateFeature.template.description}
                </dd>
              </div>
            )}

            {templateFeature.template?.createdAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(templateFeature.template.createdAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Feature Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Information</h2>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Feature Name</dt>
              <dd className="mt-1 text-sm text-gray-900 font-medium">
                {templateFeature.feature?.name || 'N/A'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Feature Type</dt>
              <dd className="mt-1">
                {templateFeature.feature?.feature_type ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {templateFeature.feature.feature_type}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Feature Group</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {templateFeature.feature?.feature_group || '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Data Type</dt>
              <dd className="mt-1">
                {templateFeature.feature?.is_float === true ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Float
                  </span>
                ) : templateFeature.feature?.is_float === false ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Integer
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </dd>
            </div>

            {templateFeature.feature?.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {templateFeature.feature.description}
                </dd>
              </div>
            )}

            {templateFeature.feature?.default_value !== null && templateFeature.feature?.default_value !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Default Value</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {templateFeature.feature.is_float 
                    ? templateFeature.feature.default_value.toFixed(2)
                    : templateFeature.feature.default_value.toString()
                  }
                </dd>
              </div>
            )}

            {templateFeature.feature?.createdAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(templateFeature.feature.createdAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Association Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Association Details</h2>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Association ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{templateFeature.id}</dd>
            </div>

            {templateFeature.createdAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(templateFeature.createdAt).toLocaleString()}
                </dd>
              </div>
            )}

            {templateFeature.updatedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(templateFeature.updatedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Template Feature Association"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete the association between{' '}
            <strong>{templateFeature.template?.name || 'Template'}</strong> and{' '}
            <strong>{templateFeature.feature?.name || 'Feature'}</strong>? This action cannot be undone.
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
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


