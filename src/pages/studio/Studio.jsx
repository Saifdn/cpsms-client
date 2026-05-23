import { useState, useMemo } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import StudioCard from "@/components/StudioCard";
import {
  useStudios,
  useCreateStudio,
  useUpdateStudio,
  useDeleteStudio,
  useToggleStudioAvailability,
} from "@/hooks/studio/useStudios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Plus,
  Building2,
  CheckCircle2,
  XCircle,
  Users2,
} from "lucide-react";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

function StudioPageSkeleton() {
  return (
    <div className="grid gap-6 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-7 w-10" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-6 pb-4 border-b space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
            <div className="p-6 space-y-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-6 w-20 rounded-md mt-4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, iconClass }) {
  const Icon = icon;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={cn("mt-0.5", iconClass)}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Studio = () => {
  const { data, isLoading, error, refetch } = useStudios();

  const createStudio = useCreateStudio();
  const updateStudio = useUpdateStudio();
  const deleteStudio = useDeleteStudio();
  const toggleAvailability = useToggleStudioAvailability();

  const studios = useMemo(() => data?.data || data || [], [data]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const stats = useMemo(
    () => ({
      total: studios.length,
      available: studios.filter((s) => s.isAvailable !== false).length,
      unavailable: studios.filter((s) => s.isAvailable === false).length,
      occupied: studios.filter((s) => s.isOccupied).length,
    }),
    [studios],
  );

  const handleCreate = () => {
    createStudio.mutate(formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ name: "", location: "", description: "" });
      },
    });
  };

  const handleEdit = (editedData) => {
    updateStudio.mutate({
      id: editedData._id || editedData.id,
      ...editedData,
    });
  };

  const handleDelete = (id) => {
    deleteStudio.mutate(id);
  };

  const handleToggle = (studioId, isAvailable) => {
    toggleAvailability.mutate({ id: studioId, isAvailable });
  };

  if (error) {
    return (
      <Page>
        <PageHeader
          title="Studio Management"
          description="Manage your studios availability and status."
        />
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <XCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Failed to load studios. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
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

      {isLoading ? (
        <StudioPageSkeleton />
      ) : (
        <div className="grid gap-6 py-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Studios"
              value={stats.total}
              icon={Building2}
              iconClass="text-primary"
            />
            <StatCard
              label="Available"
              value={stats.available}
              icon={CheckCircle2}
              iconClass="text-green-500"
            />
            <StatCard
              label="Unavailable"
              value={stats.unavailable}
              icon={XCircle}
              iconClass="text-muted-foreground"
            />
            <StatCard
              label="Occupied"
              value={stats.occupied}
              icon={Users2}
              iconClass="text-amber-500"
            />
          </div>

          {/* Add Row */}
          <div className="flex justify-end">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add New Studio
            </Button>
          </div>

          {/* Card Grid or Empty States */}
          {studios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <Building2 className="h-10 w-10 text-muted-foreground" />
              <p className="font-medium">No studios yet</p>
              <p className="text-sm text-muted-foreground">
                Get started by adding your first studio.
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="gap-2 mt-1"
              >
                <Plus className="h-4 w-4" />
                Add New Studio
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      )}

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
