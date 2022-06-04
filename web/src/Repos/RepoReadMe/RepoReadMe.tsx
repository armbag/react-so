import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

interface IRepo {
  fullName: string;
}

export function RepoReadMe(props: IRepo) {
  const [markdown, setMarkdown] = useState('');
  useEffect(() => {
    if (props.fullName) {
      fetch(
        `https://raw.githubusercontent.com/${props.fullName}/master/README.md`
      )
        .then((data) => data.text())
        .then((text) => setMarkdown(text))
        .catch(() => setMarkdown(''));
    }
  }, [props.fullName]);

  return <ReactMarkdown children={markdown} />;
}
