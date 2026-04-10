import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { graduateColumns } from "@/components/columns/GraduateColumns";
import { useGraduates } from "@/hooks/user/useGraduates";
import { useCreateGraduate } from "@/hooks/user/useGraduates";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const Graduate = () => {
  const { data, isLoading, error, refetch } = useGraduates();
  const createGraduate = useCreateGraduate();

  const graduates = data?.data || data?.graduates || data || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleCreate = () => {
    createGraduate.mutate(formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ fullName: "", email: "", phone: "" });
        refetch();
      },
    });
  };

  if (error) {
    return (
      <Page>
        <PageHeader
          title="Graduate Management"
          description="Error loading data"
        />
        <div className="p-8 text-center text-red-500">
          Failed to load graduates. Please try again.
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Graduate Management"
        description="Manage your graduates, roles, and permissions."
      />

      <div className="grid gap-6 py-8">
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Graduate
          </Button>
        </div>

        <DataTable
          title="List of Graduates"
          description="View and manage all graduates in your organization."
          columns={graduateColumns}
          data={graduates}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      </div>

      {/* Reusable Create Dialog */}
      <CreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Graduate"
        description="Add a new graduate to the system."
        onSave={handleCreate}
        isLoading={createGraduate.isPending}
        saveLabel="Create Graduate"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              disabled={createGraduate.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={createGraduate.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="012-345 6789"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              disabled={createGraduate.isPending}
            />
          </Field>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Graduate;
