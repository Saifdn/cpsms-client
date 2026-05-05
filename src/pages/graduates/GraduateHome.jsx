// pages/graduate/GraduateHome.jsx
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePackages } from "@/hooks/studio/usePackages";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Users } from "lucide-react";

const GraduateHome = () => {
  const { data: packagesData, isLoading } = usePackages();
  const navigate = useNavigate();

  const packages = packagesData?.data || [];

  const handleBookPackage = (pkg) => {
    navigate(`/book?packageId=${pkg._id}`, {
      state: { selectedPackage: pkg }
    });
  };

  const handleGeneralBookNow = () => {
    navigate("/book"); // No package pre-selected
  };

  return (
    <Page>
      {/* Hero Banner */}
      <div className="relative h-[520px] rounded-3xl overflow-hidden mb-12">
        <img
          src="/hero-studio.svg"
          alt="KFK Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative h-full flex items-center">
          <div className="max-w-2xl px-10 md:px-16">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Premium Studio Experience
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Capture Your<br />Best Moments
            </h1>

            <p className="text-lg text-white/90 max-w-md mb-8">
              Professional photography and videography in a world-class studio.
            </p>

            <Button 
              size="lg" 
              className="mr-4"
              onClick={handleGeneralBookNow}
            >
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="mb-12">
        <PageHeader
          title="Our Studio Packages"
          description="Choose the perfect package for your session"
        />

        {isLoading ? (
          <p className="text-center py-12">Loading packages...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg._id} className="hover:shadow-xl transition-all duration-300">
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

                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={() => handleBookPackage(pkg)}
                  >
                    Book This Package
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

export default GraduateHome;