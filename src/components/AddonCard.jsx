import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";

import { EditDialog } from "@/components/dialog/EditDialog";
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AddonCard({ addon, onEdit, onDelete }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: addon.name || "",
    description: addon.description || "",
    price: addon.price || "",
    normalPrice: addon.normalPrice || "",
  });

  const handleEditSave = () => {
    onEdit({
      ...addon,
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      normalPrice: Number(editForm.normalPrice),
    });
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(addon._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className={cn(
          "hover:shadow-md transition-all duration-200",
          "border-l-4 border-l-secondary",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="rounded-md bg-muted p-1.5 shrink-0">
                <Puzzle className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm leading-tight">
                {addon.name}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-1 shrink-0">
            <Badge variant="secondary" className="font-semibold text-xs">
              + RM {addon.price}
            </Badge>
            <Badge variant="secondary" className="font-semibold text-xs">
              RM {addon.normalPrice} (normal)
            </Badge>
            {addon.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {addon.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <EditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Add-on"
        description="Update add-on details"
        onSave={handleEditSave}
        isLoading={false}
        saveLabel="Save Changes"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="addon-name">Add-on Name</FieldLabel>
            <Input
              id="addon-name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="addon-price">Addon Price (RM)</FieldLabel>
            <Input
              id="addon-price"
              type="number"
              value={editForm.price}
              onChange={(e) =>
                setEditForm({ ...editForm, price: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="addon-normal-price">
              Normal Price (RM)
            </FieldLabel>
            <Input
              id="addon-normal-price"
              type="number"
              value={editForm.normalPrice}
              onChange={(e) =>
                setEditForm({ ...editForm, normalPrice: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="addon-description">Description</FieldLabel>
            <Textarea
              id="addon-description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              rows={3}
            />
          </Field>
        </div>
      </EditDialog>

      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        itemName={addon.name}
      />
    </>
  );
}
