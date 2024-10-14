"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import StrategyCard from "./_components/StrategyCard";
import {
  getMyStrategies,
  modifyStrategyStatus,
  squreOffStrategy,
} from "./_actions";
import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/components/shared/NoData";

const Page = () => {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["my-strategies"],
    queryFn: getMyStrategies,
    // refetchInterval:1500
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      name,
      activate,
    }: {
      id: number;
      name: string;
      activate: number;
    }) => modifyStrategyStatus(id, name, activate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-strategies"] });
    },
  });

  const squreOffMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => squreOffStrategy(name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-strategies"] });
    },
  });

  const handleStrategyStatus = (id: number, name: string, activate: number) => {
    toast.promise(statusMutation.mutateAsync({ id, name, activate }), {
      loading: "Updating strategy status...",
      success: (data) => data.message || "Strategy status updated successfully",
      error: (err) => err.message || "Failed to update strategy status",
    });
  };

  const handleSqureOffStrategy = (name: string) => {
    toast.promise(squreOffMutation.mutateAsync({ name }), {
      loading: "Squaring off strategy...",
      success: (data) => data.message || "Strategy squared off successfully",
      error: (err) => err.message || "Failed to square off strategy",
    });
  };

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Strategies</h1>
{/* 
      <div className="mt-4">
        {data?.data?.length === 0&& !isLoading &&
          <NoData />}
      </div> */}

      <div className="grid md:grid-cols-3 gap-4">
        {isLoading
          ? [...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-lg" />
            ))
          : data?.data?.map((strategy) => (
              <StrategyCard
                handleSqureOffStrategy={handleSqureOffStrategy}
                isActive={strategy.Activate !== 0}
                key={strategy.ID}
                strategy={strategy}
                handleStrategyStatus={handleStrategyStatus}
              />
            ))}
      </div>
    </div>
  );
};

export default Page;