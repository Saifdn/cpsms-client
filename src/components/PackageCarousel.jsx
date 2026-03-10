import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function PackageCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <div className="flex items-center justify-center w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative" // ← added relative
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="flex justify-center">
              <div className="p-1">
                <Card className="w-64 sm:w-80 md:w-96">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ← Buttons now positioned absolutely inside the carousel */}
        <CarouselPrevious className="absolute left-2 sm:left-4 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 shadow-md hover:bg-white text-black border border-gray-300 opacity-90 hover:opacity-100" />
        <CarouselNext className="absolute right-2 sm:right-4 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 shadow-md hover:bg-white text-black border border-gray-300 opacity-90 hover:opacity-100" />
      </Carousel>
    </div>
  );
}
