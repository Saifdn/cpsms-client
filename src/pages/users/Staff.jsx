import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { staffColumns } from "@/components/columns/StaffColumns";
import { useStaff } from "@/hooks/user/useStaff";
import { useCreateStaff } from "@/hooks/user/useStaff";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const Staff = () => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useStaff();

  const createStaff = useCreateStaff();

  // Safely extract the staff array from API response
  const staff = data?.data || data?.staff || data || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
  });

  const handleCreate = () => {
    createStaff.mutate(formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ fullName: "", email: "", phone: "", department: "" }); // reset form
        refetch(); // refresh the table
      },
    });
  };

  if (error) {
    return (
      <Page>
        <PageHeader 
          title="Staff Management" 
          description="Error loading data" 
        />
        <div className="p-8 text-center text-red-500">
          Failed to load staff members. Please try again.
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Staff Management"
        description="Manage your staff members, roles, and permissions."
      />

      <div className="grid gap-6 py-8">
        {/* Add New Staff Button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Staff
          </Button>
        </div>

        <DataTable
          title="List of Staff Members"
          description="View and manage all staff members in your organization."
          columns={staffColumns}
          data={staff}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      </div>

      {/* Create Staff Dialog */}
      <CreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Staff"
        description="Add a new staff member to the system."
        onSave={handleCreate}
        isLoading={createStaff.isPending}
        saveLabel="Create Staff"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              disabled={createStaff.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={createStaff.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="012-345 6789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={createStaff.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="department">Department</FieldLabel>
            <Input
              id="department"
              type="text"
              placeholder="e.g. IT, Marketing, HR"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              disabled={createStaff.isPending}
            />
          </Field>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Staff;