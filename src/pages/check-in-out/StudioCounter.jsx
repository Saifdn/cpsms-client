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

  // Improved called customer detection (handles string or object studio)
  const calledCustomer = useMemo(() => {
    if (!selectedStudio) return null;

    return activeQueue.find((q) => {
      const queueStudioId = q.studio?._id || q.studio;           // string or object
      const selectedId = selectedStudio._id || selectedStudio.id;

      return queueStudioId === selectedId && q.status === "called";
    });
  }, [activeQueue, selectedStudio]);

  const currentUser = useMemo(() => {
    if (!selectedStudio) return null;

    return activeQueue.find((q) => {
      const queueStudioId = q.studio?._id || q.studio;
      const selectedId = selectedStudio._id || selectedStudio.id;

      return queueStudioId === selectedId && q.status === "in-progress";
    });
  }, [activeQueue, selectedStudio]);

  const nextInQueue = activeQueue.find((q) => q.status === "waiting");

  // Handlers
  const handleCallNext = () => {
    if (!selectedStudio) return;
    callNextMutation.mutate({ studioId: selectedStudio._id });
    setShowScanner(true); // Auto open scanner
  };

  const handleQrScan = (scannedValue) => {
    console.log("Scanned value:", scannedValue);

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
        {/* Left: Studios List */}
        <div className="lg:col-span-5">
          <h2 className="text-lg font-semibold mb-4">Studios</h2>
          <div className="grid gap-3">
            {studios.map((studio) => (
              <Card
                key={studio._id}
                className={`cursor-pointer transition-all hover:shadow-md border ${
                  selectedStudio?._id === studio._id 
                    ? "ring-2 ring-primary border-primary" 
                    : "hover:border-border"
                }`}
                onClick={() => setSelectedStudio(studio)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{studio.name}</CardTitle>
                    <Badge 
                      variant={studio.isOccupied ? "destructive" : "secondary"}
                    >
                      {studio.isOccupied ? "Occupied" : "Free"}
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
                {/* Connection Status */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                  {isConnected ? "Live updates enabled" : "Connecting to server..."}
                </div>

                {/* Called Customer - Most Prominent */}
                {calledCustomer && (
                  <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-300 dark:border-blue-700 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">Called Customer</h3>
                        <p className="text-blue-600 dark:text-blue-400">Waiting for QR scan confirmation</p>
                      </div>
                    </div>

                    <p className="text-2xl font-semibold text-foreground">
                      {calledCustomer.booking?.graduate?.fullName || "Customer"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
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

                {/* Currently in Studio */}
                {currentUser && (
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 p-6 rounded-xl">
                    <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-3">Currently in Studio</h3>
                    <p className="text-xl font-medium">
                      {currentUser.booking?.graduate?.fullName}
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={handleCheckOut}
                      disabled={checkOutMutation.isPending}
                      className="mt-4 w-full"
                    >
                      {checkOutMutation.isPending ? "Checking out..." : "Check-out Customer"}
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
                    {callNextMutation.isPending ? "Calling..." : "Call Next Customer"}
                  </Button>
                )}

                {!calledCustomer && !currentUser && !nextInQueue && (
                  <div className="text-center py-12 text-muted-foreground">
                    No customers waiting in queue at the moment.
                  </div>
                )}

                {/* QR Scanner */}
                {showScanner && (
                  <QrScanner onScan={handleQrScan} />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-80 flex items-center justify-center border-dashed">
              <p className="text-muted-foreground">Select a studio from the left to manage</p>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
};

export default StudioCounter;