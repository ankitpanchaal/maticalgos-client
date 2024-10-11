"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { OrderBookItem } from "../../types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const getSortingButton = (column: any, label: string) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="whitespace-nowrap"
  >
    {label}
    {column.getIsSorted() === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === "desc" ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    )}
  </Button>
);

const getBadgeCell = (
  row: any,
  key: string,
  variant: string,
  currency: string = "INR"
) => {
  const value = row.getValue(key) as number;
  return (
    <Badge variant="outline" className={variant}>
      {new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
        value
      )}
    </Badge>
  );
};

const columns: ColumnDef<OrderBookItem>[] = [
  {
    accessorKey: "AccountName",
    header: ({ column }) => getSortingButton(column, "Account Name"),
  },
  {
    accessorKey: "strefID",
    header: ({ column }) => getSortingButton(column, "Stref ID"),
  },
  {
    accessorKey: "reftag",
    header: ({ column }) => getSortingButton(column, "Ref Tag"),
  },
  {
    accessorKey: "StrategyName",
    header: ({ column }) => getSortingButton(column, "Strategy Name"),
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => getSortingButton(column, "Order Type"),
  },
  {
    accessorKey: "productType",
    header: ({ column }) => getSortingButton(column, "Product Type"),
  },
  {
    accessorKey: "price",
    header: ({ column }) => getSortingButton(column, "Price"),
    cell: ({ row }) => getBadgeCell(row, "price", "bg-blue-100"),
  },
  {
    accessorKey: "limitPrice",
    header: ({ column }) => getSortingButton(column, "Limit Price"),
    cell: ({ row }) => getBadgeCell(row, "limitPrice", "bg-green-100"),
  },
  {
    accessorKey: "triggerPrice",
    header: ({ column }) => getSortingButton(column, "Trigger Price"),
    cell: ({ row }) => getBadgeCell(row, "triggerPrice", "bg-yellow-100"),
  },
  {
    accessorKey: "token",
    header: ({ column }) => getSortingButton(column, "Token"),
  },
  {
    accessorKey: "segment",
    header: ({ column }) => getSortingButton(column, "Segment"),
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => getSortingButton(column, "Symbol"),
  },
  {
    accessorKey: "qty",
    header: ({ column }) => getSortingButton(column, "Quantity"),
  },
  {
    accessorKey: "transType",
    header: ({ column }) => getSortingButton(column, "Transaction Type"),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.transType.toLowerCase() === "buy"
            ? "default"
            : "destructive"
        }
      >
        {row.getValue("transType")}
      </Badge>
    ),
  },
  {
    accessorKey: "Operations",
    header: "Operations",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>View Operations</TooltipTrigger>
          <TooltipContent>
            <p>{row.original?.Operations}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "ordersplaced",
    header: ({ column }) => getSortingButton(column, "Orders Placed"),
  },
  {
    accessorKey: "ordersdone",
    header: ({ column }) => getSortingButton(column, "Orders Done"),
  },
  {
    accessorKey: "ordersexecuted",
    header: ({ column }) => getSortingButton(column, "Orders Executed"),
  },
  {
    accessorKey: "placed_at",
    header: ({ column }) => getSortingButton(column, "Placed At"),
    cell: ({ row }) => formatDate(row.getValue("placed_at")),
  },
  {
    accessorKey: "recon_at",
    header: ({ column }) => getSortingButton(column, "Recon At"),
    cell: ({ row }) => formatDate(row.getValue("recon_at")),
  },
  {
    accessorKey: "trade_at",
    header: ({ column }) => getSortingButton(column, "Trade At"),
    cell: ({ row }) => formatDate(row.getValue("trade_at")),
  },
  {
    accessorKey: "filledQty",
    header: ({ column }) => getSortingButton(column, "Filled Quantity"),
  },
  {
    accessorKey: "tradedQty",
    header: ({ column }) => getSortingButton(column, "Traded Quantity"),
  },
  {
    accessorKey: "tradeValue",
    header: ({ column }) => getSortingButton(column, "Trade Value"),
    cell: ({ row }) => getBadgeCell(row, "tradeValue", "bg-purple-100"),
  },
  {
    accessorKey: "tradePrice",
    header: ({ column }) => getSortingButton(column, "Trade Price"),
    cell: ({ row }) => getBadgeCell(row, "tradePrice", "bg-pink-100"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => getSortingButton(column, "Status"),
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      let variant: "default" | "destructive" | "outline" = "outline";
      if (value.toLowerCase() === "executed") variant = "default";
      if (["cancelled", "error"].includes(value.toLowerCase()))
        variant = "destructive";
      return <Badge variant={variant}>{value}</Badge>;
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => getSortingButton(column, "Active"),
    cell: ({ row }) => (row.getValue("active") === 1 ? "Yes" : "No"),
  },
];

export function OrderBookTable({ data }: { data: OrderBookItem[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border overflow-x-auto max-w-[85vw] min-h-[80vh] flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-200 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-center"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="overflow-x-auto">
        {/* This empty div will create a horizontal scrollbar at the bottom */}
      </div>
    </div>
  );
}
