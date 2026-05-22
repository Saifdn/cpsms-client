"use client";

import { useState } from "react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

import {
  ChevronDownIcon,
  Truck,
  Package,
  CalendarDays,
  Wallet,
  User,
  Bell,
  MessageSquare,
  Mail,
  MessageCircleMore,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useWalletBalance } from "@/hooks/shipment/useShipments";

const UNIT_LABELS = { weight: "kg", height: "cm", length: "cm", width: "cm" };

const ShipmentConfirmationModal = ({
  open,
  onOpenChange,
  service,
  totalBookings,
  onConfirm,
  isProcessing,
}) => {
  const [date, setDate] = useState(new Date());
  const [logoErrored, setLogoErrored] = useState(false);

  const { data: walletData } = useWalletBalance();
  const walletBalance = walletData?.data?.wallet[0]?.balance || 0;

  const [sender, setSender] = useState({
    name: "Konvokesyen-70",
    company: "Kelab Fotokreatif UTM",
    phone_number_country_code: "MY",
    phone_number: "1126760658",
    email: "admin@kfk.com",
    address_1: "Bangunan Kesatuan Mahasiswa (SUB)",
    address_2: "Univerisiti Teknologi Malaysia",
    postcode: "81310",
    city: "Johor Bahru",
    subdivision_code: "MY-01",
    country_code: "MY",
  });

  const [packageDetails, setPackageDetails] = useState({
    weight: 0.5,
    height: 5,
    length: 5,
    width: 5,
  });

  const [features, setFeatures] = useState({
    sms_tracking: false,
    email_tracking: true,
    whatsapp_tracking: true,
  });

  if (!service) return null;

  const totalAmount = parseFloat(service.totalAmount);
  const remainingBalance = walletBalance - totalAmount;
  const hasSufficientFunds = remainingBalance >= 0;

  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

  const handleSubmit = () => {
    onConfirm({ collectionDate: formattedDate, sender, packageDetails, features });
  };

  const activeFeatureCount = Object.values(features).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Confirm Shipment Submission</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Review the details below before submitting{" "}
            <span className="font-medium text-foreground">{totalBookings}</span> shipments.
          </p>
        </DialogHeader>

        {/* Financial Summary */}
        <div className="border rounded-2xl p-5 bg-muted/30 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Financial Summary
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Wallet Balance</span>
            <span className="font-medium">RM {walletBalance.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Cost</span>
            <span className="font-medium text-primary">− RM {totalAmount.toFixed(2)}</span>
          </div>

          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-medium text-sm">Balance After Payment</span>
            <span
              className={cn(
                "text-lg font-bold",
                hasSufficientFunds ? "text-emerald-600" : "text-destructive"
              )}
            >
              RM {remainingBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Service Summary */}
        <div className="border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {service.courierLogo && !logoErrored ? (
                <div className="w-14 h-14 bg-white border rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1">
                  <img
                    src={service.courierLogo}
                    alt={service.courierName}
                    className="w-full h-full object-contain"
                    onError={() => setLogoErrored(true)}
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Truck className="h-6 w-6 text-muted-foreground" />
                </div>
              )}

              <div className="min-w-0">
                <div className="font-semibold">{service.courierName}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{service.serviceName}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-primary">
                RM {totalAmount.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                RM {parseFloat(service.averagePrice).toFixed(2)} × {totalBookings} shipments
              </div>
            </div>
          </div>
        </div>

        {/* Collection Date */}
        <div className="border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Collection Date</h3>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-between text-left font-normal"
              >
                {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                className="w-60"
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Editable Sections */}
        <Accordion type="single" collapsible className="space-y-3">
          {/* Sender */}
          <AccordionItem value="sender" className="border rounded-2xl px-5">
            <AccordionTrigger className="gap-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Sender Information</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { field: "name", label: "Name" },
                  { field: "company", label: "Company" },
                  { field: "phone_number", label: "Phone Number" },
                  { field: "email", label: "Email" },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <Label className="text-xs text-muted-foreground mb-1">{label}</Label>
                    <Input
                      value={sender[field]}
                      onChange={(e) => setSender({ ...sender, [field]: e.target.value })}
                    />
                  </div>
                ))}

                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1">Address Line 1</Label>
                  <Input
                    value={sender.address_1}
                    onChange={(e) => setSender({ ...sender, address_1: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1">Address Line 2</Label>
                  <Input
                    value={sender.address_2}
                    onChange={(e) => setSender({ ...sender, address_2: e.target.value })}
                  />
                </div>

                {[
                  { field: "postcode", label: "Postcode" },
                  { field: "city", label: "City" },
                  { field: "subdivision_code", label: "State Code" },
                  { field: "country_code", label: "Country Code" },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <Label className="text-xs text-muted-foreground mb-1">{label}</Label>
                    <Input
                      value={sender[field]}
                      onChange={(e) => setSender({ ...sender, [field]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Package */}
          <AccordionItem value="package" className="border rounded-2xl px-5">
            <AccordionTrigger className="gap-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Package Details</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4">
              <div className="grid grid-cols-4 gap-4">
                {["weight", "height", "length", "width"].map((field) => (
                  <div key={field}>
                    <Label className="text-xs text-muted-foreground mb-1 capitalize">{field}</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={packageDetails[field]}
                        onChange={(e) =>
                          setPackageDetails({ ...packageDetails, [field]: e.target.value })
                        }
                        className="pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                        {UNIT_LABELS[field]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Features */}
          <AccordionItem value="features" className="border rounded-2xl px-5">
            <AccordionTrigger className="gap-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Shipment Features</span>
                {activeFeatureCount > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {activeFeatureCount} active
                  </Badge>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 space-y-4">
              {[
                {
                  key: "sms_tracking",
                  label: "SMS Tracking",
                  desc: "Send SMS tracking updates",
                  Icon: MessageSquare,
                },
                {
                  key: "email_tracking",
                  label: "Email Tracking",
                  desc: "Send email tracking updates",
                  Icon: Mail,
                },
                {
                  key: "whatsapp_tracking",
                  label: "WhatsApp Tracking",
                  desc: "Send WhatsApp tracking updates",
                  Icon: MessageCircleMore,
                },
              ].map((feature) => {
                const FeatureIcon = feature.Icon;
                return (
                  <div key={feature.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FeatureIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{feature.label}</div>
                        <div className="text-xs text-muted-foreground">{feature.desc}</div>
                      </div>
                    </div>
                    <Switch
                      checked={features[feature.key]}
                      onCheckedChange={(value) => setFeatures({ ...features, [feature.key]: value })}
                    />
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Insufficient funds warning */}
        {!hasSufficientFunds && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Insufficient wallet balance. Top up at least{" "}
              <strong>RM {Math.abs(remainingBalance).toFixed(2)}</strong> to proceed.
            </span>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isProcessing || !hasSufficientFunds}
            className="min-w-40"
          >
            {isProcessing ? "Submitting..." : "Confirm & Submit Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentConfirmationModal;
