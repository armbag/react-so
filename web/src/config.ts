const prefix = process.env.REACT_APP_ENV === 'PROD' ? 'https' : 'http';

const BASE_URL = `${prefix}://${process.env.REACT_APP_SERVER}`;

export function urlServer(path = '') {
  return BASE_URL + path;
}
