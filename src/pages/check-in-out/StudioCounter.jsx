import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useMemo } from "react";
import {
  Play,
  CheckCircle,
  CheckCircle2,
  LogOut,
  MapPin,
  Users,
  Camera,
  ScanQrCode,
  SkipForward,
  Mail,
  Phone,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

import { useStudios } from "@/hooks/studio/useStudios";
import { useLiveQueue } from "@/hooks/counter/useLiveQueue";
import {
  useCallNext,
  useConfirmArrival,
  useCheckOut,
  useSkip,
} from "@/hooks/counter/useQueue";

import QrScanner from "@/components/QrScanner";
import { cn } from "@/lib/utils";

// ── Sub-components ─────────────────────────────────────────────────────────────

function StudioSkeletonList() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  ));
}

function ControlPanelSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/40 border-b pb-4">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="rounded-xl border p-4 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const StudioCounter = () => {
  const { data: studiosData, isLoading: studiosLoading } = useStudios();
  const { activeQueue, isConnected, isLoading: queueLoading } = useLiveQueue();

  const callNextMutation = useCallNext();
  const confirmArrivalMutation = useConfirmArrival();
  const checkOutMutation = useCheckOut();
  const skipMutation = useSkip();

  const studios = studiosData?.data || [];
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const isActionPending =
    callNextMutation.isPending ||
    confirmArrivalMutation.isPending ||
    checkOutMutation.isPending ||
    skipMutation.isPending;

  // Derive occupancy from live queue — avoids stale REST data
  const occupiedStudioIds = useMemo(() => {
    const ids = new Set();
    activeQueue.forEach((q) => {
      if (q.status === "in-progress") {
        const id = q.studio?._id || q.studio;
        if (id) ids.add(id);
      }
    });
    return ids;
  }, [activeQueue]);

  // Waiting count per studio
  const waitingCountByStudio = useMemo(() => {
    const map = {};
    activeQueue.forEach((q) => {
      if (q.status === "waiting") {
        const id = q.studio?._id || q.studio;
        if (id) map[id] = (map[id] || 0) + 1;
      }
    });
    return map;
  }, [activeQueue]);

  const selectedId = selectedStudio?._id || selectedStudio?.id;

  const calledCustomer = useMemo(() => {
    if (!selectedId) return null;
    return activeQueue.find((q) => {
      const queueStudioId = q.studio?._id || q.studio;
      return queueStudioId === selectedId && q.status === "called";
    });
  }, [activeQueue, selectedId]);

  const currentUser = useMemo(() => {
    if (!selectedId) return null;
    return activeQueue.find((q) => {
      const queueStudioId = q.studio?._id || q.studio;
      return queueStudioId === selectedId && q.status === "in-progress";
    });
  }, [activeQueue, selectedId]);

  // Any waiting item — studio is assigned by the backend on callNext,
  // so waiting entries don't have a studio field yet.
  const nextInQueue = useMemo(
    () => activeQueue.find((q) => q.status === "waiting"),
    [activeQueue]
  );

  const waitingCount = selectedStudio
    ? (waitingCountByStudio[selectedStudio._id] ?? 0)
    : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCallNext = () => {
    if (!selectedStudio) return;
    callNextMutation.mutate({ studioId: selectedStudio._id });
    setShowScanner(true);
  };

  const handleQrScan = (scannedValue) => {
    if (!calledCustomer) {
      toast.error("No customer is currently called for this studio.");
      setShowScanner(false);
      return;
    }

    const isMatch =
      scannedValue === calledCustomer._id ||
      scannedValue === calledCustomer.booking?.bookingNumber;

    if (isMatch) {
      confirmArrivalMutation.mutate(calledCustomer._id);
      setShowScanner(false);
    } else {
      toast.error("Scanned QR does not match the called customer. Please try again.");
    }
  };

  const handleConfirmCheckOut = () => {
    if (!currentUser) return;
    checkOutMutation.mutate({ queueId: currentUser._id });
    setCheckoutDialogOpen(false);
  };

  const handleConfirmSkip = () => {
    if (!calledCustomer) return;
    setShowScanner(false);
    skipMutation.mutate(calledCustomer.booking?._id);
    setSkipDialogOpen(false);
  };

  const handleSelectStudio = (studio) => {
    if (!studio.isAvailable) return;
    setSelectedStudio(studio);
    setShowScanner(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Page>
      <PageHeader
        title="Studio Counter"
        description="Select a studio, call the next customer, confirm arrival via QR, then check out."
      />

      <div className="grid gap-6 py-8 lg:grid-cols-[320px_1fr]">
        {/* ── Studios Panel ─────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Studios</h2>
            {studiosLoading ? (
              <Skeleton className="h-3 w-14" />
            ) : (
              <span className="text-xs text-muted-foreground">
                {studios.filter((s) => s.isAvailable).length} active
              </span>
            )}
          </div>

          <div className="grid gap-2">
            {studiosLoading ? (
              <StudioSkeletonList />
            ) : studios.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                No studios available
              </div>
            ) : (
              studios.map((studio) => {
                const isInactive = !studio.isAvailable;
                const isSelected = selectedStudio?._id === studio._id;
                const count = waitingCountByStudio[studio._id] ?? 0;

                return (
                  <button
                    key={studio._id}
                    type="button"
                    disabled={isInactive}
                    onClick={() => handleSelectStudio(studio)}
                    className={cn(
                      "w-full text-left rounded-lg border bg-card p-4 transition-all",
                      isInactive
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:shadow-sm hover:border-border/80",
                      isSelected && "ring-2 ring-primary border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={cn("font-medium text-base truncate", isSelected && "text-primary")}>
                          {studio.name}
                        </p>
                        {studio.location && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                            <MapPin size={10} className="shrink-0" />
                            {studio.location}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {isInactive ? (
                          <Badge className="text-xs px-1.5 py-0 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200">
                            Inactive
                          </Badge>
                        ) : occupiedStudioIds.has(studio._id) ? (
                          <Badge className="text-xs px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">
                            Occupied
                          </Badge>
                        ) : (
                          <Badge className="text-xs px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200">
                            Free
                          </Badge>
                        )}

                        {!isInactive && count > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users size={11} />
                            {count} waiting
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Control Panel ─────────────────────────────── */}
        <div>
          {!selectedStudio ? (
            <Card className="flex items-center justify-center border-dashed min-h-[320px]">
              <div className="text-center space-y-2 text-muted-foreground p-8">
                <div className="mx-auto mb-3 rounded-full bg-muted p-4 w-fit">
                  <Camera size={28} className="opacity-40" />
                </div>
                <p className="font-medium">No studio selected</p>
                <p className="text-xs max-w-xs">
                  Select an active studio from the list to start managing the queue
                </p>
              </div>
            </Card>
          ) : queueLoading ? (
            <ControlPanelSkeleton />
          ) : (
            <Card className="overflow-hidden">
              {/* Card Header */}
              <CardHeader className="bg-muted/40 border-b pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Camera size={15} className="text-muted-foreground shrink-0" />
                      <CardTitle className="text-base truncate">{selectedStudio.name}</CardTitle>
                    </div>
                    {selectedStudio.location && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={11} className="shrink-0" />
                        {selectedStudio.location}
                      </p>
                    )}
                    {/* Queue stats strip */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={11} />
                        {waitingCount} waiting
                      </span>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className="text-xs text-muted-foreground">
                        {occupiedStudioIds.has(selectedStudio._id) ? "Studio occupied" : "Studio free"}
                      </span>
                    </div>
                  </div>

                  {/* Connection pill */}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border shrink-0",
                      isConnected
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                    )}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                      )}
                    />
                    {isConnected ? "Live" : "Connecting"}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* ── Called Customer State ── */}
                {calledCustomer && (
                  <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                        <CheckCircle size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                          Customer Called — #{calledCustomer.queueNumber}
                        </p>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                          Waiting for QR scan confirmation
                        </p>
                      </div>
                    </div>

                    <p className="text-xl font-bold text-foreground">
                      {calledCustomer.booking?.graduate?.fullName || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {calledCustomer.booking?.bookingNumber}
                    </p>

                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <Button
                        onClick={() => setShowScanner((v) => !v)}
                        disabled={isActionPending}
                      >
                        <ScanQrCode size={16} className="mr-2" />
                        {showScanner ? "Close Scanner" : "Scan QR to Confirm"}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-950/40"
                        disabled={isActionPending}
                        onClick={() => setSkipDialogOpen(true)}
                      >
                        <SkipForward size={15} className="mr-2" />
                        Skip Customer
                      </Button>
                    </div>
                  </div>
                )}

                {/* ── In Progress State ── */}
                {currentUser && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 overflow-hidden">
                    <div className="px-5 py-3 border-b border-amber-200 dark:border-amber-700">
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        Currently in Studio
                      </p>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Graduate info */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Graduate
                        </p>
                        <p className="text-xl font-bold text-foreground leading-tight">
                          {currentUser.booking?.graduate?.fullName || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                          {currentUser.booking?.bookingNumber}
                        </p>
                        <div className="space-y-1.5">
                          {currentUser.booking?.graduate?.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail size={13} className="shrink-0" />
                              <span>{currentUser.booking.graduate.email}</span>
                            </div>
                          )}
                          {currentUser.booking?.graduate?.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone size={13} className="shrink-0" />
                              <span>{currentUser.booking.graduate.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Package info */}
                      {currentUser.booking?.package && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Package
                          </p>
                          <div className="flex items-center gap-2 mb-1">
                            <Package size={14} className="text-muted-foreground shrink-0" />
                            <p className="font-semibold text-base">
                              {currentUser.booking.package.name}
                            </p>
                          </div>
                          {currentUser.booking.package.description && (
                            <p className="text-sm text-muted-foreground mb-3 pl-5">
                              {currentUser.booking.package.description}
                            </p>
                          )}
                          {Array.isArray(currentUser.booking.package.services) &&
                            currentUser.booking.package.services.length > 0 && (
                              <div className="space-y-1.5 pl-1">
                                {currentUser.booking.package.services.map((service, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2
                                      size={13}
                                      className="text-amber-600 dark:text-amber-400 shrink-0"
                                    />
                                    <span>{service}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      )}

                      <Separator />

                      <Button
                        variant="destructive"
                        onClick={() => setCheckoutDialogOpen(true)}
                        disabled={isActionPending}
                      >
                        <LogOut size={15} className="mr-2" />
                        Check Out Customer
                      </Button>
                    </div>
                  </div>
                )}

                {/* ── Idle State ── */}
                {!calledCustomer && !currentUser && (
                  nextInQueue ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={handleCallNext}
                        disabled={isActionPending}
                      >
                        <Play size={16} className="mr-2" />
                        {callNextMutation.isPending ? "Calling..." : "Call Next Customer"}
                      </Button>

                      {/* Next-up preview */}
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground mb-0.5">Next up</p>
                        <p className="font-medium text-sm">
                          {nextInQueue.booking?.graduate?.fullName || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          #{nextInQueue.queueNumber}
                          {nextInQueue.booking?.bookingNumber && (
                            <> · {nextInQueue.booking.bookingNumber}</>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground border border-dashed rounded-xl">
                      <Users size={28} className="opacity-40" />
                      <p className="text-sm font-medium">Queue is empty</p>
                      <p className="text-xs">No customers waiting for this studio</p>
                    </div>
                  )
                )}

                {/* ── QR Scanner (inline) ── */}
                {showScanner && (
                  <div className="pt-2">
                    <Separator className="mb-4" />
                    <QrScanner onScan={handleQrScan} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Skip Confirmation Dialog ── */}
      <AlertDialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip this customer?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold text-foreground">
                {calledCustomer?.booking?.graduate?.fullName || "This customer"}
              </span>{" "}
              (Queue #{calledCustomer?.queueNumber}) will be moved to the end of the queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleConfirmSkip}
            >
              Skip Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Checkout Confirmation Dialog ── */}
      <AlertDialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Check out customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end the session for{" "}
              <span className="font-semibold text-foreground">
                {currentUser?.booking?.graduate?.fullName || "this customer"}
              </span>{" "}
              and mark the studio as free.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleConfirmCheckOut}
            >
              Check Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
};

export default StudioCounter;
