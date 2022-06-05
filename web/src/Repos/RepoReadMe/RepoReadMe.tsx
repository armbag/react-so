import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import './RepoReadMe.css';

interface IRepo {
  fullName: string;
}

export function RepoReadMe(props: IRepo) {
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.fullName) {
      setIsLoading(true);
      fetch(
        `https://raw.githubusercontent.com/${props.fullName}/master/README.md`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("This repository doesn't have `README.md` file");
          }
          return res.text();
        })
        .then((text) => setMarkdown(text))
        .catch((err) => setMarkdown(err.message))
        .finally(() => setIsLoading(false));
    } else {
      setMarkdown('');
    }
  }, [props.fullName]);

  if (isLoading) {
    return <Loader />;
  }
  if (!props.fullName) {
    return null;
  }

  return (
    <div className="read-me-container">
      <h2>
        {props.fullName} <code>README.md</code>
      </h2>
      <div className="read-me-content">
        <ReactMarkdown children={markdown} />
      </div>
    </div>
  );
}
