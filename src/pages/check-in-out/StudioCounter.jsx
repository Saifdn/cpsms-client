import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Users, Play, LogOut, Loader2 } from "lucide-react";

import { useStudios } from "@/hooks/studio/useStudios";
import { useActiveQueue, useCallNext, useCheckOut } from "@/hooks/counter/useQueue";

const StudioCounter = () => {
  const { data: studiosData, isLoading: studiosLoading } = useStudios();
  const { data: activeQueueData, isLoading: queueLoading } = useActiveQueue();

  const callNextMutation = useCallNext();
  const checkOutMutation = useCheckOut();

  const studios = studiosData?.data || [];
  const activeQueue = activeQueueData?.data || [];

  const [selectedStudio, setSelectedStudio] = useState(null);

  // Get the next waiting person
  const nextInQueue = activeQueue.find(q => q.status === "waiting");

  // Get current person in this studio
  const currentUser = activeQueue.find(q => 
    q.studio?._id === selectedStudio?._id && 
    (q.status === "in-progress" || q.status === "called")
  );

  const handleCallNext = () => {
    if (!selectedStudio || !nextInQueue) return;
    callNextMutation.mutate(selectedStudio._id);
  };

  const handleCheckOut = () => {
    if (!currentUser) return;
    checkOutMutation.mutate(currentUser._id);
  };

  return (
    <Page>
      <PageHeader
        title="Studio Counter"
        description="Manage active studios and call next customer"
      />

      <div className="grid gap-6 py-8 lg:grid-cols-12">

        {/* Left: List of Studios */}
        <div className="lg:col-span-5">
          <h2 className="text-lg font-semibold mb-4">Active Studios</h2>
          
          {studiosLoading ? (
            <div className="text-center py-8">Loading studios...</div>
          ) : (
            <div className="grid gap-4">
              {studios.map((studio) => (
                <Card 
                  key={studio._id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedStudio?._id === studio._id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedStudio(studio)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{studio.name}</CardTitle>
                      <Badge variant={studio.isAvailable ? "default" : "destructive"}>
                        {studio.isAvailable ? "Free" : "Occupied"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{studio.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Studio Control Panel */}
        <div className="lg:col-span-7">
          {selectedStudio ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{selectedStudio.name}</CardTitle>
                <p className="text-muted-foreground">{selectedStudio.location}</p>
              </CardHeader>

              <CardContent className="space-y-6">

                {/* Current Status */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Studio Status</p>
                  <p className="text-lg font-semibold">
                    {selectedStudio.isAvailable ? "✅ Available" : "⏳ Occupied"}
                  </p>
                </div>

                {/* Next in Queue */}
                {nextInQueue ? (
                  <div>
                    <p className="font-medium mb-2">Next Customer</p>
                    <div className="bg-white border rounded-lg p-4">
                      <div className="font-semibold">Queue #{nextInQueue.queueNumber}</div>
                      <div className="text-sm mt-1">
                        {nextInQueue.booking?.graduate?.fullName}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No customers waiting in queue.
                  </div>
                )}

                {/* Current User in Studio */}
                {currentUser && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="font-medium text-amber-700">Currently in Studio</p>
                    <p className="text-sm mt-1">
                      {currentUser.booking?.graduate?.fullName}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCallNext}
                    disabled={!nextInQueue || !selectedStudio.isAvailable}
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Call Next Customer
                  </Button>

                  <Button 
                    variant="destructive"
                    onClick={handleCheckOut}
                    disabled={!currentUser}
                    className="flex-1"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Check-out Current User
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-64 flex items-center justify-center border rounded-lg text-muted-foreground">
              Select a studio from the left to begin managing
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default StudioCounter;