'use client'
import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import {
  StrategyExplorerProps,
  IStrategy,
  GetLinkStrategiesResponse,
} from "../types"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion"
import SkeletonLoader from "./SkeletonLoader"
import { getLinkedStrategies, linkStartegyToAccount } from "../_actions/client"

const StrategyExplorer: React.FC<StrategyExplorerProps> = ({ strategies }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: linkedStrategies, isPending } = useQuery<GetLinkStrategiesResponse>({
    queryKey: ["linkedStrategies"],
    queryFn: getLinkedStrategies
  })

  const linkMutation = useMutation({
    mutationFn: ({
      StrategyID,
      StrategyName,
      type,
    }: {
      StrategyID: number
      StrategyName: string
      type: "subscribe" | "unsubscribe"
    }) => linkStartegyToAccount(StrategyID, StrategyName, type),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["linkedStrategies"] })
      toast.success(
        data.message ||
          `Strategy ${
            data.type === "subscribe" ? "subscribed" : "unsubscribed"
          } successfully`
      )
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while updating the strategy"
      )
    },
  })

  const isSubscribed = (strategyName: string) =>
    linkedStrategies?.data?.some((ls) => ls.StrategyName === strategyName) || false

  const handleSubscribe = async (strategy: IStrategy) => {
    const type = isSubscribed(strategy.StrategyName)
      ? "unsubscribe"
      : "subscribe"
    linkMutation.mutate({
      StrategyID: strategy.ID,
      StrategyName: strategy.StrategyName,
      type,
    })
  }

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
  )

  const columns: ColumnDef<IStrategy>[] = [
    {
      accessorKey: "StrategyName",
      header: ({ column }) => getSortingButton(column, "Strategy Name"),
    },
    {
      accessorKey: "StrategyType",
      header: ({ column }) => getSortingButton(column, "Strategy Type"),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.StrategyType}</Badge>
      ),
    },
    {
      accessorKey: "MarginRequired",
      header: ({ column }) => getSortingButton(column, "Margin Required"),
      cell: ({ row }) => `₹${row.original.Description?.split("|")[0]}`,
      sortingFn: (a, b) => {
        const aValue = Number(a.original.Description?.split("|")[0]) || 0
        const bValue = Number(b.original.Description?.split("|")[0]) || 0
        return aValue - bValue
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-between w-36 md:ml-[30%]">
          <SubscribeButton
            strategy={row.original}
            isSubscribed={isSubscribed(row.original.StrategyName)}
            onSubscribe={handleSubscribe}
            isLoading={linkMutation.isPending && linkMutation.variables?.StrategyID === row.original.ID}
          />
          {expandedRow === row.id ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: strategies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleRowClick = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  if (isPending) return <SkeletonLoader />

  return (
    <div className="relative overflow-x-auto rounded-lg bg-gray-100" style={{ maxHeight: "75vh" }}>
      <table className="w-full border-separate border-spacing-y-2">
        <thead className="sticky top-0 z-10 bg-white shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={`py-3 px-4 text-center font-semibold text-gray-600 bg-gray-50 ${
                    index === 0
                      ? "rounded-tl-lg"
                      : index === headerGroup.headers.length - 1
                      ? "rounded-tr-lg"
                      : ""
                  }`}
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr
                onClick={() => handleRowClick(row.id)}
                className={`cursor-pointer hover:bg-gray-50 ${
                  expandedRow === row.id ? "bg-blue-50" : "bg-white"
                } rounded-lg`}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`py-3 mb-4 px-4 text-center ${
                      index === 0
                        ? "rounded-tl-lg rounded-bl-lg"
                        : index === row.getVisibleCells().length - 1
                        ? "rounded-tr-lg rounded-br-lg"
                        : ""
                    }`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td colSpan={columns.length} className="p-0">
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
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SubscribeButton: React.FC<{
  strategy: IStrategy
  isSubscribed: boolean
  onSubscribe: (strategy: IStrategy) => void
  isLoading: boolean
}> = ({ strategy, isSubscribed, onSubscribe, isLoading }) => (
  <Button
    onClick={(e) => {
      e.stopPropagation()
      onSubscribe(strategy)
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
)

export default StrategyExplorer