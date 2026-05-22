import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { DashboardCard } from "./DashboardCard";

const STATUS_COLORS = {
  completed: "var(--chart-1)",
  preparing: "var(--chart-2)",
  delivery: "var(--chart-3)",
  pending: "var(--chart-4)",
  cancelled: "var(--chart-5)",
};

const STATUS_LABELS = {
  completed: "Completed",
  preparing: "Preparing",
  delivery: "Delivery",
  pending: "Pending",
  cancelled: "Cancelled",
};

export function BookingStatusChart({ data = {} }) {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  const pieData = entries.map(([status, count]) => ({
    name: STATUS_LABELS[status] ?? status,
    value: count,
    fill: STATUS_COLORS[status] ?? "var(--chart-4)",
  }));

  const chartConfig = Object.fromEntries(
    entries.map(([status]) => [
      status,
      { label: STATUS_LABELS[status] ?? status, color: STATUS_COLORS[status] ?? "var(--chart-4)" },
    ])
  );

  return (
    <DashboardCard title="Booking Status" description="Today's booking breakdown">
      {total === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
          No bookings today
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-52">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} strokeWidth={4}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      )}
    </DashboardCard>
  );
}
