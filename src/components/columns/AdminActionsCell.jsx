import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

import { useUpdateAdmin, useDeleteAdmin } from "@/hooks/user/useAdmin";

import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { EditDialog } from "@/components/dialog/EditDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

export function AdminActionsCell({ row }) {
  const deleteAdmin = useDeleteAdmin();
  const updateAdmin = useUpdateAdmin();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const admin = row.original;

  const handleDeleteConfirm = () => {
    deleteAdmin.mutate(admin._id || admin.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  const handleEdit = () => {
    setSelectedAdmin({ ...admin });
    setEditOpen(true);
  };

  const handleView = () => {
    setSelectedAdmin(admin);
    setViewOpen(true);
  };

  const handleSave = () => {
    if (!selectedAdmin) return;

    updateAdmin.mutate(
      {
        id: selectedAdmin._id || selectedAdmin.id,
        fullName: selectedAdmin.fullName,
        email: selectedAdmin.email,
        phone: selectedAdmin.phone,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedAdmin(null);
        },
      },
    );
  };

  const handleEditDialogClose = (open) => {
    setEditOpen(open);
    if (!open) setSelectedAdmin(null);
  };

  return (
    <>
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
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

      {/* Delete Dialog */}
      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={admin.fullName}
        isLoading={deleteAdmin.isPending}
      />

      {/* Edit Dialog */}
      <EditDialog
        open={editOpen}
        onOpenChange={handleEditDialogClose}
        title="Edit Admin"
        description="Update admin information"
        onSave={handleSave}
        isLoading={updateAdmin.isPending}
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              value={selectedAdmin?.fullName || ""}
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, fullName: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={selectedAdmin?.email || ""}
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, email: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              type="tel"
              value={selectedAdmin?.phone || ""}
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, phone: e.target.value })
              }
            />
          </Field>
        </div>
      </EditDialog>

      {/* View Details Dialog */}
      <ViewDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title="Admin Details"
        data={selectedAdmin}
        fields={[
          { key: "fullName", label: "Full Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone Number" },
        ]}
      />
    </>
  );
}
