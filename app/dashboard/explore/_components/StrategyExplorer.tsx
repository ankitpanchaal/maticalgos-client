"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
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
import {
  StrategyExplorerProps,
  IStrategy,
  GetLinkStrategiesResponse,
} from "../types";
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
import { API_ENDPOINT } from "@/lib/constants/app-constants";
import SkeletonLoader from "./SkeletonLoader";

const StrategyExplorer: React.FC<StrategyExplorerProps> = ({ strategies }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: linkedStrategies, isPending } = useQuery<GetLinkStrategiesResponse>({
    queryKey: ["linkedStrategies"],
    queryFn: getLinkedStrategies,
  });

  const linkMutation = useMutation({
    mutationFn: ({
      StrategyID,
      StrategyName,
      type,
    }: {
      StrategyID: number;
      StrategyName: string;
      type: "subscribe" | "unsubscribe";
    }) => linkStartegyToAccount(StrategyID, StrategyName, type),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["linkedStrategies"] });
      toast.success(
        data.message ||
          `Strategy ${
            data.type === "subscribe" ? "subscribed" : "unsubscribed"
          } successfully`
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while updating the strategy"
      );
    },
  });

  const isSubscribed = (strategyName: string) =>
    linkedStrategies?.data?.some((ls) => ls.StrategyName === strategyName) || false;

  const handleSubscribe = async (strategy: IStrategy) => {
    const type = isSubscribed(strategy.StrategyName)
      ? "unsubscribe"
      : "subscribe";
    linkMutation.mutate({
      StrategyID: strategy.ID,
      StrategyName: strategy.StrategyName,
      type,
    });
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
      cell: ({ row }) => `₹${row.original.Description?.split("|")[0]}`,
      sortingFn: (a, b) => {
        const aValue = Number(a.original.Description?.split("|")[0]) || 0;
        const bValue = Number(b.original.Description?.split("|")[0]) || 0;
        return aValue - bValue;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <SubscribeButton
          strategy={row.original}
          isSubscribed={isSubscribed(row.original.StrategyName)}
          onSubscribe={handleSubscribe}
          isLoading={linkMutation.isPending && linkMutation.variables?.StrategyID === row.original.ID}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: strategies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  if(isPending) return <SkeletonLoader />;

  return (
    <div className="relative overflow-x-auto" style={{ maxHeight: "75vh" }}>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-gray-50 hover:bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={`py-3 ${
                    index === 0
                      ? "rounded-tl-lg"
                      : index === headerGroup.headers.length - 1
                      ? "rounded-tr-lg"
                      : ""
                  }`}
                >
                  <HeaderContent header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <StrategyRow
              key={row.id}
              row={row}
              columns={columns}
              expandedRow={expandedRow}
              onRowClick={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const HeaderContent: React.FC<{ header: any }> = ({ header }) => (
  <div className="flex items-center justify-center space-x-2 cursor-pointer">
    <span>
      {flexRender(header.column.columnDef.header, header.getContext())}
    </span>
    {header.column.getIsSorted() &&
      (header.column.getIsSorted() === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      ))}
  </div>
);

const SubscribeButton: React.FC<{
  strategy: IStrategy;
  isSubscribed: boolean;
  onSubscribe: (strategy: IStrategy) => void;
  isLoading: boolean;
}> = ({ strategy, isSubscribed, onSubscribe, isLoading }) => (
  <Button
    onClick={(e) => {
      e.stopPropagation();
      onSubscribe(strategy);
    }}
    className={`font-semibold ${
      isSubscribed
        ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
    }`}
    variant="outline"
    disabled={isLoading}
  >
    {isLoading ? "Loading..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
  </Button>
);

const StrategyRow: React.FC<{
  row: any;
  columns: ColumnDef<IStrategy>[];
  expandedRow: string | null;
  onRowClick: (rowId: string) => void;
}> = ({ row, columns, expandedRow, onRowClick }) => (
  <React.Fragment>
    <TableRow
      onClick={() => onRowClick(row.id)}
      className={`cursor-pointer border-t-[12px] border-gray-100 hover:!bg-blue-50 bg-white rounded-lg overflow-hidden ${
        expandedRow === row.id ? "bg-blue-50" : ""
      }`}
    >
      {row.getVisibleCells().map((cell: any, cellIndex: number) => (
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
          <div className={`flex items-center justify-center ${cell.column.columnDef.id === "actions" ?"w-36 md:ml-[30%] justify-between border-red-700":""}`}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            {cell.column.columnDef.id === "actions" && (
              expandedRow === row.id ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />)}
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
);

export default StrategyExplorer;

const linkStartegyToAccount = async (
  StrategyID: number,
  StrategyName: string,
  type: "subscribe" | "unsubscribe"
): Promise<any> => {
  console.log("TYPE : ", type);
  const res = await fetch(`/api/user/link-strategies`, {
    credentials: "include",
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ StrategyID, StrategyName, type }),
  });
  const data = await res.json();
  return data;
};

const getLinkedStrategies = async (): Promise<GetLinkStrategiesResponse> => {
  const res = await fetch(`/api/user/link-strategies`, {
    cache: "no-store",
    credentials: "include",
    method: "GET",
  });

  const data = await res.json();
  return data;
};
