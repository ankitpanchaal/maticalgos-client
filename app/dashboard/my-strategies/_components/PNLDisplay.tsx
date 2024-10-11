import formatPNL from "@/lib/formatPNL";
import React from "react";

interface PNLDisplayProps {
  strategy: {
    bookedpnl: number;
    totalpnl: number;
  };
}

const getPNLClass = (pnl: number): string => {
  return pnl >= 0 ? "text-green-600" : "text-red-600";
};

export default function PNLDisplay({ strategy }: PNLDisplayProps) {
  const bookedPNL = strategy.bookedpnl;
  const runningPNL = strategy.totalpnl - strategy.bookedpnl;

  return (
    <div className="space-y-2">
      <p className="flex items-center justify-between gap-x-1">
        <span>Booked PNL:</span>
        <span className={`font-semibold ${getPNLClass(bookedPNL)}`}>
          {formatPNL(bookedPNL)}
        </span>
      </p>
      <p className="flex items-center justify-between gap-x-1">
        <span>Running PNL:</span>
        <span className={`font-semibold ${getPNLClass(runningPNL)}`}>
          {formatPNL(runningPNL)}
        </span>
      </p>
    </div>
  );
}
