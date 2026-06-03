import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { EditDialog } from "@/components/dialog/EditDialog";
import { Frame, MoreVertical, Edit, Trash2, Circle, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateFrame, useDeleteFrame } from "@/hooks/frames/useFrames";

const FrameCard = ({ frame }) => {
  const isActive = frame.isActive ?? true;

  const updateFrame = useUpdateFrame();
  const deleteFrame = useDeleteFrame();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      name: frame.name || "",
      description: frame.description || "",
      price: frame.price ?? 0,
      isActive: frame.isActive ?? true,
    },
  });

  const handleEditOpenChange = (open) => {
    setShowEditDialog(open);
    if (open) {
      form.reset({
        name: frame.name || "",
        description: frame.description || "",
        price: frame.price ?? 0,
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
      <Card
        className={cn(
          "overflow-hidden transition-shadow hover:shadow-md border-l-4",
          isActive ? "border-l-primary" : "border-l-muted-foreground/40"
        )}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "shrink-0 p-2 rounded-lg",
                  isActive ? "bg-primary/10" : "bg-muted"
                )}
              >
                <Frame
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-base leading-tight truncate">
                  {frame.name}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {frame.description || "No description"}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 -mr-1"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleEditOpenChange(true)}
                  className="cursor-pointer"
                >
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

          {/* Divider */}
          <div className="border-t mx-5" />

          {/* Info rows */}
          <div className="px-5 py-4 space-y-3">
            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Ala-carte price
              </span>
              <span className="text-sm font-semibold tabular-nums">
                RM {Number(frame.price).toFixed(2)}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className={cn(
                  "gap-1.5 text-xs font-medium",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground border-border"
                )}
                variant="outline"
              >
                <Circle
                  className={cn(
                    "h-1.5 w-1.5 fill-current",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
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
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.price.message}
              </p>
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
};

export default FrameCard;
