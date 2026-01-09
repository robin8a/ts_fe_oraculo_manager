import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useListUnitOfMeasures, useDeleteUnitOfMeasure } from '../../hooks/useUnitOfMeasure';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { UnitOfMeasure } from '../../types/unitOfMeasure';

export const UnitOfMeasureList: React.FC = () => {
  const navigate = useNavigate();
  const { unitOfMeasures, loading, error, refetch } = useListUnitOfMeasures();
  const { deleteUnitOfMeasure, loading: deleting } = useDeleteUnitOfMeasure();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; unitOfMeasure: UnitOfMeasure | null }>({
    isOpen: false,
    unitOfMeasure: null,
  });

  const filteredUnitOfMeasures = useMemo(() => {
    if (!searchTerm) return unitOfMeasures;
    const term = searchTerm.toLowerCase();
    return unitOfMeasures.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.abbreviation && item.abbreviation.toLowerCase().includes(term))
    );
  }, [unitOfMeasures, searchTerm]);

  const handleDelete = async () => {
    if (deleteModal.unitOfMeasure) {
      const success = await deleteUnitOfMeasure(deleteModal.unitOfMeasure.id);
      if (success) {
        setDeleteModal({ isOpen: false, unitOfMeasure: null });
        refetch();
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: UnitOfMeasure) => (
        <div className="font-medium text-gray-900">{item.name}</div>
      ),
    },
    {
      key: 'abbreviation',
      header: 'Abbreviation',
      render: (item: UnitOfMeasure) => (
        <div className="text-gray-500">{item.abbreviation || '-'}</div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: UnitOfMeasure) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/unitsofmeasure/${item.id}`);
            }}
            className="text-primary-600 hover:text-primary-900"
            title="View"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/unitsofmeasure/${item.id}/edit`);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, unitOfMeasure: item });
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
          <h1 className="text-3xl font-bold text-gray-900">Units of Measure</h1>
          <p className="mt-1 text-sm text-gray-500">Manage measurement units</p>
        </div>
        <Button
          onClick={() => navigate('/unitsofmeasure/create')}
          variant="primary"
        >
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
              placeholder="Search by name or abbreviation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          data={filteredUnitOfMeasures}
          columns={columns}
          loading={loading}
          emptyMessage="No units of measure found. Create your first one!"
          onRowClick={(item) => navigate(`/unitsofmeasure/${item.id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, unitOfMeasure: null })}
        title="Delete Unit of Measure"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{deleteModal.unitOfMeasure?.name}</strong>? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, unitOfMeasure: null })}
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


