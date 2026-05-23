import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePackages } from "@/hooks/studio/usePackages";
import { useAddons } from "@/hooks/studio/useAddons";
import { useState } from "react";
import { CheckCircle2, Star, Package, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleToggleAddon = (addon) => {
    const exists = selectedAddons.some((item) => item._id === addon._id);
    const updatedAddons = exists
      ? selectedAddons.filter((item) => item._id !== addon._id)
      : [...selectedAddons, addon];
    setSelectedAddons(updatedAddons);
    updateData({ selectedAddons: updatedAddons });
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
              {[1, 2].map((n) => (
                <div key={n} className="h-64 animate-pulse rounded-xl bg-muted" />
              ))}
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
                    {/* Top accent stripe */}
                    <div className={cn("h-1 w-full", isSelected ? "bg-primary" : "bg-muted")} />

                    <div className="flex flex-1 flex-col p-5 gap-4">
                      {/* Header row */}
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

                      {/* Price */}
                      <div>
                        <span className="text-3xl font-bold">RM {pkg.price}</span>
                        <span className="text-sm text-muted-foreground"> / session</span>
                      </div>

                      {/* Services */}
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
              {[1, 2].map((n) => (
                <div key={n} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : addons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No add-ons available.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {addons.map((addon) => {
                const isSelected = selectedAddons.some((item) => item._id === addon._id);
                return (
                  <button
                    key={addon._id}
                    type="button"
                    onClick={() => handleToggleAddon(addon)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "bg-background hover:border-primary/40 hover:shadow-sm",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground",
                      )}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <PlusCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{addon.name}</div>
                      {addon.description && (
                        <div className="text-xs text-muted-foreground truncate">{addon.description}</div>
                      )}
                    </div>
                    <div className="shrink-0 text-sm font-bold text-primary">
                      +RM {addon.price}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!selectedPackage} className="flex-1">
            Continue to Delivery
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2_PackageSelection;
