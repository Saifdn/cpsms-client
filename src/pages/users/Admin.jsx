import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { adminColumns } from "@/components/columns/AdminColumns";
import { useAdmins } from "@/hooks/user/useAdmin";
import { useCreateAdmin } from "@/hooks/user/useAdmin";     // ← Import create hook

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useAdmins();

  const createAdmin = useCreateAdmin();

  // Safely extract the admin array from API response
  const admins = data?.data || data?.admins || data || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    adminLevel: "admin",
  });

  const handleCreate = () => {
    createAdmin.mutate(formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ fullName: "", email: "", phone: "", adminLevel: "" }); // reset form
        refetch(); // refresh table
      },
    });
  };

  if (error) {
    return (
      <Page>
        <PageHeader 
          title="Admin Management" 
          description="Error loading data" 
        />
        <div className="p-8 text-center text-red-500">
          Failed to load admins. Please try again.
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Admin Management"
        description="Manage your administrators and their permissions."
      />

      <div className="grid gap-6 py-8">
        {/* Add New Admin Button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Admin
          </Button>
        </div>

        <DataTable
          title="List of Admins"
          description="View and manage all administrators in your organization."
          columns={adminColumns}
          data={admins}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      </div>

      {/* Reusable Create Dialog for Admin */}
      <CreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Admin"
        description="Add a new administrator to the system."
        onSave={handleCreate}
        isLoading={createAdmin.isPending}
        saveLabel="Create Admin"
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
              disabled={createAdmin.isPending}
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
              disabled={createAdmin.isPending}
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
              disabled={createAdmin.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="adminLevel">Admin Level</FieldLabel>
            <Select
              value={formData.adminLevel}
              onValueChange={(value) => setFormData({ ...formData, adminLevel: value })}
              disabled={createAdmin.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select admin level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Admin;