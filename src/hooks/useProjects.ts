import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../types/project';
import { listProjects, getProject } from '../graphql/queries';
import { createProject, updateProject, deleteProject } from '../graphql/mutations';

export interface ProjectListItem {
  id: string;
  name: string;
  status?: string | null;
}

export interface UseListProjectsResult {
  projects: ProjectListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useListProjects(): UseListProjectsResult {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: unknown = await API.graphql({
        query: listProjects,
        variables: { limit: 500 },
      });
      const items =
        (response as { data?: { listProjects?: { items?: ProjectListItem[] } } }).data?.listProjects
          ?.items ?? [];
      setProjects(items.filter((p): p is ProjectListItem => !!p?.id));
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ message?: string }>; message?: string };
      setError(e?.errors?.[0]?.message || e?.message || 'Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

export interface UseGetProjectResult {
  project: Project | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetProject(id: string): UseGetProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setProject(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: unknown = await API.graphql({
        query: getProject,
        variables: { id },
      });
      const item =
        (response as { data?: { getProject?: Project | null } }).data?.getProject ?? null;
      setProject(item);
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ message?: string }>; message?: string };
      setError(e?.errors?.[0]?.message || e?.message || 'Failed to fetch project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
}

export interface UseCreateProjectResult {
  createProject: (input: CreateProjectInput) => Promise<Project | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateProject(): UseCreateProjectResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProjectMutation = useCallback(async (input: CreateProjectInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: unknown = await API.graphql({
        query: createProject,
        variables: { input },
      });
      return (response as { data?: { createProject?: Project } }).data?.createProject ?? null;
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ message?: string }>; message?: string };
      setError(e?.errors?.[0]?.message || e?.message || 'Failed to create project');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createProject: createProjectMutation, loading, error };
}

export interface UseUpdateProjectResult {
  updateProject: (input: UpdateProjectInput) => Promise<Project | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateProject(): UseUpdateProjectResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProjectMutation = useCallback(async (input: UpdateProjectInput) => {
    try {
      setLoading(true);
      setError(null);
      const response: unknown = await API.graphql({
        query: updateProject,
        variables: { input },
      });
      return (response as { data?: { updateProject?: Project } }).data?.updateProject ?? null;
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ message?: string }>; message?: string };
      setError(e?.errors?.[0]?.message || e?.message || 'Failed to update project');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProject: updateProjectMutation, loading, error };
}

export interface UseDeleteProjectResult {
  deleteProject: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteProject(): UseDeleteProjectResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProjectMutation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await API.graphql({
        query: deleteProject,
        variables: { input: { id } },
      });
      return true;
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ message?: string }>; message?: string };
      setError(e?.errors?.[0]?.message || e?.message || 'Failed to delete project');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteProject: deleteProjectMutation, loading, error };
}
