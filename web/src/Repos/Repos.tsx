import { useRepos } from './hooks';
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
  const instance = useTableInstance(table, {
    data: repos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      {isLoading && 'isLoading...'}
      {!error && languages.map((lang) => <button key={lang}>{lang}</button>)}
      {!error && (
        <table>
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
