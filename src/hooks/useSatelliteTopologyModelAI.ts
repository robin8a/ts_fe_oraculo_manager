import { useState, useCallback } from 'react';
import { API } from 'aws-amplify';
import type {
  SatelliteTopologyModelAI,
  SatelliteTopologyAssociationSelection,
} from '../types/satelliteTopologyModelAI';

const MODEL_AI_FK = 'modelAISatelliteTopologyModelAIsId';
const SATELLITE_TOPOLOGY_FK = 'satelliteTopologySatelliteTopologyModelAIsId';

/** Amplify pluralizes trailing "AI" as "AIS" (same as listModelAIS). */
const LIST_BY_MODEL_AI = /* GraphQL */ `
  query ListSatelliteTopologyModelAISByModelAI(
    $filter: ModelSatelliteTopologyModelAIFilterInput
    $limit: Int
  ) {
    listSatelliteTopologyModelAIS(filter: $filter, limit: $limit) {
      items {
        id
        modelAISatelliteTopologyModelAIsId
        satelliteTopologySatelliteTopologyModelAIsId
        satelliteTopology {
          id
          name
          type
          satelliteTopologySatelliteTopologiesId
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const CREATE_ASSOCIATION = /* GraphQL */ `
  mutation CreateSatelliteTopologyModelAI($input: CreateSatelliteTopologyModelAIInput!) {
    createSatelliteTopologyModelAI(input: $input) {
      id
      modelAISatelliteTopologyModelAIsId
      satelliteTopologySatelliteTopologyModelAIsId
      satelliteTopology {
        id
        name
        type
      }
    }
  }
`;

const DELETE_ASSOCIATION = /* GraphQL */ `
  mutation DeleteSatelliteTopologyModelAI($input: DeleteSatelliteTopologyModelAIInput!) {
    deleteSatelliteTopologyModelAI(input: $input) {
      id
    }
  }
`;

function graphqlErrorMessage(err: unknown): string {
  const e = err as { errors?: Array<{ message?: string }>; message?: string };
  return e?.errors?.[0]?.message || e?.message || 'Request failed';
}

/** AppSync when the list query name does not match the deployed schema. */
function isListQueryUndefinedError(err: unknown): boolean {
  const e = err as { errors?: Array<{ message?: string }>; message?: string };
  const msgs: string[] = [];
  if (e?.errors) for (const x of e.errors) if (x?.message) msgs.push(x.message);
  if (e?.message) msgs.push(e.message);
  return msgs.some(
    (m) =>
      /listSatelliteTopologyModelAI/i.test(m) &&
      /Field .* in type 'Query' is undefined/i.test(m)
  );
}

function normalizeAssociation(raw: unknown): SatelliteTopologyModelAI | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const st = item.satelliteTopology as SatelliteTopologyModelAI['satelliteTopology'];
  const topologyId =
    (item[SATELLITE_TOPOLOGY_FK] as string | undefined) ?? st?.id ?? null;
  return {
    id: item.id as string,
    modelAISatelliteTopologyModelAIsId: item[MODEL_AI_FK] as string | undefined,
    satelliteTopologySatelliteTopologyModelAIsId: topologyId ?? undefined,
    satelliteTopology: st ?? undefined,
    createdAt: item.createdAt as string | undefined,
    updatedAt: item.updatedAt as string | undefined,
  };
}

/** Union of parent + child topology ids for persistence */
export function associationTopologyIds(selection: SatelliteTopologyAssociationSelection): string[] {
  const ids = new Set<string>();
  if (selection.parentId) ids.add(selection.parentId);
  selection.childIds.forEach((id) => ids.add(id));
  return [...ids];
}

/**
 * Infer parent vs children from stored links using topology hierarchy among associated nodes.
 */
export function inferAssociationSelection(
  associations: SatelliteTopologyModelAI[]
): SatelliteTopologyAssociationSelection {
  const nodes = associations
    .map((a) => {
      const id = a.satelliteTopologySatelliteTopologyModelAIsId ?? a.satelliteTopology?.id;
      if (!id) return null;
      return {
        id,
        name: a.satelliteTopology?.name ?? id,
        parentId:
          (a.satelliteTopology as { satelliteTopologySatelliteTopologiesId?: string } | undefined)
            ?.satelliteTopologySatelliteTopologiesId ?? null,
      };
    })
    .filter((n): n is { id: string; name: string; parentId: string | null } => n != null);

  if (nodes.length === 0) return { parentId: '', childIds: [] };

  const idSet = new Set(nodes.map((n) => n.id));
  const parentCandidates = nodes.filter((n) =>
    nodes.some((other) => other.parentId === n.id && idSet.has(other.id))
  );

  let parentId = '';
  if (parentCandidates.length === 1) {
    parentId = parentCandidates[0].id;
  } else {
    const roots = nodes.filter((n) => !n.parentId || !idSet.has(n.parentId));
    parentId = roots.length === 1 ? roots[0].id : nodes[0].id;
  }

  const childIds = nodes.map((n) => n.id).filter((id) => id !== parentId);
  return { parentId, childIds };
}

export async function listSatelliteTopologyModelAIsByModelAI(
  modelAIId: string
): Promise<{ associations: SatelliteTopologyModelAI[]; error?: string }> {
  try {
    const response: unknown = await API.graphql({
      query: LIST_BY_MODEL_AI,
      variables: {
        filter: { [MODEL_AI_FK]: { eq: modelAIId } },
        limit: 500,
      },
    });
    const raw =
      (response as { data?: { listSatelliteTopologyModelAIS?: { items?: unknown[] } } }).data
        ?.listSatelliteTopologyModelAIS?.items ?? [];
    const associations = raw
      .map((x) => normalizeAssociation(x))
      .filter((x): x is SatelliteTopologyModelAI => x != null);
    return { associations };
  } catch (err: unknown) {
    const message = isListQueryUndefinedError(err)
      ? "GraphQL query name mismatch: use listSatelliteTopologyModelAIS (not listSatelliteTopologyModelAIs)."
      : graphqlErrorMessage(err);
    return { associations: [], error: message };
  }
}

export async function syncSatelliteTopologyModelAIs(
  modelAIId: string,
  selection: SatelliteTopologyAssociationSelection
): Promise<{ ok: boolean; error?: string }> {
  const desired = new Set(associationTopologyIds(selection));
  const listResult = await listSatelliteTopologyModelAIsByModelAI(modelAIId);

  if (listResult.error) {
    return { ok: false, error: listResult.error };
  }

  try {
    const existingByTopologyId = new Map<string, SatelliteTopologyModelAI>();
    for (const row of listResult.associations) {
      const tid = row.satelliteTopologySatelliteTopologyModelAIsId;
      if (tid) existingByTopologyId.set(tid, row);
    }

    await Promise.all(
      listResult.associations
        .filter((row) => {
          const tid = row.satelliteTopologySatelliteTopologyModelAIsId;
          return tid && !desired.has(tid);
        })
        .map((row) =>
          API.graphql({
            query: DELETE_ASSOCIATION,
            variables: { input: { id: row.id } },
          })
        )
    );

    await Promise.all(
      [...desired]
        .filter((topologyId) => !existingByTopologyId.has(topologyId))
        .map((topologyId) =>
          API.graphql({
            query: CREATE_ASSOCIATION,
            variables: {
              input: {
                [MODEL_AI_FK]: modelAIId,
                [SATELLITE_TOPOLOGY_FK]: topologyId,
              },
            },
          })
        )
    );

    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: graphqlErrorMessage(err) };
  }
}

export interface UseSatelliteTopologyAssociationsResult {
  associations: SatelliteTopologyModelAI[];
  selection: SatelliteTopologyAssociationSelection;
  loading: boolean;
  error: string | null;
  setSelection: (selection: SatelliteTopologyAssociationSelection) => void;
  load: (modelAIId: string) => Promise<void>;
  sync: (modelAIId: string, selection: SatelliteTopologyAssociationSelection) => Promise<boolean>;
}

export function useSatelliteTopologyAssociations(): UseSatelliteTopologyAssociationsResult {
  const [associations, setAssociations] = useState<SatelliteTopologyModelAI[]>([]);
  const [selection, setSelection] = useState<SatelliteTopologyAssociationSelection>({
    parentId: '',
    childIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (modelAIId: string) => {
    if (!modelAIId) return;
    setLoading(true);
    setError(null);
    const result = await listSatelliteTopologyModelAIsByModelAI(modelAIId);
    if (result.error) {
      setError(result.error);
    } else {
      setAssociations(result.associations);
      setSelection(inferAssociationSelection(result.associations));
    }
    setLoading(false);
  }, []);

  const sync = useCallback(
    async (modelAIId: string, next: SatelliteTopologyAssociationSelection) => {
      setLoading(true);
      setError(null);
      const result = await syncSatelliteTopologyModelAIs(modelAIId, next);
      if (!result.ok) {
        setError(result.error ?? 'Failed to sync satellite topology associations');
        setLoading(false);
        return false;
      }
      await load(modelAIId);
      return true;
    },
    [load]
  );

  return {
    associations,
    selection,
    loading,
    error,
    setSelection,
    load,
    sync,
  };
}
