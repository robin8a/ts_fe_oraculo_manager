import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useDeleteProject, useListProjects } from '../../hooks/useProjects';
import type { Project } from '../../types/project';

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading, error, refetch } = useListProjects();
  const { deleteProject, loading: deleting } = useDeleteProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; project: Project | null }>({
    isOpen: false,
    project: null,
  });

  const filtered = useMemo(() => {
    if (!searchTerm) return projects;
    const term = searchTerm.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(term) || (p.status || '').toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  const handleDelete = async () => {
    if (!deleteModal.project) return;
    const ok = await deleteProject(deleteModal.project.id);
    if (ok) {
      setDeleteModal({ isOpen: false, project: null });
      refetch();
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: Project) => <div className="font-medium text-gray-900">{item.name}</div>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Project) => <span className="text-gray-600">{item.status}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (item: Project) => (
        <span className="text-gray-600">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Project) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects-admin/${item.id}`);
            }}
            className="text-primary-600 hover:text-primary-900"
            title="View"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects-admin/${item.id}/edit`);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, project: item });
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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your projects</p>
        </div>
        <Button onClick={() => navigate('/projects-admin/create')} variant="primary">
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
              placeholder="Search by name or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          data={filtered as unknown as Project[]}
          columns={columns}
          loading={loading}
          emptyMessage="No Projects found. Create your first one!"
          onRowClick={(item) => navigate(`/projects-admin/${(item as Project).id}`)}
        />
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, project: null })}
        title="Delete Project"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{deleteModal.project?.name}</strong>? This
            action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, project: null })}
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

