import { useState } from 'react';
import { useRepos } from './hooks';
import { Button } from '../components/Button';
import type { Repo } from '../../../api/src/models/Repo';
import {
  createTable,
  useTableInstance,
  getCoreRowModel,
} from '@tanstack/react-table';
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

  if (isLoading) {
    return <div className="loader">Loading...</div>;
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
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{cell.renderCell()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div>{error}</div>}
    </div>
  );
}
