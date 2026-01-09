import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { Template, CreateTemplateInput, UpdateTemplateInput } from '../types/template';
import { listTemplates, getTemplate } from '../graphql/queries';
import { createTemplate, updateTemplate, deleteTemplate } from '../graphql/mutations';

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

export interface UseGetTemplateResult {
  template: Template | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetTemplate(id: string): UseGetTemplateResult {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: getTemplate,
        variables: { id }
      });
      setTemplate(response.data?.getTemplate || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Template');
      console.error('Error fetching Template:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  return { template, loading, error, refetch: fetchTemplate };
}

export interface UseCreateTemplateResult {
  createTemplate: (input: CreateTemplateInput) => Promise<Template | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateTemplate(): UseCreateTemplateResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTemplateMutation = useCallback(async (input: CreateTemplateInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: createTemplate,
        variables: { input }
      });
      return response.data?.createTemplate || null;
    } catch (err: any) {
      setError(err.message || 'Failed to create Template');
      console.error('Error creating Template:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTemplate: createTemplateMutation, loading, error };
}

export interface UseUpdateTemplateResult {
  updateTemplate: (input: UpdateTemplateInput) => Promise<Template | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateTemplate(): UseUpdateTemplateResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTemplateMutation = useCallback(async (input: UpdateTemplateInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await API.graphql({
        query: updateTemplate,
        variables: { input }
      });
      return response.data?.updateTemplate || null;
    } catch (err: any) {
      setError(err.message || 'Failed to update Template');
      console.error('Error updating Template:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTemplate: updateTemplateMutation, loading, error };
}

export interface UseDeleteTemplateResult {
  deleteTemplate: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteTemplate(): UseDeleteTemplateResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTemplateMutation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: deleteTemplate,
        variables: { input: { id } }
      });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete Template');
      console.error('Error deleting Template:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTemplate: deleteTemplateMutation, loading, error };
}


