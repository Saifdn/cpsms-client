import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function GenerateSessionForm({ register, errors, disabled }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Date Range
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="fromDate">
              From Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="fromDate"
              type="date"
              disabled={disabled}
              {...register("fromDate", { required: "From date is required" })}
            />
            {errors.fromDate && (
              <p className="text-xs text-destructive mt-1">{errors.fromDate.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="toDate">
              To Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="toDate"
              type="date"
              disabled={disabled}
              {...register("toDate", { required: "To date is required" })}
            />
            {errors.toDate && (
              <p className="text-xs text-destructive mt-1">{errors.toDate.message}</p>
            )}
          </Field>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Daily Hours
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="startTime">
              Start Time <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="startTime"
              type="time"
              disabled={disabled}
              {...register("startTime", { required: "Start time is required" })}
            />
            {errors.startTime && (
              <p className="text-xs text-destructive mt-1">{errors.startTime.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="endTime">
              End Time <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="endTime"
              type="time"
              disabled={disabled}
              {...register("endTime", { required: "End time is required" })}
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
            <FieldLabel htmlFor="breakStartTime">Break Start</FieldLabel>
            <Input
              id="breakStartTime"
              type="time"
              disabled={disabled}
              {...register("breakStartTime")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="breakEndTime">Break End</FieldLabel>
            <Input
              id="breakEndTime"
              type="time"
              disabled={disabled}
              {...register("breakEndTime")}
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
