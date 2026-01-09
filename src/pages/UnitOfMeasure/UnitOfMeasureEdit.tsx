import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useGetUnitOfMeasure, useUpdateUnitOfMeasure } from '../../hooks/useUnitOfMeasure';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const UnitOfMeasureEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { unitOfMeasure, loading: fetching, error: fetchError } = useGetUnitOfMeasure(id || '');
  const { updateUnitOfMeasure, loading: updating, error: updateError } = useUpdateUnitOfMeasure();

  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (unitOfMeasure) {
      setFormData({
        name: unitOfMeasure.name,
        abbreviation: unitOfMeasure.abbreviation || '',
      });
    }
  }, [unitOfMeasure]);

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

    if (!validate() || !id) {
      return;
    }

    const input = {
      id,
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim() || null,
    };

    const result = await updateUnitOfMeasure(input);

    if (result) {
      navigate(`/unitsofmeasure/${id}`);
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

  if (fetchError || !unitOfMeasure) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {fetchError || 'Unit of Measure not found'}</p>
        <Button onClick={() => navigate('/unitsofmeasure')} variant="outline" className="mt-2">
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
          onClick={() => navigate(`/unitsofmeasure/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Details
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Unit of Measure</h1>
        <p className="mt-1 text-sm text-gray-500">Update the unit of measure information</p>
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
              onClick={() => navigate(`/unitsofmeasure/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={updating}>
              Update Unit of Measure
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


