import { useEffect, useRef, useState, useCallback } from "react";
import { CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const AUTO_DISMISS_MS = 6000;

const CheckInSuccessBanner = ({ snapshot, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);

  const cancel = useCallback(() => cancelAnimationFrame(rafRef.current), []);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDismissRef.current?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return cancel;
  }, [cancel]);

  return (
    <div className="rounded-xl border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 overflow-hidden">
      <div className="p-8 flex flex-col items-center text-center gap-4">
        <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-4">
          <CheckCircle2 size={36} className="text-green-600 dark:text-green-400" />
        </div>

        <div>
          <p className="text-xl font-bold text-foreground">{snapshot.fullName}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{snapshot.bookingNumber}</p>
          {snapshot.sessionTime && (
            <p className="text-xs text-muted-foreground mt-1">{snapshot.sessionTime}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
          <UserCheck size={18} />
          Checked In Successfully
        </div>

        <Button size="sm" variant="outline" className="mt-1" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="h-1.5 bg-green-100 dark:bg-green-900/40">
        <div
          className="h-full bg-green-500 dark:bg-green-400"
          style={{ width: `${progress}%`, transition: "width 50ms linear" }}
        />
      </div>
    </div>
  );
};

export default CheckInSuccessBanner;
