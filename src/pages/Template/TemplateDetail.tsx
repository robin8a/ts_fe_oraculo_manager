import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useGetTemplate, useDeleteTemplate } from '../../hooks/useTemplate';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const TemplateDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { template, loading, error } = useGetTemplate(id || '');
  const { deleteTemplate, loading: deleting } = useDeleteTemplate();
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteTemplate(id);
      if (success) {
        navigate('/templates');
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

  if (error || !template) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'Template not found'}</p>
        <Button onClick={() => navigate('/templates')} variant="outline" className="mt-2">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/templates')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Template Details</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/templates/${id}/edit`)}
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
            <dd className="mt-1 text-sm text-gray-900 font-mono">{template.id}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{template.name}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{template.type}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Version</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {template.version || <span className="text-gray-400">-</span>}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Is Latest</dt>
            <dd className="mt-1">
              {template.is_latest ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Yes
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  No
                </span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Parent Template</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {template.templateParent ? (
                <span>
                  {template.templateParent.name}
                  {template.templateParent.version && (
                    <span className="text-gray-500 ml-1">(v{template.templateParent.version})</span>
                  )}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {template.description || <span className="text-gray-400">No description provided</span>}
            </dd>
          </div>

          {template.createdAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(template.createdAt).toLocaleString()}
              </dd>
            </div>
          )}

          {template.updatedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(template.updatedAt).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Template"
        size="md"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{template.name}</strong>? This action cannot be undone.
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


