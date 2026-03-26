import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreateTopology, useListTopologies } from '../../hooks/useTopology';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TopologyPolygonEditor } from '../../components/Topology/TopologyPolygonEditor';
import type { PolygonFeature } from '../../types/topology';

export const TopologyCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentIdFromQuery = searchParams.get('parentId') ?? '';
  const { createTopology, loading, error } = useCreateTopology();
  const { topologies } = useListTopologies();

  const statusOptions = useMemo(
    () => [
      { value: '', label: '—' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    []
  );

  const parentOptions = useMemo(() => {
    const opts = [{ value: '', label: 'None (root)' }];
    topologies.forEach((t) => opts.push({ value: t.id, label: t.name }));
    return opts;
  }, [topologies]);

  const [formData, setFormData] = useState({
    name: '',
    string_code: '',
    number_code: '',
    status: '',
    topologyTopologyParentId: '',
  });
  const [polygon, setPolygon] = useState<PolygonFeature | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (parentIdFromQuery) {
      setFormData((prev) => ({ ...prev, topologyTopologyParentId: parentIdFromQuery }));
    }
  }, [parentIdFromQuery]);

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
    if (!validate()) return;

    const result = await createTopology({
      name: formData.name.trim(),
      string_code: formData.string_code.trim() || null,
      number_code: formData.number_code.trim() || null,
      status: formData.status.trim() || null,
      polygon: polygon ?? undefined,
      topologyTopologyParentId: formData.topologyTopologyParentId || null,
    });
    if (result) {
      navigate('/topologies');
    }
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
          onClick={() => navigate('/topologies')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Topology</h1>
        <p className="mt-1 text-sm text-gray-500">Define name, optional parent, and area polygon</p>
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
              <Select
                label="Parent topology"
                options={parentOptions}
                value={formData.topologyTopologyParentId}
                onChange={(e) => handleChange('topologyTopologyParentId', e.target.value)}
                placeholder="None (root)"
              />
            </div>
            <Input
              label="String code"
              type="text"
              value={formData.string_code}
              onChange={(e) => handleChange('string_code', e.target.value)}
            />
            <Input
              label="Number code"
              type="text"
              value={formData.number_code}
              onChange={(e) => handleChange('number_code', e.target.value)}
            />
            <div className="md:col-span-2">
              <Select
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                placeholder="Select status"
              />
            </div>
            <div className="md:col-span-2">
              <TopologyPolygonEditor value={polygon} onChange={setPolygon} />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => navigate('/topologies')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Topology
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
