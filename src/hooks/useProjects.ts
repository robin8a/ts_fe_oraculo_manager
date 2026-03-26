import { useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import { listProjects } from '../graphql/queries';

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
