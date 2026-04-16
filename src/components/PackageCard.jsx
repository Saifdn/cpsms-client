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

export function PackageCard({ package: pkg, onEdit, onDelete }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: pkg.name || "",
    description: pkg.description || "",
    price: pkg.price || "",
    services: pkg.services?.join(", ") || "",
  });

  const handleEditSave = () => {
    const servicesArray = editForm.services
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    onEdit({
      ...pkg,
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      services: servicesArray,
    });

    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(pkg._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{pkg.name}</CardTitle>
            <Badge variant="default" className="text-lg font-semibold">
              RM {pkg.price}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{pkg.duration}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground mb-2">INCLUDES</p>
            <ul className="space-y-1 text-sm">
              {pkg.services?.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
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
        title="Edit Package"
        description="Update package details"
        onSave={handleEditSave}
        isLoading={false}
        saveLabel="Save Changes"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="name">Package Name</FieldLabel>
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
            <FieldLabel htmlFor="services">Services (comma separated)</FieldLabel>
            <Textarea
              id="services"
              value={editForm.services}
              onChange={(e) => setEditForm({ ...editForm, services: e.target.value })}
              rows={4}
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
        itemName={pkg.name}
      />
    </>
  );
}