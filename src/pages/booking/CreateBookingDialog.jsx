import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Check,
  Clock,
  Receipt,
  Plus,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { useCreateAdminBooking } from "@/hooks/studio/useBookings";
import { useGraduates } from "@/hooks/user/useGraduates";
import { usePackages } from "@/hooks/studio/usePackages";
import { useSessions } from "@/hooks/studio/useSessions";
import { useAddons } from "@/hooks/studio/useAddons";

const MALAYSIA_STATES = [
  { code: "MY-01", name: "Johor" },
  { code: "MY-02", name: "Kedah" },
  { code: "MY-03", name: "Kelantan" },
  { code: "MY-04", name: "Melaka" },
  { code: "MY-05", name: "Negeri Sembilan" },
  { code: "MY-06", name: "Pahang" },
  { code: "MY-07", name: "Pulau Pinang" },
  { code: "MY-08", name: "Perak" },
  { code: "MY-09", name: "Perlis" },
  { code: "MY-10", name: "Selangor" },
  { code: "MY-11", name: "Terengganu" },
  { code: "MY-12", name: "Sabah" },
  { code: "MY-13", name: "Sarawak" },
  { code: "MY-14", name: "Wilayah Persekutuan Kuala Lumpur" },
  { code: "MY-15", name: "Wilayah Persekutuan Labuan" },
  { code: "MY-16", name: "Wilayah Persekutuan Putrajaya" },
];

const EMPTY_RECEIVER = {
  name: "",
  phone_number: "",
  email: "",
  address_1: "",
  address_2: "",
  postcode: "",
  city: "",
  subdivision_code: "",
  country_code: "MY",
};

const EMPTY_FORM = { graduate: "", package: "", session: "" };

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

function OrderSummary({ packages, addonsList, selectedPackageId, selectedAddonIds }) {
  const selectedPkg = packages.find((p) => p._id === selectedPackageId);
  const selectedAddons = addonsList.filter((a) => selectedAddonIds.includes(a._id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (a.price ?? 0), 0);
  const total = (selectedPkg?.price ?? 0) + addonsTotal;

  if (!selectedPkg) return null;

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
      <SectionLabel>Order Summary</SectionLabel>
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{selectedPkg.name}</span>
          <span className="tabular-nums font-medium">RM {selectedPkg.price.toFixed(2)}</span>
        </div>
        {selectedAddons.map((addon) => (
          <div key={addon._id} className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Plus size={11} />
              {addon.name}
            </span>
            <span className="tabular-nums text-muted-foreground">
              RM {(addon.price ?? 0).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex justify-between items-center font-semibold">
        <span className="flex items-center gap-1.5 text-sm">
          <Receipt size={14} />
          Total
        </span>
        <span className="tabular-nums">RM {total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export const CreateBookingDialog = ({ open, onOpenChange }) => {
  const createAdminBooking = useCreateAdminBooking();

  // limit:200 so the graduate combobox has enough records; enabled gates fetching to when dialog is open
  const { data: graduatesData, isLoading: graduatesLoading } = useGraduates({
    limit: 200,
    enabled: open,
  });
  const { data: packagesData } = usePackages({ enabled: open });
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions(null, {
    enabled: open,
  });
  const { data: addonsData, isLoading: addonsLoading } = useAddons({ enabled: open });

  const graduates = graduatesData?.data || [];
  const packages = packagesData?.data || [];
  const sessions = sessionsData?.data || [];
  const addonsList = addonsData?.data || [];

  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [receiver, setReceiver] = useState(EMPTY_RECEIVER);
  const [openGraduate, setOpenGraduate] = useState(false);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setSelectedDate(null);
      setSelectedAddons([]);
      setReceiver(EMPTY_RECEIVER);
      setOpenGraduate(false);
    }
    onOpenChange(isOpen);
  };

  const availableDates = [
    ...new Set(
      sessions
        .filter((s) => s.bookedCount < s.capacity)
        .map((s) => new Date(s.date).toDateString())
    ),
  ].map((d) => new Date(d));

  const availableSessions = selectedDate
    ? sessions.filter(
        (s) =>
          new Date(s.date).toDateString() === selectedDate.toDateString() &&
          s.bookedCount < s.capacity
      )
    : [];

  const firstAvailableDate = availableDates[0] ?? new Date();

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAddon = (id, checked) => {
    setSelectedAddons((prev) =>
      checked ? [...prev, id] : prev.filter((a) => a !== id)
    );
  };

  const handleSave = () => {
    if (!formData.graduate || !formData.package || !formData.session) {
      toast.error("Please select a graduate, package, and session");
      return;
    }

    const required = ["name", "phone_number", "email", "address_1", "postcode", "city", "subdivision_code"];
    if (!required.every((f) => receiver[f]?.trim())) {
      toast.error("Please fill in all required delivery address fields");
      return;
    }

    createAdminBooking.mutate(
      {
        graduate: formData.graduate,
        package: formData.package,
        session: formData.session,
        paymentMethod: "cash",
        addons: selectedAddons,
        shipment: {
          receiver: {
            name: receiver.name,
            phone_number_country_code: "MY",
            phone_number: receiver.phone_number,
            email: receiver.email,
            address_1: receiver.address_1,
            address_2: receiver.address_2 || "",
            postcode: receiver.postcode,
            city: receiver.city,
            subdivision_code: receiver.subdivision_code,
            country_code: "MY",
          },
        },
      },
      { onSuccess: () => handleOpenChange(false) }
    );
  };

  return (
    <CreateDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Create New Booking"
      description="Register a booking on behalf of a graduate"
      onSave={handleSave}
      isLoading={createAdminBooking.isPending}
      saveLabel="Create Booking"
      className="sm:max-w-2xl"
    >
      <div className="max-h-[72vh] overflow-y-auto pr-1 space-y-5">

        {/* Graduate */}
        <div className="space-y-3">
          <SectionLabel>Graduate</SectionLabel>
          <Field>
            <FieldLabel>Select Graduate</FieldLabel>
            <Popover open={openGraduate} onOpenChange={setOpenGraduate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                >
                  {formData.graduate
                    ? graduates.find((g) => g._id === formData.graduate)?.fullName
                    : "Search by name or email…"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Type name or email…" />
                  {graduatesLoading ? (
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-3/4" />
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No graduate found.</CommandEmpty>
                      <CommandGroup className="max-h-56 overflow-auto">
                        {graduates.map((grad) => (
                          <CommandItem
                            key={grad._id}
                            value={`${grad.fullName} ${grad.email}`}
                            onSelect={() => {
                              setFormData((prev) => ({ ...prev, graduate: grad._id }));
                              setOpenGraduate(false);
                            }}
                          >
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-medium">{grad.fullName}</span>
                              <span className="text-xs text-muted-foreground truncate">
                                {grad.email}
                              </span>
                            </div>
                            {formData.graduate === grad._id && (
                              <Check className="ml-2 h-4 w-4 shrink-0" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        {/* Package & Session */}
        <div className="rounded-lg border p-4 space-y-4">
          <SectionLabel>Package &amp; Session</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Package</FieldLabel>
              <Select
                value={formData.package}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, package: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg._id} value={pkg._id}>
                      {pkg.name} — RM {pkg.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Session Date</FieldLabel>
              {sessionsLoading ? (
                <Skeleton className="h-9 w-full rounded-md" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      defaultMonth={firstAvailableDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setFormData((prev) => ({ ...prev, session: "" }));
                        }
                      }}
                      disabled={(date) =>
                        !availableDates.some(
                          (d) => d.toDateString() === date.toDateString()
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel>Session Time</FieldLabel>
            {sessionsLoading ? (
              <Skeleton className="h-9 w-full rounded-md" />
            ) : selectedDate ? (
              <Select
                value={formData.session}
                disabled={availableSessions.length === 0}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, session: v }))}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      availableSessions.length === 0
                        ? "No sessions available on this date"
                        : "Choose a time slot"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableSessions.map((s) => {
                    const slotsLeft = s.capacity - s.bookedCount;
                    return (
                      <SelectItem key={s._id} value={s._id}>
                        <div className="flex items-center justify-between gap-4 w-full">
                          <span>
                            {s.startTime} – {s.endTime}
                          </span>
                          <Badge
                            variant={slotsLeft <= 2 ? "destructive" : "secondary"}
                            className="ml-auto text-xs"
                          >
                            {slotsLeft} slot{slotsLeft === 1 ? "" : "s"} left
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-dashed text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                Pick a date first
              </div>
            )}
          </Field>
        </div>

        {/* Add-ons */}
        <div className="rounded-lg border p-4 space-y-3">
          <SectionLabel>Add-ons</SectionLabel>
          {addonsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ) : addonsList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No add-ons available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {addonsList.map((addon) => (
                <div
                  key={addon._id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={addon._id}
                    checked={selectedAddons.includes(addon._id)}
                    onCheckedChange={(checked) => toggleAddon(addon._id, checked)}
                  />
                  <Label htmlFor={addon._id} className="flex-1 cursor-pointer font-normal text-sm">
                    {addon.name}{" "}
                    <span className="text-muted-foreground">— RM {addon.price}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <OrderSummary
          packages={packages}
          addonsList={addonsList}
          selectedPackageId={formData.package}
          selectedAddonIds={selectedAddons}
        />

        {/* Delivery Address */}
        <div className="rounded-lg border p-4 space-y-4">
          <SectionLabel>Delivery Address</SectionLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Recipient full name"
                value={receiver.name}
                onChange={handleReceiverChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="flex">
                <div className="bg-muted px-3 flex items-center text-sm border border-r-0 border-input rounded-l-md shrink-0">
                  +60
                </div>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="123456789"
                  value={receiver.phone_number}
                  onChange={handleReceiverChange}
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="recipient@email.com"
              value={receiver.email}
              onChange={handleReceiverChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_1">
              Address Line 1 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address_1"
              name="address_1"
              placeholder="House number, street name"
              value={receiver.address_1}
              onChange={handleReceiverChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_2">Address Line 2 (Optional)</Label>
            <Input
              id="address_2"
              name="address_2"
              placeholder="Floor, unit, landmark"
              value={receiver.address_2}
              onChange={handleReceiverChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postcode">
                Postcode <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postcode"
                name="postcode"
                placeholder="12345"
                value={receiver.postcode}
                onChange={handleReceiverChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="City name"
                value={receiver.city}
                onChange={handleReceiverChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdivision_code">
                State <span className="text-destructive">*</span>
              </Label>
              <Select
                value={receiver.subdivision_code}
                onValueChange={(v) =>
                  setReceiver((prev) => ({ ...prev, subdivision_code: v }))
                }
              >
                <SelectTrigger id="subdivision_code">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {MALAYSIA_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </CreateDialog>
  );
};
