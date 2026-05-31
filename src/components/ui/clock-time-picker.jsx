import { useRef, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CLOCK_SIZE = 240;
const CENTER = CLOCK_SIZE / 2;
const DIAL_RADIUS = 88;

const HOUR_LABELS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTE_LABELS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function parseTime(timeStr) {
  if (!timeStr) return { hours: 12, minutes: 0, period: "AM" };
  const [h, m] = timeStr.split(":").map(Number);
  return { hours: h % 12 || 12, minutes: m, period: h >= 12 ? "PM" : "AM" };
}

function formatTime24(hours, minutes, period) {
  let h = hours % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatDisplay(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function polarToXY(angleDeg, r) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

function angleFromXY(x, y) {
  const dx = x - CENTER;
  const dy = y - CENTER;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;
  return angle;
}

export function ClockTimePicker({ value, onChange, disabled, placeholder = "Pick a time" }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("hour");
  const [hours, setHours] = useState(() => parseTime(value).hours);
  const [minutes, setMinutes] = useState(() => parseTime(value).minutes);
  const [period, setPeriod] = useState(() => parseTime(value).period);
  const svgRef = useRef(null);

  const handAngle = step === "hour" ? (hours % 12) * 30 : (minutes / 60) * 360;
  const handEnd = polarToXY(handAngle, DIAL_RADIUS);

  function handleOpenChange(o) {
    if (o) {
      const p = parseTime(value);
      setHours(p.hours);
      setMinutes(p.minutes);
      setPeriod(p.period);
      setStep("hour");
    }
    setOpen(o);
  }

  function handleClockClick(e) {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CLOCK_SIZE / rect.width);
    const y = (e.clientY - rect.top) * (CLOCK_SIZE / rect.height);
    const angle = angleFromXY(x, y);

    if (step === "hour") {
      const h = Math.round(angle / 30) % 12 || 12;
      setHours(h);
      setTimeout(() => setStep("minute"), 150);
    } else {
      const raw = Math.round(angle / 6) % 60;
      setMinutes(Math.round(raw / 5) * 5 % 60);
    }
  }

  function handleConfirm() {
    onChange(formatTime24(hours, minutes, period));
    setOpen(false);
    setStep("hour");
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplay(value) ?? placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4" align="start">
        {/* Time display header */}
        <div className="flex items-center justify-center gap-2 mb-4 rounded-lg bg-muted px-4 py-3">
          <button
            type="button"
            onClick={() => setStep("hour")}
            className={cn(
              "w-16 rounded-md py-1 text-center text-4xl font-light transition-colors",
              step === "hour"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-background/60",
            )}
          >
            {String(hours).padStart(2, "0")}
          </button>
          <span className="text-4xl font-light text-foreground">:</span>
          <button
            type="button"
            onClick={() => setStep("minute")}
            className={cn(
              "w-16 rounded-md py-1 text-center text-4xl font-light transition-colors",
              step === "minute"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-background/60",
            )}
          >
            {String(minutes).padStart(2, "0")}
          </button>
          <div className="ml-1 flex flex-col gap-1">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded border px-2 py-1 text-xs font-medium transition-colors",
                  period === p
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Clock dial */}
        <div className="flex justify-center">
          <svg
            ref={svgRef}
            width={CLOCK_SIZE}
            height={CLOCK_SIZE}
            className="cursor-pointer select-none"
            onClick={handleClockClick}
          >
            {/* Face */}
            <circle cx={CENTER} cy={CENTER} r={CENTER - 4} style={{ fill: "var(--muted)" }} />

            {/* Hand */}
            <line
              x1={CENTER} y1={CENTER}
              x2={handEnd.x} y2={handEnd.y}
              strokeWidth={2}
              style={{ stroke: "var(--primary)" }}
            />
            {/* Hand tip glow */}
            <circle cx={handEnd.x} cy={handEnd.y} r={20}
              style={{ fill: "var(--primary)", opacity: 0.15 }} />
            {/* Hand tip dot */}
            <circle cx={handEnd.x} cy={handEnd.y} r={5}
              style={{ fill: "var(--primary)" }} />
            {/* Center dot */}
            <circle cx={CENTER} cy={CENTER} r={4}
              style={{ fill: "var(--primary)" }} />

            {/* Hour or minute numbers */}
            {(step === "hour" ? HOUR_LABELS : MINUTE_LABELS).map((num, i) => {
              const pos = polarToXY(i * 30, DIAL_RADIUS);
              const isSelected = step === "hour" ? num === hours : num === minutes;
              return (
                <g key={num}>
                  <circle cx={pos.x} cy={pos.y} r={18}
                    style={{ fill: isSelected ? "var(--primary)" : "transparent" }} />
                  <text
                    x={pos.x} y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={500}
                    style={{
                      fill: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
                      pointerEvents: "none",
                    }}
                  >
                    {step === "hour" ? num : String(num).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Step hint */}
        <p className="text-center text-xs text-muted-foreground mb-2">
          {step === "hour" ? "Select hour" : "Select minute"}
        </p>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleConfirm}>
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
