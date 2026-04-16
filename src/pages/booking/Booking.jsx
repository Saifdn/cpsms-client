import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

import { DataTable } from "@/components/ui/data-table";
import { bookingColumns } from "@/components/columns/bookingColumns";
import { CreateDialog } from "@/components/dialog/CreateDialog";

import { useBookings, useCreateBooking } from "@/hooks/studio/useBookings";
import { useGraduates } from "@/hooks/user/useGraduates";
import { usePackages } from "@/hooks/studio/usePackages";
import { useSessions } from "@/hooks/studio/useSessions";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { CalendarIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";

const Booking = () => {
  const { data: bookingsData, isLoading } = useBookings();
  const createBooking = useCreateBooking();

  const { data: graduatesData } = useGraduates();
  const { data: packagesData } = usePackages();
  const { data: sessionsData } = useSessions();

  const bookings = bookingsData?.data || [];
  const graduates = graduatesData?.data || [];
  const packages = packagesData?.data || [];
  const allSessions = sessionsData?.data || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);

  const [formData, setFormData] = useState({
    graduate: "",
    package: "",
    session: "",
  });
  const [openGraduate, setOpenGraduate] = useState(false);

  // Filter sessions by selected date
  const availableSessions = allSessions.filter(
    (s) =>
      new Date(s.date).toDateString() === selectedDate.toDateString() &&
      s.bookedCount < s.capacity,
  );

  const availableDates = [
    ...new Set(
      allSessions
        .filter((s) => s.bookedCount < s.capacity)
        .map((s) => new Date(s.date).toDateString()),
    ),
  ].map((d) => new Date(d));

  const handleCreateBooking = () => {
		console.log(formData);
		console.log(createBooking.isPending);
    if (!formData.graduate || !formData.package || !formData.session) {
      alert("Please select Graduate, Package and Session");
      return;
    }

    createBooking.mutate(
  {
    graduate: formData.graduate,
    package: formData.package,
    session: formData.session,
    status: "booked",
  },
  {
    onSuccess: () => {
      console.log("SUCCESS ✅");
      setShowCreateDialog(false);
      setFormData({ graduate: "", package: "", session: "" });
      setSearchTerm("");
    },
    onError: (err) => {
      console.error("ERROR ❌", err);
      alert("Failed to create booking");
    },
  }
);
  };

  return (
    <Page>
      <PageHeader
        title="Booking Management"
        description="Help graduates book sessions"
      />

      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>

      <DataTable
        title="All Bookings"
        description="List of all graduate bookings with status"
        columns={bookingColumns}
        data={bookings}
        isLoading={isLoading}
      />

      {/* Create Booking Dialog */}
      <CreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Booking"
        description="Register a booking for a graduate"
        onSave={handleCreateBooking}
        isLoading={createBooking.isPending}
        saveLabel="Create Booking"
      >
        <div className="space-y-8">
          {/* Graduate - Clickable Searchable Dropdown */}
          <Field>
            <FieldLabel>Graduate</FieldLabel>

            <Popover open={openGraduate} onOpenChange={setOpenGraduate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {formData.graduate
                    ? graduates.find((g) => g._id === formData.graduate)
                        ?.fullName
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
                          setFormData({ ...formData, graduate: grad._id });
                          setOpenGraduate(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{grad.fullName}</span>
                          <span className="text-xs text-muted-foreground">
                            {grad.email}
                          </span>
                        </div>

                        {formData.graduate === grad._id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
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
              onValueChange={(v) => setFormData({ ...formData, package: v })}
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

          {/* Date Picker */}
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  className="w-50"
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setOpenCalendar(false);
                      setFormData((prev) => ({ ...prev, session: "" }));
                    }
                  }}
                  disabled={(date) => {
                    return !availableDates.some(
                      (d) => d.toDateString() === date.toDateString(),
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* Available Sessions */}
          <Field>
            <FieldLabel>Available Session Time</FieldLabel>
            <Select
              value={formData.session}
              onValueChange={(v) => setFormData({ ...formData, session: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose available session" />
              </SelectTrigger>
              <SelectContent>
                {availableSessions.length > 0 ? (
                  availableSessions.map((session) => (
                    <SelectItem key={session._id} value={session._id}>
                      {session.startTime} — {session.endTime} (
                      {session.capacity - session.bookedCount} slots left)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No sessions available on this date
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Booking;
