import ReactMarkdown from 'react-markdown';
import './RepoReadMe.css';

interface IRepo {
  resource: any;
  repoName: string;
}

export function RepoReadMe({ resource, repoName }: IRepo) {
  const readMe = resource && resource.read();

  if (!repoName) {
    return null;
  }
  return (
    <div className="read-me-container">
      <h2>
        {repoName} <code>README.md</code>
      </h2>
      <div className="read-me-content">
        {typeof readMe === 'string' && <ReactMarkdown children={readMe} />}
      </div>
    </div>
  );
}
