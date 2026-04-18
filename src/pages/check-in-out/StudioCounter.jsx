// StudioCounter.jsx
import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { Play, CheckCircle, LogOut, Wifi, WifiOff } from "lucide-react";

import { useStudios } from "@/hooks/studio/useStudios";
import { useLiveQueue } from "@/hooks/counter/useLiveQueue";
import { 
  useCallNext, 
  useConfirmArrival, 
  useCheckOut 
} from "@/hooks/counter/useQueue";

import QrScanner from "@/components/QrScanner";

const StudioCounter = () => {
  const { data: studiosData } = useStudios();
  const { activeQueue, isConnected } = useLiveQueue();

  const callNextMutation = useCallNext();
  const confirmArrivalMutation = useConfirmArrival();
  const checkOutMutation = useCheckOut();

  const studios = studiosData?.data || [];
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  // Improved calledCustomer detection
  const calledCustomer = useMemo(() => {
    if (!selectedStudio) return null;

    return activeQueue.find((q) => {
      const studioIdFromQueue = q.studio?._id || q.studio; // handle both string and object
      const selectedStudioId = selectedStudio._id || selectedStudio.id;

      return studioIdFromQueue === selectedStudioId && q.status === "called";
    });
  }, [activeQueue, selectedStudio]);

  const currentUser = useMemo(() => {
    if (!selectedStudio) return null;

    return activeQueue.find((q) => {
      const studioIdFromQueue = q.studio?._id || q.studio;
      const selectedStudioId = selectedStudio._id || selectedStudio.id;

      return studioIdFromQueue === selectedStudioId && q.status === "in-progress";
    });
  }, [activeQueue, selectedStudio]);

  const nextInQueue = activeQueue.find((q) => q.status === "waiting");

  // Handlers
  const handleCallNext = () => {
    if (!selectedStudio) return;
    callNextMutation.mutate({ studioId: selectedStudio._id });
    setShowScanner(true);
  };

  const handleQrScan = (scannedValue) => {
    console.log("Scanned:", scannedValue);

    if (!calledCustomer) {
      alert("No customer is currently called for this studio.");
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
      alert("Scanned QR does not match the called customer. Please try again.");
    }
  };

  const handleCheckOut = () => {
    if (!currentUser) return;
    checkOutMutation.mutate({ queueId: currentUser._id });
  };

  return (
    <Page>
      <PageHeader
        title="Studio Counter"
        description="Call Next → Scan QR to confirm → Check-out"
      />

      <div className="grid gap-6 py-8 lg:grid-cols-12">
        {/* Left: Studios */}
        <div className="lg:col-span-5">
          <h2 className="text-lg font-semibold mb-4">Studios</h2>
          <div className="grid gap-3">
            {studios.map((studio) => (
              <Card
                key={studio._id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedStudio?._id === studio._id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedStudio(studio)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{studio.name}</CardTitle>
                    <Badge variant={studio.isAvailable ? "default" : "destructive"}>
                      {studio.isAvailable ? "Free" : "Occupied"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{studio.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Control Panel */}
        <div className="lg:col-span-7">
          {selectedStudio ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedStudio.name}</CardTitle>
                <p className="text-muted-foreground">{selectedStudio.location}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                  {isConnected ? "Live" : "Connecting..."}
                </div>

                {/* Called Customer */}
                {calledCustomer && (
                  <div className="bg-blue-50 border-2 border-blue-300 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-xl font-bold text-blue-700">Called Customer</h3>
                        <p className="text-blue-600">Waiting for QR scan confirmation</p>
                      </div>
                    </div>

                    <p className="text-2xl font-semibold">
                      {calledCustomer.booking?.graduate?.fullName || "Customer"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Queue #{calledCustomer.queueNumber}
                    </p>

                    <Button 
                      onClick={() => setShowScanner(true)}
                      className="mt-6 w-full"
                      size="lg"
                    >
                      Open QR Scanner
                    </Button>
                  </div>
                )}

                {/* Current User in Studio */}
                {currentUser && (
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                    <h3 className="font-semibold text-amber-700 mb-3">Currently in Studio</h3>
                    <p className="text-xl">
                      {currentUser.booking?.graduate?.fullName}
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={handleCheckOut}
                      disabled={checkOutMutation.isPending}
                      className="mt-4 w-full"
                    >
                      Check-out Customer
                    </Button>
                  </div>
                )}

                {/* Call Next Button */}
                {!calledCustomer && !currentUser && (
                  <Button 
                    onClick={handleCallNext}
                    disabled={!nextInQueue || callNextMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Call Next Customer
                  </Button>
                )}

                {!calledCustomer && !currentUser && !nextInQueue && (
                  <div className="text-center py-12 text-muted-foreground">
                    No customers waiting in queue.
                  </div>
                )}

                {/* QR Scanner */}
                {showScanner && (
                  <QrScanner onScan={handleQrScan} />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Select a studio from the left</p>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
};

export default StudioCounter;