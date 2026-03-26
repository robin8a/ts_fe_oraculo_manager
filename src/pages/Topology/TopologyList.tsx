import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useListTopologies, useDeleteTopology } from '../../hooks/useTopology';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { Topology } from '../../types/topology';
import { hasRenderablePolygon } from '../../types/topology';

export const TopologyList: React.FC = () => {
  const navigate = useNavigate();
  const { topologies, loading, error, refetch } = useListTopologies();
  const { deleteTopology, loading: deleting } = useDeleteTopology();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: Topology | null }>({
    isOpen: false,
    item: null,
  });

  const filtered = useMemo(() => {
    if (!searchTerm) return topologies;
    const term = searchTerm.toLowerCase();
    return topologies.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.string_code && item.string_code.toLowerCase().includes(term)) ||
        (item.number_code && item.number_code.toLowerCase().includes(term)) ||
        (item.status && item.status.toLowerCase().includes(term))
    );
  }, [topologies, searchTerm]);

  const handleDelete = async () => {
    if (deleteModal.item) {
      const success = await deleteTopology(deleteModal.item.id);
      if (success) {
        setDeleteModal({ isOpen: false, item: null });
        refetch();
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: Topology) => (
        <div className="font-medium text-gray-900">{item.name}</div>
      ),
    },
    {
      key: 'parent',
      header: 'Parent',
      render: (item: Topology) =>
        item.topologyParent?.id ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/topologies/${item.topologyParent!.id}`);
            }}
            className="text-primary-600 hover:text-primary-900 text-left"
          >
            {item.topologyParent.name || item.topologyParent.id}
          </button>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: 'polygon',
      header: 'Polygon',
      render: (item: Topology) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            hasRenderablePolygon(item.polygon)
              ? 'bg-green-50 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {hasRenderablePolygon(item.polygon) ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Topology) => (
        <span className="text-gray-600">{item.status || '—'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Topology) => (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/topologies/${item.id}`);
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
              navigate(`/topologies/${item.id}/edit`);
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
        <Button onClick={refetch} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Topology</h1>
          <p className="mt-1 text-sm text-gray-500">Manage topology areas and hierarchy</p>
        </div>
        <Button onClick={() => navigate('/topologies/create')} variant="primary">
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
              placeholder="Search by name, codes, or status..."
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
          emptyMessage="No topology records found. Create one to get started."
          onRowClick={(item) => navigate(`/topologies/${item.id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        title="Delete Topology"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{' '}
            <strong>{deleteModal.item?.name}</strong>? This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, item: null })}>
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
