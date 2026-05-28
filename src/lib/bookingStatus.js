export const BOOKING_STATUS_CONFIG = {
  pending:       { label: "Pending",     className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700" },
  booked:        { label: "Booked",      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  "checked-in":  { label: "Checked In",  className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800" },
  "in-progress": { label: "In Progress", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
  completed:     { label: "Completed",   className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" },
  preparing:     { label: "Preparing",   className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  delivery:      { label: "Delivery",    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  shipped:       { label: "Shipped",     className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  cancelled:     { label: "Cancelled",   className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
};

export const PAYMENT_STATUS_CONFIG = {
  paid:    { label: "Paid",    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" },
  unpaid:  { label: "Unpaid",  className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" },
  pending: { label: "Pending", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200" },
};

const FALLBACK_BOOKING = { label: "Unknown", className: "bg-muted text-muted-foreground border-muted" };
const FALLBACK_PAYMENT = { label: "Unknown", className: "bg-muted text-muted-foreground" };

export const getBookingStatus = (status) =>
  BOOKING_STATUS_CONFIG[status] ?? { ...FALLBACK_BOOKING, label: status ?? "Unknown" };

export const getPaymentStatus = (status) =>
  PAYMENT_STATUS_CONFIG[status] ?? { ...FALLBACK_PAYMENT, label: status ?? "Unknown" };
