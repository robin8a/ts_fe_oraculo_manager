import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { API } from 'aws-amplify';
import { listProjects } from '../../graphql/queries';
import { useProjectTrees } from '../../hooks/useProjectTrees';
import type { FeatureInfo } from '../../types/projectTreeFeature';
import { isAudioS3Url, downloadAudioFileFromS3 } from '../../services/storageService';
import { Table } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { ExclamationTriangleIcon, ArrowDownTrayIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

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

function escapeCsvCell(value: string | number | null): string {
  const s = value == null ? '' : String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(rows: Record<string, string | number | null>[], columns: { key: string; header: string }[]): void {
  const headerLine = columns.map((c) => escapeCsvCell(c.header)).join(',');
  const dataLines = rows.map((row) =>
    columns.map((c) => escapeCsvCell(row[c.key] ?? null)).join(',')
  );
  const csv = [headerLine, ...dataLines].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pivot-table-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type AudioState = {
  playingCellKey: string | null;
  objectUrl: string | null;
  loadingCellKey: string | null;
};

export const PivotTableView: React.FC = () => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedPivotFeatureId, setSelectedPivotFeatureId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filterColumnKey, setFilterColumnKey] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [audioState, setAudioState] = useState<AudioState>({
    playingCellKey: null,
    objectUrl: null,
    loadingCellKey: null,
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const { trees, loading: treesLoading, error: treesError, refetch } =
    useProjectTrees(selectedProjectId || null);

  const handlePlayAudio = useCallback(async (cellKey: string, url: string) => {
    setAudioState((prev) => {
      if (prev.objectUrl) URL.revokeObjectURL(prev.objectUrl);
      return { ...prev, objectUrl: null, loadingCellKey: cellKey };
    });
    try {
      const blob = await downloadAudioFileFromS3(url);
      const objectUrl = URL.createObjectURL(blob);
      if (!audioRef.current) return;
      audioRef.current.src = objectUrl;
      audioRef.current.play();
      setAudioState({ playingCellKey: cellKey, objectUrl, loadingCellKey: null });
    } catch (err) {
      console.error('Failed to load audio:', err);
      setAudioState((prev) => ({ ...prev, loadingCellKey: null }));
    }
  }, []);

  const handleStopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState((prev) => {
      if (prev.objectUrl) URL.revokeObjectURL(prev.objectUrl);
      return { playingCellKey: null, objectUrl: null, loadingCellKey: null };
    });
  }, []);

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

  const allFeaturesOrdered = useMemo(() => {
    const byId = new Map<string, FeatureInfo>();
    trees.forEach((tree) => {
      tree.features.forEach((f) => {
        if (!byId.has(f.id)) byId.set(f.id, f);
      });
    });
    return Array.from(byId.values()).sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
  }, [trees]);

  const pivotFeatureFirst = useMemo(() => {
    if (!selectedPivotFeatureId) return allFeaturesOrdered;
    const pivot = allFeaturesOrdered.find((f) => f.id === selectedPivotFeatureId);
    const rest = allFeaturesOrdered.filter((f) => f.id !== selectedPivotFeatureId);
    return pivot ? [pivot, ...rest] : allFeaturesOrdered;
  }, [allFeaturesOrdered, selectedPivotFeatureId]);

  const rows = useMemo(() => {
    return trees.map((tree) => {
      const row: Record<string, string | number | null> = {
        id: tree.id,
        treeName: tree.name,
      };
      pivotFeatureFirst.forEach((feature) => {
        const f = tree.features.find((x) => x.id === feature.id);
        const val = f ? getFeatureValue(f) : null;
        row[feature.id] = val;
      });
      return row;
    });
  }, [trees, pivotFeatureFirst]);

  const filterColumnOptions = useMemo(() => {
    const opts = [{ value: '', label: 'No filter' }, { value: 'treeName', label: 'Tree' }];
    pivotFeatureFirst.forEach((f) => opts.push({ value: f.id, label: f.name }));
    return opts;
  }, [pivotFeatureFirst]);

  const filteredRows = useMemo(() => {
    const trimmed = filterValue.trim();
    if (!filterColumnKey || trimmed === '') return rows;
    return rows.filter(
      (row) => String(row[filterColumnKey] ?? '') === trimmed
    );
  }, [rows, filterColumnKey, filterValue]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  useEffect(() => {
    if (trees.length > 0 && selectedPivotFeatureId) {
      const exists = allFeaturesOrdered.some((f) => f.id === selectedPivotFeatureId);
      if (!exists) setSelectedPivotFeatureId('');
    }
  }, [trees, allFeaturesOrdered, selectedPivotFeatureId]);

  useEffect(() => {
    setPage(1);
  }, [selectedPivotFeatureId, pageSize, filterColumnKey, filterValue]);

  const columns = useMemo(() => {
    const cols: { key: string; header: string; render?: (row: Record<string, string | number | null>) => React.ReactNode }[] = [
      { key: 'treeName', header: 'Tree' },
    ];
    pivotFeatureFirst.forEach((feature) => {
      cols.push({
        key: feature.id,
        header: feature.name,
        render: (row) => {
          const v = row[feature.id];
          if (v == null) return '—';
          const strVal = String(v);
          if (typeof v === 'string' && isAudioS3Url(v)) {
            const cellKey = `${row.id}-${feature.id}`;
            const isPlaying = audioState.playingCellKey === cellKey;
            const isLoading = audioState.loadingCellKey === cellKey;
            return (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handlePlayAudio(cellKey, v)}
                  disabled={isLoading}
                  className="rounded p-1.5 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
                  title="Play"
                >
                  {isLoading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleStopAudio}
                  disabled={!isPlaying}
                  className="rounded p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Stop"
                >
                  <StopIcon className="h-4 w-4" />
                </button>
              </div>
            );
          }
          return strVal;
        },
      });
    });
    return cols;
  }, [pivotFeatureFirst, audioState.playingCellKey, audioState.loadingCellKey, handlePlayAudio, handleStopAudio]);

  const hasTrees = trees.length > 0;
  const hasFeatures = allFeaturesOrdered.length > 0;

  return (
    <div className="space-y-6">
      <audio ref={audioRef} className="hidden" />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pivot Table</h1>
        <p className="mt-2 text-sm text-gray-600">
          Select a project, load its trees, choose a pivot feature, and view all feature values in a single table. First value shown when multiple exist per feature.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[200px]">
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
          onClick={() => refetch()}
          disabled={!selectedProjectId || treesLoading}
          isLoading={treesLoading}
        >
          Load trees
        </Button>
        <div className="min-w-[200px]">
          <Select
            label="Pivot feature"
            options={allFeaturesOrdered.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="Select feature (pivot column first)"
            value={selectedPivotFeatureId}
            onChange={(e) => setSelectedPivotFeatureId(e.target.value)}
            disabled={!hasTrees || !hasFeatures}
          />
        </div>
        {hasTrees && hasFeatures && (
          <>
            <div className="min-w-[180px]">
              <Select
                label="Filter by column"
                options={filterColumnOptions}
                value={filterColumnKey}
                onChange={(e) => {
                  setFilterColumnKey(e.target.value);
                  if (!e.target.value) setFilterValue('');
                }}
              />
            </div>
            {filterColumnKey && (
              <div className="min-w-[180px]">
                <Input
                  label="Equals"
                  placeholder="Value"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {treesError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading trees</h3>
              <p className="mt-1 text-sm text-red-700">{treesError}</p>
            </div>
          </div>
        </div>
      )}

      {!treesError && (
        <>
          {rows.length > 0 && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadCsv(
                    filteredRows,
                    columns.map((c) => ({ key: c.key, header: c.header }))
                  )
                }
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline" />
                Export CSV {filteredRows.length < rows.length ? `(${filteredRows.length} rows)` : '(all trees)'}
              </Button>
            </div>
          )}
          <Table
            data={paginatedRows}
            columns={columns}
            loading={treesLoading}
            emptyMessage={
              !selectedProjectId
                ? 'Select a project and click Load trees'
                : !hasTrees
                ? 'No trees in this project'
                : !hasFeatures
                ? 'No features in loaded trees'
                : filterColumnKey && filterValue.trim() && filteredRows.length === 0
                ? 'No rows match the filter'
                : 'No data to display'
            }
          />
          {filteredRows.length > 0 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={filteredRows.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50]}
            />
          )}
        </>
      )}
    </div>
  );
};
