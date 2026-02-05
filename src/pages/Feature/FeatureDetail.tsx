import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useGetFeature, useDeleteFeature } from '../../hooks/useFeature';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const FeatureDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { feature, loading, error } = useGetFeature(id || '');
  const { deleteFeature, loading: deleting } = useDeleteFeature();
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteFeature(id);
      if (success) {
        navigate('/features');
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

  if (error || !feature) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'Feature not found'}</p>
        <Button onClick={() => navigate('/features')} variant="outline" className="mt-2">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/features')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{feature.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Feature Details</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/features/${id}/edit`)}
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
            <dd className="mt-1 text-sm text-gray-900 font-mono">{feature.id}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Feature Type</dt>
            <dd className="mt-1">
              {feature.feature_type ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {feature.feature_type}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Feature Group</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {feature.feature_group || <span className="text-gray-400">-</span>}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Data Type</dt>
            <dd className="mt-1">
              {feature.is_float === true ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Float
                </span>
              ) : feature.is_float === false ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Integer
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {feature.description || <span className="text-gray-400">No description provided</span>}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Default Value</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {feature.default_value !== null && feature.default_value !== undefined 
                ? (feature.is_float ? feature.default_value.toFixed(2) : feature.default_value.toString())
                : <span className="text-gray-400">-</span>
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Unit of Measure</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {feature.unitOfMeasure ? (
                <span>
                  {feature.unitOfMeasure.name}
                  {feature.unitOfMeasure.abbreviation && (
                    <span className="text-gray-500 ml-1">({feature.unitOfMeasure.abbreviation})</span>
                  )}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </dd>
          </div>

          {feature.createdAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(feature.createdAt).toLocaleString()}
              </dd>
            </div>
          )}

          {feature.updatedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(feature.updatedAt).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Feature"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{feature.name}</strong>? This action cannot be undone.
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


