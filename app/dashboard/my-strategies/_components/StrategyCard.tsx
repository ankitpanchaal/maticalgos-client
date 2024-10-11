'use client'
import React, { useState } from 'react';
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartLine, InfoIcon, MoreVertical } from "lucide-react";
import { IStrategy } from "../types";
import formatPNL from "@/lib/formatPNL";
import { Badge } from "@/components/ui/badge";
import PNLDisplay from "./PNLDisplay";
import ConfirmationModal from './modals/ConfirmationModal';
import OrderBookModal from './modals/OrderBookModal';
import ChartModal from './modals/ChartModal';

const StrategyCard: React.FC<{ strategy: IStrategy }> = ({ strategy }) => {
  const [isActive, setIsActive] = useState(strategy.Activate > 0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'deploy' | 'stop' | 'squareOff' | null>(null);
  const [isOrderBookOpen, setIsOrderBookOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);

  const handleConfirm = () => {
    if (confirmAction === 'deploy' || confirmAction === 'stop') {
      setIsActive(!isActive);
    } else if (confirmAction === 'squareOff') {
      // Implement square off logic here
      console.log('Squaring off...');
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  const openConfirmModal = (action: 'deploy' | 'stop' | 'squareOff') => {
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
            <DropdownMenuItem>Option</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isActive ? (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100" >
          Active
          </Badge>
        ) : (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100" >
          Inactive
        </Badge>
        )}
      </div>
      <CardHeader>
        <h3 className="text-xl text-center font-semibold ">
          {strategy.StrategyName}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 justify-center">
          <Button variant={"secondary"} size={'sm'} onClick={() => setIsChartOpen(true)}>
            <ChartLine size={18} />
          </Button>
          <span className="font-semibold">PNL</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <PNLDisplay strategy={strategy} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
            onClick={() => openConfirmModal(isActive ? 'stop' : 'deploy')}
          >
            {isActive ? "Stop" : "Deploy"}
          </Button>
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={() => openConfirmModal('squareOff')}
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
        onClose={() => setIsOrderBookOpen(false)}
      />

      <ChartModal
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
      />
    </Card>
  );
};

export default StrategyCard;