import { useState, useEffect } from 'react';
import type { Repo } from '../../../api/src/models/Repo';

export function useRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchRepos = async () => {
      try {
        const response = await fetch('/repos');
        const data = await response.json();
        if (data.status === 400) {
          throw data;
        }
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
        setRepos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepos();
  }, []);

  return { repos, isLoading, error };
}
