import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { EditDialog } from "@/components/dialog/EditDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

const StudioCard = ({ studio, onToggleAvailability, onEdit, onDelete }) => {
  const isAvailable = studio.isAvailable !== false;
  const isOccupied = studio.isOccupied || false;

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

  const handleEditSave = () => {
    if (onEdit && editData) onEdit(editData);
    setShowEditDialog(false);
    setEditData(null);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) onDelete(studio._id || studio.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden transition-shadow hover:shadow-md border-l-4",
          isAvailable ? "border-l-green-500" : "border-l-muted-foreground/40",
        )}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "shrink-0 p-2 rounded-lg",
                  isAvailable
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-muted",
                )}
              >
                <Aperture
                  className={cn(
                    "h-5 w-5",
                    isAvailable ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-base leading-tight truncate">
                  {studio.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs truncate">{studio.location}</span>
                </div>
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
                  onClick={() => setShowViewDialog(true)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleEditClick}
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

          {/* Status rows */}
          <div className="px-5 py-4 space-y-3">
            {/* Occupancy */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Session status</span>
              <Badge
                className={cn(
                  "gap-1.5 text-xs font-medium",
                  isOccupied
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
                )}
                variant="outline"
              >
                <Circle
                  className={cn(
                    "h-1.5 w-1.5 fill-current",
                    isOccupied ? "text-red-500" : "text-green-500",
                  )}
                />
                {isOccupied ? "Occupied" : "Free"}
              </Badge>
            </div>

            {/* Availability toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Availability</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isAvailable ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                  )}
                >
                  {isAvailable ? "Open" : "Closed"}
                </span>
                <Switch checked={isAvailable} onCheckedChange={handleToggle} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={studio.name}
      />

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
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              value={editData?.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows={3}
            />
          </Field>
        </div>
      </EditDialog>

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
