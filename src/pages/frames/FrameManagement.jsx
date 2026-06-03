import { useState, useMemo } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { FrameStatsRow } from "@/components/frames/FrameStatsRow";
import FrameCard from "@/components/frames/FrameCard";
import { useAllFrames, useCreateFrame } from "@/hooks/frames/useFrames";
import { Frame, Plus, Search, XCircle, Info } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY_FORM = { name: "", description: "", price: "", isActive: true };

function FramePageSkeleton() {
  return (
    <div className="grid gap-6 py-8">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
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
                  <Skeleton className="h-3 w-40" />
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

function FrameEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <Frame className="h-10 w-10 text-muted-foreground" />
      <p className="font-medium">No frames yet</p>
      <p className="text-sm text-muted-foreground">
        Get started by adding your first frame product.
      </p>
      <Button onClick={onAdd} className="gap-2 mt-1">
        <Plus className="h-4 w-4" />
        New Frame
      </Button>
    </div>
  );
}

function FrameSearchEmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <Search className="h-10 w-10 text-muted-foreground" />
      <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
      <p className="text-sm text-muted-foreground">
        Try a different name or description.
      </p>
    </div>
  );
}

const FrameManagement = () => {
  const { data, isLoading, error, refetch } = useAllFrames();
  const createFrame = useCreateFrame();
  const frames = useMemo(() => data?.data ?? data ?? [], [data]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const stats = useMemo(
    () => ({
      total: frames.length,
      active: frames.filter((f) => f.isActive !== false).length,
      inactive: frames.filter((f) => f.isActive === false).length,
    }),
    [frames]
  );

  const filteredFrames = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return frames;
    return frames.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
    );
  }, [frames, search]);

  const handleOpenChange = (open) => {
    if (!open) setForm(EMPTY_FORM);
    setShowCreateDialog(open);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    const price = Number(form.price);
    if (isNaN(price) || price < 0) {
      toast.error("Price must be a valid number ≥ 0");
      return;
    }
    createFrame.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        isActive: form.isActive,
      },
      { onSuccess: () => handleOpenChange(false) }
    );
  };

  if (error) {
    return (
      <Page>
        <PageHeader
          title="Frame Management"
          description="Manage the ala-carte frame product catalog."
        />
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <XCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Failed to load frames. Please try again.
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
        title="Frame Management"
        description="Manage the ala-carte frame product catalog."
      />

      {/* Notice about separate pricing */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 mb-6">
        <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-primary/80 leading-relaxed">
          Frame prices here are <strong>ala-carte prices</strong> for standalone
          frame orders. They are completely separate from add-on prices used in
          studio bookings.
        </p>
      </div>

      {isLoading ? (
        <FramePageSkeleton />
      ) : (
        <div className="grid gap-6">
          <FrameStatsRow stats={stats} />

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search frames..."
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
              New Frame
            </Button>
          </div>

          {/* Card grid / empty states */}
          {frames.length === 0 ? (
            <FrameEmptyState onAdd={() => setShowCreateDialog(true)} />
          ) : filteredFrames.length === 0 ? (
            <FrameSearchEmptyState query={search} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFrames.map((frame) => (
                <FrameCard key={frame._id} frame={frame} />
              ))}
            </div>
          )}
        </div>
      )}

      <CreateDialog
        open={showCreateDialog}
        onOpenChange={handleOpenChange}
        title="New Frame"
        description="Add a new frame product to the catalog."
        onSave={handleSave}
        isLoading={createFrame.isPending}
        saveLabel="Create Frame"
      >
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="new-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="new-name"
              name="name"
              placeholder="e.g. 8R Frame"
              value={form.name}
              onChange={handleChange}
              disabled={createFrame.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-description">Description</FieldLabel>
            <Input
              id="new-description"
              name="description"
              placeholder="Optional description"
              value={form.description}
              onChange={handleChange}
              disabled={createFrame.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-price">
              Ala-Carte Price (RM) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="new-price"
              name="price"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              disabled={createFrame.isPending}
            />
          </Field>

          <div className="flex items-center gap-3">
            <Switch
              id="new-isActive"
              checked={form.isActive}
              onCheckedChange={(v) =>
                setForm((prev) => ({ ...prev, isActive: v }))
              }
              disabled={createFrame.isPending}
            />
            <Label htmlFor="new-isActive">Active (visible to graduates)</Label>
          </div>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default FrameManagement;
