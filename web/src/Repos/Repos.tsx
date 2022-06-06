import { useState, Suspense } from 'react';
import {
  createTable,
  useTableInstance,
  getCoreRowModel,
} from '@tanstack/react-table';
import type { Repo } from '../../../api/src/models/Repo';
import type { IResource } from '../utils/wrapPromise';
import { githubApi } from '../services/githubApi';
import { Button } from '../components/Button';
import { Loader } from '../components/Loader';
import { CommitInfo } from '../components/CommitInfo';
import { ErrorHandler } from '../components/ErrorHandler';
import { fetchData } from '../utils/fetchData';
import { RepoReadMe } from './RepoReadMe';
import { useRepos } from './hooks';
import './Repos.css';

const table = createTable().setRowType<Repo>();

const columns = [
  table.createGroup({
    header: 'Repositories',
    columns: [
      table.createDataColumn('name', {
        cell: (info) => info.getValue(),
      }),
      table.createDataColumn('description', {
        cell: (info) => info.getValue(),
      }),
      table.createDataColumn('language', {
        cell: (info) => info.getValue(),
      }),
      table.createDataColumn('forks_count', {
        cell: (info) => info.getValue(),
      }),
    ],
  }),
];

export function Repos() {
  const { repos, isLoading, error, languages } = useRepos();
  const [selectedLang, setSelectedLang] = useState('');
  const [selectedRepoName, setSelectedRepoName] = useState('');
  const [readMeResource, setReadMeResource] = useState<IResource>();
  const [commitInfoResource, setCommitInfoResource] = useState<IResource>();
  const instance = useTableInstance(table, {
    data: selectedLang
      ? repos.filter((repo) => repo.language === selectedLang)
      : repos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleLanguageClick = (value: string) => {
    if (value === selectedLang || !value) {
      setSelectedLang('');
    } else {
      setSelectedLang(value);
    }
    setSelectedRepoName('');
  };

  const handleRepoClick = (rep: Repo | undefined) => {
    if (!rep) {
      return;
    }
    const defaultBranch = rep.default_branch;
    const newBranchUrl = rep.branches_url?.replace(
      '{/branch}',
      `/${defaultBranch}`
    );
    setCommitInfoResource(newBranchUrl ? fetchData(newBranchUrl) : undefined);
    setReadMeResource(fetchData(githubApi.getReadMe(rep.full_name), 'text'));
    setSelectedRepoName(rep.full_name);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorHandler message={error} />;
  }
  return (
    <div className="repos-container">
      <div className="buttons-list">
        {languages.map((lang, index) => (
          <Button
            value={lang}
            key={lang + index}
            pressed={selectedLang === lang}
            onClick={handleLanguageClick}
            className={lang === '' ? 'all-button' : ''}
          >
            {lang === '' ? 'All' : lang}
          </Button>
        ))}
      </div>
      <table className="repos-table">
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.renderHeader()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRepoClick(row.original)}
              className={`row-repo ${
                row.original?.full_name === selectedRepoName ? 'selected' : ''
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Suspense fallback={<Loader />}>
        <CommitInfo
          resource={commitInfoResource}
          anySelected={selectedRepoName !== ''}
        />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <RepoReadMe resource={readMeResource} repoName={selectedRepoName} />
      </Suspense>
    </div>
  );
}
