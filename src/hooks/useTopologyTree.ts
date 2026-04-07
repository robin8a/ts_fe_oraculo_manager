import { useCallback, useEffect, useMemo, useState } from 'react';
import { API } from 'aws-amplify';
import { createTopologyTree as createTopologyTreeMutation, listTopologyTrees as listTopologyTreesQuery } from '../amplify_custom/topologyTreeOperations';
import type { Topology } from '../types/topology';
import type { TreeWithFeatures } from '../types/projectTreeFeature';
 
export interface TopologyTreeItem {
  id: string;
  topologyTopologyTreesId?: string | null;
  treeTopologyTreesId?: string | null;
  topology?: Pick<Topology, 'id' | 'name' | 'projectTopologiesId'> | null;
  tree?: Pick<TreeWithFeatures, 'id' | 'name' | 'projectTreesId'> | null;
}
 
export type TopologyIdsByTreeId = Record<string, string[]>;
export type TopologyTreeIdsByPairKey = Record<string, string>;
 
function pairKey(treeId: string, topologyId: string): string {
  return `${treeId}::${topologyId}`;
}
 
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
 
async function listAllTopologyTrees(filter: unknown): Promise<TopologyTreeItem[]> {
  const items: TopologyTreeItem[] = [];
  let nextToken: string | null | undefined = undefined;
  do {
    const resp: any = await API.graphql({
      query: listTopologyTreesQuery,
      variables: { filter, limit: 500, nextToken: nextToken || undefined },
    });
    const page = resp?.data?.listTopologyTrees?.items ?? [];
    const next = resp?.data?.listTopologyTrees?.nextToken ?? null;
    items.push(...page.filter(Boolean));
    nextToken = next;
  } while (nextToken);
  return items;
}
 
export interface UseTopologyTreeRelationsResult {
  /** treeId -> [topologyId, ...] */
  topologyIdsByTreeId: TopologyIdsByTreeId;
  /** `${treeId}::${topologyId}` -> topologyTreeId */
  topologyTreeIdByPairKey: TopologyTreeIdsByPairKey;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
 
/**
 * Fetch TopologyTree rows for a set of tree ids (chunked OR filters to avoid huge payloads).
 * Builds maps used by the Assign UI to display existing relations + skip duplicates.
 */
export function useTopologyTreeRelations(treeIds: string[]): UseTopologyTreeRelationsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topologyIdsByTreeId, setTopologyIdsByTreeId] = useState<TopologyIdsByTreeId>({});
  const [topologyTreeIdByPairKey, setTopologyTreeIdByPairKey] = useState<TopologyTreeIdsByPairKey>({});
 
  const stableIds = useMemo(() => Array.from(new Set(treeIds.filter(Boolean))).sort(), [treeIds]);
 
  const refetch = useCallback(async () => {
    if (stableIds.length === 0) {
      setTopologyIdsByTreeId({});
      setTopologyTreeIdByPairKey({});
      setError(null);
      return;
    }
 
    try {
      setLoading(true);
      setError(null);
 
      const byTree: TopologyIdsByTreeId = {};
      const byPair: TopologyTreeIdsByPairKey = {};
 
      // AppSync filters can become large; chunk OR clauses.
      for (const batch of chunk(stableIds, 25)) {
        const filter = {
          or: batch.map((id) => ({ treeTopologyTreesId: { eq: id } })),
        };
        const rows = await listAllTopologyTrees(filter);
        for (const r of rows) {
          const treeId = r.tree?.id ?? r.treeTopologyTreesId ?? null;
          const topologyId = r.topology?.id ?? r.topologyTopologyTreesId ?? null;
          if (!treeId || !topologyId || !r.id) continue;
          if (!byTree[treeId]) byTree[treeId] = [];
          if (!byTree[treeId].includes(topologyId)) byTree[treeId].push(topologyId);
          byPair[pairKey(treeId, topologyId)] = r.id;
        }
      }
 
      setTopologyIdsByTreeId(byTree);
      setTopologyTreeIdByPairKey(byPair);
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || err?.message || 'Failed to fetch TopologyTree relations';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [stableIds]);
 
  useEffect(() => {
    refetch();
  }, [refetch]);
 
  return { topologyIdsByTreeId, topologyTreeIdByPairKey, loading, error, refetch };
}
 
export interface UseCreateTopologyTreeResult {
  createTopologyTree: (input: { topologyId: string; treeId: string }) => Promise<{ id: string } | null>;
  loading: boolean;
  error: string | null;
}
 
export function useCreateTopologyTree(): UseCreateTopologyTreeResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const createTopologyTree = useCallback(async (input: { topologyId: string; treeId: string }) => {
    try {
      setLoading(true);
      setError(null);
 
      const apiInput: Record<string, unknown> = {
        topologyTopologyTreesId: input.topologyId,
        treeTopologyTreesId: input.treeId,
      };
 
      const resp: any = await API.graphql({
        query: createTopologyTreeMutation,
        variables: { input: apiInput },
      });
      const raw = resp?.data?.createTopologyTree;
      if (!raw?.id) return null;
      return { id: raw.id as string };
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || err?.message || 'Failed to create TopologyTree relationship';
      setError(msg);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
 
  return { createTopologyTree, loading, error };
}
 
export const topologyTreePairKey = pairKey;

