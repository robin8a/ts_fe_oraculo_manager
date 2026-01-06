import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreateTemplate, useListTemplates } from '../../hooks/useTemplate';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

export const TemplateCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createTemplate, loading, error } = useCreateTemplate();
  const { templates, loading: loadingTemplates } = useListTemplates();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '1',
    version: '',
    is_latest: false,
    templateTemplatesId: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const templateParentOptions = [
    { value: '', label: 'None (Root Template)' },
    ...templates.map((template) => ({
      value: template.id,
      label: `${template.name}${template.version ? ` (v${template.version})` : ''}`,
    })),
  ];

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (formData.type && isNaN(Number(formData.type))) {
      errors.type = 'Type must be a valid number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Build input object, only including templateTemplatesId if it has a value
    // This prevents DynamoDB GSI errors when the field would be null
    const input: any = {
      name: formData.name,
      description: formData.description || null,
      type: formData.type ? Number(formData.type) : 1,
      version: formData.version || null,
      is_latest: formData.is_latest,
    };

    // Only include templateTemplatesId if it has a value (not empty string)
    // This prevents sending null to DynamoDB GSI which expects a String
    if (formData.templateTemplatesId && formData.templateTemplatesId.trim() !== '') {
      input.templateTemplatesId = formData.templateTemplatesId;
    }

    const result = await createTemplate(input);
    if (result) {
      navigate('/templates');
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
          onClick={() => navigate('/templates')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Template</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new template to the system</p>
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
                placeholder="Enter template name"
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Enter template description (optional)"
              />
            </div>

            <Input
              label="Type"
              type="number"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              error={formErrors.type}
              placeholder="Enter type (default: 1)"
            />

            <Input
              label="Version"
              type="text"
              value={formData.version}
              onChange={(e) => handleChange('version', e.target.value)}
              placeholder="Enter version (optional)"
            />

            <div className="md:col-span-2">
              <Select
                label="Parent Template"
                value={formData.templateTemplatesId}
                onChange={(e) => handleChange('templateTemplatesId', e.target.value)}
                options={templateParentOptions}
                placeholder="Select parent template (optional)"
                disabled={loadingTemplates}
              />
            </div>

            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="is_latest"
                checked={formData.is_latest}
                onChange={(e) => handleChange('is_latest', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_latest" className="ml-2 block text-sm text-gray-900">
                Is Latest Version
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/templates')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Template
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

