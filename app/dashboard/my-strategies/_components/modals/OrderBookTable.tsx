import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { OrderBookItem } from "../../types";
import OrderDetails from "./OrderDetails";
import getOrderbookColumns from "./_utils/getOrderbookColumns";

export function OrderBookTable({ data }: { data: OrderBookItem[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRow, setSelectedRow] = useState<OrderBookItem | null>(null);

  const table = useReactTable({
    data: data?.reverse() || [],
    columns: getOrderbookColumns(setSelectedRow),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-1 border border-gray-200 font-medium text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white text-sm">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 text-center">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 whitespace-nowrap border border-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderDetails
        isOpen={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        order={selectedRow}
      />
    </>
  );
}
