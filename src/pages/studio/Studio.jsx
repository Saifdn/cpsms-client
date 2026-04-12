import { Page, PageHeader } from "@/components/layout/Page";
import StudioCard from "@/components/StudioCard";
import { useStudios } from "@/hooks/studio/useStudios";
import {
  useCreateStudio,
  useUpdateStudio,
  useDeleteStudio,
  useToggleStudioAvailability,
} from "@/hooks/studio/useStudios";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Studio = () => {
  const { data, isLoading, error, refetch } = useStudios();

  const createStudio = useCreateStudio();
  const updateStudio = useUpdateStudio();
  const deleteStudio = useDeleteStudio();
  const toggleAvailability = useToggleStudioAvailability();

  const studios = data?.data || data || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });

  // Create
  const handleCreate = () => {
    createStudio.mutate(formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ name: "", location: "", description: "" });
        refetch();
      },
    });
  };

  // Edit - receives edited data from StudioCard
  const handleEdit = (editedData) => {
    updateStudio.mutate(
      {
        id: editedData._id || editedData.id,
        ...editedData,
      },
      {
        onSuccess: () => refetch(),
      },
    );
  };

  // Delete
  const handleDelete = (id) => {
    deleteStudio.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  const handleToggle = (studioId, isAvailable) => {
    toggleAvailability.mutate({ id: studioId, isAvailable });
  };

  if (error) {
    return (
      <Page>
        <PageHeader
          title="Studio Management"
          description="Error loading studios"
        />
        <div className="p-8 text-center text-red-500">
          Failed to load studios. Please try again.
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Studio Management"
        description="Manage your studios availability and status."
      />

      <div className="grid gap-6 py-8">
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Studio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              onToggleAvailability={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* Only Create Dialog here */}
      <CreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Studio"
        description="Add a new studio to the system."
        onSave={handleCreate}
        isLoading={createStudio.isPending}
        saveLabel="Create Studio"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="name">Studio Name</FieldLabel>
            <Input
              id="name"
              placeholder="Studio A"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={createStudio.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="Building A, Floor 2"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              disabled={createStudio.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">
              Description (Optional)
            </FieldLabel>
            <Textarea
              id="description"
              placeholder="Describe the studio..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              disabled={createStudio.isPending}
            />
          </Field>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Studio;
