import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { 
  useGetTemplateFeature, 
  useUpdateTemplateFeature,
  useListTemplates,
  useListFeaturesForSelect 
} from '../../hooks/useTemplateFeature';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';

export const TemplateFeatureEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { templateFeature, loading: fetching, error: fetchError } = useGetTemplateFeature(id || '');
  const { updateTemplateFeature, loading: updating, error: updateError } = useUpdateTemplateFeature();
  const { templates, loading: loadingTemplates } = useListTemplates();
  const { features, loading: loadingFeatures } = useListFeaturesForSelect();

  const [formData, setFormData] = useState({
    templateId: '',
    featureId: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (templateFeature) {
      setFormData({
        templateId: templateFeature.templateTemplateFeaturesId || '',
        featureId: templateFeature.featureTemplateFeaturesId || '',
      });
    }
  }, [templateFeature]);

  const templateOptions = templates.map((template) => ({
    value: template.id,
    label: `${template.name}${template.version ? ` (v${template.version})` : ''}`,
  }));

  const featureOptions = features.map((feature) => ({
    value: feature.id,
    label: `${feature.name}${feature.feature_type ? ` (${feature.feature_type})` : ''}`,
  }));

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.templateId) {
      errors.templateId = 'Template is required';
    }

    if (!formData.featureId) {
      errors.featureId = 'Feature is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !id) {
      return;
    }

    const input = {
      id,
      templateTemplateFeaturesId: formData.templateId || null,
      featureTemplateFeaturesId: formData.featureId || null,
    };

    const result = await updateTemplateFeature(input);

    if (result) {
      navigate(`/templatefeatures/${id}`);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (fetchError || !templateFeature) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {fetchError || 'TemplateFeature not found'}</p>
        <Button onClick={() => navigate('/templatefeatures')} variant="outline" className="mt-2">
          Back to List
        </Button>
      </div>
    );
  }

  const error = updateError;

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(`/templatefeatures/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Details
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Template Feature Association</h1>
        <p className="mt-1 text-sm text-gray-500">Update the template-feature association</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
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

            <Select
              label="Feature"
              value={formData.featureId}
              onChange={(e) => handleChange('featureId', e.target.value)}
              options={featureOptions}
              placeholder="Select a feature"
              required
              error={formErrors.featureId}
              disabled={loadingFeatures}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/templatefeatures/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={updating}>
              Update Association
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


