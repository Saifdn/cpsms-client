import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

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
  });

  const handleEditSave = () => {
    onEdit({
      ...addon,
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
    });
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(addon._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-base">{addon.name}</CardTitle>
            <Badge variant="secondary">+ RM {addon.price}</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {addon.description}
          </p>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
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
            <FieldLabel htmlFor="name">Add-on Name</FieldLabel>
            <Input
              id="name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="price">Price (RM)</FieldLabel>
            <Input
              id="price"
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={3}
            />
          </Field>
        </div>
      </EditDialog>

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        itemName={addon.name}
      />
    </>
  );
}