"use client";
import React, { useState } from "react";
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
import { StrategyExplorerProps, IStrategy } from "../types";

const StrategyExplorer: React.FC<StrategyExplorerProps> = ({ strategies }) => {
  const [subscribedStrategies, setSubscribedStrategies] = useState<Set<number>>(
    new Set()
  );
  const [expandedStrategy, setExpandedStrategy] = useState<number | null>(null);

  const handleSubscribe = (strategyId: number) => {
    setSubscribedStrategies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(strategyId)) {
        newSet.delete(strategyId);
      } else {
        newSet.add(strategyId);
      }
      return newSet;
    });
  };

  const toggleAccordion = (strategyId: number) => {
    setExpandedStrategy((prev) => (prev === strategyId ? null : strategyId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore Strategies</h1>
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-center">Strategy Name</TableHead>
            <TableHead className="text-center">Strategy Type</TableHead>
            <TableHead className="text-center">Margin Required</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {strategies.map((strategy: IStrategy) => (
            <React.Fragment key={strategy.ID}>
              <TableRow
                className={`transition-colors duration-200 ${
                  expandedStrategy === strategy.ID
                    ? "bg-blue-100 hover:bg-blue-100"
                    : ""
                }`}
              >
                <TableCell className="font-medium text-center">
                  {strategy.StrategyName}
                </TableCell>
                <TableCell className="text-center">
                  {strategy.StrategyType}
                </TableCell>
                <TableCell className="text-center">
                ₹{strategy.Description?.split("|")[0]}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center space-x-2">
                    <Button
                      onClick={() => handleSubscribe(strategy.ID)}
                      className={`font-semibold ${
                        subscribedStrategies.has(strategy.ID)
                          ? "border-red-500 text-red-500"
                          : "border-green-500 text-green-500"
                      }`}
                      variant="outline"
                    >
                      {subscribedStrategies.has(strategy.ID)
                        ? "Unsubscribe"
                        : "Subscribe"}
                    </Button>
                    <Button
                      onClick={() => toggleAccordion(strategy.ID)}
                      variant={
                        expandedStrategy === strategy.ID ? "default" : "ghost"
                      }
                      size="sm"
                      className={`hover:bg-blue-100 text-black ${
                        expandedStrategy === strategy.ID ? "bg-blue-100" : ""
                      }`}
                    >
                      {expandedStrategy === strategy.ID ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedStrategy === strategy.ID
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 bg-blue-100 rounded-md shadow-sm mb-4 mt-0.5">
                      <h4 className="font-semibold mb-2">Description:</h4>
                      <p>{strategy.Description?.split("|")[1]}</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StrategyExplorer;
