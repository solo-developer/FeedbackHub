import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
} from '@tanstack/react-table';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ServerPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface GenericTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;

  // Pagination
  enablePagination?: boolean;
  paginationType?: 'client' | 'server';
  pageSize?: number;
  serverPaginationProps?: ServerPaginationProps;

  renderFilters?: () => React.ReactNode;
  onSortChange?: (sortedColumn: { id: string; desc: boolean }) => void;

  getRowId: (row: T) => string | number;
}

export interface GenericTableHandle {
  getSelectedIds: () => (string | number)[];
}

const GenericTable = forwardRef(<T extends object>(
  {
    columns,
    data,
    isLoading = false,
    enablePagination = false,
    paginationType = 'client',
    pageSize = 10,
    serverPaginationProps,
    renderFilters,
    onSortChange,
    getRowId,
  }: GenericTableProps<T>,
  ref: React.Ref<GenericTableHandle>
) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const updatedColumns: ColumnDef<T, any>[] = [
    {
      id: '_select',
      header: ({ table }) => {
        const allSelected = table.getRowModel().rows.every(row =>
          selectedIds.has(getRowId(row.original))
        );
        const isIndeterminate =
          !allSelected && table.getRowModel().rows.some(row =>
            selectedIds.has(getRowId(row.original))
          );

        return (
          <input
            type="checkbox"
            checked={allSelected}
            ref={el => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            onChange={e => {
              const checked = e.target.checked;
              const newSelectedIds = new Set(selectedIds);
              table.getRowModel().rows.forEach(row => {
                const id = getRowId(row.original);
                if (checked) {
                  newSelectedIds.add(id);
                } else {
                  newSelectedIds.delete(id);
                }
              });
              setSelectedIds(newSelectedIds);
            }}
          />
        );
      },
      cell: ({ row }) => {
        const id = getRowId(row.original);
        return (
          <input
            type="checkbox"
            checked={selectedIds.has(id)}
            onChange={e => {
              const newSelectedIds = new Set(selectedIds);
              if (e.target.checked) {
                newSelectedIds.add(id);
              } else {
                newSelectedIds.delete(id);
              }
              setSelectedIds(newSelectedIds);
            }}
          />
        );
      },
    },
    ...columns.map(column => ({
      ...column,
      enableSorting: column.enableSorting ?? false,
    })),
  ];

  const table = useReactTable({
    data,
    columns: updatedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: enablePagination && paginationType === 'server',
    pageCount:
      paginationType === 'server' && serverPaginationProps
        ? serverPaginationProps.totalPages
        : undefined,
    state: { sorting },
    onSortingChange: updater => {
      const updated = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(updated.length > 0 ? [updated[0]] : []);
    },
  });

  // Notify parent when sort changes
  useEffect(() => {
    if (onSortChange && sorting.length > 0) {
      const sortedColumn = sorting[0];
      onSortChange(sortedColumn);
    }
  }, [sorting, onSortChange]);

  // Expose selected IDs to parent
  useImperativeHandle(ref, () => ({
    getSelectedIds: () => Array.from(selectedIds),
  }));

  return (
    <div className="container-fluid mt-3 w-100">
      {renderFilters && <div className="mb-3">{renderFilters()}</div>}

      {isLoading ? (
        <div className="text-center">
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <table className="table table-bordered table-hover table-responsive">
            <thead className="thead-dark">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      {...{
                        className: header.column.getCanSort() ? 'cursor-pointer' : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <small>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span>
                            {header.column.getIsSorted()
                              ? header.column.getIsSorted() === 'desc'
                                ? ' ↓'
                                : ' ↑'
                              : ''}
                          </span>
                        )}
                      </small>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="text-sm">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {enablePagination && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <span>
                Page{' '}
                <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
                {paginationType === 'server' && serverPaginationProps
                  ? serverPaginationProps.totalPages
                  : table.getPageCount()}
              </span>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default GenericTable;
