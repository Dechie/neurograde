import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// In components/dashboard/studentDashboard/QuickStats.tsx
import React from "react";

// Define the props interface
interface QuickStatsProps {
  student: {
    id_number: string;
    academic_year: string;
    department: string;
  };
  resultCount: number;
}

export function QuickStats({ student, resultCount }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Student ID</p>
        <p className="font-medium">{student.id_number}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Academic Year</p>
        <p className="font-medium">{student.academic_year}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Department</p>
        <p className="font-medium">{student.department}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Total Results</p>
        <p className="font-medium">{resultCount}</p>
      </div>
    </div>
  );
}