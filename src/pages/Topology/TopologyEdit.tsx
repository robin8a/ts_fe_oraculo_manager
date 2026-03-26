import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useGetTopology, useListTopologies, useUpdateTopology } from '../../hooks/useTopology';
import { useListProjects } from '../../hooks/useProjects';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TopologyPolygonEditor } from '../../components/Topology/TopologyPolygonEditor';
import { parsePolygonFeature, type PolygonFeature } from '../../types/topology';

export const TopologyEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { topology, loading: fetching, error: fetchError } = useGetTopology(id || '');
  const { updateTopology, loading: updating, error: updateError } = useUpdateTopology();
  const { topologies } = useListTopologies();
  const { projects, loading: projectsLoading } = useListProjects();

  const projectOptions = useMemo(() => projects.map((p) => ({ value: p.id, label: p.name })), [projects]);

  const statusOptions = useMemo(
    () => [
      { value: '', label: '—' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    []
  );

  const [formData, setFormData] = useState({
    projectId: '',
    name: '',
    string_code: '',
    number_code: '',
    status: '',
    topologyTopologyParentId: '',
  });
  const [polygon, setPolygon] = useState<PolygonFeature | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (topology) {
      setFormData({
        projectId: topology.projectTopologiesId ?? topology.project?.id ?? '',
        name: topology.name,
        string_code: (topology.string_code ?? '').toUpperCase(),
        number_code: topology.number_code ?? '',
        status: topology.status ?? '',
        topologyTopologyParentId: topology.topologyTopologyParentId ?? topology.topologyParent?.id ?? '',
      });
      setPolygon(parsePolygonFeature(topology.polygon));
    }
  }, [topology]);

  const parentOptions = useMemo(() => {
    const opts = [{ value: '', label: 'None (root)' }];
    if (!formData.projectId) return opts;
    topologies
      .filter((t) => t.id !== id && t.project?.id === formData.projectId)
      .forEach((t) => opts.push({ value: t.id, label: t.name }));
    return opts;
  }, [topologies, id, formData.projectId]);

  const parentPolygonPreview = useMemo(() => {
    const pid = formData.topologyTopologyParentId;
    if (!pid) return null;
    const row = topologies.find((t) => t.id === pid);
    const fromList = row ? parsePolygonFeature(row.polygon) : null;
    if (fromList) return fromList;
    if (topology?.topologyParent?.id === pid) {
      return parsePolygonFeature(topology.topologyParent.polygon);
    }
    return null;
  }, [formData.topologyTopologyParentId, topologies, topology]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.projectId.trim()) {
      errors.projectId = 'Project is required';
    }
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    const result = await updateTopology({
      id,
      name: formData.name.trim(),
      projectTopologiesId: formData.projectId,
      string_code: formData.string_code.trim() || null,
      number_code: formData.number_code.trim() || null,
      status: formData.status.trim() || null,
      polygon: polygon ?? null,
      topologyTopologyParentId: formData.topologyTopologyParentId || null,
    });
    if (result) {
      navigate(`/topologies/${id}`);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      if (field === 'projectId') {
        return { ...prev, projectId: value, topologyTopologyParentId: '' };
      }
      return { ...prev, [field]: value };
    });
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

  if (fetchError || !topology) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {fetchError || 'Topology not found'}</p>
        <Button onClick={() => navigate('/topologies')} variant="outline" className="mt-2">
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
          type="button"
          onClick={() => navigate(`/topologies/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Details
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Topology</h1>
        <p className="mt-1 text-sm text-gray-500">Update project, hierarchy, and polygon</p>
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
              <Select
                label="Project"
                options={projectOptions}
                value={formData.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                placeholder={projectsLoading ? 'Loading projects…' : 'Select a project'}
                required
                disabled={projectsLoading}
                error={formErrors.projectId}
              />
            </div>
            <div className="md:col-span-2">
              <Select
                label="Parent topology"
                options={parentOptions}
                value={formData.topologyTopologyParentId}
                onChange={(e) => handleChange('topologyTopologyParentId', e.target.value)}
                placeholder="None (root)"
                disabled={!formData.projectId}
              />
            </div>
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
            <Input
              label="String code"
              type="text"
              value={formData.string_code}
              onChange={(e) => handleChange('string_code', e.target.value.toUpperCase())}
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
              <TopologyPolygonEditor
                value={polygon}
                onChange={setPolygon}
                parentPreviewFeature={parentPolygonPreview}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => navigate(`/topologies/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={updating}>
              Update Topology
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
