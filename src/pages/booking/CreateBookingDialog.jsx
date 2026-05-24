// pages/booking/CreateBookingDialog.jsx
import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { CalendarIcon, Check, Clock } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

// Hooks
import { useCreateAdminBooking } from "@/hooks/studio/useBookings";
import { useGraduates } from "@/hooks/user/useGraduates";
import { usePackages } from "@/hooks/studio/usePackages";
import { useSessions } from "@/hooks/studio/useSessions";
import { useAddons } from "@/hooks/studio/useAddons";

const malaysiaStates = [
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

const emptyReceiver = {
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

export const CreateBookingDialog = ({ open, onOpenChange }) => {
  const createAdminBooking = useCreateAdminBooking();

  const { data: graduatesData } = useGraduates({ enabled: open });
  const { data: packagesData } = usePackages({ enabled: open });
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions(null, { enabled: open });
  const { data: addonsData, isLoading: addonsLoading } = useAddons({ enabled: open });

  const graduates = graduatesData?.data || [];
  const packages = packagesData?.data || [];
  const sessions = sessionsData?.data || [];
  const addonsList = addonsData?.data || [];

  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ graduate: "", package: "", session: "" });
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [receiver, setReceiver] = useState(emptyReceiver);
  const [openGraduate, setOpenGraduate] = useState(false);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setFormData({ graduate: "", package: "", session: "" });
      setSelectedDate(null);
      setSelectedAddons([]);
      setReceiver(emptyReceiver);
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

    const requiredFields = ["name", "phone_number", "email", "address_1", "postcode", "city", "subdivision_code"];
    const receiverComplete = requiredFields.every((f) => receiver[f]?.trim());
    if (!receiverComplete) {
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
      {
        onSuccess: () => handleOpenChange(false),
      }
    );
  };

  return (
    <CreateDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Create New Booking"
      description="Register a booking for a graduate"
      onSave={handleSave}
      isLoading={createAdminBooking.isPending}
      saveLabel="Create Booking"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-6">
        {/* Graduate */}
        <Field>
          <FieldLabel>Graduate</FieldLabel>
          <Popover open={openGraduate} onOpenChange={setOpenGraduate}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {formData.graduate
                  ? graduates.find((g) => g._id === formData.graduate)?.fullName
                  : "Search and select graduate..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Type name or email..." />
                <CommandEmpty>No graduate found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {graduates.map((grad) => (
                    <CommandItem
                      key={grad._id}
                      value={`${grad.fullName} ${grad.email}`}
                      onSelect={() => {
                        setFormData((prev) => ({ ...prev, graduate: grad._id }));
                        setOpenGraduate(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{grad.fullName}</span>
                        <span className="text-xs text-muted-foreground">{grad.email}</span>
                      </div>
                      {formData.graduate === grad._id && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </Field>

        {/* Package */}
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

        {/* Session Details */}
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Session Details
          </p>

          <Field>
            <FieldLabel>Date</FieldLabel>
            {sessionsLoading ? (
              <Skeleton className="h-9 w-full rounded-md" />
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a session date"}
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
                      !availableDates.some((d) => d.toDateString() === date.toDateString())
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          </Field>

          <Field>
            <FieldLabel>Session Time</FieldLabel>
            {sessionsLoading ? (
              <Skeleton className="h-9 w-full rounded-md" />
            ) : !selectedDate ? (
              <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-dashed text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Pick a date first
              </div>
            ) : (
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
                          <span>{s.startTime} – {s.endTime}</span>
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
            )}
          </Field>
        </div>

        {/* Add-ons */}
        <div className="rounded-lg border p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Add-ons
          </p>
          {addonsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ) : addonsList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No add-ons available</p>
          ) : (
            addonsList.map((addon) => (
              <div key={addon._id} className="flex items-center gap-3">
                <Checkbox
                  id={addon._id}
                  checked={selectedAddons.includes(addon._id)}
                  onCheckedChange={(checked) => toggleAddon(addon._id, checked)}
                />
                <Label htmlFor={addon._id} className="flex-1 cursor-pointer font-normal">
                  {addon.name}{" "}
                  <span className="text-muted-foreground">— RM {addon.price}</span>
                </Label>
              </div>
            ))
          )}
        </div>

        {/* Delivery Address */}
        <div className="rounded-lg border p-4 space-y-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Delivery Address
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={receiver.name}
                onChange={handleReceiverChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <div className="flex">
                <div className="bg-muted px-3 flex items-center text-sm border border-r-0 border-input rounded-l-md">
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
            <Label htmlFor="email">Email Address *</Label>
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
            <Label htmlFor="address_1">Address Line 1 *</Label>
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
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                name="postcode"
                placeholder="12345"
                value={receiver.postcode}
                onChange={handleReceiverChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="City name"
                value={receiver.city}
                onChange={handleReceiverChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdivision_code">State *</Label>
              <Select
                value={receiver.subdivision_code}
                onValueChange={(v) => setReceiver((prev) => ({ ...prev, subdivision_code: v }))}
              >
                <SelectTrigger id="subdivision_code">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {malaysiaStates.map((state) => (
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
