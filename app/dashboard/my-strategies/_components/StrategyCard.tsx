"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartLine, CircleDashed, CircleDot, Dot, InfoIcon, MoreVertical } from "lucide-react";
import { IStrategy } from "../types";
import formatPNL from "@/lib/formatPNL";
import { Badge } from "@/components/ui/badge";
import PNLDisplay from "./PNLDisplay";
import ConfirmationModal from "./modals/ConfirmationModal";
import OrderBookModal from "./modals/OrderBookModal";
import ChartModal from "./modals/ChartModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkStartegyToAccount } from "../../explore/_actions/client";
import toast from "react-hot-toast";
import CustomToolTip from "@/components/shared/CustomToolTip";

interface Props {
  strategy: IStrategy;
  isActive: boolean;
  handleStrategyStatus: (id: number, name: string, activate: number) => void;
  handleSqureOffStrategy: (name: string) => void;
}

const StrategyCard: React.FC<Props> = ({
  strategy,
  handleStrategyStatus,
  isActive,
  handleSqureOffStrategy,
}) => {
  const queryClient = useQueryClient();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "deploy" | "stop" | "squareOff" | 'unsubscribe' | null
  >(null);
  const [isOrderBookOpen, setIsOrderBookOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);

  const unSubscribeMutation = useMutation({
    mutationFn: ({ id, name }: unSubscribeMutationProps) =>
      linkStartegyToAccount(id, name, "unsubscribe"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-strategies"] });
    },
  });

  const handleConfirm = () => {
    if (confirmAction === "deploy" || confirmAction === "stop") {
      handleStrategyStatus(
        strategy.ID,
        strategy.StrategyName,
        isActive ? 0 : 1
      );
    } else if (confirmAction === "squareOff") {
      handleSqureOffStrategy(strategy.StrategyName);
    }else if(confirmAction === 'unsubscribe'){
      toast.promise(unSubscribeMutation.mutateAsync({id :strategy.ID, name:strategy.StrategyName}), {
        loading: "Unsubscribing strategy...",
        success: (data) => data.message || "Strategy unsubscribed successfully",
        error: (err) => err.message || "Failed to unsubscribe strategy",
      });
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  const openConfirmModal = (action: "deploy" | "stop" | "squareOff" | "unsubscribe") => {
    setConfirmAction(action);
    setIsConfirmOpen(true);
  };

  return (
    <Card className="w-full">
      <div className="flex items-center space-x-2 px-2 pt-2 justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => openConfirmModal("unsubscribe")} 
            className="cursor-pointer text-red-600 hover:bg-red-100 hover:!text-red-600"
            >
              Unsubscribe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Badge
          className={`items-center gap-x-1 hover:bg-${
            isActive ? "green" : "red"
          }-100 bg-${isActive ? "green" : "red"}-100 text-${
            isActive ? "green" : "red"
          }-800`}
        >
          {isActive ? "• Active" : "• Inactive"}
        </Badge>
      </div>
      <CardHeader>
        <h3 className="text-xl text-center font-semibold ">
          {strategy.StrategyName}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 justify-center">
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={() => setIsChartOpen(true)}
          >
            <ChartLine size={18} />
          </Button>
          <span className="font-semibold">PNL</span>
          <CustomToolTip trigger={<InfoIcon 
              className="w-4 h-4 text-gray-400 cursor-pointer"
            />} >
              <PNLDisplay strategy={strategy} />
          </CustomToolTip>
          
        </div>
        <p
          className={`text-2xl font-bold text-center mt-2 ${
            strategy.totalpnl >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatPNL(strategy.totalpnl)}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full space-x-2">
          <Button
            className="flex-1"
            variant={isActive ? "destructive" : "default"}
            style={
              !isActive ? { backgroundColor: "#22c55e", color: "white" } : {}
            }
            onClick={() => openConfirmModal(isActive ? "stop" : "deploy")}
          >
            {isActive ? "Stop" : "Deploy"}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => openConfirmModal("squareOff")}
          >
            Square Off
          </Button>
        </div>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsOrderBookOpen(true)}
        >
          OrderBook
        </Button>
      </CardFooter>

      {/* Add the modal components */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        action={confirmAction}
      />

      <OrderBookModal
        isOpen={isOrderBookOpen}
        acname={strategy.AccountName}
        stname={strategy.StrategyName}
        onClose={() => setIsOrderBookOpen(false)}
      />

      <ChartModal isOpen={isChartOpen} onClose={() => setIsChartOpen(false)} stName={strategy.StrategyName} />
    </Card>
  );
};

export default StrategyCard;

type unSubscribeMutationProps = {
  id: number;
  name: string;
};