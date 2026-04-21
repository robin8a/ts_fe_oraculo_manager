import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListSatelliteTopologies } from '../../hooks/useSatelliteTopology';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { SatelliteTopology } from '../../types/satelliteTopology';

function safeLower(s: string | null | undefined): string {
  return (s ?? '').toLowerCase();
}

function parentIdOf(node: SatelliteTopology): string | null {
  const pid = node.satelliteTopologySatelliteTopologiesId;
  return pid ? pid : null;
}

function buildBreadcrumbPath(
  startId: string,
  nodeById: Map<string, SatelliteTopology>
): SatelliteTopology[] {
  const out: SatelliteTopology[] = [];
  const seen = new Set<string>();
  let curId: string | null = startId;
  let hops = 0;
  while (curId && hops < 50) {
    if (seen.has(curId)) break;
    seen.add(curId);
    const node = nodeById.get(curId);
    if (!node) break;
    out.push(node);
    curId = parentIdOf(node);
    hops += 1;
  }
  return out.reverse();
}

export const SatelliteTopologyHierarchy: React.FC = () => {
  const navigate = useNavigate();
  const { satelliteTopologies, loading, error, refetch } = useListSatelliteTopologies();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nodeById = useMemo(() => {
    const m = new Map<string, SatelliteTopology>();
    for (const n of satelliteTopologies) m.set(n.id, n);
    return m;
  }, [satelliteTopologies]);

  const childrenByParentId = useMemo(() => {
    const m = new Map<string | null, SatelliteTopology[]>();
    for (const n of satelliteTopologies) {
      const pid = parentIdOf(n);
      if (!m.has(pid)) m.set(pid, []);
      m.get(pid)!.push(n);
    }
    for (const [, list] of m) {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return m;
  }, [satelliteTopologies]);

  const selectedNode = useMemo(() => {
    if (!selectedId) return null;
    return nodeById.get(selectedId) ?? null;
  }, [selectedId, nodeById]);

  const breadcrumbPath = useMemo(() => {
    if (!selectedId) return [];
    return buildBreadcrumbPath(selectedId, nodeById);
  }, [selectedId, nodeById]);

  const matchingNodes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];
    return satelliteTopologies.filter((n) => {
      const hay =
        `${safeLower(n.name)} ${safeLower(n.type)} ${safeLower(n.description)} ${safeLower(n.satelliteTopologyParent?.name ?? '')}`.trim();
      return hay.includes(term);
    });
  }, [satelliteTopologies, search]);

  const visibleNodes = useMemo(() => {
    const term = search.trim();
    if (term) return matchingNodes;
    if (!selectedId) return childrenByParentId.get(null) ?? [];
    return childrenByParentId.get(selectedId) ?? [];
  }, [search, matchingNodes, selectedId, childrenByParentId]);

  const childNodes = useMemo(() => {
    if (!selectedId) return [];
    return childrenByParentId.get(selectedId) ?? [];
  }, [selectedId, childrenByParentId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Satellite Topology Hierarchy</h1>
        <p className="mt-2 text-sm text-gray-600">
          Drill down the SatelliteTopology hierarchy (parent → children). Use search to jump to any node.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[280px]">
          <Input
            label="Search"
            placeholder="Search by name, type, description, or parent…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={async () => {
            await refetch();
          }}
          disabled={loading}
          isLoading={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Error loading satellite topology: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">Drill-down</div>
              <div className="mt-1 text-xs text-gray-600">
                {search.trim()
                  ? 'Showing matches (click a node to select it)'
                  : selectedNode
                    ? 'Showing children of selected node'
                    : 'Showing root nodes'}
              </div>
            </div>
            {selectedNode && !search.trim() && (
              <Button type="button" size="sm" variant="outline" onClick={() => setSelectedId(null)}>
                Back to roots
              </Button>
            )}
          </div>

          {breadcrumbPath.length > 0 && !search.trim() && (
            <div className="mt-3 rounded border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700">
              Path:{' '}
              {breadcrumbPath.map((n, idx) => (
                <span key={n.id}>
                  <button
                    type="button"
                    className="text-primary-700 hover:text-primary-900"
                    onClick={() => setSelectedId(n.id)}
                  >
                    {n.name || n.id}
                  </button>
                  {idx < breadcrumbPath.length - 1 ? <span className="mx-1">›</span> : null}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 max-h-[520px] overflow-y-auto rounded border border-gray-100">
            {loading && <div className="p-3 text-sm text-gray-600">Loading…</div>}
            {!loading && satelliteTopologies.length === 0 && (
              <div className="p-3 text-sm text-gray-600">No satellite topology nodes found.</div>
            )}
            {!loading && satelliteTopologies.length > 0 && visibleNodes.length === 0 && (
              <div className="p-3 text-sm text-gray-600">
                {search.trim() ? 'No matches for this search.' : 'No child nodes.'}
              </div>
            )}
            {!loading && visibleNodes.length > 0 && (
              <ul className="divide-y divide-gray-100">
                {visibleNodes.map((n) => {
                  const isSelected = n.id === selectedId;
                  const childCount = (childrenByParentId.get(n.id) ?? []).length;
                  return (
                    <li
                      key={n.id}
                      className={`p-3 hover:bg-gray-50 ${isSelected ? 'bg-primary-50' : ''}`}
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => setSelectedId(n.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              className={`truncate text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}
                            >
                              {n.name || n.id}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {n.type}
                              </span>
                              {n.description ? (
                                <span className="truncate text-xs text-gray-500 max-w-[420px]">
                                  {n.description}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0 text-xs text-gray-600">
                            Children: <span className="font-medium">{childCount}</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-semibold text-gray-900">Selected node</div>
          {!selectedNode && (
            <div className="mt-2 text-sm text-gray-600">
              Select a node on the left to see its details and child nodes.
            </div>
          )}

          {selectedNode && (
            <div className="mt-3 space-y-6">
              <div className="rounded border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {selectedNode.name || selectedNode.id}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {selectedNode.type}
                      </span>
                      <span className="truncate text-xs text-gray-600 font-mono">{selectedNode.id}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/satellite-topology/${selectedNode.id}`)}
                    >
                      Open detail
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => navigate(`/satellite-topology/${selectedNode.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-gray-500">Parent</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {selectedNode.satelliteTopologyParent?.id ? (
                        <button
                          type="button"
                          className="text-primary-700 hover:text-primary-900 hover:underline"
                          onClick={() => setSelectedId(selectedNode.satelliteTopologyParent!.id)}
                        >
                          {selectedNode.satelliteTopologyParent?.name ?? selectedNode.satelliteTopologyParent!.id}
                        </button>
                      ) : (
                        '—'
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Children</div>
                    <div className="mt-1 text-sm text-gray-900">{childNodes.length}</div>
                  </div>
                </div>

                {selectedNode.description && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-500">Description</div>
                    <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedNode.description}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Child nodes</div>
                  <div className="text-xs text-gray-600">
                    Count: <span className="font-medium">{childNodes.length}</span>
                  </div>
                </div>
                <div className="mt-2 rounded border border-gray-100">
                  {childNodes.length === 0 ? (
                    <div className="p-3 text-sm text-gray-600">No child nodes.</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {childNodes.map((c) => (
                        <li key={c.id} className="p-3 hover:bg-gray-50">
                          <button
                            type="button"
                            onClick={() => setSelectedId(c.id)}
                            className="w-full text-left"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-primary-700 hover:text-primary-900">
                                  {c.name || c.id}
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {c.type}
                                  </span>
                                  <div className="truncate text-xs text-gray-500 font-mono">{c.id}</div>
                                </div>
                              </div>
                              <div className="shrink-0 text-xs text-gray-600">
                                Children:{' '}
                                <span className="font-medium">
                                  {(childrenByParentId.get(c.id) ?? []).length}
                                </span>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

