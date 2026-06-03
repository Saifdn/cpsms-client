import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyFrameOrders } from "@/hooks/frameOrders/useFrameOrders";
import { getFrameOrderStatus } from "@/components/columns/FrameOrderColumns";
import {
  ArrowRight,
  PackageOpen,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";

const FILTERS = [
  { value: "all",       label: "All" },
  { value: "pending",   label: "Pending" },
  { value: "paid",      label: "Paid" },
  { value: "preparing", label: "Preparing" },
  { value: "delivery",  label: "Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="h-1.5 w-full bg-primary/20" />
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4 pb-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ filter }) => {
  const isFiltered = filter !== "all";
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
        <PackageOpen className="h-9 w-9 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        {isFiltered ? "No orders here" : "No orders yet"}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xs">
        {isFiltered
          ? "Try switching to a different tab or view all orders."
          : "You haven't placed any frame orders yet."}
      </p>
      {!isFiltered && (
        <Button asChild size="lg">
          <Link to="/frames">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Frame Shop
          </Link>
        </Button>
      )}
    </div>
  );
};

const MyFrameOrders = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useMyFrameOrders();
  const [filter, setFilter] = useState("all");

  const orders = data?.data ?? [];

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.filter((f) => f.value !== "all").map(({ value }) => [
          value,
          orders.filter((o) => o.status === value).length,
        ])
      ),
    [orders]
  );

  if (isLoading) {
    return (
      <Page>
        <PageHeader title="My Frame Orders" description="View and track your ala-carte frame orders" />
        <div className="grid gap-5">
          {[...Array(3)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <PageHeader title="My Frame Orders" description="View and track your ala-carte frame orders" />
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to load orders</h2>
          <p className="text-muted-foreground mb-6">
            {error?.response?.data?.message || error?.message || "Something went wrong."}
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title="My Frame Orders" description="View and track your ala-carte frame orders" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-2 mb-6">
        <p className="text-sm text-muted-foreground order-last sm:order-first">
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
          {isFetching && !isLoading && (
            <span className="ml-2 text-xs text-muted-foreground/60">(refreshing…)</span>
          )}
        </p>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-auto flex-wrap gap-1 bg-muted/60">
            {FILTERS.map(({ value, label }) => {
              const count = value === "all" ? orders.length : (counts[value] ?? 0);
              return (
                <TabsTrigger key={value} value={value} className="text-xs gap-1.5 py-1.5">
                  {label}
                  {count > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-primary/15 text-primary">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="grid gap-5">
          {filtered.map((order) => {
            const statusInfo = getFrameOrderStatus(order.status);
            return (
              <Card
                key={order._id}
                className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="h-1.5 w-full bg-primary" />

                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-base font-bold tracking-tight leading-none mb-1">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length ?? 0} frame type{(order.items?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs px-3 py-1 font-semibold border capitalize shrink-0 ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Ordered On
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1.5">
                        RM {Number(order.totalPrice).toFixed(2)}
                      </p>
                    </div>

                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <Link to={`/my-frame-orders/${order._id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
};

export default MyFrameOrders;
