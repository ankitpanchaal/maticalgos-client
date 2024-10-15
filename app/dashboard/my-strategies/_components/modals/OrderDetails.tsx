import React from "react";
import { OrderBookItem } from "../../types";
import { fetchOrderDetails } from "../../_actions";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/shared/Spinner";
import NoData from "@/components/shared/NoData";

interface OrderDetailsProps {
  order: OrderBookItem | null;
  onClose: () => void;
  isOpen: boolean;
}

const OrderDetails = ({ order, isOpen, onClose }: OrderDetailsProps) => {
  if (!order) return null;

  const { isLoading, error, data } = useQuery({
    queryKey: [`order-details-${order.reftag}-${order.strefID}`],
    queryFn: () => fetchOrderDetails(order.reftag, order.strefID),
    enabled: isOpen,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderValue = (value: string) => {
    const lowercaseValue = value.toLowerCase();

    let className = "bg-gray-200 hover:bg-gray-200 text-gray-800"; // Default for pending

    if (lowercaseValue === "executed") {
      className = "bg-green-200 hover:bg-green-200 text-green-800";
    } else if (["cancelled", "error"].includes(lowercaseValue)) {
      className = "bg-red-200 text-red-800 hover:bg-red-200";
    }

    return <Badge className={`font-medium ${className}`}>{value}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col ">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-scroll ">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : error ? (
            <p>Error loading order details</p>
          ) : (
            <div className="space-y-6">
              <Table>
                <TableHeader className="bg-gray-100 ">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Filled Quantity</TableHead>
                    <TableHead>Trade Price</TableHead>
                    <TableHead>Trade Value</TableHead>
                    <TableHead>Placed At</TableHead>
                  </TableRow>
                </TableHeader>
                {data?.data[0].orders?.length === 0 ? (
                   <TableBody>
                    <TableCell colSpan={7} className="text-center">
                   <NoData label="No data available" />
                    </TableCell>
                   </TableBody>
                ) : (
                  <TableBody>
                    {data?.data[0]?.orders?.map((order: any) => (
                      <TableRow key={order.orderid}>
                        <TableCell>{order.orderid}</TableCell>
                        <TableCell>{renderValue(order.status)}</TableCell>
                        <TableCell>{order.qty}</TableCell>
                        <TableCell>{order.filledQty || "-"}</TableCell>
                        <TableCell>{order.tradePrice || "-"}</TableCell>
                        <TableCell>{order.tradeValue || "-"}</TableCell>
                        <TableCell>{formatDate(order.placed_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
