// components/columns/ShipmentActionsCell.jsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Truck, Trash2 } from "lucide-react";
import { useState } from "react";

import { useDeleteShipment } from "@/hooks/shipment/useShipments";
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

export function ShipmentActionsCell({ row }) {
  const deleteShipment = useDeleteShipment();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const shipment = row.original;

  const handleDeleteConfirm = () => {
    deleteShipment.mutate(shipment._id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  return (
    <>
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Truck className="mr-2 h-4 w-4" />
              Process Shipment
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialogs */}
      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={`Shipment #${shipment._id?.slice(-6)}`}
      />

      <ViewDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title="Shipment Details"
        data={shipment}
        fields={[
          { key: "booking.bookingNumber", label: "Booking Number" },
          { key: "receiver.name", label: "Receiver Name" },
          { key: "receiver.phoneNumber", label: "Phone" },
          { key: "status", label: "Status" },
        ]}
      />
    </>
  );
}