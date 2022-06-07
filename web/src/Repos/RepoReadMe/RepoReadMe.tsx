import ReactMarkdown from 'react-markdown';
import { IResource } from '../../utils/wrapPromise';
import './RepoReadMe.css';

interface IRepo {
  resource: IResource | undefined;
  repoName: string;
}

export function RepoReadMe({ resource, repoName }: IRepo) {
  const readMe: any = resource?.read?.();

  if (!repoName) {
    return null;
  }
  return (
    <div className="read-me-container">
      <h2>
        {repoName} <code>README.md</code>
      </h2>
      <div className="read-me-content">
        <ReactMarkdown children={readMe} />
      </div>
    </div>
  );
}
