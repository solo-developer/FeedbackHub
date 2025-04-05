import React from 'react';
import { useReactTable, ColumnDef, flexRender, getCoreRowModel } from '@tanstack/react-table';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Define the type for your props to make it reusable
interface GenericTableProps<T> {
  columns: ColumnDef<T, any>[]; // The columns prop is an array of ColumnDef
  data: T[]; // The data prop is an array of type T
  isLoading?: boolean; // The isLoading flag is optional and defaults to false
}

const GenericTable = <T extends object>({ columns, data, isLoading = false }: GenericTableProps<T>) => {
  // Initialize the table with useReactTable hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // Use the core row model for the basic functionality
  });

  return (
    <div className="container mt-2">
      {isLoading ? (
        <div className="text-center">
          <p>Data is loading...</p> {/* Show a loading message */}
        </div>
      ) : (
        <table className="table table-bordered table-hover table-responsive">
          <thead className="thead-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {/* Render the header */}
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data.length === 0 ? (
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
                      {/* Render the cell */}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GenericTable;
