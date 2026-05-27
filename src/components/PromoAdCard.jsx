import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { EditDialog } from "@/components/dialog/EditDialog";
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import imageCompression from "browser-image-compression";

export function PromoAdCard({ promoAd, onEdit, onDelete, isEditLoading, isDeleteLoading }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: promoAd.name || "",
    description: promoAd.description || "",
    image: null,
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
    });
    setEditForm((prev) => ({ ...prev, image: compressed }));
  };

  const handleEditSave = () => {
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("description", editForm.description);
    if (editForm.image) formData.append("image", editForm.image);
    onEdit({ id: promoAd._id, data: formData });
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(promoAd._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-0">
          <div className="relative h-44 w-full">
            <img
              src={promoAd.imageBase64}
              alt={promoAd.name}
              className="w-full h-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            {/* Action buttons — top right */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-md p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-white hover:bg-white/20"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-red-300 hover:bg-white/20"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Name + description overlay — bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
              <p className="text-white font-semibold text-sm leading-tight truncate">
                {promoAd.name}
              </p>
              {promoAd.description && (
                <p className="text-white/80 text-xs mt-0.5 line-clamp-1">
                  {promoAd.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Promo Ad"
        description="Update the promotional image details"
        onSave={handleEditSave}
        isLoading={isEditLoading}
        saveLabel="Save Changes"
      >
        <div className="space-y-5">
          <Field>
            <FieldLabel htmlFor="edit-promo-name">Name</FieldLabel>
            <Input
              id="edit-promo-name"
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-promo-description">Description</FieldLabel>
            <Textarea
              id="edit-promo-description"
              value={editForm.description}
              onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-promo-image">
              Replace Image{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input
              id="edit-promo-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Field>
        </div>
      </EditDialog>

      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        itemName={promoAd.name}
      />
    </>
  );
}
