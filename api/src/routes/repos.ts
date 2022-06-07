import { Router, Request, Response } from 'express';
import localRepos from '../../data/repos.json';
import fetch from 'node-fetch';
import type { Repo } from '../models/Repo';

export const repos = Router();

const fetchRemoteRepos = async (): Promise<any> => {
  const response = await fetch(
    ' https://api.github.com/users/silverorange/repos'
  );
  const json = await response.json();
  const correctRepos = json.filter((repo: Repo) => repo.fork === false);

  return correctRepos;
};

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');

  const correctLocalRepos = localRepos.filter((repo) => repo.fork === false);
  const remoteRepos = await fetchRemoteRepos();
  const correctRemoteRepos = remoteRepos.filter(
    (repo: Repo) => repo.fork === false
  );

  res.status(200);
  res.set('Content-Type', 'application/json');
  res.json([...correctLocalRepos, ...correctRemoteRepos]);
});
