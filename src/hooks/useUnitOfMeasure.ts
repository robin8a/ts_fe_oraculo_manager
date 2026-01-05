import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { UnitOfMeasure } from '../types/unitOfMeasure';

// GraphQL queries and mutations
const LIST_UNIT_OF_MEASURES = `
  query ListUnitOfMeasures {
    listUnitOfMeasures {
      items {
        id
        name
        abbreviation
        createdAt
        updatedAt
      }
    }
  }
`;

const GET_UNIT_OF_MEASURE = `
  query GetUnitOfMeasure($id: ID!) {
    getUnitOfMeasure(id: $id) {
      id
      name
      abbreviation
      createdAt
      updatedAt
    }
  }
`;

const CREATE_UNIT_OF_MEASURE = `
  mutation CreateUnitOfMeasure($input: CreateUnitOfMeasureInput!) {
    createUnitOfMeasure(input: $input) {
      id
      name
      abbreviation
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_UNIT_OF_MEASURE = `
  mutation UpdateUnitOfMeasure($input: UpdateUnitOfMeasureInput!) {
    updateUnitOfMeasure(input: $input) {
      id
      name
      abbreviation
      createdAt
      updatedAt
    }
  }
`;

const DELETE_UNIT_OF_MEASURE = `
  mutation DeleteUnitOfMeasure($input: DeleteUnitOfMeasureInput!) {
    deleteUnitOfMeasure(input: $input) {
      id
    }
  }
`;

export interface UseListUnitOfMeasuresResult {
  unitOfMeasures: UnitOfMeasure[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListUnitOfMeasures(): UseListUnitOfMeasuresResult {
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnitOfMeasures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: any = await API.graphql({
        query: LIST_UNIT_OF_MEASURES
      });
      
      const items = response.data?.listUnitOfMeasures?.items || [];
      setUnitOfMeasures(items);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to fetch UnitOfMeasure records';
      setError(errorMessage);
      console.error('Error fetching UnitOfMeasures:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnitOfMeasures();
  }, [fetchUnitOfMeasures]);

  return { unitOfMeasures, loading, error, refetch: fetchUnitOfMeasures };
}

export interface UseGetUnitOfMeasureResult {
  unitOfMeasure: UnitOfMeasure | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetUnitOfMeasure(id: string): UseGetUnitOfMeasureResult {
  const [unitOfMeasure, setUnitOfMeasure] = useState<UnitOfMeasure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnitOfMeasure = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: GET_UNIT_OF_MEASURE,
        variables: { id }
      });
      setUnitOfMeasure(response.data?.getUnitOfMeasure || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch UnitOfMeasure');
      console.error('Error fetching UnitOfMeasure:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUnitOfMeasure();
  }, [fetchUnitOfMeasure]);

  return { unitOfMeasure, loading, error, refetch: fetchUnitOfMeasure };
}

export interface UseCreateUnitOfMeasureResult {
  createUnitOfMeasure: (input: Omit<UnitOfMeasure, 'id' | 'createdAt' | 'updatedAt'>) => Promise<UnitOfMeasure | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateUnitOfMeasure(): UseCreateUnitOfMeasureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUnitOfMeasure = useCallback(async (input: Omit<UnitOfMeasure, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: CREATE_UNIT_OF_MEASURE,
        variables: { input }
      });
      return response.data?.createUnitOfMeasure || null;
    } catch (err: any) {
      setError(err.message || 'Failed to create UnitOfMeasure');
      console.error('Error creating UnitOfMeasure:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUnitOfMeasure, loading, error };
}

export interface UseUpdateUnitOfMeasureResult {
  updateUnitOfMeasure: (input: Partial<UnitOfMeasure> & { id: string }) => Promise<UnitOfMeasure | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateUnitOfMeasure(): UseUpdateUnitOfMeasureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUnitOfMeasure = useCallback(async (input: Partial<UnitOfMeasure> & { id: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: UPDATE_UNIT_OF_MEASURE,
        variables: { input }
      });
      return response.data?.updateUnitOfMeasure || null;
    } catch (err: any) {
      setError(err.message || 'Failed to update UnitOfMeasure');
      console.error('Error updating UnitOfMeasure:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUnitOfMeasure, loading, error };
}

export interface UseDeleteUnitOfMeasureResult {
  deleteUnitOfMeasure: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteUnitOfMeasure(): UseDeleteUnitOfMeasureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUnitOfMeasure = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: DELETE_UNIT_OF_MEASURE,
        variables: { input: { id } }
      });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete UnitOfMeasure');
      console.error('Error deleting UnitOfMeasure:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUnitOfMeasure, loading, error };
}

