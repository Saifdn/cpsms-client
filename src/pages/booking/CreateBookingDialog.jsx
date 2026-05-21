// components/dialog/CreateBookingDialog.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

// Hooks
import { useCreateBooking } from "@/hooks/studio/useBookings";
import { useGraduates } from "@/hooks/user/useGraduates";
import { usePackages } from "@/hooks/studio/usePackages";
import { useSessions } from "@/hooks/studio/useSessions";

export const CreateBookingDialog = ({ open, onOpenChange }) => {
  const createBooking = useCreateBooking();

  // Only fetch data when dialog is open
  const { data: graduatesData } = useGraduates({ enabled: open });
  const { data: packagesData } = usePackages({ enabled: open });
  const { data: sessionsData } = useSessions({ enabled: open });

  const graduates = graduatesData?.data || [];
  const packages = packagesData?.data || [];
  const sessions = sessionsData?.data || [];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    graduate: "",
    package: "",
    session: "",
  });
  const [openGraduate, setOpenGraduate] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({ graduate: "", package: "", session: "" });
      setSelectedDate(new Date());
      setOpenGraduate(false);
    }
  }, [open]);

  // Filter available sessions
  const availableSessions = sessions.filter(
    (s) =>
      new Date(s.date).toDateString() === selectedDate.toDateString() &&
      s.bookedCount < s.capacity
  );

  const availableDates = [
    ...new Set(
      sessions
        .filter((s) => s.bookedCount < s.capacity)
        .map((s) => new Date(s.date).toDateString())
    ),
  ].map((d) => new Date(d));

  const handleSave = () => {
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
          console.log("Booking created successfully ✅");
          onOpenChange(false);
        },
        onError: (err) => {
          console.error("ERROR ❌", err);
          alert("Failed to create booking");
        },
      }
    );
  };

  return (
    <CreateDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Booking"
      description="Register a booking for a graduate"
      onSave={handleSave}
      isLoading={createBooking.isPending}
      saveLabel="Create Booking"
    >
      <div className="space-y-8">
        {/* Graduate */}
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

        {/* Date & Session (same as before) */}
        <Field>
          <FieldLabel>Date</FieldLabel>
          <Popover>
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
                mode="single"
                selected={selectedDate}
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
        </Field>

        <Field>
          <FieldLabel>Available Session Time</FieldLabel>
          <Select
            value={formData.session}
            onValueChange={(v) => setFormData((prev) => ({ ...prev, session: v }))}
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
                <SelectItem value="none" disabled>
                  No sessions available on this date
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </CreateDialog>
  );
};