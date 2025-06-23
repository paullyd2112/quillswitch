
import React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EnhancedCard } from "./enhanced-card";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  className
}) => {
  if (loading) {
    return (
      <EnhancedCard className={cn("p-6", className)}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      </EnhancedCard>
    );
  }

  if (data.length === 0) {
    return (
      <EnhancedCard className={cn("p-6 text-center", className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard className={cn("overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EnhancedCard>
  );
};

export default DataTable;
