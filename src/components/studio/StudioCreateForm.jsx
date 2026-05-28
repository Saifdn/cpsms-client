import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function StudioCreateForm({ register, errors, disabled }) {
  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="name">Studio Name</FieldLabel>
        <Input
          id="name"
          placeholder="Studio A"
          disabled={disabled}
          {...register("name", { required: "Studio name is required" })}
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <Input
          id="location"
          placeholder="Building A, Floor 2"
          disabled={disabled}
          {...register("location", { required: "Location is required" })}
        />
        {errors.location && (
          <p className="text-xs text-destructive mt-1">{errors.location.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
        <Textarea
          id="description"
          placeholder="Describe the studio..."
          rows={3}
          disabled={disabled}
          {...register("description")}
        />
      </Field>
    </div>
  );
}
