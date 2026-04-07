import React, { useEffect, useMemo, useState } from 'react';
import { API } from 'aws-amplify';
import { listProjects } from '../../graphql/queries';
import { useListTopologies } from '../../hooks/useTopology';
import { useProjectTrees } from '../../hooks/useProjectTrees';
import { useTopologyTreeRelations } from '../../hooks/useTopologyTree';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { Topology } from '../../types/topology';
import type { TreeWithFeatures } from '../../types/projectTreeFeature';

interface ProjectOption {
  id: string;
  name: string;
}

function safeLower(s: string | null | undefined): string {
  return (s ?? '').toLowerCase();
}

function buildBreadcrumbPath(
  startId: string,
  topologyById: Map<string, Topology>
): Topology[] {
  const out: Topology[] = [];
  const seen = new Set<string>();
  let curId: string | null = startId;
  let hops = 0;
  while (curId && hops < 50) {
    if (seen.has(curId)) break;
    seen.add(curId);
    const node = topologyById.get(curId);
    if (!node) break;
    out.push(node);
    curId = node.topologyTopologyParentId ?? null;
    hops += 1;
  }
  return out.reverse();
}

export const TreesHierarchy: React.FC = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const { topologies, loading: topologiesLoading, error: topologiesError } = useListTopologies();
  const {
    trees,
    loading: treesLoading,
    error: treesError,
    refetch: refetchTrees,
  } = useProjectTrees(selectedProjectId ? selectedProjectId : null);

  const treeIds = useMemo(() => trees.map((t) => t.id), [trees]);
  const {
    topologyIdsByTreeId,
    loading: relationsLoading,
    error: relationsError,
    refetch: refetchRelations,
  } = useTopologyTreeRelations(treeIds);

  const [topologySearch, setTopologySearch] = useState('');
  const [selectedTopologyId, setSelectedTopologyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const all: ProjectOption[] = [];
        let nextToken: string | undefined;
        do {
          const response: any = await API.graphql({
            query: listProjects,
            variables: { limit: 100, nextToken: nextToken || undefined },
          });
          const items = response.data?.listProjects?.items || [];
          const next = response.data?.listProjects?.nextToken;
          all.push(...items.map((p: any) => ({ id: p.id, name: p.name || p.id })));
          nextToken = next;
        } while (nextToken && !cancelled);
        if (!cancelled) setProjects(all);
      } catch (err: any) {
        const msg = err?.errors?.[0]?.message || err?.message || 'Failed to fetch projects';
        console.error('Failed to fetch projects:', err);
        if (!cancelled) {
          setProjects([]);
          setProjectsError(msg);
        }
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  // Reset selection when project changes
  useEffect(() => {
    setSelectedTopologyId(null);
    setTopologySearch('');
  }, [selectedProjectId]);

  const projectTopologies = useMemo(() => {
    if (!selectedProjectId) return [];
    return topologies.filter((t) => t.projectTopologiesId === selectedProjectId);
  }, [topologies, selectedProjectId]);

  const topologyById = useMemo(() => {
    const m = new Map<string, Topology>();
    for (const t of projectTopologies) m.set(t.id, t);
    return m;
  }, [projectTopologies]);

  const childrenByParentId = useMemo(() => {
    const m = new Map<string | null, Topology[]>();
    for (const t of projectTopologies) {
      const pid = t.topologyTopologyParentId ?? null;
      if (!m.has(pid)) m.set(pid, []);
      m.get(pid)!.push(t);
    }
    for (const [, list] of m) {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return m;
  }, [projectTopologies]);

  const selectedTopology = useMemo(() => {
    if (!selectedTopologyId) return null;
    return topologyById.get(selectedTopologyId) ?? null;
  }, [selectedTopologyId, topologyById]);

  const breadcrumbPath = useMemo(() => {
    if (!selectedTopologyId) return [];
    return buildBreadcrumbPath(selectedTopologyId, topologyById);
  }, [selectedTopologyId, topologyById]);

  const visibleNodes = useMemo(() => {
    if (!selectedProjectId) return [];
    const term = topologySearch.trim().toLowerCase();
    if (term) {
      return projectTopologies.filter((t) => safeLower(t.name).includes(term));
    }
    if (!selectedTopologyId) {
      return childrenByParentId.get(null) ?? [];
    }
    return childrenByParentId.get(selectedTopologyId) ?? [];
  }, [selectedProjectId, topologySearch, projectTopologies, selectedTopologyId, childrenByParentId]);

  const treesById = useMemo(() => {
    const m = new Map<string, TreeWithFeatures>();
    for (const t of trees) m.set(t.id, t);
    return m;
  }, [trees]);

  const assignedTrees = useMemo(() => {
    if (!selectedTopologyId) return [];
    const result: TreeWithFeatures[] = [];
    for (const [treeId, topologyIds] of Object.entries(topologyIdsByTreeId)) {
      if (!topologyIds.includes(selectedTopologyId)) continue;
      const tree = treesById.get(treeId);
      if (tree) result.push(tree);
    }
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return result;
  }, [selectedTopologyId, topologyIdsByTreeId, treesById]);

  const childTopologies = useMemo(() => {
    if (!selectedTopologyId) return [];
    return childrenByParentId.get(selectedTopologyId) ?? [];
  }, [selectedTopologyId, childrenByParentId]);

  const anyLoading =
    projectsLoading ||
    (selectedProjectId ? topologiesLoading || treesLoading || relationsLoading : false);
  const anyError =
    projectsError ||
    topologiesError ||
    treesError ||
    relationsError ||
    null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trees Hierarchy</h1>
        <p className="mt-2 text-sm text-gray-600">
          Select a project, drill down the Topology hierarchy, then review child topologies and the trees assigned to the selected node.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[240px]">
          <Select
            label="Project"
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            placeholder={projectsLoading ? 'Loading projects…' : 'Select project'}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={projectsLoading}
          />
        </div>

        <Button
          onClick={async () => {
            await refetchTrees();
            await refetchRelations();
          }}
          disabled={!selectedProjectId || treesLoading || relationsLoading}
          isLoading={treesLoading || relationsLoading}
        >
          Refresh
        </Button>

        <div className="flex-1 min-w-[280px]">
          <Input
            label="Topology search"
            placeholder={selectedProjectId ? 'Search by name…' : 'Select a project first'}
            value={topologySearch}
            onChange={(e) => setTopologySearch(e.target.value)}
            disabled={!selectedProjectId}
          />
        </div>
      </div>

      {anyError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {projectsError ? `Error loading projects: ${projectsError}` : null}
          {projectsError && (topologiesError || treesError || relationsError) ? <br /> : null}
          {topologiesError ? `Error loading topologies: ${topologiesError}` : null}
          {topologiesError && (treesError || relationsError) ? <br /> : null}
          {treesError ? `Error loading trees: ${treesError}` : null}
          {treesError && relationsError ? <br /> : null}
          {relationsError ? `Error loading relationships: ${relationsError}` : null}
        </div>
      )}

      {!selectedProjectId && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          Select a project to view its Topology hierarchy and assigned trees.
        </div>
      )}

      {selectedProjectId && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">Topology drill-down</div>
                <div className="mt-1 text-xs text-gray-600">
                  {topologySearch.trim()
                    ? 'Showing matches (click a node to select it)'
                    : selectedTopology
                      ? 'Showing children of selected node'
                      : 'Showing root topologies'}
                </div>
              </div>
              {selectedTopology && !topologySearch.trim() && (
                <Button type="button" size="sm" variant="outline" onClick={() => setSelectedTopologyId(null)}>
                  Back to roots
                </Button>
              )}
            </div>

            {breadcrumbPath.length > 0 && !topologySearch.trim() && (
              <div className="mt-3 rounded border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                Path:{' '}
                {breadcrumbPath.map((t, idx) => (
                  <span key={t.id}>
                    <button
                      type="button"
                      className="text-primary-700 hover:text-primary-900"
                      onClick={() => setSelectedTopologyId(t.id)}
                    >
                      {t.name || t.id}
                    </button>
                    {idx < breadcrumbPath.length - 1 ? <span className="mx-1">›</span> : null}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 max-h-[520px] overflow-y-auto rounded border border-gray-100">
              {anyLoading && (
                <div className="p-3 text-sm text-gray-600">Loading…</div>
              )}
              {!anyLoading && projectTopologies.length === 0 && (
                <div className="p-3 text-sm text-gray-600">No topologies found for this project.</div>
              )}
              {!anyLoading && projectTopologies.length > 0 && visibleNodes.length === 0 && (
                <div className="p-3 text-sm text-gray-600">
                  {topologySearch.trim() ? 'No matches for this search.' : 'No child topologies.'}
                </div>
              )}
              {!anyLoading && projectTopologies.length > 0 && visibleNodes.length > 0 && (
                <ul className="divide-y divide-gray-100">
                  {visibleNodes.map((t) => {
                    const isSelected = t.id === selectedTopologyId;
                    const childCount = (childrenByParentId.get(t.id) ?? []).length;
                    return (
                      <li
                        key={t.id}
                        className={`p-3 hover:bg-gray-50 ${isSelected ? 'bg-primary-50' : ''}`}
                      >
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => setSelectedTopologyId(t.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className={`truncate text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                                {t.name || t.id}
                              </div>
                              <div className="truncate text-xs text-gray-500">
                                {t.status ? `Status: ${t.status}` : '—'}
                                {t.string_code ? ` • ${t.string_code}` : ''}
                                {t.number_code ? ` • ${t.number_code}` : ''}
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
            <div className="text-sm font-semibold text-gray-900">Selected topology</div>
            {!selectedTopology && (
              <div className="mt-2 text-sm text-gray-600">
                Select a topology on the left to see its child topologies and assigned trees.
              </div>
            )}
            {selectedTopology && (
              <div className="mt-3 space-y-6">
                <div className="rounded border border-gray-100 bg-gray-50 p-3">
                  <div className="text-sm font-medium text-gray-900">{selectedTopology.name}</div>
                  <div className="mt-1 text-xs text-gray-600 font-mono">{selectedTopology.id}</div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Child topologies</div>
                    <div className="text-xs text-gray-600">
                      Count: <span className="font-medium">{childTopologies.length}</span>
                    </div>
                  </div>
                  <div className="mt-2 rounded border border-gray-100">
                    {childTopologies.length === 0 ? (
                      <div className="p-3 text-sm text-gray-600">No child topologies.</div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {childTopologies.map((c) => (
                          <li key={c.id} className="p-3 hover:bg-gray-50">
                            <button
                              type="button"
                              onClick={() => setSelectedTopologyId(c.id)}
                              className="w-full text-left"
                            >
                              <div className="truncate text-sm font-medium text-primary-700 hover:text-primary-900">
                                {c.name || c.id}
                              </div>
                              <div className="truncate text-xs text-gray-500 font-mono">{c.id}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Assigned trees</div>
                    <div className="text-xs text-gray-600">
                      Count: <span className="font-medium">{assignedTrees.length}</span>
                      {relationsLoading ? <span className="ml-2 text-gray-500">Refreshing…</span> : null}
                    </div>
                  </div>
                  <div className="mt-2 rounded border border-gray-100">
                    {assignedTrees.length === 0 ? (
                      <div className="p-3 text-sm text-gray-600">No trees are assigned to this topology.</div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {assignedTrees.map((t) => (
                          <li key={t.id} className="p-3">
                            <div className="truncate text-sm font-medium text-gray-900">{t.name}</div>
                            <div className="truncate text-xs text-gray-500 font-mono">{t.id}</div>
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
      )}
    </div>
  );
};

