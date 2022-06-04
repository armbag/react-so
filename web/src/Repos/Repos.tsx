import { useState } from 'react';
import {
  createTable,
  useTableInstance,
  getCoreRowModel,
} from '@tanstack/react-table';
import { Button } from '../components/Button';
import { Loader } from '../components/Loader';
import { CommitInfo } from '../components/CommitInfo';
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
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [selectedLang, setSelectedLang] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [lastCommitInfo, setLastCommitInfo] = useState({
    name: '',
    date: '',
    message: '',
  });
  const instance = useTableInstance(table, {
    data: selectedLang ? filteredRepos : repos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleLanguageClick = (value: string) => {
    if (value === selectedLang) {
      setSelectedLang('');
      setFilteredRepos([]);
    } else {
      setSelectedLang(value);
      setFilteredRepos(repos.filter((repo) => repo.language === value));
    }
  };

  const handleClickRepo = (row: any) => {
    // When you click a repository, display the most recent commit date, author,
    // and message.
    setSelectedRepo(row.original?.full_name);

    const defaultBranch = row.original.default_branch;
    const branchUrl = row.original.branches_url.replace(
      '{/branch}',
      `/${defaultBranch}`
    );
    fetch(branchUrl)
      .then((raw) => raw.json())
      .then((data) => {
        setLastCommitInfo({
          name: data.commit.commit.author.name,
          date: data.commit.commit.author.date,
          message: data.commit.commit.message,
        });
      });
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="repos-container">
      <div className="buttons-list">
        {!error &&
          languages.map((lang) => (
            <Button
              value={lang}
              key={lang}
              pressed={selectedLang === lang}
              onClick={handleLanguageClick}
            >
              {lang}
            </Button>
          ))}
      </div>
      {!error && (
        <table className="repos-table">
          <thead>
            {instance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : header.renderHeader()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {instance.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleClickRepo(row)}
                className={
                  row.original?.full_name === selectedRepo ? 'selected' : ''
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{cell.renderCell()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div>{error}</div>}
      <CommitInfo data={lastCommitInfo} />
      <RepoReadMe fullName={selectedRepo} />
    </div>
  );
}
