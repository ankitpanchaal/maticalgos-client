import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CustomToolTip from "@/components/shared/CustomToolTip";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChartNoAxesGantt,
  Repeat,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { OrderBookItem, TOrderModalType } from "../../../types";
import formatDate from "@/lib/formatDate";

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
    ) : //@ts-ignore
    column.getIsSorted() === "desc" ? (
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
  currency = "INR"
) => {
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
  status: 6,
  price: 7,
  limitPrice: 8,
  triggerPrice: 9,
  token: 10,
  segment: 11,
  symbol: 12,
  qty: 13,
  transType: 14,
  Operations: 15,
  ordersplaced: 16,
  ordersdone: 17,
  ordersexecuted: 18,
  placed_at: 19,
  recon_at: 20,
  trade_at: 21,
  filledQty: 22,
  tradedQty: 23,
  tradeValue: 24,
  tradePrice: 25,
  active: 26,
  productType: 27,
};

export default function getOrderbookColumns(
  setSelectedRow: React.Dispatch<React.SetStateAction<OrderBookItem | null>>,
  setModalType: React.Dispatch<React.SetStateAction<TOrderModalType | null>>
) {
  const columns: ColumnDef<OrderBookItem>[] = [
    {
      accessorKey: "AccountName",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Account Name"),
    },
    {
      accessorKey: "strefID",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Stref ID"),
    },
    {
      accessorKey: "reftag",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Ref Tag"),
    },
    {
      accessorKey: "StrategyName",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Strategy Name"),
    },
    {
      accessorKey: "orderType",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Order Type"),
    },
    {
      accessorKey: "price",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Price"),
      cell: ({ row }: { row: any }) =>
        getBadgeCell(row, "price", "bg-blue-100"),
    },
    {
      accessorKey: "limitPrice",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Limit Price"),
      cell: ({ row }: { row: any }) =>
        getBadgeCell(row, "limitPrice", "bg-green-100"),
    },
    {
      accessorKey: "triggerPrice",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Trigger Price"),
      cell: ({ row }: { row: any }) =>
        getBadgeCell(row, "triggerPrice", "bg-yellow-100"),
    },
    {
      accessorKey: "token",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Token"),
    },
    {
      accessorKey: "segment",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Segment"),
    },
    {
      accessorKey: "symbol",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Symbol"),
    },
    {
      accessorKey: "qty",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Quantity"),
    },
    {
      accessorKey: "transType",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Transaction Type"),
      cell: ({ row }: { row: any }) => (
        <Badge
          className={
            row.original.transType.toLowerCase() === "buy"
              ? "bg-green-500 hover:bg-green-500"
              : "bg-red-500 hover:bg-red-500"
          }
        >
          {row.getValue("transType")}
        </Badge>
      ),
    },
    {
      accessorKey: "Operations",
      header: "Operations",
      cell: ({ row }: { row: any }) => (
        <CustomToolTip
          trigger={<Badge variant="outline">View Operations</Badge>}
        >
          <p>{row.original?.Operations}</p>
        </CustomToolTip>
      ),
    },
    {
      accessorKey: "ordersplaced",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Orders Placed"),
    },
    {
      accessorKey: "ordersdone",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Orders Done"),
    },
    {
      accessorKey: "ordersexecuted",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Orders Executed"),
    },
    {
      accessorKey: "placed_at",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Placed At"),
      cell: ({ row }: { row: any }) => formatDate(row.getValue("placed_at")),
    },
    {
      accessorKey: "recon_at",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Recon At"),
      cell: ({ row }: { row: any }) => formatDate(row.getValue("recon_at")),
    },
    {
      accessorKey: "trade_at",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Trade At"),
      cell: ({ row }: { row: any }) => formatDate(row.getValue("trade_at")),
    },
    {
      accessorKey: "filledQty",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Filled Quantity"),
    },
    {
      accessorKey: "tradedQty",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Traded Quantity"),
    },
    {
      accessorKey: "tradeValue",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Trade Value"),
      cell: ({ row }: { row: any }) =>
        getBadgeCell(row, "tradeValue", "bg-purple-100"),
    },
    {
      accessorKey: "tradePrice",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Trade Price"),
      cell: ({ row }: { row: any }) =>
        getBadgeCell(row, "tradePrice", "bg-pink-100"),
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Status"),
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("status") as string;
        const lowercaseValue = value.toLowerCase();

        let className = "bg-gray-200 hover:bg-gray-200 text-gray-800"; // Default for pending

        if (lowercaseValue === "executed") {
          className = "bg-green-200 hover:bg-green-200 text-green-800";
        } else if (["cancelled", "error"].includes(lowercaseValue)) {
          className = "bg-red-200 text-red-800 hover:bg-red-200";
        }

        return <Badge className={`font-medium ${className}`}>{value}</Badge>;
      },
    },
    {
      accessorKey: "active",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Active"),
      cell: ({ row }: { row: any }) =>
        row.getValue("active") === 1 ? "Yes" : "No",
    },
    {
      accessorKey: "productType",
      header: ({ column }: { column: ColumnDef<OrderBookItem> }) =>
        getSortingButton(column, "Product Type"),
    },
  ].sort(
    (a, b) =>
      columnPriorities[a.accessorKey as string] -
      columnPriorities[b.accessorKey as string]
  );

  const actionColumn: ColumnDef<OrderBookItem> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => (
      <div className="flex gap-x-2 items-center">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedRow(row.original);
                  setModalType("DETAILS");
                }}
                className="whitespace-nowrap"
              >
                <ChartNoAxesGantt size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-50 relative" side="left">
              <span>View Order Details</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  };

  return { regularColumns: columns, actionColumn };
}
