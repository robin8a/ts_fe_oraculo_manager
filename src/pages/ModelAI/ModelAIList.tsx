import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useListModelAIs, useDeleteModelAI } from '../../hooks/useModelAI';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { ModelAI } from '../../types/modelai';

export const ModelAIList: React.FC = () => {
  const navigate = useNavigate();
  const { modelAIs, loading, error, refetch } = useListModelAIs();
  const { deleteModelAI, loading: deleting } = useDeleteModelAI();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; modelAI: ModelAI | null }>({
    isOpen: false,
    modelAI: null,
  });

  const filteredModelAIs = useMemo(() => {
    if (!searchTerm) return modelAIs;
    const term = searchTerm.toLowerCase();
    return modelAIs.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.version.toLowerCase().includes(term)
    );
  }, [modelAIs, searchTerm]);

  const handleDelete = async () => {
    if (deleteModal.modelAI) {
      const success = await deleteModelAI(deleteModal.modelAI.id);
      if (success) {
        setDeleteModal({ isOpen: false, modelAI: null });
        refetch();
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: ModelAI) => (
        <div className="font-medium text-gray-900">{item.name}</div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: ModelAI) => (
        <div className="text-gray-500 truncate max-w-md">{item.description}</div>
      ),
    },
    {
      key: 'version',
      header: 'Version',
    },
    {
      key: 'is_approved',
      header: 'Status',
      render: (item: ModelAI) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.is_approved
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {item.is_approved ? 'Approved' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'tokens_cost',
      header: 'Tokens Cost',
      render: (item: ModelAI) => <span>{item.tokens_cost}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: ModelAI) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/modelai/${item.id}`);
            }}
            className="text-primary-600 hover:text-primary-900"
            title="View"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/modelai/${item.id}/edit`);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, modelAI: item });
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
          <h1 className="text-3xl font-bold text-gray-900">ModelAI</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your AI models</p>
        </div>
        <Button
          onClick={() => navigate('/modelai/create')}
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
              placeholder="Search by name, description, or version..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          data={filteredModelAIs}
          columns={columns}
          loading={loading}
          emptyMessage="No ModelAI records found. Create your first one!"
          onRowClick={(item) => navigate(`/modelai/${item.id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, modelAI: null })}
        title="Delete ModelAI"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{deleteModal.modelAI?.name}</strong>? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, modelAI: null })}
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



