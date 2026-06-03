import { useState, useEffect } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFrameOrders } from "@/hooks/frameOrders/useFrameOrders";
import { frameOrderColumns } from "@/components/columns/FrameOrderColumns";
import { AdminCreateFrameOrderDialog } from "./AdminCreateFrameOrderDialog";
import { Plus, Filter } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending",   label: "Pending" },
  { value: "paid",      label: "Paid" },
  { value: "preparing", label: "Preparing" },
  { value: "delivery",  label: "Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const FrameOrdersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, limit]);

  const { data, isLoading } = useFrameOrders({
    status: statusFilter === "all" ? undefined : statusFilter,
    search,
    page: currentPage,
    limit,
  });

  const orders = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const total = data?.pagination?.total ?? 0;

  return (
    <Page>
      <PageHeader
        title="Frame Orders"
        description="Manage and process all ala-carte frame orders"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <DataTable
        title="Frame Orders"
        description={`${total} order${total !== 1 ? "s" : ""} found`}
        columns={frameOrderColumns}
        data={orders}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        limit={limit}
        onLimitChange={(v) => { setLimit(v); setCurrentPage(1); }}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <AdminCreateFrameOrderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </Page>
  );
};

export default FrameOrdersList;
