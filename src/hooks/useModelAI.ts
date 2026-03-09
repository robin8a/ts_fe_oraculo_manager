import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { ModelAI } from '../types/modelai';

/** Normalize parent to { id, name } or null; ensure modelAIParent is always in a shape the UI can display */
function normalizeParent(parent: any): { id: string; name: string } | null {
  if (!parent || typeof parent !== 'object') return null;
  const id = parent.id ?? parent.ID;
  const name = parent.name;
  if (id && name) return { id, name };
  if (id) return { id, name: String(name ?? id) };
  return null;
}

function normalizeModelAIItems(raw: any[]): ModelAI[] {
  return raw.map((item: any) => {
    const modelAIs = item.modelAIs?.items ?? item.modelAIs;
    const parent = normalizeParent(item.modelAIParent);
    const parentId = item.modelAIParentId ?? item.modelAIModelAIParentId ?? parent?.id;
    return {
      ...item,
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
    modelAIParent: parent ?? undefined,
    modelAIModelAIParentId: parentId,
    modelAIs: Array.isArray(modelAIs) ? modelAIs.map((c: any) => ({ id: c.id, name: c.name })) : undefined,
  };
}

// Deployed schema has modelAIParent @belongsTo and modelAIs @hasMany.
// CreateModelAIInput/UpdateModelAIInput do not accept modelAIParentId or modelAIModelAIParentId in this project's API — parent not sent. Set SEND_PARENT_FK = true and PARENT_FK_FIELD to the exact input field name from amplify codegen when the API supports it.
const PARENT_FK_FIELD = 'modelAIParentId';
const SEND_PARENT_FK = false;

const PARENT_CHILDREN_FIELDS = `
  modelAIParent { id name }
  modelAIs { items { id name } }
`;

const GET_MODEL_AI = `
  query GetModelAI($id: ID!) {
    getModelAI(id: $id) {
      id
      name
      description
      document_link
      api_link
      version
      is_approved
      tokens_cost
      cost_tokens
      createdAt
      updatedAt
      ${PARENT_CHILDREN_FIELDS}
    }
  }
`;

const LIST_MODEL_AIS_ALT = `
  query ListModelAIS {
    listModelAIS {
      items {
        id
        name
        description
        document_link
        api_link
        version
        is_approved
        tokens_cost
        cost_tokens
        createdAt
        updatedAt
        ${PARENT_CHILDREN_FIELDS}
      }
    }
  }
`;

const CREATE_MODEL_AI = `
  mutation CreateModelAI($input: CreateModelAIInput!) {
    createModelAI(input: $input) {
      id
      name
      description
      document_link
      api_link
      version
      is_approved
      tokens_cost
      cost_tokens
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_MODEL_AI = `
  mutation UpdateModelAI($input: UpdateModelAIInput!) {
    updateModelAI(input: $input) {
      id
      name
      description
      document_link
      api_link
      version
      is_approved
      tokens_cost
      cost_tokens
      createdAt
      updatedAt
    }
  }
`;

const DELETE_MODEL_AI = `
  mutation DeleteModelAI($input: DeleteModelAIInput!) {
    deleteModelAI(input: $input) {
      id
    }
  }
`;

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
      // API exposes listModelAIS (capital S), not listModelAIs
      const response: any = await API.graphql({
        query: LIST_MODEL_AIS_ALT
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
        query: GET_MODEL_AI,
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
        query: CREATE_MODEL_AI,
        variables: { input: apiInput }
      });
      return normalizeModelAI(response.data?.createModelAI) ?? null;
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
        query: UPDATE_MODEL_AI,
        variables: { input: apiInput }
      });
      return normalizeModelAI(response.data?.updateModelAI) ?? null;
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
        query: DELETE_MODEL_AI,
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

