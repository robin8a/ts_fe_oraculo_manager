import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { 
  useCreateMultipleTemplateFeatures, 
  useListTemplates,
  useListFeaturesForSelect 
} from '../../hooks/useTemplateFeature';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { MultiSelect } from '../../components/ui/MultiSelect';

export const TemplateFeatureCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createMultipleTemplateFeatures, loading, error } = useCreateMultipleTemplateFeatures();
  const { templates, loading: loadingTemplates } = useListTemplates();
  const { features, loading: loadingFeatures } = useListFeaturesForSelect();
  
  const [formData, setFormData] = useState({
    templateId: '',
    featureIds: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const templateOptions = templates.map((template) => ({
    value: template.id,
    label: `${template.name}${template.version ? ` (v${template.version})` : ''}`,
  }));

  const featureOptions = features.map((feature) => ({
    value: feature.id,
    label: feature.name,
    description: feature.description || feature.feature_type || undefined,
  }));

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.templateId) {
      errors.templateId = 'Template is required';
    }

    if (formData.featureIds.length === 0) {
      errors.featureIds = 'At least one feature must be selected';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    if (!validate()) {
      return;
    }

    const result = await createMultipleTemplateFeatures(
      formData.templateId,
      formData.featureIds
    );

    if (result.success > 0) {
      const message = result.failed > 0
        ? `Successfully added ${result.success} feature(s) to template. ${result.failed} failed.`
        : `Successfully added ${result.success} feature(s) to template.`;
      setSuccessMessage(message);
      
      // Clear form after successful submission
      setTimeout(() => {
        setFormData({ templateId: '', featureIds: [] });
        setSuccessMessage(null);
        navigate('/templatefeatures');
      }, 2000);
    }
  };

  const handleChange = (field: string, value: string | string[]) => {
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
          onClick={() => navigate('/templatefeatures')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Template Feature Associations</h1>
        <p className="mt-1 text-sm text-gray-500">Add one or multiple features to a template</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Select
              label="Template"
              value={formData.templateId}
              onChange={(e) => handleChange('templateId', e.target.value)}
              options={templateOptions}
              placeholder="Select a template"
              required
              error={formErrors.templateId}
              disabled={loadingTemplates}
            />

            <MultiSelect
              label="Features"
              options={featureOptions}
              selectedValues={formData.featureIds}
              onChange={(values) => handleChange('featureIds', values)}
              placeholder="Select one or more features"
              required
              error={formErrors.featureIds}
              helperText={`${formData.featureIds.length} feature(s) selected`}
              disabled={loadingFeatures}
              searchable
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/templatefeatures')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Associations
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


