import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const SkeletonLoader = ({ rowCount = 3 }) => {
  return (
    <Table>
      <TableBody>
        {[...Array(rowCount)].map((_, index) => (
          <TableRow
            key={index}
            className="border-t-[12px] border-gray-100 bg-white rounded-lg overflow-hidden"
          >
            <TableCell colSpan={4} className="p-0">
              <Skeleton className="h-16 w-full rounded-lg" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkeletonLoader;