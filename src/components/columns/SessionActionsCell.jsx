import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { EditDialog } from "@/components/dialog/EditDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

import { useUpdateSession, useDeleteSession } from "@/hooks/studio/useSessions";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SessionActionsCell({ row }) {
  const session = row.original;
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      startTime: session.startTime || "",
      endTime: session.endTime || "",
      duration: session.duration || 60,
      capacity: session.capacity || 5,
    },
  });

  const handleEditOpenChange = (open) => {
    setShowEditDialog(open);
    if (open) {
      form.reset({
        startTime: session.startTime || "",
        endTime: session.endTime || "",
        duration: session.duration || 60,
        capacity: session.capacity || 5,
      });
    }
  };

  const handleEditSave = form.handleSubmit((values) => {
    updateSession.mutate(
      {
        id: session._id,
        ...values,
        duration: Number(values.duration),
        capacity: Number(values.capacity),
      },
      { onSuccess: () => setShowEditDialog(false) },
    );
  });

  const handleDelete = () => {
    deleteSession.mutate(session._id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  return (
    <>
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowViewDialog(true)} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleEditOpenChange(true)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ViewDetailsDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        title={`Session — ${new Date(session.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`}
        data={session}
        fields={[
          { key: "date", label: "Date", isDate: true },
          { key: "startTime", label: "Start Time" },
          { key: "endTime", label: "End Time" },
          { key: "duration", label: "Duration (minutes)" },
          { key: "capacity", label: "Capacity" },
          { key: "bookedCount", label: "Currently Booked" },
          { key: "status", label: "Status", isBadge: true },
        ]}
      />

      <EditDialog
        open={showEditDialog}
        onOpenChange={handleEditOpenChange}
        title="Edit Session"
        description="Update session timing and capacity."
        onSave={handleEditSave}
        isLoading={updateSession.isPending}
        saveLabel="Save Changes"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-startTime">
                Start Time <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="edit-startTime"
                type="time"
                disabled={updateSession.isPending}
                {...form.register("startTime", { required: "Required" })}
              />
              {form.formState.errors.startTime && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.startTime.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-endTime">
                End Time <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="edit-endTime"
                type="time"
                disabled={updateSession.isPending}
                {...form.register("endTime", { required: "Required" })}
              />
              {form.formState.errors.endTime && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.endTime.message}
                </p>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-duration">Duration (minutes)</FieldLabel>
              <Input
                id="edit-duration"
                type="number"
                min={15}
                disabled={updateSession.isPending}
                {...form.register("duration", {
                  required: "Required",
                  min: { value: 15, message: "Min 15" },
                  valueAsNumber: true,
                })}
              />
              {form.formState.errors.duration && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.duration.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-capacity">Capacity (pax)</FieldLabel>
              <Input
                id="edit-capacity"
                type="number"
                min={1}
                disabled={updateSession.isPending}
                {...form.register("capacity", {
                  required: "Required",
                  min: { value: 1, message: "Min 1" },
                  valueAsNumber: true,
                })}
              />
              {form.formState.errors.capacity && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.capacity.message}
                </p>
              )}
            </Field>
          </div>
        </div>
      </EditDialog>

      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        itemName={`session at ${session.startTime}`}
        isLoading={deleteSession.isPending}
      />
    </>
  );
}
