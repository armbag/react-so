import { useRepos } from './useRepos';
import type { Repo } from '../../../api/src/models/Repo';
import './Repos.css';

export function Repos() {
  const { repos, isLoading, error } = useRepos();

  return (
    <div>
      {isLoading && 'isLoading...'}
      {repos.map((repo: Repo) => (
        <div key={repo.id}>
          {repo.name} {repo.description} {repo.language} {repo.forks_count}
        </div>
      ))}
      {error && <div>{error}</div>}
    </div>
  );
}
