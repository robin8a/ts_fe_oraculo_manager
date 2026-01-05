import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useListTemplateFeatures, useDeleteTemplateFeature } from '../../hooks/useTemplateFeature';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { TemplateFeature } from '../../types/templateFeature';

export const TemplateFeatureList: React.FC = () => {
  const navigate = useNavigate();
  const { templateFeatures, loading, error, refetch } = useListTemplateFeatures();
  const { deleteTemplateFeature, loading: deleting } = useDeleteTemplateFeature();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; templateFeature: TemplateFeature | null }>({
    isOpen: false,
    templateFeature: null,
  });

  const filteredTemplateFeatures = useMemo(() => {
    if (!searchTerm) return templateFeatures;
    const term = searchTerm.toLowerCase();
    return templateFeatures.filter(
      (item) =>
        item.template?.name.toLowerCase().includes(term) ||
        item.feature?.name.toLowerCase().includes(term) ||
        item.feature?.feature_type?.toLowerCase().includes(term) ||
        item.feature?.feature_group?.toLowerCase().includes(term)
    );
  }, [templateFeatures, searchTerm]);

  const handleDelete = async () => {
    if (deleteModal.templateFeature) {
      const success = await deleteTemplateFeature(deleteModal.templateFeature.id);
      if (success) {
        setDeleteModal({ isOpen: false, templateFeature: null });
        refetch();
      }
    }
  };

  const columns = [
    {
      key: 'template',
      header: 'Template',
      render: (item: TemplateFeature) => (
        <div className="font-medium text-gray-900">
          {item.template?.name || 'N/A'}
        </div>
      ),
    },
    {
      key: 'feature',
      header: 'Feature',
      render: (item: TemplateFeature) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.feature?.name || 'N/A'}
          </div>
          {item.feature?.feature_type && (
            <div className="text-xs text-gray-500 mt-0.5">
              {item.feature.feature_type}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'feature_group',
      header: 'Feature Group',
      render: (item: TemplateFeature) => (
        <span className="text-sm text-gray-600">
          {item.feature?.feature_group || '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (item: TemplateFeature) => (
        <span className="text-sm text-gray-600">
          {item.createdAt 
            ? new Date(item.createdAt).toLocaleDateString()
            : '-'
          }
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: TemplateFeature) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/templatefeatures/${item.id}`);
            }}
            className="text-primary-600 hover:text-primary-900"
            title="View details"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/templatefeatures/${item.id}/edit`);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, templateFeature: item });
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

  if (error && !loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Template Features</h1>
          <p className="mt-1 text-sm text-gray-500">Manage template-feature associations</p>
        </div>
        <Button
          onClick={() => navigate('/templatefeatures/create')}
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
              placeholder="Search by template name, feature name, type, or group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          data={filteredTemplateFeatures}
          columns={columns}
          loading={loading}
          emptyMessage="No TemplateFeature associations found. Create your first one!"
          onRowClick={(item) => navigate(`/templatefeatures/${item.id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, templateFeature: null })}
        title="Delete Template Feature Association"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete the association between{' '}
            <strong>{deleteModal.templateFeature?.template?.name || 'Template'}</strong> and{' '}
            <strong>{deleteModal.templateFeature?.feature?.name || 'Feature'}</strong>?
            This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, templateFeature: null })}
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

