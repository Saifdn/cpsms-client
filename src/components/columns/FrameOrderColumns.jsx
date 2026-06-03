import { FrameOrderActionsCell } from "./FrameOrderActionsCell";
import { Badge } from "@/components/ui/badge";

const FRAME_ORDER_STATUS_CONFIG = {
  pending:    { label: "Pending",    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700" },
  paid:       { label: "Paid",       className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  preparing:  { label: "Preparing",  className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  delivery:   { label: "Delivery",   className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  delivered:  { label: "Delivered",  className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" },
  cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
};

const PAYMENT_STATUS_CONFIG = {
  pending:  { label: "Pending",  className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200" },
  paid:     { label: "Paid",     className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" },
  failed:   { label: "Failed",   className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200" },
  refunded: { label: "Refunded", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" },
};

const FALLBACK = { label: "Unknown", className: "bg-muted text-muted-foreground border-muted" };

export const getFrameOrderStatus = (status) =>
  FRAME_ORDER_STATUS_CONFIG[status] ?? { ...FALLBACK, label: status ?? "Unknown" };

export const getFrameOrderPaymentStatus = (status) =>
  PAYMENT_STATUS_CONFIG[status] ?? { ...FALLBACK, label: status ?? "Unknown" };

export const frameOrderColumns = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-sm">{row.getValue("orderNumber")}</span>
    ),
  },
  {
    id: "graduate",
    header: "Graduate",
    cell: ({ row }) => {
      const g = row.original.graduate;
      if (!g) return <span className="text-muted-foreground">—</span>;
      return (
        <div>
          <p className="font-medium text-sm">{g.fullName}</p>
          <p className="text-xs text-muted-foreground">{g.email}</p>
        </div>
      );
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items ?? [];
      if (!items.length) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <span key={item._id} className="text-sm">
              {item.frame?.name ?? "Unknown"}{" "}
              <span className="text-muted-foreground">×{item.quantity}</span>
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const info = getFrameOrderStatus(row.getValue("status"));
      return (
        <Badge className={`text-xs px-2.5 py-0.5 font-semibold border capitalize ${info.className}`}>
          {info.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const info = getFrameOrderPaymentStatus(row.getValue("paymentStatus"));
      return (
        <Badge className={`text-xs px-2.5 py-0.5 font-medium border capitalize ${info.className}`}>
          {info.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => (
      <span className="tabular-nums font-semibold">
        RM {Number(row.getValue("totalPrice")).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ordered On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <FrameOrderActionsCell row={row} />,
  },
];
