import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreateUnitOfMeasure } from '../../hooks/useUnitOfMeasure';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const UnitOfMeasureCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createUnitOfMeasure, loading, error } = useCreateUnitOfMeasure();
  
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
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
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim() || null,
    };

    const result = await createUnitOfMeasure(input);
    if (result) {
      navigate('/unitsofmeasure');
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

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/unitsofmeasure')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Unit of Measure</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new unit of measure to the system</p>
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
                placeholder="e.g., Meters, Kilograms, Liters"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Abbreviation"
                type="text"
                value={formData.abbreviation}
                onChange={(e) => handleChange('abbreviation', e.target.value)}
                error={formErrors.abbreviation}
                placeholder="e.g., m, kg, L"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/unitsofmeasure')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Unit of Measure
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

