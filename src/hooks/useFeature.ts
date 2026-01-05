import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { Feature, CreateFeatureInput, UpdateFeatureInput, UnitOfMeasure } from '../types/feature';
import { listFeatures, getFeature, listUnitOfMeasures } from '../graphql/queries';
import { createFeature, updateFeature, deleteFeature } from '../graphql/mutations';

export interface UseListFeaturesResult {
  features: Feature[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListFeatures(): UseListFeaturesResult {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: any = await API.graphql({
        query: listFeatures
      });
      
      const items = response.data?.listFeatures?.items || [];
      setFeatures(items);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to fetch Features';
      setError(errorMessage);
      console.error('Error fetching Features:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return { features, loading, error, refetch: fetchFeatures };
}

export interface UseGetFeatureResult {
  feature: Feature | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetFeature(id: string): UseGetFeatureResult {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeature = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: getFeature,
        variables: { id }
      });
      setFeature(response.data?.getFeature || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Feature');
      console.error('Error fetching Feature:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFeature();
  }, [fetchFeature]);

  return { feature, loading, error, refetch: fetchFeature };
}

export interface UseCreateFeatureResult {
  createFeature: (input: CreateFeatureInput) => Promise<Feature | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateFeature(): UseCreateFeatureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFeatureMutation = useCallback(async (input: CreateFeatureInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: createFeature,
        variables: { input }
      });
      return response.data?.createFeature || null;
    } catch (err: any) {
      setError(err.message || 'Failed to create Feature');
      console.error('Error creating Feature:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createFeature: createFeatureMutation, loading, error };
}

export interface UseUpdateFeatureResult {
  updateFeature: (input: UpdateFeatureInput) => Promise<Feature | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateFeature(): UseUpdateFeatureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFeatureMutation = useCallback(async (input: UpdateFeatureInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: updateFeature,
        variables: { input }
      });
      return response.data?.updateFeature || null;
    } catch (err: any) {
      setError(err.message || 'Failed to update Feature');
      console.error('Error updating Feature:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateFeature: updateFeatureMutation, loading, error };
}

export interface UseDeleteFeatureResult {
  deleteFeature: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteFeature(): UseDeleteFeatureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFeatureMutation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: deleteFeature,
        variables: { input: { id } }
      });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete Feature');
      console.error('Error deleting Feature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteFeature: deleteFeatureMutation, loading, error };
}

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
        query: listUnitOfMeasures
      });
      
      const items = response.data?.listUnitOfMeasures?.items || [];
      setUnitOfMeasures(items);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to fetch Unit of Measures';
      setError(errorMessage);
      console.error('Error fetching Unit of Measures:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnitOfMeasures();
  }, [fetchUnitOfMeasures]);

  return { unitOfMeasures, loading, error, refetch: fetchUnitOfMeasures };
}

