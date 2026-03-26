import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { Topology } from '../types/topology';
import {
  getTopology as getTopologyQuery,
  listTopologies as listTopologiesQuery,
  createTopology as createTopologyMutation,
  updateTopology as updateTopologyMutation,
  deleteTopology as deleteTopologyMutation,
} from '../amplify_custom/topologyOperations';

/** Amplify @belongsTo FK for `topologyParent` on Topology (adjust if AppSync rejects). */
const PARENT_FK_FIELD = 'topologyTopologyParentId';

/** Same pattern as Tree → Project (`projectTreesId` on Tree): Project has `topologies: [Topology] @hasMany`. */
const PROJECT_FK_FIELD = 'projectTopologiesId';

function normalizeParent(parent: unknown): { id: string; name?: string | null; polygon?: unknown } | null {
  if (!parent || typeof parent !== 'object') return null;
  const p = parent as { id?: string; name?: string | null; polygon?: unknown };
  if (!p.id) return null;
  return { id: p.id, name: p.name, polygon: p.polygon };
}

function normalizeProject(project: unknown): Topology['project'] {
  if (!project || typeof project !== 'object') return null;
  const p = project as { id?: string; name?: string | null; status?: string | null };
  if (!p.id) return null;
  return { id: p.id, name: p.name, status: p.status };
}

function normalizeTopology(raw: unknown): Topology | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const parent = normalizeParent(item.topologyParent);
  const parentId =
    (item[PARENT_FK_FIELD] as string | undefined) ??
    (item.topologyParentId as string | undefined) ??
    parent?.id ??
    null;

  const proj = normalizeProject(item.project);
  const projectId =
    (item[PROJECT_FK_FIELD] as string | undefined) ??
    (item.projectId as string | undefined) ??
    proj?.id ??
    null;

  const topologies = item.topologies as Topology['topologies'];
  const children = topologies?.items;

  return {
    ...(item as unknown as Topology),
    project: proj ?? undefined,
    projectTopologiesId: projectId,
    topologyParent: parent ?? undefined,
    topologyTopologyParentId: parentId,
    topologies: Array.isArray(children)
      ? { items: children.filter(Boolean) as Array<{ id: string; name: string }> }
      : topologies,
  };
}

function normalizePolygonInput(polygon: unknown): string | undefined {
  if (polygon === undefined || polygon === null) return undefined;
  if (typeof polygon === 'string') return polygon;
  return JSON.stringify(polygon);
}

export interface UseListTopologiesResult {
  topologies: Topology[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListTopologies(): UseListTopologiesResult {
  const [topologies, setTopologies] = useState<Topology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: unknown = await API.graphql({
        query: listTopologiesQuery,
        variables: { limit: 500 },
      });
      const raw = (response as { data?: { listTopologies?: { items?: unknown[] } } }).data?.listTopologies
        ?.items ?? [];
      setTopologies(
        raw.map((x) => normalizeTopology(x)).filter((x): x is Topology => x != null)
      );
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ message?: string }>; message?: string };
      setError(e?.errors?.[0]?.message || e?.message || 'Failed to fetch topologies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { topologies, loading, error, refetch: fetchList };
}

export interface UseGetTopologyResult {
  topology: Topology | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetTopology(id: string): UseGetTopologyResult {
  const [topology, setTopology] = useState<Topology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response: unknown = await API.graphql({
        query: getTopologyQuery,
        variables: { id },
      });
      const raw = (response as { data?: { getTopology?: unknown } }).data?.getTopology;
      setTopology(normalizeTopology(raw));
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Failed to fetch topology');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return { topology, loading, error, refetch: fetchOne };
}

/** Imperative fetch for ancestor walking (no hook). */
export async function getTopologyById(id: string): Promise<Topology | null> {
  const response: unknown = await API.graphql({
    query: getTopologyQuery,
    variables: { id },
  });
  const raw = (response as { data?: { getTopology?: unknown } }).data?.getTopology;
  return normalizeTopology(raw);
}

export interface UseCreateTopologyResult {
  createTopology: (input: {
    name: string;
    projectTopologiesId: string;
    string_code?: string | null;
    number_code?: string | null;
    status?: string | null;
    polygon?: unknown;
    topologyTopologyParentId?: string | null;
  }) => Promise<Topology | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateTopology(): UseCreateTopologyResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTopology = useCallback(
    async (input: {
      name: string;
      projectTopologiesId: string;
      string_code?: string | null;
      number_code?: string | null;
      status?: string | null;
      polygon?: unknown;
      topologyTopologyParentId?: string | null;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const { topologyTopologyParentId, polygon, projectTopologiesId, ...rest } = input;
        const apiInput: Record<string, unknown> = { ...rest };
        const poly = normalizePolygonInput(polygon);
        if (poly !== undefined) apiInput.polygon = poly;
        apiInput[PROJECT_FK_FIELD] = projectTopologiesId;
        const parentId =
          topologyTopologyParentId && topologyTopologyParentId !== '' ? topologyTopologyParentId : null;
        if (parentId) apiInput[PARENT_FK_FIELD] = parentId;

        const response: unknown = await API.graphql({
          query: createTopologyMutation,
          variables: { input: apiInput },
        });
        const raw = (response as { data?: { createTopology?: unknown } }).data?.createTopology;
        return normalizeTopology(raw);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || 'Failed to create topology');
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createTopology, loading, error };
}

export interface UseUpdateTopologyResult {
  updateTopology: (input: {
    id: string;
    name?: string;
    projectTopologiesId?: string | null;
    string_code?: string | null;
    number_code?: string | null;
    status?: string | null;
    polygon?: unknown | null;
    topologyTopologyParentId?: string | null;
  }) => Promise<Topology | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateTopology(): UseUpdateTopologyResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTopology = useCallback(
    async (input: {
      id: string;
      name?: string;
      projectTopologiesId?: string | null;
      string_code?: string | null;
      number_code?: string | null;
      status?: string | null;
      polygon?: unknown | null;
      topologyTopologyParentId?: string | null;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const { id, topologyTopologyParentId, polygon, projectTopologiesId, ...rest } = input;
        const apiInput: Record<string, unknown> = { id, ...rest };
        if ('polygon' in input) {
          if (polygon === null || polygon === undefined) {
            apiInput.polygon = null;
          } else {
            apiInput.polygon = normalizePolygonInput(polygon);
          }
        }
        if ('topologyTopologyParentId' in input) {
          const parentId =
            topologyTopologyParentId === '' || topologyTopologyParentId == null
              ? null
              : topologyTopologyParentId;
          apiInput[PARENT_FK_FIELD] = parentId;
        }
        if ('projectTopologiesId' in input) {
          const pid =
            projectTopologiesId === '' || projectTopologiesId == null ? null : projectTopologiesId;
          apiInput[PROJECT_FK_FIELD] = pid;
        }

        const response: unknown = await API.graphql({
          query: updateTopologyMutation,
          variables: { input: apiInput },
        });
        const raw = (response as { data?: { updateTopology?: unknown } }).data?.updateTopology;
        return normalizeTopology(raw);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || 'Failed to update topology');
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateTopology, loading, error };
}

export interface UseDeleteTopologyResult {
  deleteTopology: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteTopology(): UseDeleteTopologyResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTopology = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: deleteTopologyMutation,
        variables: { input: { id } },
      });
      return true;
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Failed to delete topology');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTopology, loading, error };
}
