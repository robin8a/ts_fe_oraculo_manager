import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreateModelAI } from '../../hooks/useModelAI';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

export const ModelAICreate: React.FC = () => {
  const navigate = useNavigate();
  const { createModelAI, loading, error } = useCreateModelAI();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    document_link: '',
    api_link: '',
    version: '',
    is_approved: false,
    tokens_cost: 0,
    cost_tokens: 0,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.document_link.trim()) {
      errors.document_link = 'Document link is required';
    }
    if (!formData.api_link.trim()) {
      errors.api_link = 'API link is required';
    }
    if (!formData.version.trim()) {
      errors.version = 'Version is required';
    }
    if (formData.tokens_cost < 0) {
      errors.tokens_cost = 'Tokens cost must be a positive number';
    }
    if (formData.cost_tokens < 0) {
      errors.cost_tokens = 'Cost tokens must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const result = await createModelAI(formData);
    if (result) {
      navigate('/modelai');
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/modelai')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create ModelAI</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new AI model to the system</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={formErrors.name}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={formErrors.description}
                rows={4}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Document Link"
                type="url"
                value={formData.document_link}
                onChange={(e) => handleChange('document_link', e.target.value)}
                error={formErrors.document_link}
                placeholder="https://example.com/documentation"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="API Link"
                type="url"
                value={formData.api_link}
                onChange={(e) => handleChange('api_link', e.target.value)}
                error={formErrors.api_link}
                placeholder="https://api.example.com/endpoint"
                required
              />
            </div>

            <Input
              label="Version"
              type="text"
              value={formData.version}
              onChange={(e) => handleChange('version', e.target.value)}
              error={formErrors.version}
              placeholder="1.0.0"
              required
            />

            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="is_approved"
                checked={formData.is_approved}
                onChange={(e) => handleChange('is_approved', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_approved" className="ml-2 block text-sm text-gray-900">
                Approved
              </label>
            </div>

            <Input
              label="Tokens Cost"
              type="number"
              value={formData.tokens_cost}
              onChange={(e) => handleChange('tokens_cost', parseInt(e.target.value) || 0)}
              error={formErrors.tokens_cost}
              min="0"
              required
            />

            <Input
              label="Cost Tokens"
              type="number"
              value={formData.cost_tokens}
              onChange={(e) => handleChange('cost_tokens', parseInt(e.target.value) || 0)}
              error={formErrors.cost_tokens}
              min="0"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/modelai')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create ModelAI
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};



