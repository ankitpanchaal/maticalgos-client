'use client';
import React, { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StrategyExplorerProps, IStrategy } from "../types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

const StrategyExplorer: React.FC<StrategyExplorerProps> = ({
  strategies,
  linkedStrategies,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const isSubscribed = (strategyName: string) => {
    return linkedStrategies.some((ls) => ls.StrategyName === strategyName);
  };

  const columns: ColumnDef<IStrategy>[] = [
    {
      accessorKey: "StrategyName",
      header: "Strategy Name",
    },
    {
      accessorKey: "StrategyType",
      header: "Strategy Type",
    },
    {
      accessorKey: "MarginRequired",
      header: "Margin Required",
      cell: ({ row }) => {
        const description = row.original.Description?.split("|")[0];
        return `₹${description}`;
      },
      sortingFn: (a, b) => {
        const aValue = Number(a.original.Description?.split("|")[0]) || 0;
        const bValue = Number(b.original.Description?.split("|")[0]) || 0;
        return aValue - bValue;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            console.log(
              `${
                isSubscribed(row.original.StrategyName)
                  ? "Unsubscribe from"
                  : "Subscribe to"
              } ${row.original.StrategyName}`
            );
          }}
          className={`font-semibold ${
            isSubscribed(row.original.StrategyName)
              ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          }`}
          variant="outline"
        >
          {isSubscribed(row.original.StrategyName)
            ? "Unsubscribe"
            : "Subscribe"}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: strategies,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  return (
    <div className="relative overflow-x-auto" style={{ maxHeight: "75vh" }}>
      <Table >
        <TableHeader className="sticky top-0 z-10 bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  className={`py-3 ${
                    index === 0
                      ? "rounded-tl-lg"
                      : index === headerGroup.headers.length - 1
                      ? "rounded-tr-lg"
                      : ""
                  }`}
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center justify-center space-x-2 cursor-pointer">
                    <span>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                    {header.column.getIsSorted() && (
                      header.column.getIsSorted() === "asc" 
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow
                onClick={() => handleRowClick(row.id)}
                className={`cursor-pointer border-t-[12px] border-gray-100 hover:!bg-blue-50 bg-white rounded-lg overflow-hidden ${
                  expandedRow === row.id ? "bg-blue-50" : ""
                }`}
              >
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell 
                    key={cell.id}
                    className={`${
                      cellIndex === 0 
                        ? "rounded-l-lg" 
                        : cellIndex === row.getVisibleCells().length - 1 
                          ? "rounded-r-lg" 
                          : ""
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <Accordion type="single" value={expandedRow ?? ""}>
                    <AccordionItem value={row.id}>
                      <AccordionContent>
                        <div className="bg-blue-50 rounded-md p-4 mt-0 m-2">
                          <h4 className="font-semibold mb-2">Description:</h4>
                          <p>{row.original.Description?.split("|")[1]}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StrategyExplorer;