"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { chartData } from "@/data/Booking";

export const description = "A stacked bar chart with a legend";

// const chartData = [
//   { date: "2024-07-15", booked: 450, done: 300 },
//   { date: "2024-07-16", booked: 380, done: 420 },
//   { date: "2024-07-17", booked: 520, done: 120 },
//   { date: "2024-07-18", booked: 140, done: 550 },
//   { date: "2024-07-19", booked: 600, done: 350 },
//   { date: "2024-07-20", booked: 480, done: 400 },
//   { date: "2024-07-21", booked: 520, done: 120 },
//   { date: "2024-07-22", booked: 140, done: 550 },
//   { date: "2024-07-23", booked: 600, done: 350 },
//   { date: "2024-07-24", booked: 480, done: 400 },
// ];

const chartConfig = {
  booked: {
    label: "Booked",
    color: "var(--chart-1)",
  },
  done: {
    label: "Done",
    color: "var(--chart-2)",
  },
};

export default function BookingChart() {
  return (
        <div className="">
          <ChartContainer config={chartConfig} className="h-70 lg:h-52 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Bar
              dataKey="booked"
              stackId="a"
              fill="var(--color-booked)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="done"
              stackId="a"
              fill="var(--color-done)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
        </div>
        
  );
}