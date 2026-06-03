import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { MALAYSIA_STATES_MAP } from "@/lib/malaysia";

function formatPhone(countryCode, phoneNumber) {
  if (!phoneNumber) return null;
  const parsed = parsePhoneNumberFromString(String(phoneNumber), countryCode);
  return parsed?.formatInternational() ?? phoneNumber;
}

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

export function FrameShipmentActionsCell({ row }) {
  const record = row.original;
  const [showViewDialog, setShowViewDialog] = useState(false);

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
            <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ViewDetailsDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        title="Frame Shipment Details"
        data={record}
      >
        <div className="space-y-5">
          {/* Order */}
          <Section title="Order">
            <Field label="Order No." value={record.orderNumber} mono />
            <Field label="Graduate" value={record.graduate?.fullName} />
            <Field label="Email" value={record.graduate?.email} />
            <Field label="Phone" value={parsePhoneNumberFromString(record.graduate?.phone ?? "")?.formatInternational() ?? record.graduate?.phone} />
            {record.items?.length > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="text-sm font-medium">
                  {record.items.map((i) => `${i.frame?.name ?? "Frame"} ×${i.quantity}`).join(", ")}
                </p>
              </div>
            )}
          </Section>

          <div className="border-t" />

          {/* Receiver */}
          <Section title="Receiver">
            <Field label="Name" value={record.shipment?.receiver?.name} />
            <Field label="Phone" value={formatPhone(record.shipment?.receiver?.phone_number_country_code, record.shipment?.receiver?.phone_number)} />
            {(() => {
              const r = record.shipment?.receiver;
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
        </div>
      </ViewDetailsDialog>
    </>
  );
}
