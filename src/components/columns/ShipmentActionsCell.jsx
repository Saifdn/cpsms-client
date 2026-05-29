// components/columns/ShipmentActionsCell.jsx
import { Badge } from "@/components/ui/badge";
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

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { MALAYSIA_STATES_MAP } from "@/lib/malaysia";
import { useDeleteShipment } from "@/hooks/shipment/useShipments";

function formatPhone(countryCode, phoneNumber) {
  if (!phoneNumber) return null;
  const parsed = parsePhoneNumberFromString(String(phoneNumber), countryCode);
  return parsed?.formatInternational() ?? phoneNumber;
}
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

function Field({ label, value, mono = false }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium break-all ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
    </div>
  );
}

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
      >
        <div className="space-y-5">
          {/* Booking */}
          <Section title="Booking">
            <Field label="Booking No." value={shipment.bookingNumber} mono />
            <Field label="Graduate" value={shipment.graduate?.fullName} />
            <Field label="Email" value={shipment.graduate?.email} />
            <Field label="Phone" value={parsePhoneNumberFromString(shipment.graduate?.phone ?? "")?.formatInternational() ?? shipment.graduate?.phone} />
            <Field label="Package" value={shipment.package?.name} />
            {shipment.addons?.length > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Add-ons</p>
                <p className="text-sm font-medium">{shipment.addons.map((a) => a.name).join(", ")}</p>
              </div>
            )}
          </Section>

          <div className="border-t" />

          {/* Receiver */}
          <Section title="Receiver">
            <Field label="Name" value={shipment.shipment?.receiver?.name} />
            <Field label="Phone" value={formatPhone(shipment.shipment?.receiver?.phone_number_country_code, shipment.shipment?.receiver?.phone_number)} />
            {(() => {
              const r = shipment.shipment?.receiver;
              if (!r) return null;
              const lines = [
                r.address_1,
                r.address_2,
                [r.postcode, r.city].filter(Boolean).join(" "),
                MALAYSIA_STATES_MAP[r.subdivision_code] ?? r.subdivision_code,
              ].filter(Boolean);
              return lines.length > 0 ? (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <div className="text-sm font-medium space-y-0.5">
                    {lines.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              ) : null;
            })()}
          </Section>

          <div className="border-t" />

          {/* Shipment */}
          <Section title="Shipment">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="secondary" className="capitalize mt-0.5">
                {shipment.shipment?.status || shipment.status || "draft"}
              </Badge>
            </div>
            <Field label="Courier" value={shipment.shipment?.courierName} />
            <Field label="Service" value={shipment.shipment?.serviceName} />
            <Field label="AWB / Tracking" value={shipment.awb_number || shipment.shipment?.awb_number} mono />
            <Field label="Collection Date" value={shipment.shipment?.collectionDate} />
          </Section>
        </div>
      </ViewDetailsDialog>
    </>
  );
}