import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Minus, Plus, ShoppingBag, PackageOpen, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFrames } from "@/hooks/frames/useFrames";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const FrameCardSkeleton = () => (
  <div className="rounded-xl border p-4 flex items-center gap-4">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-4 w-5" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Step1_FrameSelection = ({ data, updateData, onNext }) => {
  const navigate = useNavigate();
  const { data: framesData, isLoading, isError } = useFrames();
  const frames = useMemo(() => framesData?.data ?? [], [framesData]);

  const [cart, setCart] = useState(data.cart ?? {});

  const cartItems = useMemo(
    () =>
      frames
        .filter((f) => cart[f._id] > 0)
        .map((f) => ({ frame: f, quantity: cart[f._id] })),
    [frames, cart],
  );

  const total = useMemo(
    () => cartItems.reduce((sum, { frame, quantity }) => sum + frame.price * quantity, 0),
    [cartItems],
  );

  const increment = (frameId) =>
    setCart((prev) => ({ ...prev, [frameId]: (prev[frameId] || 0) + 1 }));

  const decrement = (frameId) =>
    setCart((prev) => {
      const qty = (prev[frameId] || 0) - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[frameId];
        return next;
      }
      return { ...prev, [frameId]: qty };
    });

  const handleNext = () => {
    updateData({ cart, frames });
    onNext();
  };

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-36" />
            <div className="grid gap-3 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => <FrameCardSkeleton key={n} />)}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="lg" className="flex-1" disabled>Cancel</Button>
            <Button size="lg" className="flex-1" disabled>Continue to Delivery</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────

  if (isError) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to load frames</h2>
          <p className="text-muted-foreground">Something went wrong. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  // ─── Empty ──────────────────────────────────────────────────────────────────

  if (frames.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
            <PackageOpen className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No frames available</h2>
          <p className="text-muted-foreground">Check back later for available frame products.</p>
        </CardContent>
      </Card>
    );
  }

  // ─── Main ───────────────────────────────────────────────────────────────────

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Select Your Frames
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose the frames you'd like to order for your graduation photos.
        </p>
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        {/* Frames grid */}
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Available Frames
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {frames.map((frame) => {
              const qty = cart[frame._id] || 0;
              const isInCart = qty > 0;

              return (
                <div
                  key={frame._id}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 transition-all",
                    isInCart
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "bg-background",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{frame.name}</div>
                    {frame.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {frame.description}
                      </div>
                    )}
                    <div className="text-sm font-bold text-primary mt-0.5">
                      RM {Number(frame.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => decrement(frame._id)}
                      disabled={qty === 0}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => increment(frame._id)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart summary */}
        {cartItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Cart Summary
              </p>
              <div className="rounded-xl border p-4 space-y-2">
                {cartItems.map(({ frame, quantity }) => (
                  <div key={frame._id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {frame.name}{" "}
                      <span className="text-foreground font-medium">×{quantity}</span>
                    </span>
                    <span className="tabular-nums font-medium">
                      RM {(frame.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator className="my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-1.5 text-sm">
                    <Receipt className="h-4 w-4" />
                    Total
                  </span>
                  <span className="text-xl font-bold text-primary">RM {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="lg" onClick={() => navigate("/")} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={cartItems.length === 0}
            className="flex-1"
            size="lg"
          >
            Continue to Delivery
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1_FrameSelection;
