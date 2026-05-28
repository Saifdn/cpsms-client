import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/components/queue/ConnectionStatus";
import { QueueColumn } from "@/components/queue/QueueColumn";
import { QueueItem } from "@/components/queue/QueueItem";
import { QueueBoardSkeleton } from "@/components/queue/QueueBoardSkeleton";
import { useLiveQueue } from "@/hooks/counter/useLiveQueue";
import {
  Clock,
  Users,
  ArrowRight,
  UserCheck,
  Maximize2,
  Minimize2,
  Camera,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { speakQueue } from "@/lib/speakQueue";
import { cn } from "@/lib/utils";

// ── Static config ──────────────────────────────────────────────────────────────

const STAT_PILLS = [
  {
    icon: Clock,
    label: "Waiting",
    color:
      "border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40",
  },
  {
    icon: ArrowRight,
    label: "Called",
    color:
      "border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40",
  },
  {
    icon: UserCheck,
    label: "In Progress",
    color:
      "border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40",
  },
];

const COLUMNS = [
  {
    variant: "waiting",
    icon: Clock,
    title: "Waiting",
    subtitle: (n) => `${n} in queue`,
    emptyIcon: Users,
    emptyText: "Queue is clear",
  },
  {
    variant: "called",
    icon: ArrowRight,
    title: "Now Calling",
    subtitle: () => "Please proceed to studio",
    emptyIcon: ArrowRight,
    emptyText: "No one called yet",
  },
  {
    variant: "in-progress",
    icon: UserCheck,
    title: "In Studio",
    subtitle: () => "Session in progress",
    emptyIcon: Camera,
    emptyText: "No active sessions",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

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
        "flex flex-col items-center justify-center text-muted-foreground h-48",
        fullscreen ? "gap-4" : "gap-3",
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

const DisconnectedBanner = () => (
  <div className="flex items-center gap-2.5 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800/60 dark:bg-yellow-950/40 px-4 py-2.5 text-sm text-yellow-800 dark:text-yellow-300">
    <WifiOff className="h-4 w-4 shrink-0" />
    <span>
      Connection lost — displaying last known queue state. Reconnecting…
    </span>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────

const LiveQueueBoard = () => {
  const { activeQueue, isConnected, isLoading } = useLiveQueue();
  const containerRef = useRef(null);
  const prevCalledRef = useRef([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const waitingList = activeQueue.filter((q) => q.status === "waiting");
  const calledList = activeQueue.filter((q) => q.status === "called");
  const inProgressList = activeQueue.filter((q) => q.status === "in-progress");

  const listsByVariant = { waiting: waitingList, called: calledList, "in-progress": inProgressList };

  // Announce newly called numbers via speech synthesis
  useEffect(() => {
    const prev = prevCalledRef.current;
    const newCalled = calledList.filter(
      (item) => !prev.some((p) => p._id === item._id),
    );
    newCalled.forEach((item) => speakQueue(item.queueNumber, item.studio?.name));
    prevCalledRef.current = calledList;
  }, [calledList]);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep isFullscreen in sync with browser fullscreen state
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

  // ── Shared sections ──────────────────────────────────────────────────────────

  const statsBar = (
    <div className={cn("flex flex-wrap gap-2", isFullscreen ? "mt-1" : "mt-4")}>
      {STAT_PILLS.map(({ icon, label, color }, i) => {
        const counts = [waitingList.length, calledList.length, inProgressList.length];
        return (
          <StatPill key={label} icon={icon} label={label} count={counts[i]} color={color} />
        );
      })}
    </div>
  );

  const queueGrid = (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-3 gap-6",
        isFullscreen ? "flex-1 min-h-0 mt-6" : "py-6",
      )}
    >
      {COLUMNS.map(({ variant, icon, title, subtitle, emptyIcon, emptyText }) => {
        const items = listsByVariant[variant];
        return (
          <QueueColumn
            key={variant}
            variant={variant}
            icon={icon}
            title={title}
            subtitle={subtitle(items.length)}
            count={items.length}
            fullscreen={isFullscreen}
          >
            {items.length === 0 ? (
              <EmptyState icon={emptyIcon} text={emptyText} fullscreen={isFullscreen} />
            ) : (
              items.map((item) => (
                <QueueItem key={item._id} item={item} variant={variant} fullscreen={isFullscreen} />
              ))
            )}
          </QueueColumn>
        );
      })}
    </div>
  );

  // ── Fullscreen layout ────────────────────────────────────────────────────────
  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        className="h-screen flex flex-col bg-gray-50 text-gray-900 px-8 py-6 overflow-hidden"
      >
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
              <ConnectionStatus isConnected={isConnected} />
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

  // ── Normal layout ────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef}>
      <Page>
        <PageHeader
          title="Live Queue Board"
          description="Real-time studio queue status"
          actions={
            <div className="flex items-center gap-3">
              <ConnectionStatus isConnected={isConnected} />
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
          }
        />

        {!isConnected && !isLoading && <DisconnectedBanner />}

        {isLoading ? statsBar : statsBar}

        {isLoading ? (
          <QueueBoardSkeleton />
        ) : (
          queueGrid
        )}
      </Page>
    </div>
  );
};

export default LiveQueueBoard;
