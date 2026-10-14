import type { ReactNode } from 'react';
import './Table.css';

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right';
  width?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
};

export function Table<T>({ columns, rows, rowKey, onRowClick }: Props<T>) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{ textAlign: c.align ?? 'left', width: c.width }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr
              key={rowKey(row)}
              className={onRowClick ? 'table__row--click' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c, i) => (
                <td key={i} style={{ textAlign: c.align ?? 'left' }}>{c.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
