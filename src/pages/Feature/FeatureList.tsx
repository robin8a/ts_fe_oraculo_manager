import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useListFeatures, useDeleteFeature } from '../../hooks/useFeature';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { Feature } from '../../types/feature';

export const FeatureList: React.FC = () => {
  const navigate = useNavigate();
  const { features, loading, error, refetch } = useListFeatures();
  const { deleteFeature, loading: deleting } = useDeleteFeature();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; feature: Feature | null }>({
    isOpen: false,
    feature: null,
  });

  const filteredFeatures = useMemo(() => {
    if (!searchTerm) return features;
    const term = searchTerm.toLowerCase();
    return features.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.feature_group && item.feature_group.toLowerCase().includes(term)) ||
        (item.feature_type && item.feature_type.toLowerCase().includes(term))
    );
  }, [features, searchTerm]);

  const handleDelete = async () => {
    if (deleteModal.feature) {
      const success = await deleteFeature(deleteModal.feature.id);
      if (success) {
        setDeleteModal({ isOpen: false, feature: null });
        refetch();
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: Feature) => (
        <div className="font-medium text-gray-900">{item.name}</div>
      ),
    },
    {
      key: 'feature_type',
      header: 'Type',
      render: (item: Feature) => (
        <span className="text-gray-600">
          {item.feature_type || '-'}
        </span>
      ),
    },
    {
      key: 'feature_group',
      header: 'Group',
      render: (item: Feature) => (
        <span className="text-gray-600">
          {item.feature_group || '-'}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Feature) => (
        <div className="text-gray-500 truncate max-w-md">
          {item.description || '-'}
        </div>
      ),
    },
    {
      key: 'default_value',
      header: 'Default Value',
      render: (item: Feature) => (
        <span className="text-gray-600">
          {item.default_value !== null && item.default_value !== undefined 
            ? (item.is_float ? item.default_value.toFixed(2) : item.default_value.toString())
            : '-'
          }
        </span>
      ),
    },
    {
      key: 'is_float',
      header: 'Data Type',
      render: (item: Feature) => (
        <span className="text-gray-600">
          {item.is_float === true ? 'Float' : item.is_float === false ? 'Integer' : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Feature) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/features/${item.id}`);
            }}
            className="text-primary-600 hover:text-primary-900"
            title="View"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/features/${item.id}/edit`);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, feature: item });
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
          <h1 className="text-3xl font-bold text-gray-900">Features</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your features</p>
        </div>
        <Button
          onClick={() => navigate('/features/create')}
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
              placeholder="Search by name, description, group, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          data={filteredFeatures}
          columns={columns}
          loading={loading}
          emptyMessage="No Features found. Create your first one!"
          onRowClick={(item) => navigate(`/features/${item.id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, feature: null })}
        title="Delete Feature"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{deleteModal.feature?.name}</strong>? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, feature: null })}
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


