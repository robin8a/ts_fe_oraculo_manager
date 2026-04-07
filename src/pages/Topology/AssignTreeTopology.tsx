import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { API } from 'aws-amplify';
import { listProjects } from '../../graphql/queries';
import { useProjectTrees } from '../../hooks/useProjectTrees';
import { useListTopologies } from '../../hooks/useTopology';
import { useCreateTopologyTree, useTopologyTreeRelations, topologyTreePairKey } from '../../hooks/useTopologyTree';
import { Table } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { FeatureInfo } from '../../types/projectTreeFeature';
 
interface ProjectOption {
  id: string;
  name: string;
}
 
function getFeatureValue(feature: FeatureInfo): string | number | null {
  const first = feature.rawData?.[0];
  if (!first) return null;
  if (first.valueFloat != null) return first.valueFloat;
  if (first.valueString != null) return first.valueString;
  return null;
}
 
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
 
export const AssignTreeTopology: React.FC = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
 
  // Trees (same load pattern as Pivot Table)
  const { trees, loading: treesLoading, error: treesError, refetch: refetchTrees } =
    useProjectTrees(selectedProjectId || null);
 
  // Topologies
  const { topologies, loading: topologiesLoading, error: topologiesError } = useListTopologies();
 
  const projectTopologies = useMemo(() => {
    if (!selectedProjectId) return [];
    // useTopology normalizes FK into `projectTopologiesId`
    return topologies.filter((t) => t.projectTopologiesId === selectedProjectId);
  }, [topologies, selectedProjectId]);
 
  // Tree filter (same behavior as Pivot Table)
  const [filterColumnKey, setFilterColumnKey] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
 
  // Tree selection
  const [selectedTreeIds, setSelectedTreeIds] = useState<Record<string, boolean>>({});
 
  // Topology selection (multi)
  const [topologySearch, setTopologySearch] = useState('');
  const [selectedTopologyIds, setSelectedTopologyIds] = useState<Record<string, boolean>>({});
 
  const treeIds = useMemo(() => trees.map((t) => t.id), [trees]);
  const {
    topologyIdsByTreeId,
    topologyTreeIdByPairKey,
    loading: relationsLoading,
    error: relationsError,
    refetch: refetchRelations,
  } = useTopologyTreeRelations(treeIds);
 
  const { createTopologyTree, loading: creating, error: createError } = useCreateTopologyTree();
 
  const [assignResult, setAssignResult] = useState<{
    created: number;
    skipped: number;
    failed: number;
    message?: string;
  } | null>(null);
 
  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      setProjectsLoading(true);
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
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, []);
 
  // Derive a stable feature list (like Pivot Table) so filter-by-feature can work the same.
  const allFeaturesOrdered = useMemo(() => {
    const byId = new Map<string, FeatureInfo>();
    trees.forEach((tree) => {
      tree.features.forEach((f) => {
        if (!byId.has(f.id)) byId.set(f.id, f);
      });
    });
    return Array.from(byId.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [trees]);
 
  const rows = useMemo(() => {
    return trees.map((tree) => {
      const row: Record<string, string | number | null> = {
        id: tree.id,
        treeName: tree.name,
      };
      allFeaturesOrdered.forEach((feature) => {
        const f = tree.features.find((x) => x.id === feature.id);
        row[feature.id] = f ? getFeatureValue(f) : null;
      });
      return row;
    });
  }, [trees, allFeaturesOrdered]);
 
  const filterColumnOptions = useMemo(() => {
    const opts = [{ value: '', label: 'No filter' }, { value: 'treeName', label: 'Tree' }];
    allFeaturesOrdered.forEach((f) => opts.push({ value: f.id, label: f.name }));
    return opts;
  }, [allFeaturesOrdered]);
 
  const filteredRows = useMemo(() => {
    const trimmed = filterValue.trim();
    if (!filterColumnKey || trimmed === '') return rows;
    return rows.filter((row) => String(row[filterColumnKey] ?? '') === trimmed);
  }, [rows, filterColumnKey, filterValue]);
 
  // Reset selections when project changes / trees reload
  useEffect(() => {
    setSelectedTreeIds({});
    setSelectedTopologyIds({});
    setTopologySearch('');
    setAssignResult(null);
    setFilterColumnKey('');
    setFilterValue('');
  }, [selectedProjectId]);
 
  const selectedTreeIdList = useMemo(
    () => Object.entries(selectedTreeIds).filter(([, v]) => v).map(([k]) => k),
    [selectedTreeIds]
  );
  const selectedTopologyIdList = useMemo(
    () => Object.entries(selectedTopologyIds).filter(([, v]) => v).map(([k]) => k),
    [selectedTopologyIds]
  );
 
  const visibleTopologyOptions = useMemo(() => {
    const term = topologySearch.trim().toLowerCase();
    const list = projectTopologies;
    if (!term) return list;
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        (t.string_code && t.string_code.toLowerCase().includes(term)) ||
        (t.number_code && t.number_code.toLowerCase().includes(term)) ||
        (t.status && t.status.toLowerCase().includes(term))
    );
  }, [projectTopologies, topologySearch]);
 
  const toggleAllVisibleTopologies = useCallback(
    (checked: boolean) => {
      setSelectedTopologyIds((prev) => {
        const next = { ...prev };
        for (const t of visibleTopologyOptions) next[t.id] = checked;
        return next;
      });
    },
    [visibleTopologyOptions]
  );
 
  const toggleAllFilteredTrees = useCallback((checked: boolean) => {
    setSelectedTreeIds((prev) => {
      const next = { ...prev };
      for (const r of filteredRows) next[String(r.id)] = checked;
      return next;
    });
  }, [filteredRows]);
 
  const handleAssign = useCallback(async () => {
    setAssignResult(null);
    const treeIdsToAssign = selectedTreeIdList;
    const topologyIdsToAssign = selectedTopologyIdList;
 
    if (treeIdsToAssign.length === 0 || topologyIdsToAssign.length === 0) {
      setAssignResult({ created: 0, skipped: 0, failed: 0, message: 'Select at least 1 tree and 1 topology.' });
      return;
    }
 
    let skipped = 0;
    let createdCount = 0;
    let failed = 0;
 
    const pairs: Array<{ treeId: string; topologyId: string }> = [];
    for (const treeId of treeIdsToAssign) {
      for (const topologyId of topologyIdsToAssign) {
        const key = topologyTreePairKey(treeId, topologyId);
        if (topologyTreeIdByPairKey[key]) {
          skipped += 1;
        } else {
          pairs.push({ treeId, topologyId });
        }
      }
    }
 
    // Batch to avoid too many simultaneous requests.
    for (const batch of chunk(pairs, 10)) {
      const results = await Promise.allSettled(
        batch.map((p) => createTopologyTree({ treeId: p.treeId, topologyId: p.topologyId }))
      );
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value?.id) createdCount += 1;
        else failed += 1;
      }
    }
 
    setAssignResult({ created: createdCount, skipped, failed });
    await refetchRelations();
  }, [selectedTreeIdList, selectedTopologyIdList, topologyTreeIdByPairKey, createTopologyTree, refetchRelations]);
 
  const columns = useMemo(() => {
    return [
      {
        key: '__select',
        header: '',
        className: 'w-12',
        render: (row: Record<string, string | number | null>) => {
          const id = String(row.id);
          const checked = !!selectedTreeIds[id];
          return (
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setSelectedTreeIds((prev) => ({ ...prev, [id]: e.target.checked }))}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4"
              aria-label={`Select tree ${row.treeName ?? id}`}
            />
          );
        },
      },
      { key: 'treeName', header: 'Tree' },
      {
        key: '__assigned',
        header: 'Assigned topologies',
        render: (row: Record<string, string | number | null>) => {
          const id = String(row.id);
          const count = topologyIdsByTreeId[id]?.length ?? 0;
          return count ? (
            <span className="text-gray-900">{count}</span>
          ) : (
            <span className="text-gray-500">0</span>
          );
        },
      },
    ] as Array<{
      key: string;
      header: string;
      className?: string;
      render?: (row: Record<string, string | number | null>) => React.ReactNode;
    }>;
  }, [selectedTreeIds, topologyIdsByTreeId]);
 
  const anyTreeSelected = selectedTreeIdList.length > 0;
  const anyTopologySelected = selectedTopologyIdList.length > 0;
 
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assign Tree Topology</h1>
        <p className="mt-2 text-sm text-gray-600">
          Select a project, load its trees, filter if needed, then link selected trees to one or more topologies (creates <span className="font-mono">TopologyTree</span> relationships).
        </p>
      </div>
 
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[220px]">
          <Select
            label="Project"
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            placeholder="Select project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={projectsLoading}
          />
        </div>
        <Button
          onClick={() => refetchTrees()}
          disabled={!selectedProjectId || treesLoading}
          isLoading={treesLoading}
        >
          Load trees
        </Button>
 
        <div className="min-w-[200px]">
          <Select
            label="Filter by column"
            options={filterColumnOptions}
            value={filterColumnKey}
            onChange={(e) => {
              setFilterColumnKey(e.target.value);
              if (!e.target.value) setFilterValue('');
            }}
            disabled={!trees.length}
          />
        </div>
        {filterColumnKey && (
          <div className="min-w-[200px]">
            <Input
              label="Equals"
              placeholder="Value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        )}
 
        <div className="flex-1 min-w-[320px]">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="flex-1">
                <Input
                  label="Topologies (multi-select)"
                  placeholder="Search topologies..."
                  value={topologySearch}
                  onChange={(e) => setTopologySearch(e.target.value)}
                  disabled={!selectedProjectId || topologiesLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAllVisibleTopologies(true)}
                  disabled={!visibleTopologyOptions.length}
                >
                  Select visible
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAllVisibleTopologies(false)}
                  disabled={!visibleTopologyOptions.length}
                >
                  Clear visible
                </Button>
              </div>
            </div>
 
            <div className="mt-3 max-h-56 overflow-y-auto rounded border border-gray-100">
              {!selectedProjectId && (
                <div className="p-3 text-sm text-gray-600">Select a project to list its topologies.</div>
              )}
              {selectedProjectId && (topologiesLoading || topologiesError) && (
                <div className="p-3 text-sm text-gray-600">
                  {topologiesError ? `Error loading topologies: ${topologiesError}` : 'Loading topologies…'}
                </div>
              )}
              {selectedProjectId && !topologiesLoading && !topologiesError && visibleTopologyOptions.length === 0 && (
                <div className="p-3 text-sm text-gray-600">No topologies match this project/search.</div>
              )}
              {selectedProjectId && !topologiesLoading && !topologiesError && visibleTopologyOptions.length > 0 && (
                <ul className="divide-y divide-gray-100">
                  {visibleTopologyOptions.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={!!selectedTopologyIds[t.id]}
                        onChange={(e) =>
                          setSelectedTopologyIds((prev) => ({ ...prev, [t.id]: e.target.checked }))
                        }
                        className="h-4 w-4"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">{t.name}</div>
                        <div className="truncate text-xs text-gray-500">
                          {t.status ? `Status: ${t.status}` : '—'}
                          {t.string_code ? ` • ${t.string_code}` : ''}
                          {t.number_code ? ` • ${t.number_code}` : ''}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
 
            <div className="mt-3 text-xs text-gray-600">
              Selected: <span className="font-medium">{selectedTopologyIdList.length}</span>
            </div>
          </div>
        </div>
      </div>
 
      {(treesError || relationsError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {treesError ? `Error loading trees: ${treesError}` : null}
          {treesError && relationsError ? <br /> : null}
          {relationsError ? `Error loading relationships: ${relationsError}` : null}
        </div>
      )}
 
      {createError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Error creating relationship: {createError}
        </div>
      )}
 
      {assignResult && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
          {assignResult.message ? (
            assignResult.message
          ) : (
            <>
              Created: <strong>{assignResult.created}</strong> • Skipped (already existed):{' '}
              <strong>{assignResult.skipped}</strong> • Failed: <strong>{assignResult.failed}</strong>
            </>
          )}
        </div>
      )}
 
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Trees shown: <span className="font-medium">{filteredRows.length}</span>
          {relationsLoading && <span className="ml-2 text-gray-500">Refreshing relationships…</span>}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleAllFilteredTrees(true)}
            disabled={!filteredRows.length}
          >
            Select shown trees
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleAllFilteredTrees(false)}
            disabled={!filteredRows.length}
          >
            Clear shown trees
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            isLoading={creating}
            disabled={!anyTreeSelected || !anyTopologySelected || creating}
          >
            Assign selected
          </Button>
        </div>
      </div>
 
      <Table
        data={filteredRows}
        columns={columns}
        loading={treesLoading}
        emptyMessage={
          !selectedProjectId
            ? 'Select a project and click Load trees'
            : !trees.length
            ? 'No trees in this project'
            : filterColumnKey && filterValue.trim() && filteredRows.length === 0
            ? 'No rows match the filter'
            : 'No data to display'
        }
      />
    </div>
  );
};

