import { useState } from "react";
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

  const [editForm, setEditForm] = useState({
    startTime: session.startTime || "",
    endTime: session.endTime || "",
    duration: session.duration || 60,
    capacity: session.capacity || 5,
  });

  const handleEditSave = () => {
    updateSession.mutate({
      id: session._id,
      ...editForm,
      duration: Number(editForm.duration),
      capacity: Number(editForm.capacity),
    });
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    deleteSession.mutate(session._id);
    setShowDeleteDialog(false);
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
            <DropdownMenuItem 
              onClick={() => setShowViewDialog(true)} 
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => setShowEditDialog(true)} 
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

      {/* View Details Dialog */}
      <ViewDetailsDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        title={`Session - ${new Date(session.date).toLocaleDateString()}`}
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

      {/* Edit Dialog */}
      <EditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Session"
        description="Update session timing and capacity"
        onSave={handleEditSave}
        isLoading={updateSession.isPending}
        saveLabel="Save Changes"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
            <Input
              id="startTime"
              type="time"
              value={editForm.startTime}
              onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="endTime">End Time</FieldLabel>
            <Input
              id="endTime"
              type="time"
              value={editForm.endTime}
              onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
            <Input
              id="duration"
              type="number"
              value={editForm.duration}
              onChange={(e) => setEditForm({ ...editForm, duration: Number(e.target.value) })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
            <Input
              id="capacity"
              type="number"
              value={editForm.capacity}
              onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
            />
          </Field>
        </div>
      </EditDialog>

      {/* Delete Dialog */}
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