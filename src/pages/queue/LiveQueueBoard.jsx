import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/components/queue/ConnectionStatus";
import { QueueColumn } from "@/components/queue/QueueColumn";
import { QueueItem } from "@/components/queue/QueueItem";
import { QueueBoardSkeleton } from "@/components/queue/QueueBoardSkeleton";
import { useLiveQueue } from "@/hooks/counter/useLiveQueue";
import { useQueueLog } from "@/hooks/counter/useQueueLog";
import { queueLogColumns } from "@/components/columns/QueueLogColumns";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/assets/Logo";
import {
  Clock,
  Users,
  ArrowRight,
  UserCheck,
  Maximize2,
  Minimize2,
  Camera,
  WifiOff,
  ScrollText,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { speakQueue } from "@/lib/speakQueue";
import { cn } from "@/lib/utils";

// ── Static config ──────────────────────────────────────────────────────────────

const STAT_PILLS = [
  {
    icon: Clock,
    label: "Waiting",
    color: "border-border bg-muted/50 text-muted-foreground",
  },
  {
    icon: ArrowRight,
    label: "Called",
    color: "border-primary/30 bg-primary/5 text-primary",
  },
  {
    icon: UserCheck,
    label: "In Progress",
    color: "border-border bg-muted/30 text-muted-foreground",
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
  const [logOpen, setLogOpen] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logLimit, setLogLimit] = useState(10);

  const { data: logData, isLoading: logIsLoading } = useQueueLog({
    page: logPage,
    limit: logLimit,
    enabled: logOpen,
  });

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

  const counts = [waitingList.length, calledList.length, inProgressList.length];

  const statsBar = (
    <div className="flex flex-wrap gap-2 mt-4">
      {STAT_PILLS.map(({ icon, label, color }, i) => (
        <StatPill key={label} icon={icon} label={label} count={counts[i]} color={color} />
      ))}
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
        className="h-screen flex flex-col bg-background text-foreground px-8 py-5 overflow-hidden"
      >
        {/* Row 1: Logo + title | Clock */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Logo size={40} color="var(--primary)" />
            <div className="w-px h-10 bg-border" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Live Queue Board</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{formattedDate}</p>
            </div>
          </div>
          <div className="font-mono text-5xl font-bold text-primary tabular-nums tracking-widest">
            {formattedTime}
          </div>
        </div>

        {/* Row 2: Stat pills | Connection + exit */}
        <div className="flex items-center justify-between shrink-0 mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {STAT_PILLS.map(({ icon, label, color }, i) => (
              <StatPill key={label} icon={icon} label={label} count={counts[i]} color={color} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ConnectionStatus isConnected={isConnected} />
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="gap-1.5"
            >
              <Minimize2 className="h-4 w-4" />
              Exit Fullscreen
            </Button>
          </div>
        </div>

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
                onClick={() => setLogOpen(true)}
                className="gap-1.5"
              >
                <ScrollText className="h-4 w-4" />
                Queue Log
              </Button>
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

        {/* Branding strip */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3 mb-4">
          <div className="flex items-center gap-3">
            <Logo size={28} color="var(--primary)" />
            <div className="w-px h-6 bg-border" />
            <span className="text-sm font-semibold text-foreground">Convocation Photography Studio</span>
          </div>
          <span className="font-mono text-sm font-bold tabular-nums text-primary tracking-widest">
            {formattedTime}
          </span>
        </div>

        {!isConnected && !isLoading && <DisconnectedBanner />}

        {statsBar}

        {isLoading ? <QueueBoardSkeleton /> : queueGrid}

        <Dialog open={logOpen} onOpenChange={setLogOpen}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Queue Log</DialogTitle>
            </DialogHeader>
            <DataTable
              columns={queueLogColumns}
              data={logData?.data || []}
              isLoading={logIsLoading}
              currentPage={logPage}
              totalPages={logData?.pagination?.totalPages ?? 1}
              onPageChange={setLogPage}
              limit={logLimit}
              onLimitChange={(v) => { setLogLimit(v); setLogPage(1); }}
            />
          </DialogContent>
        </Dialog>
      </Page>
    </div>
  );
};

export default LiveQueueBoard;
