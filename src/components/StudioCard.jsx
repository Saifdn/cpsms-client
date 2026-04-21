import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";

import { 
  Aperture, 
  MapPin, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react";

import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { EditDialog } from "@/components/dialog/EditDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

const StudioCard = ({ 
  studio, 
  onToggleAvailability,
  onEdit,
  onDelete 
}) => {
  const isAvailable = studio.isAvailable !== false;
  const isOccupied = studio.isOccupied || false;
  const bookingNumber = studio.currentBooking;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleToggle = (checked) => {
    if (onToggleAvailability) {
      onToggleAvailability(studio._id || studio.id, checked);
    }
  };

  const handleEditClick = () => {
    setEditData({ ...studio });
    setShowEditDialog(true);
  };

  const handleViewClick = () => {
    setShowViewDialog(true);
  };

  const handleEditSave = () => {
    if (onEdit && editData) {
      onEdit(editData);
    }
    setShowEditDialog(false);
    setEditData(null);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(studio._id || studio.id);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="bg-background overflow-hidden hover:shadow-md transition-all">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Aperture className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{studio.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <CardDescription className="m-0">{studio.location}</CardDescription>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-1">
                <Switch 
                  checked={isAvailable} 
                  onCheckedChange={handleToggle}
                />
                <Label className="text-xs font-medium">
                  {isAvailable ? "Available" : "Unavailable"}
                </Label>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleViewClick} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">
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
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current Status</span>
            </div>

            <Badge 
              variant={isOccupied ? "destructive" : "default"}
              className={isOccupied ? "bg-red-600" : "bg-green-600"}
            >
              {isOccupied 
                ? `Occupied` 
                : "Free / Available"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={studio.name}
      />

      {/* Edit Dialog */}
      <EditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Studio"
        description="Update studio information"
        onSave={handleEditSave}
        isLoading={false}
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="name">Studio Name</FieldLabel>
            <Input
              id="name"
              value={editData?.name || ""}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              value={editData?.location || ""}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              value={editData?.description || ""}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={3}
            />
          </Field>
        </div>
      </EditDialog>

      {/* View Details Dialog */}
      <ViewDetailsDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        title={`${studio.name} Details`}
        data={studio}
        fields={[
          { key: "name", label: "Studio Name" },
          { key: "location", label: "Location" },
          { key: "description", label: "Description" },
          { key: "isAvailable", label: "Availability", isBadge: true },
          { key: "createdAt", label: "Created At", isDate: true },
        ]}
      />
    </>
  );
};

export default StudioCard;