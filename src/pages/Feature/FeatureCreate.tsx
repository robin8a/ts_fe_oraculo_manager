import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreateFeature, useListUnitOfMeasures } from '../../hooks/useFeature';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

export const FeatureCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createFeature, loading, error } = useCreateFeature();
  const { unitOfMeasures, loading: loadingUnits } = useListUnitOfMeasures();
  
  const [formData, setFormData] = useState({
    feature_type: '',
    name: '',
    description: '',
    feature_group: '',
    default_value: '',
    is_float: false,
    unitOfMeasureFeaturesId: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const featureTypeOptions = [
    { value: 'variable', label: 'Variable' },
    { value: 'constant', label: 'Constant' },
    { value: 'KPI', label: 'KPI' },
  ];

  const unitOfMeasureOptions = unitOfMeasures.map((unit) => ({
    value: unit.id,
    label: unit.abbreviation ? `${unit.name} (${unit.abbreviation})` : unit.name,
  }));

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (formData.default_value && isNaN(Number(formData.default_value))) {
      errors.default_value = 'Default value must be a valid number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const input = {
      feature_type: formData.feature_type || null,
      name: formData.name,
      description: formData.description || null,
      feature_group: formData.feature_group || null,
      default_value: formData.default_value ? Number(formData.default_value) : null,
      is_float: formData.is_float,
      unitOfMeasureFeaturesId: formData.unitOfMeasureFeaturesId || null,
    };

    const result = await createFeature(input);
    if (result) {
      navigate('/features');
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
          onClick={() => navigate('/features')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Feature</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new feature to the system</p>
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
                placeholder="Enter feature name"
              />
            </div>

            <Select
              label="Feature Type"
              value={formData.feature_type}
              onChange={(e) => handleChange('feature_type', e.target.value)}
              options={featureTypeOptions}
              placeholder="Select feature type (optional)"
            />

            <Input
              label="Feature Group"
              type="text"
              value={formData.feature_group}
              onChange={(e) => handleChange('feature_group', e.target.value)}
              placeholder="Enter feature group (optional)"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Enter feature description (optional)"
              />
            </div>

            <Input
              label="Default Value"
              type="number"
              step="any"
              value={formData.default_value}
              onChange={(e) => handleChange('default_value', e.target.value)}
              error={formErrors.default_value}
              placeholder="Enter default value (optional)"
            />

            <Select
              label="Unit of Measure"
              value={formData.unitOfMeasureFeaturesId}
              onChange={(e) => handleChange('unitOfMeasureFeaturesId', e.target.value)}
              options={unitOfMeasureOptions}
              placeholder="Select unit of measure (optional)"
              disabled={loadingUnits}
            />

            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="is_float"
                checked={formData.is_float}
                onChange={(e) => handleChange('is_float', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_float" className="ml-2 block text-sm text-gray-900">
                Is Float (decimal number)
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/features')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Feature
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

