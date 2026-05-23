// pages/graduate/GraduateHome.jsx
import { useState, useEffect, useCallback } from "react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePackages } from "@/hooks/studio/usePackages";
import { usePromoAds } from "@/hooks/studio/usePromoAds";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ChevronLeft, ChevronRight,
  CheckCircle2, Star, ZoomIn, Camera,
  Users, Image, Award, Sparkles, BookOpen, Download, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";


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
        className="relative h-[380px] md:h-auto md:aspect-video rounded-2xl overflow-hidden group cursor-pointer"
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

        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-5 w-5 text-white" />
        </div>

        <div className="absolute bottom-14 left-6 right-16 text-white">
          <h3 className="text-2xl font-bold drop-shadow-lg">{current.name}</h3>
          {current.description && (
            <p className="text-sm text-white/85 mt-1 drop-shadow">{current.description}</p>
          )}
        </div>

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
    className={cn(
      "relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
      pkg.isPopular ? "ring-2 ring-primary shadow-xl" : "shadow-sm"
    )}
  >
    <div className={cn("h-1.5 w-full", pkg.isPopular ? "bg-primary" : "bg-border")} />

    {pkg.isPopular && (
      <div className="overflow-hidden">
        <div className="absolute top-5 -right-8 rotate-45 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest px-10 py-1 shadow-md">
          POPULAR
        </div>
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
        <div className="shrink-0 rounded-xl p-2.5 bg-primary/10 text-primary">
          <Camera className="h-5 w-5" />
        </div>
      </div>
    </CardHeader>

    <CardContent className="flex flex-col flex-1 gap-5 pt-0">
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tracking-tight text-primary">
          RM {pkg.price}
        </span>
        <span className="text-muted-foreground text-sm font-medium">/ session</span>
      </div>

      <Separator />

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


// ─── Package Skeleton ─────────────────────────────────────────────────────────

const PackageSkeleton = () => (
  <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
    <div className="h-1.5 w-full bg-muted" />
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      </div>
      <Skeleton className="h-9 w-1/2" />
      <Skeleton className="h-px w-full" />
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  </div>
);


// ─── Stats Bar ────────────────────────────────────────────────────────────────

const STATS = [
  { value: "1000+", label: "Graduates Served", icon: Users },
  { value: "5+", label: "Years Experience", icon: Award },
  { value: "100%", label: "Satisfaction Rate", icon: Star },
  { value: "HD", label: "Digital Gallery", icon: Image },
];

const StatsBar = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border shadow-sm mb-10">
    {STATS.map((stat) => {
      const Icon = stat.icon;
      return (
        <div key={stat.label} className="flex flex-col items-center gap-1.5 py-5 px-4 bg-card text-center">
          <div className="rounded-full p-2 bg-primary/10 text-primary mb-0.5">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-2xl font-extrabold text-primary tracking-tight">{stat.value}</span>
          <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
        </div>
      );
    })}
  </div>
);


// ─── Features Grid ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Camera,
    title: "Professional Equipment",
    desc: "Studio-grade cameras, lighting rigs, and backdrops for flawless results.",
  },
  {
    icon: Users,
    title: "Expert Photographers",
    desc: "Experienced team who make you feel comfortable and confident on camera.",
  },
  {
    icon: Award,
    title: "Digital Gallery",
    desc: "Receive high-resolution edited images delivered straight to your inbox.",
  },
];

const FeaturesGrid = () => (
  <div className="mb-14">
    <div className="text-center mb-8">
      <span className="inline-block text-xs font-semibold tracking-widest text-primary uppercase mb-3">
        Our Promise
      </span>
      <h2 className="text-3xl font-bold">Why Choose KFK Studio?</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-5">
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-muted/40 border border-border/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="rounded-2xl p-3.5 bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        );
      })}
    </div>
  </div>
);


// ─── How It Works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: BookOpen,
    title: "Choose Your Package",
    desc: "Browse our curated photography packages and pick the one that suits you best.",
  },
  {
    icon: Camera,
    title: "Book Your Session",
    desc: "Select your preferred date and time slot — booking takes under 2 minutes.",
  },
  {
    icon: Truck,
    title: "Receive Your Photos",
    desc: "Get beautifully printed high-resolution photos delivered to your house.",
  },
];

const HowItWorks = () => (
  <div className="mb-14">
    <div className="text-center mb-10">
      <span className="inline-block text-xs font-semibold tracking-widest text-primary uppercase mb-3">
        Simple Process
      </span>
      <h2 className="text-3xl font-bold">How It Works</h2>
      <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
        Getting your graduation photos is quick and easy — just three steps.
      </p>
    </div>

    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Connecting line (desktop only) */}
      <div className="absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] hidden md:block border-t-2 border-dashed border-primary/25 pointer-events-none" />

      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="flex flex-col items-center text-center gap-4 relative">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg z-10 relative">
                <Icon className="h-7 w-7" />
              </div>
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background">
                {i + 1}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);


// ─── Bottom CTA Banner ────────────────────────────────────────────────────────

const CtaBanner = ({ onBook }) => (
  <div className="relative rounded-3xl overflow-hidden mb-4">
    <div className="absolute inset-0 bg-primary" />
    {/* Decorative circles */}
    <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />
    <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/5" />
    <div className="absolute top-4 right-1/3 h-20 w-20 rounded-full bg-white/5" />

    <div className="relative px-8 py-12 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div>
        <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <span className="text-yellow-300 text-xs font-semibold tracking-widest uppercase">
            Limited Slots Available
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
          Don't Miss Your<br className="hidden md:block" /> Graduation Moment
        </h2>
        <p className="text-white/75 text-sm max-w-sm">
          Secure your studio session today before slots fill up. Memories last forever.
        </p>
      </div>
      <div className="shrink-0">
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl px-8"
          onClick={onBook}
        >
          Book Your Session Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
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

  const scrollToPackages = () =>
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });

  return (
    <Page>
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <img
          src="/hero-studio.svg"
          alt="KFK Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Layered gradient: primary tint + dark */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-primary/20" />
        {/* Subtle dot-pattern texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative flex flex-col justify-between min-h-[520px] py-8 px-5 md:py-10 md:px-14">
          {/* Top: badge */}
          <div>
            <Badge className="bg-white/15 text-white border-white/25 backdrop-blur-sm gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Now Accepting Bookings
            </Badge>
          </div>

          {/* Middle: headline + CTAs */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-3 md:mb-4">
              Capture Your<br />Best Moments
            </h1>
            <p className="text-sm md:text-lg text-white/85 max-w-md mb-5 md:mb-8">
              Professional graduation photography in a world-class studio. A milestone this big deserves to be remembered beautifully.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Button size="lg" onClick={handleGeneralBookNow} className="font-semibold shadow-lg">
                Book a Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToPackages}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm font-semibold"
              >
                Explore Packages
              </Button>
            </div>
          </div>

          {/* Bottom strip: trust signals */}
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {["Professional Equipment", "Expert Photographers", "HD Digital Gallery"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-white/80 text-xs md:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <StatsBar />

      {/* ── Promo Ads Carousel ────────────────────────────────────────────── */}
      {!promoLoading && ads.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Special Promotions</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Click any slide to view full image</p>
            </div>
            <Badge className="gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              Live Offers
            </Badge>
          </div>
          <PromoCarousel promoAds={ads} />
        </div>
      )}

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <FeaturesGrid />

      {/* ── Packages Section ──────────────────────────────────────────────── */}
      <div id="packages" className="mb-14 scroll-mt-6">
        <div className="rounded-3xl bg-primary/5 border border-primary/10 px-6 py-10 md:px-10">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              <PackageSkeleton />
              <PackageSkeleton />
              <PackageSkeleton />
            </div>
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
      </div>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Bottom CTA Banner ─────────────────────────────────────────────── */}
      <CtaBanner onBook={handleGeneralBookNow} />
    </Page>
  );
};

export default GraduateHome;
