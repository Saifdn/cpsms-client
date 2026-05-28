import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Page, PageHeader } from "@/components/layout/Page";
import {
  useStudios,
  useCreateStudio,
  useUpdateStudio,
  useDeleteStudio,
  useToggleStudioAvailability,
} from "@/hooks/studio/useStudios";
import StudioCard from "@/components/StudioCard";
import { StudioStatsRow } from "@/components/studio/StudioStatsRow";
import { StudioCreateForm } from "@/components/studio/StudioCreateForm";
import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Plus, Search, XCircle } from "lucide-react";

const FORM_DEFAULTS = { name: "", location: "", description: "" };

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
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-28" />
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
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-full rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StudioEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <Building2 className="h-10 w-10 text-muted-foreground" />
      <p className="font-medium">No studios yet</p>
      <p className="text-sm text-muted-foreground">
        Get started by adding your first studio.
      </p>
      <Button onClick={onAdd} className="gap-2 mt-1">
        <Plus className="h-4 w-4" />
        Add New Studio
      </Button>
    </div>
  );
}

function StudioSearchEmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <Search className="h-10 w-10 text-muted-foreground" />
      <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
      <p className="text-sm text-muted-foreground">
        Try a different name or location.
      </p>
    </div>
  );
}

const Studio = () => {
  const { data, isLoading, error, refetch } = useStudios();
  const createStudio = useCreateStudio();
  const updateStudio = useUpdateStudio();
  const deleteStudio = useDeleteStudio();
  const toggleAvailability = useToggleStudioAvailability();

  const studios = useMemo(() => data?.data ?? data ?? [], [data]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm({ defaultValues: FORM_DEFAULTS });

  const stats = useMemo(
    () => ({
      total: studios.length,
      available: studios.filter((s) => s.isAvailable !== false).length,
      unavailable: studios.filter((s) => s.isAvailable === false).length,
      occupied: studios.filter((s) => s.isOccupied).length,
    }),
    [studios],
  );

  const filteredStudios = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return studios;
    return studios.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.location?.toLowerCase().includes(q),
    );
  }, [studios, search]);

  const handleCreate = form.handleSubmit((values) => {
    createStudio.mutate(values, {
      onSuccess: () => {
        setShowCreateDialog(false);
        form.reset();
      },
    });
  });

  const handleDialogOpenChange = (open) => {
    setShowCreateDialog(open);
    if (!open) form.reset();
  };

  const handleEdit = (editedData) => {
    updateStudio.mutate({ id: editedData._id ?? editedData.id, ...editedData });
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
          <StudioStatsRow stats={stats} />

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search studios..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Studio
            </Button>
          </div>

          {/* Studio grid / empty states */}
          {studios.length === 0 ? (
            <StudioEmptyState onAdd={() => setShowCreateDialog(true)} />
          ) : filteredStudios.length === 0 ? (
            <StudioSearchEmptyState query={search} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudios.map((studio) => (
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
        onOpenChange={handleDialogOpenChange}
        title="Create New Studio"
        description="Add a new studio to the system."
        onSave={handleCreate}
        isLoading={createStudio.isPending}
        saveLabel="Create Studio"
      >
        <StudioCreateForm
          register={form.register}
          errors={form.formState.errors}
          disabled={createStudio.isPending}
        />
      </CreateDialog>
    </Page>
  );
};

export default Studio;
