import { formatDate } from '../../utils/formatDate';
import './CommitInfo.css';

interface ICommit {
  resource: any;
  anySelected: boolean;
}

export function CommitInfo({ resource, anySelected }: ICommit) {
  const data = resource && resource.read();

  if (!anySelected) {
    return null;
  }
  return (
    <>
      <h3 className="commit-title">Last Commit Information</h3>
      {data ? (
        <div className="commit-info">
          <div className="commit-labels">
            <div>Author:</div>
            <div>Date:</div>
            <div>Message:</div>
          </div>
          <div>
            <div className="commit-author">
              {data.commit.commit.author.name}
            </div>
            <div className="commit-date">
              {formatDate(data.commit.commit.author.date)}
            </div>
            <div className="commit-message"> {data.commit.commit.message}</div>
          </div>
        </div>
      ) : (
        <p>Unable to retrieve last commit information</p>
      )}
    </>
  );
}
