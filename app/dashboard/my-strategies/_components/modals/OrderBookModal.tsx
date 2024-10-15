import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchOrderBook } from "../../_actions";
import { OrderBookTable } from "./OrderBookTable";
import Spinner from "@/components/shared/Spinner";
import NoData from "@/components/shared/NoData";

interface OrderBookProps {
  isOpen: boolean;
  onClose: () => void;
  acname: string;
  stname: string;
}

const OrderBookModal: React.FC<OrderBookProps> = ({
  isOpen,
  onClose,
  acname,
  stname,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orderbook", acname, stname],
    queryFn: () => fetchOrderBook(acname, stname),
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-[95vw] h-fit">
        <DialogHeader>
          <DialogTitle>Order Book</DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Spinner size={26} />
            </div>
          ) : error ? (
            <p>Error loading order book: {(error as Error).message}</p>
          ) : data?.data?.length === 0 ? (
            <div className="flex h-28 justify-center items-center">
            <NoData label="No data available" />
            </div>
          ) : (
            data &&  <OrderBookTable data={data.data} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderBookModal;
