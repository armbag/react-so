import { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { formatDate } from '../../utils/formatDate';
import './CommitInfo.css';

interface ICommit {
  branchUrl?: string;
}

export function CommitInfo(props: ICommit) {
  const [data, setData] = useState({
    name: '',
    date: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.branchUrl) {
      setIsLoading(true);
      fetch(props.branchUrl)
        .then((raw) => raw.json())
        .then((json) => {
          setData({
            name: json.commit.commit.author.name,
            date: json.commit.commit.author.date,
            message: json.commit.commit.message,
          });
        })
        .catch(() =>
          setData({
            name: '',
            date: '',
            message: '',
          })
        )
        .finally(() => setIsLoading(false));
    } else {
      setData({
        name: '',
        date: '',
        message: '',
      });
    }
  }, [props.branchUrl]);

  if (!data.name) {
    return null;
  }
  if (isLoading) {
    return <Loader />;
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
          <div className="commit-author"> {data.name}</div>
          <div className="commit-date"> {formatDate(data.date)}</div>
          <div className="commit-message"> {data.message}</div>
        </div>
      </div>
    </>
  );
}
