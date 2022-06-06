import wrapPromise from './wrapPromise';

export function fetchData(url: string, type = 'json') {
  const promise = fetch(url).then((res) =>
    type === 'json' ? res.json() : res.text()
  );

  return wrapPromise(promise);
}
