import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { SatelliteTopology } from '../types/satelliteTopology';

/**
 * Amplify FK for SatelliteTopology → parent: parent model has `satelliteTopologies` @hasMany.
 * Same pattern as Topology (`topologyTopologiesId`) and ModelAI (`modelAIModelAIsId`).
 */
const PARENT_FK_FIELD = 'satelliteTopologySatelliteTopologiesId';

const LIST_SATELLITE_TOPOLOGIES = /* GraphQL */ `
  query ListSatelliteTopologies($limit: Int, $nextToken: String) {
    listSatelliteTopologies(limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        name
        description
        satelliteTopologySatelliteTopologiesId
        satelliteTopologyParent {
          id
          name
          type
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const GET_SATELLITE_TOPOLOGY = /* GraphQL */ `
  query GetSatelliteTopology($id: ID!) {
    getSatelliteTopology(id: $id) {
      id
      type
      name
      description
      satelliteTopologySatelliteTopologiesId
      satelliteTopologyParent {
        id
        name
        type
      }
      satelliteTopologies {
        items {
          id
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SATELLITE_TOPOLOGY = /* GraphQL */ `
  mutation CreateSatelliteTopology($input: CreateSatelliteTopologyInput!) {
    createSatelliteTopology(input: $input) {
      id
      type
      name
      description
      satelliteTopologySatelliteTopologiesId
      satelliteTopologyParent {
        id
        name
        type
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_SATELLITE_TOPOLOGY = /* GraphQL */ `
  mutation UpdateSatelliteTopology($input: UpdateSatelliteTopologyInput!) {
    updateSatelliteTopology(input: $input) {
      id
      type
      name
      description
      satelliteTopologySatelliteTopologiesId
      satelliteTopologyParent {
        id
        name
        type
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_SATELLITE_TOPOLOGY = /* GraphQL */ `
  mutation DeleteSatelliteTopology($input: DeleteSatelliteTopologyInput!) {
    deleteSatelliteTopology(input: $input) {
      id
    }
  }
`;

function normalizeParent(
  parent: unknown
): { id: string; name: string; type?: string | null } | null {
  if (!parent || typeof parent !== 'object') return null;
  const p = parent as { id?: string; name?: string; type?: string | null };
  if (!p.id) return null;
  return { id: p.id, name: p.name ?? p.id, type: p.type };
}

function normalizeSatelliteTopology(raw: unknown): SatelliteTopology | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const parent = normalizeParent(item.satelliteTopologyParent);
  const parentId =
    (item[PARENT_FK_FIELD] as string | undefined) ??
    (item.satelliteTopologyParentId as string | undefined) ??
    parent?.id ??
    null;
  const st = item.satelliteTopologies as SatelliteTopology['satelliteTopologies'];
  const childItems = st?.items?.filter(Boolean) as Array<{ id: string; name: string }> | undefined;

  return {
    ...(item as unknown as SatelliteTopology),
    satelliteTopologySatelliteTopologiesId: parentId,
    satelliteTopologyParent: parent ?? undefined,
    satelliteTopologies: st
      ? { items: childItems ?? [] }
      : undefined,
  };
}

function graphqlErrorMessage(err: unknown): string {
  const e = err as { errors?: Array<{ message?: string }>; message?: string };
  return e?.errors?.[0]?.message || e?.message || 'Request failed';
}

export interface UseListSatelliteTopologiesResult {
  satelliteTopologies: SatelliteTopology[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListSatelliteTopologies(): UseListSatelliteTopologiesResult {
  const [satelliteTopologies, setSatelliteTopologies] = useState<SatelliteTopology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: unknown = await API.graphql({
        query: LIST_SATELLITE_TOPOLOGIES,
        variables: { limit: 500 },
      });
      const raw =
        (response as { data?: { listSatelliteTopologies?: { items?: unknown[] } } }).data
          ?.listSatelliteTopologies?.items ?? [];
      setSatelliteTopologies(
        raw.map((x) => normalizeSatelliteTopology(x)).filter((x): x is SatelliteTopology => x != null)
      );
    } catch (err: unknown) {
      setError(graphqlErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { satelliteTopologies, loading, error, refetch: fetchList };
}

export interface UseGetSatelliteTopologyResult {
  satelliteTopology: SatelliteTopology | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetSatelliteTopology(id: string): UseGetSatelliteTopologyResult {
  const [satelliteTopology, setSatelliteTopology] = useState<SatelliteTopology | null>(null);
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
        query: GET_SATELLITE_TOPOLOGY,
        variables: { id },
      });
      const raw = (response as { data?: { getSatelliteTopology?: unknown } }).data?.getSatelliteTopology;
      setSatelliteTopology(normalizeSatelliteTopology(raw));
    } catch (err: unknown) {
      setError(graphqlErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return { satelliteTopology, loading, error, refetch: fetchOne };
}

export interface UseCreateSatelliteTopologyResult {
  createSatelliteTopology: (input: {
    type: string;
    name: string;
    description: string;
    satelliteTopologySatelliteTopologiesId?: string | null;
  }) => Promise<SatelliteTopology | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateSatelliteTopology(): UseCreateSatelliteTopologyResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSatelliteTopology = useCallback(
    async (input: {
      type: string;
      name: string;
      description: string;
      satelliteTopologySatelliteTopologiesId?: string | null;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const { satelliteTopologySatelliteTopologiesId, ...rest } = input;
        const apiInput: Record<string, unknown> = { ...rest };
        const parentId =
          satelliteTopologySatelliteTopologiesId && satelliteTopologySatelliteTopologiesId !== ''
            ? satelliteTopologySatelliteTopologiesId
            : null;
        if (parentId) apiInput[PARENT_FK_FIELD] = parentId;

        const response: unknown = await API.graphql({
          query: CREATE_SATELLITE_TOPOLOGY,
          variables: { input: apiInput },
        });
        const raw = (response as { data?: { createSatelliteTopology?: unknown } }).data
          ?.createSatelliteTopology;
        return normalizeSatelliteTopology(raw);
      } catch (err: unknown) {
        setError(graphqlErrorMessage(err));
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createSatelliteTopology, loading, error };
}

export interface UseUpdateSatelliteTopologyResult {
  updateSatelliteTopology: (input: {
    id: string;
    type?: string;
    name?: string;
    description?: string;
    satelliteTopologySatelliteTopologiesId?: string | null;
  }) => Promise<SatelliteTopology | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateSatelliteTopology(): UseUpdateSatelliteTopologyResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSatelliteTopology = useCallback(
    async (input: {
      id: string;
      type?: string;
      name?: string;
      description?: string;
      satelliteTopologySatelliteTopologiesId?: string | null;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const { id, satelliteTopologySatelliteTopologiesId, ...rest } = input;
        const apiInput: Record<string, unknown> = { id, ...rest };
        if ('satelliteTopologySatelliteTopologiesId' in input) {
          const parentId =
            satelliteTopologySatelliteTopologiesId === '' ||
            satelliteTopologySatelliteTopologiesId == null
              ? null
              : satelliteTopologySatelliteTopologiesId;
          apiInput[PARENT_FK_FIELD] = parentId;
        }

        const response: unknown = await API.graphql({
          query: UPDATE_SATELLITE_TOPOLOGY,
          variables: { input: apiInput },
        });
        const raw = (response as { data?: { updateSatelliteTopology?: unknown } }).data
          ?.updateSatelliteTopology;
        return normalizeSatelliteTopology(raw);
      } catch (err: unknown) {
        setError(graphqlErrorMessage(err));
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateSatelliteTopology, loading, error };
}

export interface UseDeleteSatelliteTopologyResult {
  deleteSatelliteTopology: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteSatelliteTopology(): UseDeleteSatelliteTopologyResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSatelliteTopology = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: DELETE_SATELLITE_TOPOLOGY,
        variables: { input: { id } },
      });
      return true;
    } catch (err: unknown) {
      setError(graphqlErrorMessage(err));
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteSatelliteTopology, loading, error };
}
