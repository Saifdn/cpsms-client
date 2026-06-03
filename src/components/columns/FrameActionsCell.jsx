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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { EditDialog } from "@/components/dialog/EditDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateFrame, useDeleteFrame } from "@/hooks/frames/useFrames";

export function FrameActionsCell({ row }) {
  const frame = row.original;
  const updateFrame = useUpdateFrame();
  const deleteFrame = useDeleteFrame();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      name: frame.name || "",
      description: frame.description || "",
      price: frame.price || 0,
      isActive: frame.isActive ?? true,
    },
  });

  const handleEditOpenChange = (open) => {
    setShowEditDialog(open);
    if (open) {
      form.reset({
        name: frame.name || "",
        description: frame.description || "",
        price: frame.price || 0,
        isActive: frame.isActive ?? true,
      });
    }
  };

  const handleEditSave = form.handleSubmit((values) => {
    updateFrame.mutate(
      { id: frame._id, ...values, price: Number(values.price) },
      { onSuccess: () => setShowEditDialog(false) }
    );
  });

  const handleDelete = () => {
    deleteFrame.mutate(frame._id, {
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

      <EditDialog
        open={showEditDialog}
        onOpenChange={handleEditOpenChange}
        title="Edit Frame"
        description="Update frame product details."
        onSave={handleEditSave}
        isLoading={updateFrame.isPending}
        saveLabel="Save Changes"
      >
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="edit-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="edit-name"
              disabled={updateFrame.isPending}
              {...form.register("name", { required: "Required" })}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
            <Input
              id="edit-description"
              disabled={updateFrame.isPending}
              {...form.register("description")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-price">
              Price (RM) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="edit-price"
              type="number"
              min={0}
              step="0.01"
              disabled={updateFrame.isPending}
              {...form.register("price", {
                required: "Required",
                min: { value: 0, message: "Must be ≥ 0" },
                valueAsNumber: true,
              })}
            />
            {form.formState.errors.price && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.price.message}</p>
            )}
          </Field>

          <div className="flex items-center gap-3">
            <Switch
              id="edit-isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(v) => form.setValue("isActive", v)}
              disabled={updateFrame.isPending}
            />
            <Label htmlFor="edit-isActive">Active (visible to graduates)</Label>
          </div>
        </div>
      </EditDialog>

      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        itemName={`frame "${frame.name}"`}
        isLoading={deleteFrame.isPending}
      />
    </>
  );
}
