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
} from "lucide-react";
import { useState, useMemo } from "react";

import { PackageCarousel } from "@/components/PackageCarousel";
import { PackageCard } from "@/components/PackageCard";
import { AddonCard } from "@/components/AddonCard";
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

import { usePromoAds, useCreatePromoAd } from "@/hooks/studio/usePromoAds";

import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import imageCompression from "browser-image-compression";

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

  const packages = useMemo(() => packagesData?.data || [], [packagesData]);
  const addons = useMemo(() => addonsData?.data || [], [addonsData]);
  const promoAds = useMemo(() => promoAdsData?.data || [], [promoAdsData]);

  const isLoading = packagesLoading || addonsLoading;

  // Dialog States
  const [showCreatePackage, setShowCreatePackage] = useState(false);
  const [showCreateAddon, setShowCreateAddon] = useState(false);
  const [showCreatePromoImage, setShowCreatePromoImage] = useState(false);

  // Form States
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    price: "",
    services: "",
    isPopular: false,
  });

  const [addonForm, setAddonForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [promoImageForm, setPromoImageForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  // Handlers
  const handleCreatePackage = () => {
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
          setPackageForm({ name: "", description: "", price: "", services: "", isPopular: false });
        },
      },
    );
  };

  const handleCreateAddon = () => {
    createAddon.mutate(
      {
        name: addonForm.name,
        description: addonForm.description,
        price: Number(addonForm.price),
      },
      {
        onSuccess: () => {
          setShowCreateAddon(false);
          setAddonForm({ name: "", description: "", price: "" });
        },
      },
    );
  };

  const handleEditPackage = (updatedPackage) => {
    updatePackage.mutate({ id: updatedPackage._id, ...updatedPackage });
  };

  const handleDeletePackage = (id) => {
    deletePackage.mutate(id);
  };

  const handleEditAddon = (updatedAddon) => {
    updateAddon.mutate({ id: updatedAddon._id, ...updatedAddon });
  };

  const handleDeleteAddon = (id) => {
    deleteAddon.mutate(id);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
    });
    setPromoImageForm({ ...promoImageForm, image: compressedFile });
  };

  const handleCreatePromoImage = () => {
    const formData = new FormData();
    formData.append("name", promoImageForm.name);
    formData.append("description", promoImageForm.description);
    formData.append("image", promoImageForm.image);

    createPromoImage.mutate(formData, {
      onSuccess: () => {
        setShowCreatePromoImage(false);
        setPromoImageForm({ name: "", description: "", image: null });
      },
    });
  };

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
          {/* LEFT - Promo Carousel */}
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
            <PackageCarousel promoAds={promoAds} />
          </div>

          {/* RIGHT - Stats + Packages + Addons */}
          <div className="lg:col-span-7 space-y-8">
            {/* Stats Row */}
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

            {/* Studio Packages Section */}
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

              {packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3 rounded-lg border border-dashed">
                  <PackageX className="h-9 w-9 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">No packages yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Get started by creating your first studio package.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowCreatePackage(true)}
                    className="gap-2 mt-1"
                  >
                    <Plus className="h-4 w-4" />
                    New Package
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {packages.map((pkg) => (
                    <PackageCard
                      key={pkg._id}
                      package={pkg}
                      onEdit={handleEditPackage}
                      onDelete={handleDeletePackage}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Add-ons Section */}
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

              {addons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3 rounded-lg border border-dashed">
                  <PuzzleIcon className="h-9 w-9 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">No add-ons yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Create optional extras that graduates can add to their bookings.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateAddon(true)}
                    className="gap-2 mt-1"
                  >
                    <Plus className="h-4 w-4" />
                    New Add-on
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addons.map((addon) => (
                    <AddonCard
                      key={addon._id}
                      addon={addon}
                      onEdit={handleEditAddon}
                      onDelete={handleDeleteAddon}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Package Dialog */}
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
                setPackageForm({ ...packageForm, name: e.target.value })
              }
              placeholder="Premium Studio Package"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-pkg-price">Price (RM)</FieldLabel>
            <Input
              id="new-pkg-price"
              type="number"
              value={packageForm.price}
              onChange={(e) =>
                setPackageForm({ ...packageForm, price: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-pkg-services">
              Services (comma separated)
            </FieldLabel>
            <Textarea
              id="new-pkg-services"
              value={packageForm.services}
              onChange={(e) =>
                setPackageForm({ ...packageForm, services: e.target.value })
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
                setPackageForm({ ...packageForm, description: e.target.value })
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
                  setPackageForm({ ...packageForm, isPopular: checked })
                }
              />
            </div>
          </Field>
        </div>
      </CreateDialog>

      {/* Create Addon Dialog */}
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
                setAddonForm({ ...addonForm, name: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-addon-price">Price (RM)</FieldLabel>
            <Input
              id="new-addon-price"
              type="number"
              value={addonForm.price}
              onChange={(e) =>
                setAddonForm({ ...addonForm, price: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-addon-description">Description</FieldLabel>
            <Textarea
              id="new-addon-description"
              value={addonForm.description}
              onChange={(e) =>
                setAddonForm({ ...addonForm, description: e.target.value })
              }
              rows={3}
            />
          </Field>
        </div>
      </CreateDialog>

      {/* Create Promo Image Dialog */}
      <CreateDialog
        open={showCreatePromoImage}
        onOpenChange={setShowCreatePromoImage}
        title="Create New Promo Image"
        description="Upload a new promotional image"
        onSave={handleCreatePromoImage}
        isLoading={createPromoImage.isPending}
        saveLabel="Create Promo Image"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="new-promo-name">Name</FieldLabel>
            <Input
              id="new-promo-name"
              value={promoImageForm.name}
              onChange={(e) =>
                setPromoImageForm({ ...promoImageForm, name: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-promo-description">Description</FieldLabel>
            <Input
              id="new-promo-description"
              value={promoImageForm.description}
              onChange={(e) =>
                setPromoImageForm({
                  ...promoImageForm,
                  description: e.target.value,
                })
              }
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
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Package;
