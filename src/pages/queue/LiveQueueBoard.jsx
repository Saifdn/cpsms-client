// LiveQueueBoard.jsx
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLiveQueue } from "@/hooks/counter/useLiveQueue";
import { Clock, Users, ArrowRight, UserCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { speakQueue } from "@/lib/speakQueue";

const LiveQueueBoard = () => {
  const { activeQueue, isConnected } = useLiveQueue();

  const waitingList = activeQueue.filter((q) => q.status === "waiting");
  const calledList = activeQueue.filter((q) => q.status === "called");
  const inProgressList = activeQueue.filter((q) => q.status === "in-progress");

  const prevCalledRef = useRef([]);

  useEffect(() => {
    const prevCalled = prevCalledRef.current;

    const newCalled = calledList.filter(
      (item) => !prevCalled.some((prev) => prev._id === item._id),
    );

    if (newCalled.length > 0) {
      newCalled.forEach((item) => {
        speakQueue(item.queueNumber, item.studio?.name);
      });
    }

    prevCalledRef.current = calledList;
  }, [calledList]);

  return (
    <Page>
      <PageHeader
        title="Live Queue Board"
        description="Real-time studio queue status"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
        {/* 1. Waiting Column */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-orange-50 dark:bg-orange-950 border-b border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-orange-700 dark:text-orange-300">
                  Waiting
                </CardTitle>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {waitingList.length} customers
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-3 min-h-[420px]">
            {waitingList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Users className="h-12 w-12 mb-3 opacity-50" />
                <p>No one waiting</p>
              </div>
            ) : (
              waitingList.map((item) => (
                <div
                  key={item._id}
                  className="bg-card border border-border p-4 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="font-mono text-lg font-semibold tracking-wider text-orange-600 dark:text-orange-400">
                    #{item.queueNumber}
                  </div>
                  <div className="mt-2 font-medium">
                    {item.booking?.graduate?.fullName || "Unknown"}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* 2. Called Column - Highlighted */}
        <Card className="border-blue-300 dark:border-blue-700 ring-1 ring-blue-200 dark:ring-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-blue-700 dark:text-blue-300">
                  Called
                </CardTitle>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {calledList.length} customers
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4 min-h-[420px]">
            {calledList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <ArrowRight className="h-12 w-12 mb-3 opacity-40" />
                <p>No one called yet</p>
              </div>
            ) : (
              calledList.map((item) => (
                <div
                  key={item._id}
                  className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-300 dark:border-blue-600 p-5 rounded-2xl"
                >
                  <div className="font-mono text-3xl font-bold text-blue-600 dark:text-blue-400">
                    #{item.queueNumber}
                  </div>
                  <div className="mt-3 text-lg font-medium">
                    {item.booking?.graduate?.fullName || "Customer"}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    {item.studio?.name || "Studio"}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* 3. In Progress Column */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-950 border-b border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-green-700 dark:text-green-300">
                  In Progress
                </CardTitle>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {inProgressList.length} customers
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-3 min-h-[420px]">
            {inProgressList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <UserCheck className="h-12 w-12 mb-3 opacity-40" />
                <p>No one in studio</p>
              </div>
            ) : (
              inProgressList.map((item) => (
                <div
                  key={item._id}
                  className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 p-4 rounded-xl"
                >
                  <div className="font-mono text-lg font-semibold text-green-600 dark:text-green-400">
                    #{item.queueNumber}
                  </div>
                  <div className="mt-2 font-medium">
                    {item.booking?.graduate?.fullName || "Customer"}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default LiveQueueBoard;
