import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

import {
  useUpdateGraduate,
  useDeleteGraduate,
} from "@/hooks/user/useGraduates";

import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { EditDialog } from "@/components/dialog/EditDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

export function GraduateActionsCell({ row }) {
  const deleteGraduate = useDeleteGraduate();
  const updateGraduate = useUpdateGraduate();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedGraduate, setSelectedGraduate] = useState(null);

  const graduate = row.original;

  // Delete Handler
  const handleDeleteConfirm = () => {
    deleteGraduate.mutate(graduate._id || graduate.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  // Edit Handlers
  const handleEdit = () => {
    setSelectedGraduate({ ...graduate });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!selectedGraduate) return;

    updateGraduate.mutate(
      {
        id: selectedGraduate._id || selectedGraduate.id,
        fullName: selectedGraduate.fullName,
        email: selectedGraduate.email,
        phone: selectedGraduate.phone,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedGraduate(null);
        },
      }
    );
  };

  const handleEditDialogClose = (open) => {
    setEditOpen(open);
    if (!open) setSelectedGraduate(null);
  };

  // View Handler
  const handleView = () => {
    setSelectedGraduate(graduate);
    setViewOpen(true);
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
        itemName={graduate.fullName}
        isLoading={deleteGraduate.isPending}
      />

      {/* Edit Dialog */}
      <EditDialog
        open={editOpen}
        onOpenChange={handleEditDialogClose}
        title="Edit Graduate"
        description="Update graduate information"
        onSave={handleSave}
        isLoading={updateGraduate.isPending}
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              value={selectedGraduate?.fullName || ""}
              onChange={(e) =>
                setSelectedGraduate({
                  ...selectedGraduate,
                  fullName: e.target.value,
                })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={selectedGraduate?.email || ""}
              onChange={(e) =>
                setSelectedGraduate({
                  ...selectedGraduate,
                  email: e.target.value,
                })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <PhoneInput
              international
              defaultCountry="MY"
              countryCallingCodeEditable={false}
              placeholder="Enter phone number"
              value={selectedGraduate?.phone || ""}
              onChange={(value) => setSelectedGraduate({ ...selectedGraduate, phone: value || "" })}
              disabled={updateGraduate.isPending}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors",
                "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                "[&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:placeholder:text-muted-foreground",
                "[&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-0 [&_.PhoneInputCountrySelect]:outline-none",
                updateGraduate.isPending && "cursor-not-allowed opacity-50"
              )}
            />
          </Field>
        </div>
      </EditDialog>

      {/* View Details Dialog */}
      <ViewDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title="Graduate Details"
        data={selectedGraduate}
        fields={[
          { key: "fullName", label: "Full Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone Number", format: (v) => parsePhoneNumberFromString(String(v ?? ""), "MY")?.formatInternational() ?? v },
          { key: "createdAt", label: "Joined On", isDate: true },
        ]}
      />
    </>
  );
}