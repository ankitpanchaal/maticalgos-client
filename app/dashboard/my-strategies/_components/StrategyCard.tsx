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

const StrategyCard: React.FC<{ strategy: IStrategy }> = ({ strategy }) => {
  const isActive = strategy.Activate > 0;

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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isActive ? (
          <div className="w-10 h-2.5 bg-green-500" />
        ) : (
          <div className="w-10 h-2.5 bg-red-500" />
        )}
      </div>
      <CardHeader>
        <h3 className="text-xl text-center font-semibold ">{strategy.StrategyName}</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-1 justify-center">
        <ChartLine size={22} />
          <span className="font-semibold">PNL</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Profit and Loss</p>
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
          >
            {isActive ? "Stop" : "Deploy"}
          </Button>
          <Button className="flex-1" variant="outline">
            Square Off
          </Button>
        </div>
        <Button className="w-full" variant="outline">
          OrderBook
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StrategyCard;
