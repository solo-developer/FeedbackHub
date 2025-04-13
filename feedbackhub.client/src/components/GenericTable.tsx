import React from 'react';
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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

  // Server-side pagination
  serverPaginationProps?: ServerPaginationProps;

  // Optional custom UI section (e.g., filters, actions)
  renderFilters?: () => React.ReactNode;
}

const GenericTable = <T extends object>({
  columns,
  data,
  isLoading = false,
  enablePagination = false,
  paginationType = 'client',
  pageSize = 10,
  serverPaginationProps,
  renderFilters,
}: GenericTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination && paginationType === 'client' && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize,
        },
      },
    }),
    manualPagination: enablePagination && paginationType === 'server',
    pageCount:
      paginationType === 'server' && serverPaginationProps
        ? serverPaginationProps.totalPages
        : undefined,
    state: {
      ...(enablePagination &&
        paginationType === 'server' &&
        serverPaginationProps && {
          pagination: {
            pageIndex: serverPaginationProps.currentPage,
            pageSize,
          },
        }),
    },
    ...(enablePagination &&
      paginationType === 'server' &&
      serverPaginationProps && {
        onPaginationChange: (updater) => {
          if (typeof updater === 'function') {
            const next = updater({
              pageIndex: serverPaginationProps.currentPage,
              pageSize,
            });
            serverPaginationProps.onPageChange(next.pageIndex);
          } else {
            serverPaginationProps.onPageChange(updater.pageIndex);
          }
        },
      }),
  });

  return (
    <div className="container mt-3">
      {renderFilters && <div className="mb-3">{renderFilters()}</div>}

      {isLoading ? (
        <div className="text-center">
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <table className="table table-bordered table-hover table-responsive">
            <thead className="thead-dark">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
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
                Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
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
};

export default GenericTable;
