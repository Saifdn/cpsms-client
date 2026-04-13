import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function PackageCarousel({ promoAds = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!promoAds.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          No promo images yet
        </CardContent>
      </Card>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promoAds.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + promoAds.length) % promoAds.length
    );
  };

  const currentPromo = promoAds[currentIndex];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="relative h-[320px] w-full">
          <img
            src={currentPromo.imageBase64}
            alt={currentPromo.name}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold">
              {currentPromo.name}
            </h3>
            <p className="text-sm opacity-90">
              {currentPromo.description}
            </p>
          </div>

          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}