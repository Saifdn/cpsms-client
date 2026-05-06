// pages/booking/steps/Step2_PackageSelection.jsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePackages } from "@/hooks/studio/usePackages";
import { useAddons } from "@/hooks/studio/useAddons";
import { useState } from "react";

const Step2_PackageSelection = ({ data, updateData, onNext, onPrev }) => {
  const { data: packagesData } = usePackages();
  const { data: addonsData } = useAddons();
  const packages = packagesData?.data || [];
  const addons = addonsData?.data || [];
  const [selectedPackage, setSelectedPackage] = useState(data.selectedPackage);
  const [selectedAddons, setSelectedAddons] = useState(
    data.selectedAddons || [],
  );

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
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Choose Package</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Packages</h3>
            <p className="text-sm text-muted-foreground">
              Choose one main package.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg._id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPackage?._id === pkg._id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSelectPackage(pkg)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    {pkg.isPopular && <Badge>Popular</Badge>}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <span className="text-4xl font-bold">RM {pkg.price}</span>
                    <span className="text-muted-foreground"> / session</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {pkg.services?.slice(0, 5).map((service, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        {service}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Add-ons</h3>
            <p className="text-sm text-muted-foreground">
              Optionally select one or more add-ons.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addons.map((pkg) => (
              <Card
                key={pkg._id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAddons.some((addon) => addon._id === pkg._id)
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => handleToggleAddon(pkg)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    {pkg.isPopular && <Badge>Popular</Badge>}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <span className="text-2xl font-bold">+ RM {pkg.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedPackage}
            className="flex-1"
          >
            Continue to Delivery Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2_PackageSelection;
