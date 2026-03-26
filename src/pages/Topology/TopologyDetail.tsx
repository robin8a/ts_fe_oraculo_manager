import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useGetTopology, useDeleteTopology, getTopologyById } from '../../hooks/useTopology';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TopologyPolygonViewer } from '../../components/Topology/TopologyPolygonViewer';
import {
  fetchTopologyAncestorPolygons,
  hasRenderablePolygon,
  parsePolygonFeature,
  type PolygonFeature,
} from '../../types/topology';

export const TopologyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { topology, loading, error } = useGetTopology(id || '');
  const { deleteTopology, loading: deleting } = useDeleteTopology();
  const [deleteModal, setDeleteModal] = useState(false);
  const [ancestorRows, setAncestorRows] = useState<
    Array<{ id: string; name?: string | null; feature: PolygonFeature }>
  >([]);
  const [ancestorsLoading, setAncestorsLoading] = useState(false);

  const leafFeature = useMemo(
    () => (topology ? parsePolygonFeature(topology.polygon) : null),
    [topology]
  );

  useEffect(() => {
    if (!topology || !leafFeature) {
      setAncestorRows([]);
      return;
    }
    let cancelled = false;
    setAncestorsLoading(true);
    fetchTopologyAncestorPolygons(getTopologyById, topology)
      .then((rows) => {
        if (!cancelled) setAncestorRows(rows);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (!cancelled) setAncestorsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [topology, leafFeature]);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteTopology(id);
      if (success) {
        navigate('/topologies');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !topology) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error || 'Topology not found'}</p>
        <Button onClick={() => navigate('/topologies')} variant="outline" className="mt-2">
          Back to List
        </Button>
      </div>
    );
  }

  const showMap = leafFeature != null && hasRenderablePolygon(topology.polygon);

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
        <div className="flex justify-between items-start">
          <div>
            {topology.topologyParent?.id && (
              <p className="text-sm text-gray-500 mb-1">
                <button
                  type="button"
                  onClick={() => navigate(`/topologies/${topology.topologyParent!.id}`)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  {topology.topologyParent.name || topology.topologyParent.id}
                </button>
                <span className="mx-1">›</span>
                <span className="text-gray-700">{topology.name}</span>
              </p>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{topology.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Topology details</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="primary" onClick={() => navigate(`/topologies/${id}/edit`)}>
              <PencilIcon className="h-5 w-5 mr-2 inline" />
              Edit
            </Button>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              <TrashIcon className="h-5 w-5 mr-2 inline" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{topology.id}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-700">Parent</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {topology.topologyParent?.id ? (
                <button
                  type="button"
                  onClick={() => navigate(`/topologies/${topology.topologyParent!.id}`)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  {topology.topologyParent.name || topology.topologyParent.id}
                </button>
              ) : (
                <span className="text-gray-600">None (root)</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">String code</dt>
            <dd className="mt-1 text-sm text-gray-900">{topology.string_code || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Number code</dt>
            <dd className="mt-1 text-sm text-gray-900">{topology.number_code || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{topology.status || '—'}</dd>
          </div>
          {topology.createdAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(topology.createdAt).toLocaleString()}
              </dd>
            </div>
          )}
          {topology.updatedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(topology.updatedAt).toLocaleString()}
              </dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Child topologies</dt>
            <dd className="mt-1">
              {(topology.topologies?.items?.length ?? 0) > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {topology.topologies!.items!.map(
                    (child) =>
                      child && (
                        <li key={child.id}>
                          <button
                            type="button"
                            onClick={() => navigate(`/topologies/${child.id}`)}
                            className="text-primary-600 hover:text-primary-900 text-left"
                          >
                            {child.name}
                          </button>
                        </li>
                      )
                  )}
                </ul>
              ) : (
                <span className="text-gray-500">None</span>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => navigate(`/topologies/create?parentId=${id}`)}
              >
                <PlusIcon className="h-4 w-4 mr-1 inline" />
                Add child
              </Button>
            </dd>
          </div>
        </dl>
      </div>

      {showMap && leafFeature && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Map</h2>
          {ancestorsLoading && (
            <p className="text-sm text-gray-500 mb-2">Loading parent areas…</p>
          )}
          <TopologyPolygonViewer leaf={leafFeature} ancestors={ancestorRows} />
        </div>
      )}

      {!showMap && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
          No polygon is stored for this topology, so the map is hidden. Add a polygon in Edit.
        </div>
      )}

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Topology" size="md">
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{topology.name}</strong>? This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
