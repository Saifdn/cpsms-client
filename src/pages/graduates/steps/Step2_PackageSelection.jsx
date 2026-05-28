import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePackages } from "@/hooks/studio/usePackages";
import { useAddons } from "@/hooks/studio/useAddons";
import { useState } from "react";
import { CheckCircle2, Star, Package, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Skeletons ────────────────────────────────────────────────────────────────

const PackageCardSkeleton = () => (
  <div className="rounded-xl border overflow-hidden">
    <div className="h-1 w-full bg-muted" />
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  </div>
);

const AddonSkeleton = () => (
  <div className="rounded-xl border p-4 flex items-center gap-4">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Skeleton className="h-7 w-7 rounded-md" />
      <Skeleton className="h-4 w-5" />
      <Skeleton className="h-7 w-7 rounded-md" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Step2_PackageSelection = ({ data, updateData, onNext, onPrev }) => {
  const { data: packagesData, isLoading: packagesLoading } = usePackages();
  const { data: addonsData, isLoading: addonsLoading } = useAddons();
  const packages = packagesData?.data || [];
  const addons = addonsData?.data || [];

  const [selectedPackage, setSelectedPackage] = useState(data.selectedPackage);
  const [selectedAddons, setSelectedAddons] = useState(data.selectedAddons || []);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    updateData({ selectedPackage: pkg });
  };

  const getAddonQty = (addon) =>
    selectedAddons.filter((item) => item._id === addon._id).length;

  const incrementAddon = (addon) => {
    const updated = [...selectedAddons, addon];
    setSelectedAddons(updated);
    updateData({ selectedAddons: updated });
  };

  const decrementAddon = (addon) => {
    let removed = false;
    const updated = selectedAddons.filter((item) => {
      if (!removed && item._id === addon._id) {
        removed = true;
        return false;
      }
      return true;
    });
    setSelectedAddons(updated);
    updateData({ selectedAddons: updated });
  };

  const handleContinue = () => {
    if (selectedPackage) onNext();
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="h-5 w-5 text-primary" />
          Choose Your Package
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select one main package and optionally add extras.
        </p>
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        {/* Packages */}
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Main Packages
          </p>

          {packagesLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((n) => <PackageCardSkeleton key={n} />)}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {packages.map((pkg) => {
                const isSelected = selectedPackage?._id === pkg._id;
                return (
                  <button
                    key={pkg._id}
                    type="button"
                    onClick={() => handleSelectPackage(pkg)}
                    className={cn(
                      "relative flex flex-col overflow-hidden rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-primary ring-2 ring-primary shadow-lg shadow-primary/10"
                        : "bg-background hover:border-primary/40 hover:shadow-md",
                    )}
                  >
                    <div className={cn("h-1 w-full", isSelected ? "bg-primary" : "bg-muted")} />

                    <div className="flex flex-1 flex-col p-5 gap-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-base font-bold">{pkg.name}</div>
                          {pkg.description && (
                            <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              {pkg.description}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {pkg.isPopular && (
                            <Badge className="flex items-center gap-1 bg-primary text-primary-foreground text-xs">
                              <Star className="h-3 w-3 fill-current" />
                              Popular
                            </Badge>
                          )}
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-3xl font-bold">RM {pkg.price}</span>
                        <span className="text-sm text-muted-foreground"> / session</span>
                      </div>

                      {pkg.services?.length > 0 && (
                        <ul className="space-y-1.5">
                          {pkg.services.slice(0, 5).map((service, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                              <span>{service}</span>
                            </li>
                          ))}
                          {pkg.services.length > 5 && (
                            <li className="text-xs text-muted-foreground pl-5">
                              +{pkg.services.length - 5} more
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Add-ons */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Optional Add-ons
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enhance your session with extras. You can select multiple.
            </p>
          </div>

          {addonsLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[1, 2].map((n) => <AddonSkeleton key={n} />)}
            </div>
          ) : addons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No add-ons available.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {addons.map((addon) => {
                const qty = getAddonQty(addon);
                const isSelected = qty > 0;
                return (
                  <div
                    key={addon._id}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-4 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "bg-background",
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{addon.name}</div>
                      {addon.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {addon.description}
                        </div>
                      )}
                      <div className="text-sm font-bold text-primary mt-0.5">
                        +RM {addon.price}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => decrementAddon(addon)}
                        disabled={qty === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => incrementAddon(addon)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="lg" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button size="lg" onClick={handleContinue} disabled={!selectedPackage} className="flex-1">
            Continue to Delivery
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2_PackageSelection;
