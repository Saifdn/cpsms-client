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

import {
  ChevronDownIcon,
  Truck,
  Package,
  CalendarDays,
  Wallet,
} from "lucide-react";

import { useWalletBalance } from "@/hooks/shipment/useShipments";

const ShipmentConfirmationModal = ({
  open,
  onOpenChange,
  service,
  totalBookings,
  onConfirm,
  isProcessing,
}) => {
  const [date, setDate] = useState(new Date());

  const { data: walletData } = useWalletBalance();
  const walletBalance = walletData?.data?.wallet[0]?.balance || 0;

  // Sender
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

  // Package
  const [packageDetails, setPackageDetails] = useState({
    weight: 0.5,
    height: 5,
    length: 5,
    width: 5,
  });

  // Features
  const [features, setFeatures] = useState({
    sms_tracking: false,
    email_tracking: true,
    whatsapp_tracking: true,
  });

  if (!service) return null;

  const formattedDate = date
    ? format(date, "yyyy-MM-dd")
    : null;

  const handleSubmit = () => {
    onConfirm({
      collectionDate: formattedDate,
      sender,
      packageDetails,
      features,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Confirm Shipment Submission
          </DialogTitle>
        </DialogHeader>

        <div className="border rounded-2xl p-5 bg-muted/30">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Wallet Balance
              </span>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-primary">
                RM {walletBalance.toFixed(2)}
              </div>

            </div>
          </div>
        </div>

        {/* Service Summary */}
        <div className="border rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>

              <div>
                <div className="font-semibold text-lg">
                  {service.courierName}
                </div>

                <div className="text-muted-foreground">
                  {service.serviceName}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                RM {service.totalAmount}
              </div>

              <div className="text-sm text-muted-foreground">
                {totalBookings} Shipments
              </div>
            </div>
          </div>
        </div>

        {/* Collection Date */}
        <div className="border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <h3 className="font-semibold">
              Collection Date
            </h3>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="w-[240px] justify-between text-left font-normal"
              >
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}

                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                className="w-60"
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
                disabled={(date) =>
                  date <
                  new Date(
                    new Date().setHours(0, 0, 0, 0)
                  )
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Editable Sections */}
        <Accordion
          type="single"
          collapsible
          className="space-y-4"
        >
          {/* Sender */}
          <AccordionItem
            value="sender"
            className="border rounded-2xl px-5"
          >
            <AccordionTrigger>
              Sender Information
            </AccordionTrigger>

            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>

                  <Input
                    value={sender.name}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Company</Label>

                  <Input
                    value={sender.company}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        company: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>

                  <Input
                    value={sender.phone_number}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Email</Label>

                  <Input
                    value={sender.email}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label>Address Line 1</Label>

                  <Input
                    value={sender.address_1}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        address_1: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Address Line 2</Label>

                  <Input
                    value={sender.address_2}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        address_2: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Postcode</Label>

                  <Input
                    value={sender.postcode}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        postcode: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>City</Label>

                  <Input
                    value={sender.city}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        city: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>State</Label>

                  <Input
                    value={sender.subdivision_code}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        subdivision_code: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Country</Label>

                  <Input
                    value={sender.country_code}
                    onChange={(e) =>
                      setSender({
                        ...sender,
                        country_code: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Package */}
          <AccordionItem
            value="package"
            className="border rounded-2xl px-5"
          >
            <AccordionTrigger>
              Package Details
            </AccordionTrigger>

            <AccordionContent className="pt-4">
              <div className="grid grid-cols-4 gap-4">
                {["weight", "height", "length", "width"].map(
                  (field) => (
                    <div key={field}>
                      <Label className="capitalize">
                        {field}
                      </Label>

                      <Input
                        type="number"
                        value={packageDetails[field]}
                        onChange={(e) =>
                          setPackageDetails({
                            ...packageDetails,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Features */}
          <AccordionItem
            value="features"
            className="border rounded-2xl px-5"
          >
            <AccordionTrigger>
              Shipment Features
            </AccordionTrigger>

            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    SMS Tracking
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Send SMS tracking updates
                  </div>
                </div>

                <Switch
                  checked={features.sms_tracking}
                  onCheckedChange={(value) =>
                    setFeatures({
                      ...features,
                      sms_tracking: value,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    Email Tracking
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Send email tracking updates
                  </div>
                </div>

                <Switch
                  checked={features.email_tracking}
                  onCheckedChange={(value) =>
                    setFeatures({
                      ...features,
                      email_tracking: value,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    WhatsApp Tracking
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Send WhatsApp tracking updates
                  </div>
                </div>

                <Switch
                  checked={features.whatsapp_tracking}
                  onCheckedChange={(value) =>
                    setFeatures({
                      ...features,
                      whatsapp_tracking: value,
                    })
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Submitting..."
              : "Confirm & Submit Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentConfirmationModal;