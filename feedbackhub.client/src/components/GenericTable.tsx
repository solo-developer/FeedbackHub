import React, {
  useEffect,
  useState,
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
  getFilteredRowModel,
  SortingState,
} from '@tanstack/react-table';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ServerPaginationProps {
  totalCount: number;
  currentPage: number; // 1-based
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

interface GenericTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;

  enablePagination?: boolean;
  paginationType?: 'client' | 'server';
  pageSize?: number;
  serverPaginationProps?: ServerPaginationProps;

  renderFilters?: () => React.ReactNode;
  onSortChange?: (sortedColumn: { id: string; desc: boolean }) => void;

  getRowId?: (row: T) => string | number;
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
    getRowId = (row: T) => {
      if (!(row as any)._internalId) {
        (row as any)._internalId = crypto.randomUUID();
      }
      return (row as any)._internalId;
    },
  }: GenericTableProps<T>,
  ref: React.Ref<GenericTableHandle>
) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [currentPageIndex, setCurrentPageIndex] = useState(
    paginationType === 'server' && serverPaginationProps
      ? serverPaginationProps.currentPage - 1
      : 0
  );

  const totalCount =
    paginationType === 'server'
      ? serverPaginationProps?.totalCount ?? 0
      : data.length;

  const totalPages =
    paginationType === 'server'
      ? Math.ceil(totalCount / currentPageSize)
      : undefined;

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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: paginationType === 'server',
    pageCount: totalPages,
    state: {
      sorting,
      globalFilter,
      ...(paginationType === 'server' && {
        pagination: {
          pageIndex: currentPageIndex,
          pageSize: currentPageSize,
        },
      }),
    },
    onSortingChange: updater => {
      const updated = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(updated.length > 0 ? [updated[0]] : []);
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    if (onSortChange && sorting.length > 0) {
      onSortChange(sorting[0]);
    }
  }, [sorting, onSortChange]);

  useImperativeHandle(ref, () => ({
    getSelectedIds: () => Array.from(selectedIds),
  }));

  const pagination = table.getState().pagination;
  const filteredTotal =
    paginationType === 'server'
      ? totalCount
      : table.getFilteredRowModel().rows.length;

  const pageStart =
    filteredTotal === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    filteredTotal
  );

  const handlePageSizeChange = (size: number) => {
    if (paginationType === 'server' && serverPaginationProps) {
      setCurrentPageSize(size);
      setCurrentPageIndex(0);
      serverPaginationProps.onPageSizeChange?.(size);
      serverPaginationProps.onPageChange(1);
    } else {
      table.setPageSize(size);
    }
  };

  const handlePreviousPage = () => {
    if (paginationType === 'server' && serverPaginationProps) {
      if (currentPageIndex > 0) {
        const newPage = currentPageIndex; // 0-based to 1-based
        setCurrentPageIndex(newPage - 1);
        serverPaginationProps.onPageChange(newPage);
      }
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (paginationType === 'server' && serverPaginationProps) {
      const newPage = currentPageIndex + 2;
      if (newPage <= totalPages) {
        setCurrentPageIndex(newPage - 1);
        serverPaginationProps.onPageChange(newPage);
      }
    } else {
      table.nextPage();
    }
  };

  return (
    <div className="container-fluid mt-3 w-100">
      {renderFilters && <div className="mb-3">{renderFilters()}</div>}

      {paginationType === 'client' && enablePagination && (
        <div className="mb-2 d-flex justify-content-end">
          <input
            type="text"
            className="form-control form-control-sm w-25"
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
          />
        </div>
      )}

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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="small">Rows per page:</span>
                {[1,5, 10, 20, 50].map(size => (
                  <button
                    key={size}
                    className={`btn btn-sm ${
                      pagination.pageSize === size ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => handlePageSizeChange(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="text-muted small text-center flex-grow-1">
                Showing {pageStart}–{pageEnd} of {filteredTotal}
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handlePreviousPage}
                  disabled={
                    paginationType === 'server'
                      ? currentPageIndex === 0
                      : !table.getCanPreviousPage()
                  }
                >
                  Previous
                </button>
                <span className="small">
                  Page{' '}
                  {paginationType === 'server'
                    ? currentPageIndex + 1
                    : pagination.pageIndex + 1}{' '}
                  of{' '}
                  {paginationType === 'server'
                    ? totalPages
                    : table.getPageCount()}
                </span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleNextPage}
                  disabled={
                    paginationType === 'server'
                      ? currentPageIndex + 1 >= (totalPages ?? 1)
                      : !table.getCanNextPage()
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default GenericTable;
