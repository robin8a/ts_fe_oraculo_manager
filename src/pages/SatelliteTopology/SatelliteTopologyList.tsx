import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useListSatelliteTopologies, useDeleteSatelliteTopology } from '../../hooks/useSatelliteTopology';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { SatelliteTopology } from '../../types/satelliteTopology';

export const SatelliteTopologyList: React.FC = () => {
  const navigate = useNavigate();
  const { satelliteTopologies, loading, error, refetch } = useListSatelliteTopologies();
  const { deleteSatelliteTopology, loading: deleting } = useDeleteSatelliteTopology();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: SatelliteTopology | null;
  }>({ isOpen: false, item: null });

  const filtered = useMemo(() => {
    if (!searchTerm) return satelliteTopologies;
    const term = searchTerm.toLowerCase();
    return satelliteTopologies.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        (item.satelliteTopologyParent?.name?.toLowerCase().includes(term) ?? false)
    );
  }, [satelliteTopologies, searchTerm]);

  const handleDelete = async () => {
    if (deleteModal.item) {
      const success = await deleteSatelliteTopology(deleteModal.item.id);
      if (success) {
        setDeleteModal({ isOpen: false, item: null });
        refetch();
      }
    }
  };

  const columns = [
    {
      key: 'type',
      header: 'Type',
      render: (item: SatelliteTopology) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          {item.type}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (item: SatelliteTopology) => (
        <div className="font-medium text-gray-900">{item.name}</div>
      ),
    },
    {
      key: 'parent',
      header: 'Parent',
      render: (item: SatelliteTopology) => (
        <div className="text-gray-600">
          {item.satelliteTopologyParent?.name ?? '—'}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: SatelliteTopology) => (
        <div className="text-gray-500 max-w-md truncate" title={item.description}>
          {item.description}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: SatelliteTopology) => (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/satellite-topology/${item.id}`);
            }}
            className="text-primary-600 hover:text-primary-900"
            title="View"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/satellite-topology/${item.id}/edit`);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, item });
            }}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Satellite topology</h1>
          <p className="mt-1 text-sm text-gray-500">Manage satellite and band nodes in the hierarchy</p>
        </div>
        <Button onClick={() => navigate('/satellite-topology/create')} variant="primary">
          <PlusIcon className="h-5 w-5 mr-2 inline" />
          Create New
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, type, description, or parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          data={filtered}
          columns={columns}
          loading={loading}
          emptyMessage="No satellite topology records yet. Create one to get started."
          onRowClick={(item) => navigate(`/satellite-topology/${item.id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        title="Delete satellite topology"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{deleteModal.item?.name}</strong>? This cannot be
            undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, item: null })}
            >
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
