import { useState } from 'react';
import {
  createTable,
  useTableInstance,
  getCoreRowModel,
} from '@tanstack/react-table';
import { Button } from '../components/Button';
import { Loader } from '../components/Loader';
import { CommitInfo } from '../components/CommitInfo';
import { ErrorHandler } from '../components/ErrorHandler';
import type { Repo } from '../../../api/src/models/Repo';
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
  const [selectedRepo, setSelectedRepo] = useState('');
  const [branchUrl, setBranchUrl] = useState('');
  const instance = useTableInstance(table, {
    data: selectedLang
      ? repos.filter((repo) => repo.language === selectedLang)
      : repos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleLanguageClick = (value: string) => {
    if (value === selectedLang || value === '') {
      setSelectedLang('');
    } else {
      setSelectedLang(value);
    }
    setSelectedRepo('');
    setBranchUrl('');
  };

  const handleRepoClick = (rep: Repo | undefined) => {
    if (!rep) {
      return;
    }
    setSelectedRepo(rep.full_name);
    const defaultBranch = rep.default_branch;
    const newBranchUrl = rep.branches_url?.replace(
      '{/branch}',
      `/${defaultBranch}`
    );
    if (newBranchUrl) {
      setBranchUrl(newBranchUrl);
    } else {
      setBranchUrl('');
    }
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
                row.original?.full_name === selectedRepo ? 'selected' : ''
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRepo && (
        <>
          <CommitInfo branchUrl={branchUrl} />
          <RepoReadMe fullName={selectedRepo} />
        </>
      )}
    </div>
  );
}
