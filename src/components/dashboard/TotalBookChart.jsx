"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartData } from "@/data/Booking"; // ← your data import

export const description = "Booking completion donut chart";

export function TotalBookChart() {
  // Calculate totals once (memoized)
  const { totalBooked, totalDone, totalRemaining } = React.useMemo(() => {
    const bookedSum = chartData.reduce((acc, curr) => acc + curr.booked, 0);
    const doneSum = chartData.reduce((acc, curr) => acc + curr.done, 0);
    const remaining = Math.max(0, bookedSum - doneSum); // avoid negative

    return {
      totalBooked: bookedSum,
      totalDone: doneSum,
      totalRemaining: remaining,
    };
  }, []);

  // Prepare pie data – only two slices
  const pieData = [
    { name: "Done", value: totalDone, fill: "var(--color-totalDone)" },
    { name: "Remaining", value: totalRemaining, fill: "var(--color-totalRemaining)" },
  ];

  // Chart config (colors + labels)
  const chartConfig = {
    totalDone: {
      label: "Done",
      color: "var(--chart-1)"
    },
    totalRemaining: {
      label: "Remaining",
      color: "var(--chart-3)",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Booking Completion</CardTitle>
        <CardDescription>Recent Period</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}          
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalBooked.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Booked
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {totalDone} done • {totalRemaining} remaining
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total bookings: {totalBooked} | Completion:{" "}
          {totalBooked > 0 ? Math.round((totalDone / totalBooked) * 100) : 0}%
        </div>
      </CardFooter>
    </Card>
  );
}