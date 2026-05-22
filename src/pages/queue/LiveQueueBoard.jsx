import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLiveQueue } from "@/hooks/counter/useLiveQueue";
import {
  Clock,
  Users,
  ArrowRight,
  UserCheck,
  Maximize2,
  Minimize2,
  Camera,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { speakQueue } from "@/lib/speakQueue";
import { cn } from "@/lib/utils";

const ConnectionDot = ({ isConnected, className }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <span className="relative flex h-2.5 w-2.5">
      {isConnected && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full h-2.5 w-2.5",
          isConnected ? "bg-green-500" : "bg-red-500",
        )}
      />
    </span>
    <span
      className={cn(
        "text-xs font-medium",
        isConnected ? "text-green-600 dark:text-green-400" : "text-red-500",
      )}
    >
      {isConnected ? "Live" : "Reconnecting…"}
    </span>
  </div>
);

const StatPill = ({ icon, label, count, color }) => {
  const Icon = icon;
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium",
        color,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <span className="font-bold tabular-nums">{count}</span>
    </div>
  );
};

const EmptyState = ({ icon, text, fullscreen }) => {
  const Icon = icon;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-muted-foreground",
        fullscreen ? "h-48 gap-4" : "h-48 gap-3",
      )}
    >
      <Icon
        className={cn("opacity-30", fullscreen ? "h-16 w-16" : "h-12 w-12")}
      />
      <p className={cn("font-medium", fullscreen ? "text-base" : "text-sm")}>
        {text}
      </p>
    </div>
  );
};

const QueueItem = ({ item, variant, fullscreen }) => {
  const variants = {
    waiting: {
      wrapper: "bg-card border border-orange-200 dark:border-orange-800/60 rounded-xl px-4 py-3 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700",
      fsWrapper: "bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 flex items-center gap-5 transition-all duration-300",
      number: "font-mono font-bold tabular-nums text-orange-600 dark:text-orange-400",
      numberSize: fullscreen ? "text-4xl" : "text-2xl",
      name: fullscreen ? "text-base font-medium text-gray-800" : "text-sm font-medium",
      dot: "h-2 w-2 rounded-full bg-orange-400 shrink-0",
    },
    called: {
      wrapper: "bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-300 dark:border-blue-600 rounded-2xl p-5 transition-all duration-300",
      fsWrapper: "bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 transition-all duration-300",
      number: "font-mono font-black tabular-nums text-blue-600 dark:text-blue-300 leading-none",
      numberSize: fullscreen ? "text-7xl" : "text-5xl",
      name: fullscreen ? "text-xl font-semibold text-blue-800 mt-3" : "text-base font-semibold mt-2",
      dot: "h-3 w-3 rounded-full bg-blue-400 animate-pulse shrink-0",
    },
    "in-progress": {
      wrapper: "bg-card border border-green-200 dark:border-green-800/60 rounded-xl px-4 py-3 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-green-300 dark:hover:border-green-700",
      fsWrapper: "bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-5 transition-all duration-300",
      number: "font-mono font-bold tabular-nums text-green-600 dark:text-green-400",
      numberSize: fullscreen ? "text-4xl" : "text-2xl",
      name: fullscreen ? "text-base font-medium text-gray-800" : "text-sm font-medium",
      dot: "h-2 w-2 rounded-full bg-green-400 shrink-0",
    },
  };

  const v = variants[variant];
  const wrapperClass = fullscreen ? v.fsWrapper : v.wrapper;

  if (variant === "called") {
    return (
      <div className={wrapperClass}>
        <div className="flex items-start gap-3">
          <span className={cn(v.dot, "mt-2")} />
          <div>
            <div className={cn(v.number, v.numberSize)}>
              #{item.queueNumber}
            </div>
            <div className={v.name}>
              {item.booking?.graduate?.fullName || "Customer"}
            </div>
            {item.studio?.name && (
              <Badge
                variant="secondary"
                className={cn(
                  "mt-2",
                  fullscreen
                    ? "text-sm bg-blue-100 text-blue-700 border-blue-200"
                    : "text-xs",
                )}
              >
                {item.studio.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <span className={v.dot} />
      <div className={cn(v.number, v.numberSize)}>#{item.queueNumber}</div>
      <div className={v.name}>
        {item.booking?.graduate?.fullName || "Customer"}
      </div>
    </div>
  );
};

const LiveQueueBoard = () => {
  const { activeQueue, isConnected } = useLiveQueue();
  const containerRef = useRef(null);
  const prevCalledRef = useRef([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const waitingList = activeQueue.filter((q) => q.status === "waiting");
  const calledList = activeQueue.filter((q) => q.status === "called");
  const inProgressList = activeQueue.filter((q) => q.status === "in-progress");

  // Speech announcement for newly called items
  useEffect(() => {
    const prevCalled = prevCalledRef.current;
    const newCalled = calledList.filter(
      (item) => !prevCalled.some((prev) => prev._id === item._id),
    );
    if (newCalled.length > 0) {
      newCalled.forEach((item) => speakQueue(item.queueNumber, item.studio?.name));
    }
    prevCalledRef.current = calledList;
  }, [calledList]);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen sync
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("en-MY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statsBar = (
    <div className={cn("flex flex-wrap gap-2", isFullscreen ? "mt-1" : "mt-4")}>
      <StatPill
        icon={Clock}
        label="Waiting"
        count={waitingList.length}
        color="border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40"
      />
      <StatPill
        icon={ArrowRight}
        label="Called"
        count={calledList.length}
        color="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40"
      />
      <StatPill
        icon={UserCheck}
        label="In Progress"
        count={inProgressList.length}
        color="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40"
      />
    </div>
  );

  const queueGrid = (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-3 gap-6",
        isFullscreen ? "flex-1 min-h-0 mt-6" : "py-6",
      )}
    >
      {/* Waiting Column */}
      <Card
        className={cn(
          "flex flex-col border-orange-200 dark:border-orange-800/60",
          isFullscreen &&
            "bg-white border-orange-200 rounded-2xl",
        )}
      >
        <CardHeader
          className={cn(
            "border-b shrink-0",
            isFullscreen
              ? "bg-orange-50 border-orange-200 rounded-t-2xl"
              : "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isFullscreen
                    ? "bg-orange-100"
                    : "bg-orange-100 dark:bg-orange-900",
                )}
              >
                <Clock
                  className={cn(
                    isFullscreen ? "h-7 w-7" : "h-5 w-5",
                    "text-orange-500 dark:text-orange-400",
                  )}
                />
              </div>
              <div>
                <CardTitle
                  className={cn(
                    "text-orange-700 dark:text-orange-300",
                    isFullscreen ? "text-xl" : "text-base",
                  )}
                >
                  Waiting
                </CardTitle>
                <p
                  className={cn(
                    "text-orange-500 dark:text-orange-400",
                    isFullscreen ? "text-sm mt-0.5" : "text-xs",
                  )}
                >
                  {waitingList.length} in queue
                </p>
              </div>
            </div>
            <span
              className={cn(
                "font-bold tabular-nums text-orange-600 dark:text-orange-400 font-mono",
                isFullscreen ? "text-3xl" : "text-xl",
              )}
            >
              {waitingList.length}
            </span>
          </div>
        </CardHeader>

        <CardContent
          className={cn(
            "flex-1 overflow-y-auto space-y-2.5",
            isFullscreen ? "pt-5 px-5 pb-5" : "pt-4",
          )}
        >
          {waitingList.length === 0 ? (
            <EmptyState icon={Users} text="Queue is clear" fullscreen={isFullscreen} />
          ) : (
            waitingList.map((item) => (
              <QueueItem
                key={item._id}
                item={item}
                variant="waiting"
                fullscreen={isFullscreen}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Called Column — center, most prominent */}
      <Card
        className={cn(
          "flex flex-col border-blue-300 dark:border-blue-700 ring-1 ring-blue-200 dark:ring-blue-800",
          isFullscreen &&
            "bg-white border-blue-300 ring-blue-200 rounded-2xl shadow-lg shadow-blue-100/50",
        )}
      >
        <CardHeader
          className={cn(
            "border-b shrink-0",
            isFullscreen
              ? "bg-blue-50 border-blue-200 rounded-t-2xl"
              : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isFullscreen ? "bg-blue-100" : "bg-blue-100 dark:bg-blue-900",
                )}
              >
                <ArrowRight
                  className={cn(
                    isFullscreen ? "h-7 w-7" : "h-5 w-5",
                    "text-blue-500 dark:text-blue-400",
                  )}
                />
              </div>
              <div>
                <CardTitle
                  className={cn(
                    "text-blue-700 dark:text-blue-300",
                    isFullscreen ? "text-xl" : "text-base",
                  )}
                >
                  Now Calling
                </CardTitle>
                <p
                  className={cn(
                    "text-blue-500 dark:text-blue-400",
                    isFullscreen ? "text-sm mt-0.5" : "text-xs",
                  )}
                >
                  Please proceed to studio
                </p>
              </div>
            </div>
            <span
              className={cn(
                "font-bold tabular-nums text-blue-600 dark:text-blue-300 font-mono",
                isFullscreen ? "text-3xl" : "text-xl",
              )}
            >
              {calledList.length}
            </span>
          </div>
        </CardHeader>

        <CardContent
          className={cn(
            "flex-1 overflow-y-auto space-y-3",
            isFullscreen ? "pt-5 px-5 pb-5" : "pt-4",
          )}
        >
          {calledList.length === 0 ? (
            <EmptyState
              icon={ArrowRight}
              text="No one called yet"
              fullscreen={isFullscreen}
            />
          ) : (
            calledList.map((item) => (
              <QueueItem
                key={item._id}
                item={item}
                variant="called"
                fullscreen={isFullscreen}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* In Progress Column */}
      <Card
        className={cn(
          "flex flex-col border-green-200 dark:border-green-800/60",
          isFullscreen && "bg-white border-green-200 rounded-2xl",
        )}
      >
        <CardHeader
          className={cn(
            "border-b shrink-0",
            isFullscreen
              ? "bg-green-50 border-green-200 rounded-t-2xl"
              : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isFullscreen
                    ? "bg-green-100"
                    : "bg-green-100 dark:bg-green-900",
                )}
              >
                <UserCheck
                  className={cn(
                    isFullscreen ? "h-7 w-7" : "h-5 w-5",
                    "text-green-500 dark:text-green-400",
                  )}
                />
              </div>
              <div>
                <CardTitle
                  className={cn(
                    "text-green-700 dark:text-green-300",
                    isFullscreen ? "text-xl" : "text-base",
                  )}
                >
                  In Studio
                </CardTitle>
                <p
                  className={cn(
                    "text-green-500 dark:text-green-400",
                    isFullscreen ? "text-sm mt-0.5" : "text-xs",
                  )}
                >
                  Session in progress
                </p>
              </div>
            </div>
            <span
              className={cn(
                "font-bold tabular-nums text-green-600 dark:text-green-400 font-mono",
                isFullscreen ? "text-3xl" : "text-xl",
              )}
            >
              {inProgressList.length}
            </span>
          </div>
        </CardHeader>

        <CardContent
          className={cn(
            "flex-1 overflow-y-auto space-y-2.5",
            isFullscreen ? "pt-5 px-5 pb-5" : "pt-4",
          )}
        >
          {inProgressList.length === 0 ? (
            <EmptyState
              icon={Camera}
              text="No active sessions"
              fullscreen={isFullscreen}
            />
          ) : (
            inProgressList.map((item) => (
              <QueueItem
                key={item._id}
                item={item}
                variant="in-progress"
                fullscreen={isFullscreen}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ── Fullscreen layout ──────────────────────────────────────────
  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        className="h-screen flex flex-col bg-gray-50 text-gray-900 px-8 py-6 overflow-hidden"
      >
        {/* Fullscreen header */}
        <div className="flex items-start justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Live Queue Board
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{formattedDate}</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="font-mono text-5xl font-bold text-gray-900 tabular-nums tracking-widest">
              {formattedTime}
            </div>
            <div className="flex items-center gap-3">
              <ConnectionDot isConnected={isConnected} />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-1.5"
              >
                <Minimize2 className="h-4 w-4" />
                Exit Fullscreen
              </Button>
            </div>
          </div>
        </div>

        {statsBar}
        {queueGrid}
      </div>
    );
  }

  // ── Normal layout ──────────────────────────────────────────────
  return (
    <div ref={containerRef}>
      <Page>
        <div className="flex items-start justify-between">
          <PageHeader
            title="Live Queue Board"
            description="Real-time studio queue status"
          />
          <div className="flex items-center gap-3 pt-1 shrink-0">
            <ConnectionDot isConnected={isConnected} />
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="gap-1.5"
            >
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
        </div>

        {statsBar}
        {queueGrid}
      </Page>
    </div>
  );
};

export default LiveQueueBoard;
