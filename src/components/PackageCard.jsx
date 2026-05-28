import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import { EditDialog } from "@/components/dialog/EditDialog";
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function PackageCard({ package: pkg, onEdit, onDelete, isLoading, isDeleteLoading }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: pkg.name || "",
    description: pkg.description || "",
    price: pkg.price || "",
    services: pkg.services?.join(", ") || "",
    isPopular: pkg.isPopular ?? false,
  });

  const handleEditSave = () => {
    const servicesArray = editForm.services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onEdit({
      ...pkg,
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      services: servicesArray,
      isPopular: editForm.isPopular,
    });

    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(pkg._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className={cn(
          "hover:shadow-lg transition-all duration-200 relative",
          "border-l-4",
          pkg.isPopular ? "border-l-amber-400" : "border-l-primary/40",
        )}
      >
        {pkg.isPopular && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400 gap-1 px-2 py-0.5 text-[10px] font-semibold shadow-sm">
              <Star className="h-2.5 w-2.5 fill-current" />
              Popular
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base leading-tight truncate">
                {pkg.name}
              </p>
              {pkg.duration && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pkg.duration}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Badge variant="default" className="text-sm font-bold px-2.5 py-1">
                RM {pkg.price}
              </Badge>
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

        <CardContent className="space-y-3 pt-0">
          {pkg.services?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                Includes
              </p>
              <ul className="space-y-1">
                {pkg.services.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pkg.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 pt-1 border-t">
              {pkg.description}
            </p>
          )}
        </CardContent>
      </Card>

      <EditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Package"
        description="Update package details"
        onSave={handleEditSave}
        isLoading={isLoading}
        saveLabel="Save Changes"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="pkg-name">Package Name</FieldLabel>
            <Input
              id="pkg-name"
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="pkg-price">Price (RM)</FieldLabel>
            <Input
              id="pkg-price"
              type="number"
              min="0"
              value={editForm.price}
              onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="pkg-services">Services (comma separated)</FieldLabel>
            <Textarea
              id="pkg-services"
              value={editForm.services}
              onChange={(e) => setEditForm((prev) => ({ ...prev, services: e.target.value }))}
              rows={4}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="pkg-description">Description</FieldLabel>
            <Textarea
              id="pkg-description"
              value={editForm.description}
              onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="pkg-popular">Popular Package</FieldLabel>
              <Switch
                id="pkg-popular"
                checked={editForm.isPopular}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({ ...prev, isPopular: checked }))
                }
              />
            </div>
          </Field>
        </div>
      </EditDialog>

      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        itemName={pkg.name}
      />
    </>
  );
}
