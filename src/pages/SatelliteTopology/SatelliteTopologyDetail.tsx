import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  useGetSatelliteTopology,
  useDeleteSatelliteTopology,
} from '../../hooks/useSatelliteTopology';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const SatelliteTopologyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { satelliteTopology, loading, error } = useGetSatelliteTopology(id || '');
  const { deleteSatelliteTopology, loading: deleting } = useDeleteSatelliteTopology();
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteSatelliteTopology(id);
      if (success) navigate('/satellite-topology');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !satelliteTopology) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'Record not found'}</p>
        <Button onClick={() => navigate('/satellite-topology')} variant="outline" className="mt-2">
          Back to list
        </Button>
      </div>
    );
  }

  const children = satelliteTopology.satelliteTopologies?.items ?? [];

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/satellite-topology')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to list
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{satelliteTopology.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                {satelliteTopology.type}
              </span>
              Satellite topology
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="primary" onClick={() => navigate(`/satellite-topology/${id}/edit`)}>
              <PencilIcon className="h-5 w-5 mr-2 inline" />
              Edit
            </Button>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              <TrashIcon className="h-5 w-5 mr-2 inline" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{satelliteTopology.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Parent</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {satelliteTopology.satelliteTopologyParent ? (
                <button
                  type="button"
                  className="text-primary-600 hover:underline"
                  onClick={() =>
                    navigate(`/satellite-topology/${satelliteTopology.satelliteTopologyParent!.id}`)
                  }
                >
                  {satelliteTopology.satelliteTopologyParent.name}
                </button>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{satelliteTopology.description}</dd>
          </div>
          {satelliteTopology.createdAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(satelliteTopology.createdAt).toLocaleString()}
              </dd>
            </div>
          )}
          {satelliteTopology.updatedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(satelliteTopology.updatedAt).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {children.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Child nodes</h2>
          <ul className="divide-y divide-gray-100">
            {children.map((c) => (
              <li key={c.id} className="py-2 flex justify-between items-center">
                <span className="text-gray-900">{c.name}</span>
                <Button variant="outline" onClick={() => navigate(`/satellite-topology/${c.id}`)}>
                  View
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete satellite topology"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Delete <strong>{satelliteTopology.name}</strong>? This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
