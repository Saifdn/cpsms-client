import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardCard } from "./DashboardCard";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartConfig = {
  revenue: {
    label: "Revenue (RM)",
    color: "var(--chart-1)",
  },
};

export function MonthlyRevenueChart({ data = [] }) {
  const chartData = data.map((item) => ({
    month: MONTH_LABELS[item.month - 1],
    revenue: item.revenue,
  }));

  const year = new Date().getFullYear();

  return (
    <DashboardCard title="Monthly Revenue" description={`Revenue overview for ${year}`}>
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `RM${v}`}
            className="text-xs"
            width={60}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => [`RM ${value.toLocaleString()}`, "Revenue"]}
              />
            }
          />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </DashboardCard>
  );
}
