import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClockTimePicker } from "@/components/ui/clock-time-picker";
import { cn } from "@/lib/utils";

export function GenerateSessionForm({ control, register, errors, disabled }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Date Range
        </p>
        <Controller
          control={control}
          name="dateRange"
          rules={{
            validate: (v) =>
              (v?.from && v?.to) || "Please select a start and end date",
          }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "dd MMM yyyy")} —{" "}
                          {format(field.value.to, "dd MMM yyyy")}
                        </>
                      ) : (
                        format(field.value.from, "dd MMM yyyy")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={1}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateRange && (
                <p className="text-xs text-destructive">{errors.dateRange.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Daily Hours
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              Start Time <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={control}
              name="startTime"
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <ClockTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="Start time"
                />
              )}
            />
            {errors.startTime && (
              <p className="text-xs text-destructive mt-1">{errors.startTime.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>
              End Time <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={control}
              name="endTime"
              rules={{ required: "End time is required" }}
              render={({ field }) => (
                <ClockTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="End time"
                />
              )}
            />
            {errors.endTime && (
              <p className="text-xs text-destructive mt-1">{errors.endTime.message}</p>
            )}
          </Field>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Break Time{" "}
          <span className="text-xs normal-case font-normal">(optional)</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Break Start</FieldLabel>
            <Controller
              control={control}
              name="breakStartTime"
              render={({ field }) => (
                <ClockTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="Break start"
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Break End</FieldLabel>
            <Controller
              control={control}
              name="breakEndTime"
              render={({ field }) => (
                <ClockTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="Break end"
                />
              )}
            />
          </Field>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Session Settings
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="duration">
              Duration (minutes) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="duration"
              type="number"
              min={15}
              disabled={disabled}
              {...register("duration", {
                required: "Duration is required",
                min: { value: 15, message: "Minimum 15 minutes" },
                valueAsNumber: true,
              })}
            />
            {errors.duration && (
              <p className="text-xs text-destructive mt-1">{errors.duration.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="capacity">
              Capacity (pax) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="capacity"
              type="number"
              min={1}
              disabled={disabled}
              {...register("capacity", {
                required: "Capacity is required",
                min: { value: 1, message: "Minimum 1" },
                valueAsNumber: true,
              })}
            />
            {errors.capacity && (
              <p className="text-xs text-destructive mt-1">{errors.capacity.message}</p>
            )}
          </Field>
        </div>
      </div>
    </div>
  );
}
