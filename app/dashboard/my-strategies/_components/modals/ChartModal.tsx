'use client'
import React, { useState, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, ReferenceArea, Tooltip, TooltipProps } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { chartData } from '@/lib/constants/chart';
import formatPNL from '@/lib/formatPNL';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DataPoint {
  Datetime: string;
  PNL: number;
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose }) => {
  const [leftIndex, setLeftIndex] = useState<number>(0);
  const [rightIndex, setRightIndex] = useState<number>(chartData.length - 1);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);

  const formatXAxis = (tickItem: string): string => {
    const date = new Date(tickItem);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const visibleData = useMemo(() => {
    const dataSlice = chartData.slice(leftIndex, rightIndex + 1);
    const dataLength = dataSlice.length;
    const maxPoints = 100; // Maximum number of points to display
    
    if (dataLength <= maxPoints) {
      return dataSlice;
    }

    const step = Math.ceil(dataLength / maxPoints);
    const sampledData = [];
    
    for (let i = 0; i < dataLength; i += step) {
      sampledData.push(dataSlice[i]);
    }

    // Ensure the last point is always included
    if (sampledData[sampledData.length - 1] !== dataSlice[dataLength - 1]) {
      sampledData.push(dataSlice[dataLength - 1]);
    }

    return sampledData;
  }, [leftIndex, rightIndex]);

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    let left = chartData.findIndex(item => item.Datetime === refAreaLeft);
    let right = chartData.findIndex(item => item.Datetime === refAreaRight);

    if (left > right) 
      [left, right] = [right, left];

    setLeftIndex(left);
    setRightIndex(right);

    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const resetZoom = () => {
    setLeftIndex(0);
    setRightIndex(chartData.length - 1);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  // CSS to prevent text selection
  const noSelectStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  } as React.CSSProperties;
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value as number;
      const color = value < 0 ? 'red' : 'green';
      return (
        <div className={`custom-tooltip bg-white p-2 border border-gray-300 rounded shadow border-l-4 ${value<0 ? "border-l-red-500" :"border-l-green-500"}`}>
          <p className="label text-sm">{new Date(label).toLocaleString()}</p>
          <p className="intro" style={{ color }}>{formatPNL(value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:min-w-[80vw]">
        <DialogHeader>
          <DialogTitle>PNL Chart</DialogTitle>
        </DialogHeader>
            <div style={noSelectStyle}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={visibleData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  onMouseDown={e => setRefAreaLeft(e?.activeLabel)}
                  onMouseMove={e => refAreaLeft && setRefAreaRight(e?.activeLabel)}
                  onMouseUp={zoom}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="Datetime" 
                    tickFormatter={formatXAxis}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `₹${value}`}
                    domain={['auto', 'auto']}
                    tick={(props) => {
                      const { x, y, payload } = props;
                      const color = payload.value < 0 ? 'red' : 'green';
                      return (
                        <text x={x} y={y} dy={4} fill={color} fontSize={12} fontWeight={600} textAnchor="end" style={noSelectStyle}>
                        {formatPNL(payload.value)}
                        </text>
                      );
                    }}
                  />
                <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="linear" 
                    dataKey="PNL" 
                    stroke="blue"
                    strokeWidth={2}
                    dot={false}
                  />
                  {refAreaLeft && refAreaRight ? (
                    <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4">
              <Button variant='outline' onClick={resetZoom}>
                Reset Zoom
              </Button>
            </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartModal;