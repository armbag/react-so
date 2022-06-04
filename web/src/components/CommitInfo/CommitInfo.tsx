import './CommitInfo.css';

interface ICommit {
  data: {
    name: string;
    date: string;
    message: string;
  };
}

export function CommitInfo(props: ICommit) {
  if (!props.data.name) {
    return null;
  }
  return (
    <>
      <h3 className="commit-title">Last Commit Information</h3>
      <div className="commit-info">
        <div className="commit-labels">
          <div>Author:</div>
          <div>Date:</div>
          <div>Message:</div>
        </div>
        <div>
          <div className="commit-author"> {props.data.name}</div>
          <div className="commit-date"> {props.data.date}</div>
          <div className="commit-message"> {props.data.message}</div>
        </div>
      </div>
    </>
  );
}
