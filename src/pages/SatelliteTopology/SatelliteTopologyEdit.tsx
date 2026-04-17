import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {
  useGetSatelliteTopology,
  useListSatelliteTopologies,
  useUpdateSatelliteTopology,
} from '../../hooks/useSatelliteTopology';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { SATELLITE_TOPOLOGY_TYPES } from '../../types/satelliteTopology';

export const SatelliteTopologyEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { satelliteTopology, loading: fetching, error: fetchError } = useGetSatelliteTopology(id || '');
  const { satelliteTopologies: allNodes, loading: loadingParents } = useListSatelliteTopologies();
  const { updateSatelliteTopology, loading: updating, error: updateError } = useUpdateSatelliteTopology();

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

  useEffect(() => {
    if (satelliteTopology) {
      setFormData({
        type: satelliteTopology.type,
        name: satelliteTopology.name,
        description: satelliteTopology.description,
        parentId: satelliteTopology.satelliteTopologySatelliteTopologiesId ?? '',
      });
    }
  }, [satelliteTopology]);

  const typeOptions = useMemo(() => {
    const base = SATELLITE_TOPOLOGY_TYPES.map((t) => ({ value: t, label: t }));
    if (satelliteTopology && !SATELLITE_TOPOLOGY_TYPES.includes(satelliteTopology.type as (typeof SATELLITE_TOPOLOGY_TYPES)[number])) {
      return [{ value: satelliteTopology.type, label: satelliteTopology.type }, ...base];
    }
    return base;
  }, [satelliteTopology]);

  const parentOptions = useMemo(() => {
    return allNodes
      .filter((p) => p.id !== id)
      .map((p) => ({
        value: p.id,
        label: `${p.name} (${p.type})`,
      }));
  }, [allNodes, id]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    const result = await updateSatelliteTopology({
      id,
      type: formData.type,
      name: formData.name.trim(),
      description: formData.description.trim(),
      satelliteTopologySatelliteTopologiesId: formData.parentId || null,
    });
    if (result) navigate(`/satellite-topology/${id}`);
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

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (fetchError || !satelliteTopology) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {fetchError || 'Record not found'}</p>
        <Button onClick={() => navigate('/satellite-topology')} variant="outline" className="mt-2">
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(`/satellite-topology/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to details
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit satellite topology</h1>
        <p className="mt-1 text-sm text-gray-500">Update type, text, or parent link</p>
      </div>

      {updateError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {updateError}</p>
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
              options={typeOptions}
              error={formErrors.type}
            />
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
              <Select
                label="Parent (optional)"
                value={formData.parentId}
                onChange={(e) => handleChange('parentId', e.target.value)}
                options={parentOptions}
                placeholder="No parent (root)"
                disabled={loadingParents}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => navigate(`/satellite-topology/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={updating}>
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
