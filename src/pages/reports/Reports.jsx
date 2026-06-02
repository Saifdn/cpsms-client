import { useState } from "react";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDays,
  CalendarRange,
  DollarSign,
  Download,
  Loader2,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useEventSummary, useDailyDrillDown } from "@/hooks/reports/useReports";
import { downloadReportExcel } from "@/lib/exportReport";

// ─── Colour palette ───────────────────────────────────────────────────────────
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// ─── Period tabs ──────────────────────────────────────────────────────────────
const PERIOD_TABS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, prefix, color }) {
  const Icon = icon;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">
              {prefix && <span className="text-base font-semibold mr-0.5">{prefix}</span>}
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KpiCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Revenue by Day chart ─────────────────────────────────────────────────────
const revenueDayConfig = {
  grandTotal: { label: "Revenue (RM)", color: "var(--chart-1)" },
};

function RevenueByDayChart({ data = [], onSelectDate }) {
  const chartData = data.map((d) => ({
    date: format(new Date(d.date), "d MMM"),
    rawDate: d.date,
    grandTotal: d.grandTotal,
  }));

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Revenue by Day</CardTitle>
        <CardDescription>
          Daily grand total — click a bar to see the breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {chartData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={revenueDayConfig} className="h-64 w-full">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              onClick={(e) => {
                if (e?.activePayload?.[0]) {
                  onSelectDate(e.activePayload[0].payload.rawDate);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => `RM${v.toLocaleString()}`}
                className="text-xs"
                width={72}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`RM ${value.toLocaleString()}`, "Revenue"]}
                  />
                }
              />
              <Bar dataKey="grandTotal" fill="var(--color-grandTotal)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Package sales donut ──────────────────────────────────────────────────────
function PackageSalesChart({ data = [] }) {
  const pieData = data.map((p, i) => ({
    name: p.name,
    value: p.revenue,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const chartConfig = Object.fromEntries(
    data.map((p, i) => [p.name, { label: p.name, color: CHART_COLORS[i % CHART_COLORS.length] }])
  );

  const total = data.reduce((s, p) => s + p.revenue, 0);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Package Sales</CardTitle>
        <CardDescription>Revenue contribution by package</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {pieData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-56">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`RM ${value.toLocaleString()}`, ""]}
                  />
                }
              />
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} strokeWidth={4}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">
                            RM {(total / 1000).toFixed(1)}k
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-xs">
                            Revenue
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
      </CardContent>
    </Card>
  );
}

// ─── Addon revenue bar chart ──────────────────────────────────────────────────
function AddonRevenueChart({ data = [] }) {
  const chartData = data.map((a, i) => ({
    name: a.name,
    revenue: a.revenue,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const chartConfig = Object.fromEntries(
    data.map((a, i) => [a.name, { label: a.name, color: CHART_COLORS[i % CHART_COLORS.length] }])
  );

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Addon Revenue</CardTitle>
        <CardDescription>Revenue breakdown by add-on product</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {chartData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={chartConfig} className="h-56 w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `RM${v.toLocaleString()}`}
                className="text-xs"
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                width={96}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`RM ${value.toLocaleString()}`, "Revenue"]}
                  />
                }
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Breakdown table ──────────────────────────────────────────────────────────
function BreakdownTable({ title, description, data = [] }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right">RM {row.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.qty}</TableCell>
                  <TableCell className="text-right font-semibold">
                    RM {row.revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Daily drill-down sheet ───────────────────────────────────────────────────
function DailyDrillDownSheet({ date, onClose }) {
  const { data: res, isLoading } = useDailyDrillDown(date);
  const daily = res?.data;

  return (
    <Sheet open={!!date} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-3">
            {date ? format(new Date(date), "EEEE, d MMMM yyyy") : "Daily Drill-Down"}
            {daily && (
              <Badge variant="secondary" className="ml-auto text-sm">
                RM {daily.grandTotal.toLocaleString()}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Session utilisation, packages, and add-ons for the selected day.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : !daily ? (
          <p className="text-muted-foreground text-sm">No data for this date.</p>
        ) : (
          <div className="space-y-6">
            {/* Summary badges */}
            <div className="flex gap-3 flex-wrap">
              <Badge variant="outline">
                {daily.totalBookings} booking{daily.totalBookings !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="outline">
                Grand Total: RM {daily.grandTotal.toLocaleString()}
              </Badge>
            </div>

            {/* Sessions utilization */}
            {daily.sessions?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Session Utilisation</h3>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Capacity</TableHead>
                        <TableHead className="text-right">Booked</TableHead>
                        <TableHead className="text-right">Utilisation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daily.sessions.map((s) => (
                        <TableRow key={s.sessionId}>
                          <TableCell className="font-medium">
                            {s.startTime} – {s.endTime}
                          </TableCell>
                          <TableCell className="text-right">{s.capacity}</TableCell>
                          <TableCell className="text-right">{s.bookedCount}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                s.utilizationPct >= 80
                                  ? "text-green-600 dark:text-green-400 font-semibold"
                                  : s.utilizationPct >= 50
                                  ? "text-yellow-600 dark:text-yellow-400 font-semibold"
                                  : "text-muted-foreground"
                              }
                            >
                              {s.utilizationPct.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Packages */}
            {daily.packages?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Packages</h3>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daily.packages.map((p) => (
                        <TableRow key={p.packageId}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-right">RM {p.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{p.qty}</TableCell>
                          <TableCell className="text-right font-semibold">
                            RM {p.revenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Addons */}
            {daily.addons?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Add-ons</h3>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Add-on</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daily.addons.map((a) => (
                        <TableRow key={a.addonId}>
                          <TableCell className="font-medium">{a.name}</TableCell>
                          <TableCell className="text-right">RM {a.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{a.qty}</TableCell>
                          <TableCell className="text-right font-semibold">
                            RM {a.revenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
      No data for the selected period
    </div>
  );
}

// ─── Chart skeleton ───────────────────────────────────────────────────────────
function ChartSkeleton({ height = "h-64" }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-60" />
      </CardHeader>
      <CardContent className="pt-6">
        <Skeleton className={`${height} w-full`} />
      </CardContent>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Reports() {
  const [period, setPeriod] = useState("all");
  const [dateRange, setDateRange] = useState(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const isCustom = !!(dateRange?.from && dateRange?.to);

  const queryParams = isCustom
    ? {
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      }
    : period === "all"
    ? {}
    : { period };

  const { data: res, isLoading } = useEventSummary(queryParams);
  const summary = res?.data;
  const overall = summary?.overall ?? {};
  const eventDays = summary?.eventDays ?? [];

  const avgRevenue =
    overall.totalDays > 0
      ? Math.round(overall.grandTotal / overall.totalDays)
      : 0;

  function handleTabChange(val) {
    setPeriod(val);
    setDateRange(undefined);
  }

  function handleCalendarSelect(range) {
    setDateRange(range ?? undefined);
    if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
      setCalendarOpen(false);
    }
  }

  const dateRangeLabel =
    isCustom
      ? `${format(dateRange.from, "d MMM yyyy")} – ${format(dateRange.to, "d MMM yyyy")}`
      : "Custom Range";

  const periodLabel = isCustom
    ? dateRangeLabel
    : PERIOD_TABS.find((t) => t.value === period)?.label ?? "All Time";

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadReportExcel(summary, periodLabel);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Page>
      <PageHeader
        title="Reports"
        description="Studio performance, revenue, and sales analytics"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownload}
              disabled={downloading || !summary}
            >
              {downloading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Download size={15} />
              )}
              {downloading ? "Generating…" : "Download Excel"}
            </Button>

            <Tabs
              value={isCustom ? "" : period}
              onValueChange={handleTabChange}
            >
              <TabsList>
                {PERIOD_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={isCustom ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  <CalendarRange size={15} />
                  {isCustom ? dateRangeLabel : "Custom Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleCalendarSelect}
                />
              </PopoverContent>
            </Popover>
          </div>
        }
      />

      {/* ── KPI cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              icon={ShoppingCart}
              label="Total Bookings"
              value={(overall.totalBookings ?? 0).toLocaleString()}
              color="bg-blue-500"
            />
            <KpiCard
              icon={DollarSign}
              label="Grand Total Revenue"
              value={(overall.grandTotal ?? 0).toLocaleString()}
              prefix="RM"
              color="bg-emerald-500"
            />
            <KpiCard
              icon={CalendarDays}
              label="Event Days"
              value={(overall.totalDays ?? 0).toLocaleString()}
              color="bg-violet-500"
            />
            <KpiCard
              icon={TrendingUp}
              label="Avg Revenue / Day"
              value={avgRevenue.toLocaleString()}
              prefix="RM"
              color="bg-amber-500"
            />
          </>
        )}
      </div>

      {/* ── Revenue by Day + Package Sales ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <RevenueByDayChart
              data={eventDays}
              onSelectDate={(d) => setSelectedDate(d)}
            />
          )}
        </div>
        <div>
          {isLoading ? (
            <ChartSkeleton height="h-56" />
          ) : (
            <PackageSalesChart data={overall.packageBreakdown ?? []} />
          )}
        </div>
      </div>

      {/* ── Addon Revenue ─────────────────────────────────────────────────── */}
      <div className="mb-4">
        {isLoading ? (
          <ChartSkeleton height="h-56" />
        ) : (
          <AddonRevenueChart data={overall.addonBreakdown ?? []} />
        )}
      </div>

      {/* ── Breakdown tables ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <ChartSkeleton height="h-40" />
            <ChartSkeleton height="h-40" />
          </>
        ) : (
          <>
            <BreakdownTable
              title="Package Breakdown"
              description="Total quantities and revenue per package"
              data={overall.packageBreakdown ?? []}
            />
            <BreakdownTable
              title="Addon Breakdown"
              description="Total quantities and revenue per add-on"
              data={overall.addonBreakdown ?? []}
            />
          </>
        )}
      </div>

      {/* ── Hint ─────────────────────────────────────────────────────────── */}
      {!isLoading && eventDays.length > 0 && (
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
          <MousePointerClick size={13} />
          Click any bar in the Revenue by Day chart to see the daily drill-down.
        </p>
      )}

      {/* ── Daily drill-down sheet ────────────────────────────────────────── */}
      <DailyDrillDownSheet
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </Page>
  );
}
