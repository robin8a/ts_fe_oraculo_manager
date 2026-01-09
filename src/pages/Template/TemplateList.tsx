import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useListTemplates, useDeleteTemplate } from '../../hooks/useTemplate';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { Template } from '../../types/template';

export const TemplateList: React.FC = () => {
  const navigate = useNavigate();
  const { templates, loading, error, refetch } = useListTemplates();
  const { deleteTemplate, loading: deleting } = useDeleteTemplate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; template: Template | null }>({
    isOpen: false,
    template: null,
  });

  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return templates;
    const term = searchTerm.toLowerCase();
    return templates.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.version && item.version.toLowerCase().includes(term))
    );
  }, [templates, searchTerm]);

  const handleDelete = async () => {
    if (deleteModal.template) {
      const success = await deleteTemplate(deleteModal.template.id);
      if (success) {
        setDeleteModal({ isOpen: false, template: null });
        refetch();
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: Template) => (
        <div className="font-medium text-gray-900">{item.name}</div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Template) => (
        <div className="text-gray-500 truncate max-w-md">
          {item.description || '-'}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: Template) => (
        <span className="text-gray-600">
          {item.type}
        </span>
      ),
    },
    {
      key: 'version',
      header: 'Version',
      render: (item: Template) => (
        <span className="text-gray-600">
          {item.version || '-'}
        </span>
      ),
    },
    {
      key: 'is_latest',
      header: 'Latest',
      render: (item: Template) => (
        <span className={item.is_latest 
          ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
          : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
        }>
          {item.is_latest ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (item: Template) => (
        <span className="text-gray-600">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Template) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/templates/${item.id}`);
            }}
            className="text-primary-600 hover:text-primary-900"
            title="View"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/templates/${item.id}/edit`);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, template: item });
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
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your templates</p>
        </div>
        <Button
          onClick={() => navigate('/templates/create')}
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
          data={filteredTemplates}
          columns={columns}
          loading={loading}
          emptyMessage="No Templates found. Create your first one!"
          onRowClick={(item) => navigate(`/templates/${item.id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, template: null })}
        title="Delete Template"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{deleteModal.template?.name}</strong>? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, template: null })}
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


