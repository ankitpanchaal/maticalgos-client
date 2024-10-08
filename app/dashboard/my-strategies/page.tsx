import React from "react";
import StrategyCard from "./_components/StrategyCard";
import { IStrategy } from "./types";

const page = () => {
  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Strategies</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {dummyStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
};

export default page;

const dummyStrategies: IStrategy[] = [
  { id: "1", name: "Strategy 1", pnl: 200000, status: "active" },
  { id: "2", name: "Strategy 2", pnl: 200000, status: "inactive" },
];
