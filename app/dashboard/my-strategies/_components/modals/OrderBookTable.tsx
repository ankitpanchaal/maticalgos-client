import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
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

const getSortingButton = (column: ColumnDef<OrderBookItem>, label: string) => (
  <Button
    variant="ghost"
    //@ts-ignore
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="whitespace-nowrap"
    >
    {label}
    {/* @ts-ignore */}
    {column.getIsSorted() === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
      //@ts-ignore
    ) : column.getIsSorted() === "desc" ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    )}
  </Button>
);

const getBadgeCell = (row: any, key: string, variant: string, currency = "INR") => {
  const value = row.getValue(key);
  return (
    <Badge variant="outline" className={variant}>
      {new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
        value
      )}
    </Badge>
  );
};

// Define column priorities
const columnPriorities: { [key: string]: number } = {
  AccountName: 1,
  strefID: 2,
  reftag: 3,
  StrategyName: 4,
  orderType: 5,
  price: 6,
  limitPrice: 7,
  triggerPrice: 8,
  token: 9,
  segment: 10,
  symbol: 11,
  qty: 12,
  transType: 13,
  Operations: 14,
  ordersplaced: 15,
  ordersdone: 16,
  ordersexecuted: 17,
  placed_at: 18,
  recon_at: 19,
  trade_at: 20,
  filledQty: 21,
  tradedQty: 22,
  tradeValue: 23,
  tradePrice: 24,
  status: 25,
  active: 26,
  productType: 27, // Lower priority
};

// Sort columns by priority
const columns: ColumnDef<OrderBookItem>[] = [
  {
    accessorKey: "AccountName",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Account Name"),
  },
  {
    accessorKey: "strefID",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Stref ID"),
  },
  {
    accessorKey: "reftag",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Ref Tag"),
  },
  {
    accessorKey: "StrategyName",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Strategy Name"),
  },
  {
    accessorKey: "orderType",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Order Type"),
  },
  {
    accessorKey: "price",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Price"),
    cell: ({ row }: { row: any }) => getBadgeCell(row, "price", "bg-blue-100"),
  },
  {
    accessorKey: "limitPrice",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Limit Price"),
    cell: ({ row }: { row: any }) => getBadgeCell(row, "limitPrice", "bg-green-100"),
  },
  {
    accessorKey: "triggerPrice",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Trigger Price"),
    cell: ({ row }: { row: any }) => getBadgeCell(row, "triggerPrice", "bg-yellow-100"),
  },
  {
    accessorKey: "token",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Token"),
  },
  {
    accessorKey: "segment",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Segment"),
  },
  {
    accessorKey: "symbol",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Symbol"),
  },
  {
    accessorKey: "qty",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Quantity"),
  },
  {
    accessorKey: "transType",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Transaction Type"),
    cell: ({ row }: { row: any }) => (
      <Badge
       className={row.original.transType.toLowerCase() === "buy"
        ? "bg-green-500 hover:bg-green-500"
        : "bg-red-500 hover:bg-red-500"}
      >
        {row.getValue("transType")}
      </Badge>
    ),
  },
  {
    accessorKey: "Operations",
    header: "Operations",
    cell:({ row }: { row: any }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline">
            View Operations
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original?.Operations}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "ordersplaced",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Orders Placed"),
  },
  {
    accessorKey: "ordersdone",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Orders Done"),
  },
  {
    accessorKey: "ordersexecuted",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Orders Executed"),
  },
  {
    accessorKey: "placed_at",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Placed At"),
    cell: ({ row }: { row: any }) => formatDate(row.getValue("placed_at")),
  },
  {
    accessorKey: "recon_at",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Recon At"),
    cell: ({ row }: { row: any }) => formatDate(row.getValue("recon_at")),
  },
  {
    accessorKey: "trade_at",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Trade At"),
    cell: ({ row }: { row: any }) => formatDate(row.getValue("trade_at")),
  },
  {
    accessorKey: "filledQty",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Filled Quantity"),
  },
  {
    accessorKey: "tradedQty",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Traded Quantity"),
  },
  {
    accessorKey: "tradeValue",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Trade Value"),
    cell: ({ row }: { row: any }) => getBadgeCell(row, "tradeValue", "bg-purple-100"),
  },
  {
    accessorKey: "tradePrice",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Trade Price"),
    cell: ({ row }: { row: any }) => getBadgeCell(row, "tradePrice", "bg-pink-100"),
  },
  {
    accessorKey: "status",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Status"),
    cell: ({ row }: { row: any }) => {
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
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Active"),
    cell: ({ row }: { row: any }) => (row.getValue("active") === 1 ? "Yes" : "No"),
  },
  {
    accessorKey: "productType",
    header: ({ column }: { column: ColumnDef<OrderBookItem> }) => getSortingButton(column, "Product Type"),
  },
].sort((a, b) => columnPriorities[a.accessorKey as string] - columnPriorities[b.accessorKey as string]);

export function OrderBookTable({ data }: { data: OrderBookItem[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data:data?.reverse() || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
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
  );
}