// pages/booking/steps/Step2_PackageSelection.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePackages } from "@/hooks/studio/usePackages";
import { useState } from "react";

const Step2_PackageSelection = ({ data, updateData, onNext, onPrev }) => {
  const { data: packagesData } = usePackages();
  const packages = packagesData?.data || [];
  const [selectedPackage, setSelectedPackage] = useState(data.selectedPackage);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    updateData({ selectedPackage: pkg });
  };

  const handleContinue = () => {
    if (selectedPackage) onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Choose Package</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            // <Card
            //   key={pkg._id}
            //   className={`cursor-pointer transition-all hover:shadow-md ${
            //     selectedPackage?._id === pkg._id ? "ring-2 ring-primary" : ""
            //   }`}
            //   onClick={() => handleSelectPackage(pkg)}
            // >
            //   <CardContent className="p-6">
            //     <div className="flex justify-between">
            //       <h3 className="font-semibold text-lg">{pkg.name}</h3>
            //       <span className="text-2xl font-bold">RM {pkg.price}</span>
            //     </div>
            //     <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
            //   </CardContent>
            // </Card>

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

        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!selectedPackage} className="flex-1">
            Continue to Delivery Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2_PackageSelection;