import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Plus,
  ImagePlus,
  Box,
  Tag,
  Image,
  PackageX,
  PuzzleIcon,
  Search,
  X,
} from "lucide-react";
import { createElement, useState, useMemo, useCallback } from "react";

import { PackageCard } from "@/components/PackageCard";
import { AddonCard } from "@/components/AddonCard";
import { PromoAdCard } from "@/components/PromoAdCard";
import { CreateDialog } from "@/components/dialog/CreateDialog";

import {
  usePackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
} from "@/hooks/studio/usePackages";

import {
  useAddons,
  useCreateAddon,
  useUpdateAddon,
  useDeleteAddon,
} from "@/hooks/studio/useAddons";

import {
  usePromoAds,
  useCreatePromoAd,
  useUpdatePromoAd,
  useDeletePromoAd,
} from "@/hooks/studio/usePromoAds";

import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import imageCompression from "browser-image-compression";

// ─── Constants ───────────────────────────────────────────────────────────────

const INITIAL_PACKAGE_FORM = {
  name: "",
  description: "",
  price: "",
  services: "",
  isPopular: false,
};

const INITIAL_ADDON_FORM = {
  name: "",
  description: "",
  price: "",
  normalPrice: "",
};

const INITIAL_PROMO_FORM = {
  name: "",
  description: "",
  image: null,
};

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, iconClass }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={cn("mt-0.5", iconClass)}>
            {createElement(icon, { size: 20 })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Search Bar ──────────────────────────────────────────────────────────────

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8 h-9 text-sm"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3 rounded-lg border border-dashed">
      {createElement(icon, { className: "h-9 w-9 text-muted-foreground" })}
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {action}
    </div>
  );
}

// ─── Page Skeleton ───────────────────────────────────────────────────────────

function PackagePageSkeleton() {
  return (
    <div className="grid gap-8 py-8 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>

      <div className="lg:col-span-7 space-y-8">
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-9 w-full max-w-xs" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-l-4 border-l-primary/20">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-28" />
          </div>
          <Skeleton className="h-9 w-full max-w-xs" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-l-4 border-l-secondary/40">
                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Package = () => {
  const { data: packagesData, isLoading: packagesLoading } = usePackages();
  const { data: addonsData, isLoading: addonsLoading } = useAddons();
  const { data: promoAdsData } = usePromoAds();

  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();
  const createAddon = useCreateAddon();
  const updateAddon = useUpdateAddon();
  const deleteAddon = useDeleteAddon();
  const createPromoImage = useCreatePromoAd();
  const updatePromoAd = useUpdatePromoAd();
  const deletePromoAd = useDeletePromoAd();

  const packages = useMemo(() => packagesData?.data || [], [packagesData]);
  const addons = useMemo(() => addonsData?.data || [], [addonsData]);
  const promoAds = useMemo(() => promoAdsData?.data || [], [promoAdsData]);

  const isLoading = packagesLoading || addonsLoading;

  // ─── Dialog state ─────────────────────────────────────────────────────────
  const [showCreatePackage, setShowCreatePackage] = useState(false);
  const [showCreateAddon, setShowCreateAddon] = useState(false);
  const [showCreatePromoImage, setShowCreatePromoImage] = useState(false);

  // ─── Form state ───────────────────────────────────────────────────────────
  const [packageForm, setPackageForm] = useState(INITIAL_PACKAGE_FORM);
  const [addonForm, setAddonForm] = useState(INITIAL_ADDON_FORM);
  const [promoImageForm, setPromoImageForm] = useState(INITIAL_PROMO_FORM);
  const [promoImagePreview, setPromoImagePreview] = useState(null);

  // ─── Search state ─────────────────────────────────────────────────────────
  const [pkgSearch, setPkgSearch] = useState("");
  const [addonSearch, setAddonSearch] = useState("");

  const filteredPackages = useMemo(() => {
    const q = pkgSearch.trim().toLowerCase();
    if (!q) return packages;
    return packages.filter((p) => p.name.toLowerCase().includes(q));
  }, [packages, pkgSearch]);

  const filteredAddons = useMemo(() => {
    const q = addonSearch.trim().toLowerCase();
    if (!q) return addons;
    return addons.filter((a) => a.name.toLowerCase().includes(q));
  }, [addons, addonSearch]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleCreatePackage = useCallback(() => {
    const servicesArray = packageForm.services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    createPackage.mutate(
      {
        name: packageForm.name,
        description: packageForm.description,
        price: Number(packageForm.price),
        services: servicesArray,
        isPopular: packageForm.isPopular,
      },
      {
        onSuccess: () => {
          setShowCreatePackage(false);
          setPackageForm(INITIAL_PACKAGE_FORM);
        },
      },
    );
  }, [packageForm, createPackage]);

  const handleCreateAddon = useCallback(() => {
    createAddon.mutate(
      {
        name: addonForm.name,
        description: addonForm.description,
        price: Number(addonForm.price),
        normalPrice: Number(addonForm.normalPrice),
      },
      {
        onSuccess: () => {
          setShowCreateAddon(false);
          setAddonForm(INITIAL_ADDON_FORM);
        },
      },
    );
  }, [addonForm, createAddon]);

  const handleEditPackage = useCallback(
    (updatedPackage) => {
      updatePackage.mutate({ id: updatedPackage._id, ...updatedPackage });
    },
    [updatePackage],
  );

  const handleDeletePackage = useCallback(
    (id) => {
      deletePackage.mutate(id);
    },
    [deletePackage],
  );

  const handleEditAddon = useCallback(
    (updatedAddon) => {
      updateAddon.mutate({ id: updatedAddon._id, ...updatedAddon });
    },
    [updateAddon],
  );

  const handleDeleteAddon = useCallback(
    (id) => {
      deleteAddon.mutate(id);
    },
    [deleteAddon],
  );

  const handleEditPromoAd = useCallback(
    ({ id, data }) => {
      updatePromoAd.mutate({ id, data });
    },
    [updatePromoAd],
  );

  const handleDeletePromoAd = useCallback(
    (id) => {
      deletePromoAd.mutate(id);
    },
    [deletePromoAd],
  );

  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
    });
    const previewUrl = URL.createObjectURL(compressedFile);
    setPromoImageForm((prev) => ({ ...prev, image: compressedFile }));
    setPromoImagePreview(previewUrl);
  }, []);

  const handleCreatePromoImage = useCallback(() => {
    const formData = new FormData();
    formData.append("name", promoImageForm.name);
    formData.append("description", promoImageForm.description);
    formData.append("image", promoImageForm.image);

    createPromoImage.mutate(formData, {
      onSuccess: () => {
        setShowCreatePromoImage(false);
        setPromoImageForm(INITIAL_PROMO_FORM);
        setPromoImagePreview(null);
      },
    });
  }, [promoImageForm, createPromoImage]);

  const handlePromoDialogClose = useCallback((open) => {
    setShowCreatePromoImage(open);
    if (!open) {
      setPromoImageForm(INITIAL_PROMO_FORM);
      setPromoImagePreview(null);
    }
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Page>
      <PageHeader
        title="Studio Packages & Add-ons"
        description="Create and manage service packages, add-ons, and promotions"
      />

      {isLoading ? (
        <PackagePageSkeleton />
      ) : (
        <div className="grid gap-8 py-8 lg:grid-cols-12">
          {/* LEFT — Promo Ads */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Promotions</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowCreatePromoImage(true)}
              >
                <ImagePlus className="h-4 w-4" />
                Add Promo
              </Button>
            </div>

            {promoAds.length === 0 ? (
              <EmptyState
                icon={Image}
                title="No promo ads yet"
                description="Add a promotional image to display to graduates."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreatePromoImage(true)}
                    className="gap-2 mt-1"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Add Promo
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {promoAds.map((promo) => (
                  <PromoAdCard
                    key={promo._id}
                    promoAd={promo}
                    onEdit={handleEditPromoAd}
                    onDelete={handleDeletePromoAd}
                    isEditLoading={updatePromoAd.isPending}
                    isDeleteLoading={deletePromoAd.isPending}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Stats + Packages + Add-ons */}
          <div className="lg:col-span-7 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Packages"
                value={packages.length}
                icon={Box}
                iconClass="text-primary"
              />
              <StatCard
                label="Add-ons"
                value={addons.length}
                icon={Tag}
                iconClass="text-violet-500"
              />
              <StatCard
                label="Promo Slides"
                value={promoAds.length}
                icon={Image}
                iconClass="text-amber-500"
              />
            </div>

            {/* Packages */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Studio Packages</h2>
                  {packages.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {packages.length} package{packages.length !== 1 ? "s" : ""} available
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowCreatePackage(true)}
                  className="gap-2 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  New Package
                </Button>
              </div>

              {packages.length > 0 && (
                <SearchInput
                  value={pkgSearch}
                  onChange={setPkgSearch}
                  placeholder="Search packages..."
                />
              )}

              {packages.length === 0 ? (
                <EmptyState
                  icon={PackageX}
                  title="No packages yet"
                  description="Get started by creating your first studio package."
                  action={
                    <Button
                      size="sm"
                      onClick={() => setShowCreatePackage(true)}
                      className="gap-2 mt-1"
                    >
                      <Plus className="h-4 w-4" />
                      New Package
                    </Button>
                  }
                />
              ) : filteredPackages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2 rounded-lg border border-dashed">
                  <Search className="h-7 w-7 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No packages match &ldquo;{pkgSearch}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredPackages.map((pkg) => (
                    <PackageCard
                      key={pkg._id}
                      package={pkg}
                      onEdit={handleEditPackage}
                      onDelete={handleDeletePackage}
                      isLoading={updatePackage.isPending}
                      isDeleteLoading={deletePackage.isPending}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Add-ons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Add-ons</h2>
                  {addons.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {addons.length} add-on{addons.length !== 1 ? "s" : ""} available
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateAddon(true)}
                  className="gap-2 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  New Add-on
                </Button>
              </div>

              {addons.length > 0 && (
                <SearchInput
                  value={addonSearch}
                  onChange={setAddonSearch}
                  placeholder="Search add-ons..."
                />
              )}

              {addons.length === 0 ? (
                <EmptyState
                  icon={PuzzleIcon}
                  title="No add-ons yet"
                  description="Create optional extras that graduates can add to their bookings."
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateAddon(true)}
                      className="gap-2 mt-1"
                    >
                      <Plus className="h-4 w-4" />
                      New Add-on
                    </Button>
                  }
                />
              ) : filteredAddons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2 rounded-lg border border-dashed">
                  <Search className="h-7 w-7 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No add-ons match &ldquo;{addonSearch}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAddons.map((addon) => (
                    <AddonCard
                      key={addon._id}
                      addon={addon}
                      onEdit={handleEditAddon}
                      onDelete={handleDeleteAddon}
                      isLoading={updateAddon.isPending}
                      isDeleteLoading={deleteAddon.isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Create Package Dialog ─────────────────────────────────────────── */}
      <CreateDialog
        open={showCreatePackage}
        onOpenChange={setShowCreatePackage}
        title="Create New Package"
        description="Define a new studio package"
        onSave={handleCreatePackage}
        isLoading={createPackage.isPending}
        saveLabel="Create Package"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="new-pkg-name">Package Name</FieldLabel>
            <Input
              id="new-pkg-name"
              value={packageForm.name}
              onChange={(e) =>
                setPackageForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Premium Studio Package"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-pkg-price">Price (RM)</FieldLabel>
            <Input
              id="new-pkg-price"
              type="number"
              min="0"
              value={packageForm.price}
              onChange={(e) =>
                setPackageForm((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-pkg-services">
              Services{" "}
              <span className="text-muted-foreground font-normal">(comma separated)</span>
            </FieldLabel>
            <Textarea
              id="new-pkg-services"
              value={packageForm.services}
              onChange={(e) =>
                setPackageForm((prev) => ({ ...prev, services: e.target.value }))
              }
              placeholder="Studio Access, Pro Lighting, Makeup Artist"
              rows={4}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-pkg-description">Description</FieldLabel>
            <Textarea
              id="new-pkg-description"
              value={packageForm.description}
              onChange={(e) =>
                setPackageForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="new-pkg-popular">Popular Package</FieldLabel>
              <Switch
                id="new-pkg-popular"
                checked={packageForm.isPopular}
                onCheckedChange={(checked) =>
                  setPackageForm((prev) => ({ ...prev, isPopular: checked }))
                }
              />
            </div>
          </Field>
        </div>
      </CreateDialog>

      {/* ── Create Add-on Dialog ──────────────────────────────────────────── */}
      <CreateDialog
        open={showCreateAddon}
        onOpenChange={setShowCreateAddon}
        title="Create New Add-on"
        description="Create an additional service"
        onSave={handleCreateAddon}
        isLoading={createAddon.isPending}
        saveLabel="Create Add-on"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="new-addon-name">Add-on Name</FieldLabel>
            <Input
              id="new-addon-name"
              value={addonForm.name}
              onChange={(e) =>
                setAddonForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-addon-price">Promo Price (RM)</FieldLabel>
            <Input
              id="new-addon-price"
              type="number"
              min="0"
              value={addonForm.price}
              onChange={(e) =>
                setAddonForm((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-addon-normal-price">Normal Price (RM)</FieldLabel>
            <Input
              id="new-addon-normal-price"
              type="number"
              min="0"
              value={addonForm.normalPrice}
              onChange={(e) =>
                setAddonForm((prev) => ({ ...prev, normalPrice: e.target.value }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-addon-description">Description</FieldLabel>
            <Textarea
              id="new-addon-description"
              value={addonForm.description}
              onChange={(e) =>
                setAddonForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </Field>
        </div>
      </CreateDialog>

      {/* ── Create Promo Image Dialog ─────────────────────────────────────── */}
      <CreateDialog
        open={showCreatePromoImage}
        onOpenChange={handlePromoDialogClose}
        title="Add Promotional Image"
        description="Upload an image to display in the graduate booking carousel"
        onSave={handleCreatePromoImage}
        isLoading={createPromoImage.isPending}
        saveLabel="Upload Promo"
      >
        <div className="space-y-5">
          <Field>
            <FieldLabel htmlFor="new-promo-name">Name</FieldLabel>
            <Input
              id="new-promo-name"
              value={promoImageForm.name}
              onChange={(e) =>
                setPromoImageForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Summer Promo 2025"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-promo-description">Description</FieldLabel>
            <Input
              id="new-promo-description"
              value={promoImageForm.description}
              onChange={(e) =>
                setPromoImageForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Book now and get 10% off"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-promo-image">Promo Image</FieldLabel>
            <Input
              id="new-promo-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Field>

          {promoImagePreview && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={promoImagePreview}
                alt="Preview"
                className="w-full h-44 object-cover"
              />
            </div>
          )}
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Package;
