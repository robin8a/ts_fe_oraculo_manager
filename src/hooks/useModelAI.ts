import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { ModelAI } from '../types/modelai';
import { getModelAI, listModelAIS } from '../amplify_custom/queries';
import { createModelAI as createModelAIMutation, updateModelAI as updateModelAIMutation, deleteModelAI as deleteModelAIMutation } from '../graphql/mutations';

/** Normalize parent to { id, name } or null; ensure modelAIParent is always in a shape the UI can display */
function normalizeParent(parent: any): { id: string; name: string } | null {
  if (!parent || typeof parent !== 'object') return null;
  const id = parent.id ?? parent.ID;
  const name = parent.name;
  if (id && name) return { id, name };
  if (id) return { id, name: String(name ?? id) };
  return null;
}

/** Legacy rows may lack `is_latest` in DynamoDB; we omit it from queries to avoid AppSync non-null errors. */
function normalizeIsLatest(value: unknown): boolean {
  return value === true;
}

function normalizeModelAIItems(raw: any[]): ModelAI[] {
  return raw
    .filter((item) => item != null)
    .map((item: any) => {
      const modelAIs = item.modelAIs?.items ?? item.modelAIs;
      const parent = normalizeParent(item.modelAIParent);
      const parentId = item.modelAIParentId ?? item.modelAIModelAIParentId ?? parent?.id;
      return {
        ...item,
        is_latest: normalizeIsLatest(item.is_latest),
        modelAIParent: parent ?? undefined,
        modelAIModelAIParentId: parentId,
        modelAIs: Array.isArray(modelAIs) ? modelAIs.map((c: any) => ({ id: c.id, name: c.name })) : undefined,
      };
    });
}

function normalizeModelAI(item: any): ModelAI | null {
  if (!item) return null;
  const modelAIs = item.modelAIs?.items ?? item.modelAIs;
  const parent = normalizeParent(item.modelAIParent);
  const parentId = item.modelAIParentId ?? item.modelAIModelAIParentId ?? parent?.id;
  return {
    ...item,
    is_latest: normalizeIsLatest(item.is_latest),
    modelAIParent: parent ?? undefined,
    modelAIModelAIParentId: parentId,
    modelAIs: Array.isArray(modelAIs) ? modelAIs.map((c: any) => ({ id: c.id, name: c.name })) : undefined,
  };
}

// Parent FK on create/update input (from graphql/mutations): modelAIModelAIsId
const PARENT_FK_FIELD = 'modelAIModelAIsId';
const SEND_PARENT_FK = true;

export interface UseListModelAIsResult {
  modelAIs: ModelAI[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListModelAIs(): UseListModelAIsResult {
  const [modelAIs, setModelAIs] = useState<ModelAI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelAIs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: listModelAIS,
        variables: {}
      });
      const rawItems = response.data?.listModelAIS?.items ?? [];
      setModelAIs(normalizeModelAIItems(rawItems));
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to fetch ModelAI records';
      setError(errorMessage);
      console.error('Error fetching ModelAIs:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      console.error('💡 Tip: Check your AWS AppSync console to see the exact query names available.');
      console.error('💡 The query might need to be deployed. Run: amplify push');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModelAIs();
  }, [fetchModelAIs]);

  return { modelAIs, loading, error, refetch: fetchModelAIs };
}

export interface UseGetModelAIResult {
  modelAI: ModelAI | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetModelAI(id: string): UseGetModelAIResult {
  const [modelAI, setModelAI] = useState<ModelAI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelAI = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: getModelAI,
        variables: { id }
      });
      setModelAI(normalizeModelAI(response.data?.getModelAI) ?? null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ModelAI');
      console.error('Error fetching ModelAI:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchModelAI();
  }, [fetchModelAI]);

  return { modelAI, loading, error, refetch: fetchModelAI };
}

export interface UseCreateModelAIResult {
  createModelAI: (input: Omit<ModelAI, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ModelAI | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateModelAI(): UseCreateModelAIResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createModelAI = useCallback(async (input: Omit<ModelAI, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const { modelAIParent, modelAIs: _ma, modelAIModelAIParentId, ...rest } = input as any;
      const apiInput: any = { ...rest };
      if (SEND_PARENT_FK) {
        const parentId = modelAIModelAIParentId && modelAIModelAIParentId !== '' ? modelAIModelAIParentId : null;
        if (parentId !== undefined) apiInput[PARENT_FK_FIELD] = parentId;
      }
      const response: any = await API.graphql({
        query: createModelAIMutation,
        variables: { input: apiInput }
      });
      const created = normalizeModelAI(response.data?.createModelAI) ?? null;
      if (created && typeof input.is_latest === 'boolean') {
        return { ...created, is_latest: input.is_latest };
      }
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create ModelAI');
      console.error('Error creating ModelAI:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createModelAI, loading, error };
}

export interface UseUpdateModelAIResult {
  updateModelAI: (input: Partial<ModelAI> & { id: string }) => Promise<ModelAI | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateModelAI(): UseUpdateModelAIResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateModelAI = useCallback(async (input: Partial<ModelAI> & { id: string }) => {
    try {
      setLoading(true);
      setError(null);
      const { modelAIParent, modelAIs: _ma, modelAIModelAIParentId, ...rest } = input as any;
      const apiInput: any = { ...rest };
      if (SEND_PARENT_FK && 'modelAIModelAIParentId' in input) {
        const parentId = modelAIModelAIParentId === '' || modelAIModelAIParentId == null ? null : modelAIModelAIParentId;
        apiInput[PARENT_FK_FIELD] = parentId;
      }
      const response: any = await API.graphql({
        query: updateModelAIMutation,
        variables: { input: apiInput }
      });
      const updated = normalizeModelAI(response.data?.updateModelAI) ?? null;
      if (updated && typeof input.is_latest === 'boolean') {
        return { ...updated, is_latest: input.is_latest };
      }
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update ModelAI');
      console.error('Error updating ModelAI:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateModelAI, loading, error };
}

export interface UseDeleteModelAIResult {
  deleteModelAI: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteModelAI(): UseDeleteModelAIResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteModelAI = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: deleteModelAIMutation,
        variables: { input: { id } }
      });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete ModelAI');
      console.error('Error deleting ModelAI:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteModelAI, loading, error };
}

