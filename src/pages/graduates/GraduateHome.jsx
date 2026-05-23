// pages/graduate/GraduateHome.jsx
import { useState, useEffect, useCallback } from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePackages } from "@/hooks/studio/usePackages";
import { usePromoAds } from "@/hooks/studio/usePromoAds";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ChevronLeft, ChevronRight,
  CheckCircle2, Star, ZoomIn, Camera,
} from "lucide-react";


// ─── Promo Carousel ──────────────────────────────────────────────────────────

const PromoCarousel = ({ promoAds }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % promoAds.length);
  }, [promoAds.length]);

  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + promoAds.length) % promoAds.length);

  useEffect(() => {
    if (isPaused || promoAds.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isPaused, next, promoAds.length]);

  const current = promoAds[currentIndex];

  return (
    <>
      <div
        className="relative h-[380px] rounded-2xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={current.imageBase64}
          alt={current.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Zoom hint */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-5 w-5 text-white" />
        </div>

        {/* Slide info */}
        <div className="absolute bottom-14 left-6 right-16 text-white">
          <h3 className="text-2xl font-bold drop-shadow-lg">{current.name}</h3>
          {current.description && (
            <p className="text-sm text-white/85 mt-1 drop-shadow">{current.description}</p>
          )}
        </div>

        {/* Dot indicators */}
        {promoAds.length > 1 && (
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {promoAds.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Arrow navigation */}
        {promoAds.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Full-image lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          <img
            src={current.imageBase64}
            alt={current.name}
            className="w-full h-auto max-h-[85vh] object-contain"
          />
          {(current.name || current.description) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
              <p className="text-white font-semibold text-lg">{current.name}</p>
              {current.description && (
                <p className="text-white/80 text-sm">{current.description}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─── Package Card ─────────────────────────────────────────────────────────────

const PackageCard = ({ pkg, onBook }) => (
  <Card
    className={`relative flex flex-col overflow-hidden transition-all duration-300
      hover:-translate-y-1.5 hover:shadow-2xl
      ${pkg.isPopular ? "ring-2 ring-primary shadow-xl" : "shadow-sm"}`}
  >
    {/* Gradient top stripe using primary colour */}
    <div className="h-1.5 w-full bg-primary" />

    {/* Popular banner */}
    {pkg.isPopular && (
      <div className="bg-primary text-primary-foreground text-center text-xs font-semibold py-1.5 flex items-center justify-center gap-1.5 tracking-wide">
        <Star className="h-3 w-3 fill-current" />
        MOST POPULAR
      </div>
    )}

    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-xl font-bold leading-tight mb-1.5">
            {pkg.name}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed line-clamp-2">
            {pkg.description}
          </CardDescription>
        </div>
        {/* Camera icon badge */}
        <div className="shrink-0 rounded-xl p-2.5 bg-primary/10 text-primary">
          <Camera className="h-5 w-5" />
        </div>
      </div>
    </CardHeader>

    <CardContent className="flex flex-col flex-1 gap-5 pt-0">
      {/* Price block */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tracking-tight text-primary">
          RM {pkg.price}
        </span>
        <span className="text-muted-foreground text-sm font-medium">/ session</span>
      </div>

      <Separator />

      {/* Services */}
      <div className="space-y-2.5 text-sm flex-1">
        {pkg.services?.map((service, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <span className="text-foreground/80 leading-snug">{service}</span>
          </div>
        ))}
      </div>

      <Button
        className="w-full font-semibold tracking-wide"
        size="lg"
        onClick={() => onBook(pkg)}
      >
        Book This Package
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const GraduateHome = () => {
  const { data: packagesData, isLoading } = usePackages();
  const { data: promoAds, isLoading: promoLoading } = usePromoAds();
  const navigate = useNavigate();

  const packages = packagesData?.data || [];
  const ads = promoAds?.data || [];

  const handleBookPackage = (pkg) =>
    navigate(`/book?packageId=${pkg._id}`, { state: { selectedPackage: pkg } });

  const handleGeneralBookNow = () => navigate("/book");

  return (
    <Page>
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
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
            <Button size="lg" onClick={handleGeneralBookNow}>
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* ── Promo Ads Carousel ────────────────────────────────────────────── */}
      {!promoLoading && ads.length > 0 && (
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Special Promotions</h2>
            <p className="text-muted-foreground text-sm mt-1">Click any slide to view full image</p>
          </div>
          <PromoCarousel promoAds={ads} />
        </div>
      )}

      {/* ── Packages Section ──────────────────────────────────────────────── */}
      <div className="mb-12">
        {/* Section header */}
        <div className="mb-10 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            Studio Packages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Choose Your Perfect Package
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Select from our curated photography packages designed to capture
            your graduation milestone beautifully.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center py-12 text-muted-foreground">Loading packages…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-start">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg._id}
                pkg={pkg}
                onBook={handleBookPackage}
              />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

export default GraduateHome;
