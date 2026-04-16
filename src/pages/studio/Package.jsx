import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Plus, ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import imageCompression from "browser-image-compression";

const Package = () => {
  // Data Fetching
  const { data: packagesData, isLoading: packagesLoading } = usePackages();
  const { data: addonsData, isLoading: addonsLoading } = useAddons();
  const { data: promoAdsData } = usePromoAds();

  // Mutations
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();
  const createAddon = useCreateAddon();
  const updateAddon = useUpdateAddon();
  const deleteAddon = useDeleteAddon();
  const createPromoImage = useCreatePromoAd();

  const packages = packagesData?.data || [];
  const addons = addonsData?.data || [];
  const promoAds = promoAdsData?.data || [];

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
      },
      {
        onSuccess: () => {
          setShowCreatePackage(false);
          setPackageForm({
            name: "",
            description: "",
            price: "",
            services: "",
          });
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
    updatePackage.mutate({
      id: updatedPackage._id,
      ...updatedPackage,
    });
  };

  const handleDeletePackage = (id) => {
    deletePackage.mutate(id);
  };

  const handleEditAddon = (updatedAddon) => {
    updateAddon.mutate({
      id: updatedAddon._id,
      ...updatedAddon,
    });
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

    setPromoImageForm({
      ...promoImageForm,
      image: compressedFile,
    });
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

      <div className="grid gap-8 py-8 lg:grid-cols-12">
        {/* LEFT - Promo Carousel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Promotions</h2>
            <Button variant="outline" className="gap-2" onClick={() => setShowCreatePromoImage(true)}>
              <ImagePlus className="h-4 w-4" />
              Add Promo Image
            </Button>
          </div>
          <PackageCarousel promoAds={promoAds} />
        </div>

        {/* RIGHT - Packages & Addons */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex gap-3">
            <Button
              onClick={() => setShowCreatePackage(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Package
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCreateAddon(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Add-on
            </Button>
          </div>

          {/* Studio Packages */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Studio Packages</h2>
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
          </div>

          {/* Add-ons */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Add-ons</h2>
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
          </div>
        </div>
      </div>

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
            <FieldLabel htmlFor="name">Package Name</FieldLabel>
            <Input
              id="name"
              value={packageForm.name}
              onChange={(e) =>
                setPackageForm({ ...packageForm, name: e.target.value })
              }
              placeholder="Premium Studio Package"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="price">Price (RM)</FieldLabel>
            <Input
              id="price"
              type="number"
              value={packageForm.price}
              onChange={(e) =>
                setPackageForm({ ...packageForm, price: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="services">
              Services (comma separated)
            </FieldLabel>
            <Textarea
              id="services"
              value={packageForm.services}
              onChange={(e) =>
                setPackageForm({ ...packageForm, services: e.target.value })
              }
              placeholder="Studio Access, Pro Lighting, Makeup Artist"
              rows={4}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              value={packageForm.description}
              onChange={(e) =>
                setPackageForm({ ...packageForm, description: e.target.value })
              }
              rows={3}
            />
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
            <FieldLabel htmlFor="name">Add-on Name</FieldLabel>
            <Input
              id="name"
              value={addonForm.name}
              onChange={(e) =>
                setAddonForm({ ...addonForm, name: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="price">Price (RM)</FieldLabel>
            <Input
              id="price"
              type="number"
              value={addonForm.price}
              onChange={(e) =>
                setAddonForm({ ...addonForm, price: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
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
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              value={promoImageForm.name}
              onChange={(e) =>
                setPromoImageForm({ ...promoImageForm, name: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              value={promoImageForm.description}
              onChange={(e) =>
                setPromoImageForm({ ...promoImageForm, description: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="image">Promo Image</FieldLabel>
            <Input
              id="image"
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
