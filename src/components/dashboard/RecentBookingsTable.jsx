import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const BOOKING_STATUS_STYLES = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  preparing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  delivery: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const PAYMENT_STATUS_STYLES = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StatusBadge({ status, styleMap }) {
  return (
    <Badge
      variant="secondary"
      className={cn("capitalize text-xs", styleMap[status])}
    >
      {status}
    </Badge>
  );
}

export function RecentBookingsTable({ data = [] }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Last {data.length} bookings in the system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No recent bookings
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking No.</TableHead>
                <TableHead>Graduate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-mono text-xs">
                    {booking.bookingNumber}
                  </TableCell>
                  <TableCell>{booking.graduate?.fullName ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={booking.status}
                      styleMap={BOOKING_STATUS_STYLES}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    RM {booking.totalPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {format(new Date(booking.createdAt), "d MMM yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
