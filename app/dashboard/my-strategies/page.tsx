import React from "react";
import StrategyCard from "./_components/StrategyCard";
import { getMyStrategies } from "./_actions";

const page = async() => {
  const strategies = await getMyStrategies("forwardTester");

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Strategies</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {strategies?.data?.map((strategy) => (
          <StrategyCard key={strategy.ID} strategy={strategy} />
        ))}
      </div>
    </div>
  );
};

export default page;