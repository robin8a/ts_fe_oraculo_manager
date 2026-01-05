import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { 
  TemplateFeature, 
  CreateTemplateFeatureInput, 
  UpdateTemplateFeatureInput,
  Template 
} from '../types/templateFeature';
import { Feature } from '../types/feature';
import { 
  listTemplateFeatures, 
  getTemplateFeature,
  listTemplates 
} from '../graphql/queries';
import { 
  createTemplateFeature, 
  updateTemplateFeature, 
  deleteTemplateFeature 
} from '../graphql/mutations';
import { listFeatures } from '../graphql/queries';

// Enhanced query to get TemplateFeatures with nested data
const listTemplateFeaturesWithDetails = /* GraphQL */ `
  query ListTemplateFeaturesWithDetails(
    $filter: ModelTemplateFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplateFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        template {
          id
          name
          description
          type
          version
          is_latest
          createdAt
          updatedAt
          templateTemplatesId
        }
        feature {
          id
          feature_type
          name
          description
          feature_group
          default_value
          is_float
          createdAt
          updatedAt
          unitOfMeasureFeaturesId
        }
        createdAt
        updatedAt
        templateTemplateFeaturesId
        featureTemplateFeaturesId
      }
      nextToken
    }
  }
`;

export interface UseListTemplateFeaturesResult {
  templateFeatures: TemplateFeature[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListTemplateFeatures(): UseListTemplateFeaturesResult {
  const [templateFeatures, setTemplateFeatures] = useState<TemplateFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplateFeatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: any = await API.graphql({
        query: listTemplateFeaturesWithDetails
      });
      
      const items = response.data?.listTemplateFeatures?.items || [];
      setTemplateFeatures(items);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to fetch TemplateFeatures';
      setError(errorMessage);
      console.error('Error fetching TemplateFeatures:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplateFeatures();
  }, [fetchTemplateFeatures]);

  return { templateFeatures, loading, error, refetch: fetchTemplateFeatures };
}

export interface UseGetTemplateFeatureResult {
  templateFeature: TemplateFeature | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetTemplateFeature(id: string): UseGetTemplateFeatureResult {
  const [templateFeature, setTemplateFeature] = useState<TemplateFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplateFeature = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: getTemplateFeature,
        variables: { id }
      });
      setTemplateFeature(response.data?.getTemplateFeature || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch TemplateFeature');
      console.error('Error fetching TemplateFeature:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplateFeature();
  }, [fetchTemplateFeature]);

  return { templateFeature, loading, error, refetch: fetchTemplateFeature };
}

export interface UseCreateTemplateFeatureResult {
  createTemplateFeature: (input: CreateTemplateFeatureInput) => Promise<TemplateFeature | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateTemplateFeature(): UseCreateTemplateFeatureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTemplateFeatureMutation = useCallback(async (input: CreateTemplateFeatureInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: createTemplateFeature,
        variables: { input }
      });
      return response.data?.createTemplateFeature || null;
    } catch (err: any) {
      setError(err.message || 'Failed to create TemplateFeature');
      console.error('Error creating TemplateFeature:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTemplateFeature: createTemplateFeatureMutation, loading, error };
}

export interface UseCreateMultipleTemplateFeaturesResult {
  createMultipleTemplateFeatures: (
    templateId: string, 
    featureIds: string[]
  ) => Promise<{ success: number; failed: number; errors: string[] }>;
  loading: boolean;
  error: string | null;
}

export function useCreateMultipleTemplateFeatures(): UseCreateMultipleTemplateFeaturesResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMultiple = useCallback(async (
    templateId: string, 
    featureIds: string[]
  ): Promise<{ success: number; failed: number; errors: string[] }> => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await Promise.allSettled(
        featureIds.map(featureId =>
          API.graphql({
            query: createTemplateFeature,
            variables: {
              input: {
                templateTemplateFeaturesId: templateId,
                featureTemplateFeaturesId: featureId
              }
            }
          })
        )
      );

      const success = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => r.reason?.message || 'Unknown error');

      if (failed > 0) {
        setError(`${failed} feature(s) failed to associate. ${success} succeeded.`);
      }

      return { success, failed, errors };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create TemplateFeatures';
      setError(errorMessage);
      console.error('Error creating TemplateFeatures:', err);
      return { success: 0, failed: featureIds.length, errors: [errorMessage] };
    } finally {
      setLoading(false);
    }
  }, []);

  return { createMultipleTemplateFeatures: createMultiple, loading, error };
}

export interface UseUpdateTemplateFeatureResult {
  updateTemplateFeature: (input: UpdateTemplateFeatureInput) => Promise<TemplateFeature | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateTemplateFeature(): UseUpdateTemplateFeatureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTemplateFeatureMutation = useCallback(async (input: UpdateTemplateFeatureInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: updateTemplateFeature,
        variables: { input }
      });
      return response.data?.updateTemplateFeature || null;
    } catch (err: any) {
      setError(err.message || 'Failed to update TemplateFeature');
      console.error('Error updating TemplateFeature:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTemplateFeature: updateTemplateFeatureMutation, loading, error };
}

export interface UseDeleteTemplateFeatureResult {
  deleteTemplateFeature: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteTemplateFeature(): UseDeleteTemplateFeatureResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTemplateFeatureMutation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: deleteTemplateFeature,
        variables: { input: { id } }
      });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete TemplateFeature');
      console.error('Error deleting TemplateFeature:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTemplateFeature: deleteTemplateFeatureMutation, loading, error };
}

export interface UseListTemplatesResult {
  templates: Template[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListTemplates(): UseListTemplatesResult {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: any = await API.graphql({
        query: listTemplates
      });
      
      const items = response.data?.listTemplates?.items || [];
      setTemplates(items);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to fetch Templates';
      setError(errorMessage);
      console.error('Error fetching Templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, error, refetch: fetchTemplates };
}

export interface UseListFeaturesForSelectResult {
  features: Feature[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListFeaturesForSelect(): UseListFeaturesForSelectResult {
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

