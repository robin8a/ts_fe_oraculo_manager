import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useGetUnitOfMeasure, useDeleteUnitOfMeasure } from '../../hooks/useUnitOfMeasure';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const UnitOfMeasureDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { unitOfMeasure, loading, error, refetch } = useGetUnitOfMeasure(id || '');
  const { deleteUnitOfMeasure, loading: deleting } = useDeleteUnitOfMeasure();
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteUnitOfMeasure(id);
      if (success) {
        navigate('/unitsofmeasure');
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

  if (error || !unitOfMeasure) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'Unit of Measure not found'}</p>
        <Button onClick={() => navigate('/unitsofmeasure')} variant="outline" className="mt-2">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/unitsofmeasure')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{unitOfMeasure.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Unit of Measure Details</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/unitsofmeasure/${id}/edit`)}
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
            <dd className="mt-1 text-sm text-gray-900 font-mono">{unitOfMeasure.id}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900 font-medium">{unitOfMeasure.name}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Abbreviation</dt>
            <dd className="mt-1 text-sm text-gray-900">{unitOfMeasure.abbreviation || '-'}</dd>
          </div>

          {unitOfMeasure.createdAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(unitOfMeasure.createdAt).toLocaleString()}
              </dd>
            </div>
          )}

          {unitOfMeasure.updatedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(unitOfMeasure.updatedAt).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Unit of Measure"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{unitOfMeasure.name}</strong>? This action cannot be undone.
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

