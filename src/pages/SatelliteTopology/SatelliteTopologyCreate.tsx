import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreateSatelliteTopology, useListSatelliteTopologies } from '../../hooks/useSatelliteTopology';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { SATELLITE_TOPOLOGY_TYPES } from '../../types/satelliteTopology';

export const SatelliteTopologyCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createSatelliteTopology, loading, error } = useCreateSatelliteTopology();
  const { satelliteTopologies: parents, loading: loadingParents } = useListSatelliteTopologies();

  const [formData, setFormData] = useState<{
    type: string;
    name: string;
    description: string;
    parentId: string;
  }>({
    type: SATELLITE_TOPOLOGY_TYPES[0],
    name: '',
    description: '',
    parentId: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const parentOptions = useMemo(
    () =>
      parents.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.type})`,
      })),
    [parents]
  );

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.type) errors.type = 'Type is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await createSatelliteTopology({
      type: formData.type,
      name: formData.name.trim(),
      description: formData.description.trim(),
      satelliteTopologySatelliteTopologiesId: formData.parentId || null,
    });
    if (result) navigate('/satellite-topology');
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/satellite-topology')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to list
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create satellite topology</h1>
        <p className="mt-1 text-sm text-gray-500">Add a SATELLITE or BAND node; optionally link a parent</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Type"
              required
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={SATELLITE_TOPOLOGY_TYPES.map((t) => ({ value: t, label: t }))}
              error={formErrors.type}
            />
            <div className="md:col-span-2">
              <Input
                label="Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={formErrors.name}
                placeholder="Display name"
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
                placeholder="What this node represents"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Select
                label="Parent (optional)"
                value={formData.parentId}
                onChange={(e) => handleChange('parentId', e.target.value)}
                options={parentOptions}
                placeholder="No parent (root)"
                disabled={loadingParents}
                helperText="Choose a parent to place this node under an existing satellite topology"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => navigate('/satellite-topology')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
