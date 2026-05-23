import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import { useSessionDates, useSessions } from "@/hooks/studio/useSessions";

const Step1_SessionSelection = ({ data, updateData, onNext }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    data.selectedSession?.date ? new Date(data.selectedSession.date) : null,
  );
  const [selectedSessionId, setSelectedSessionId] = useState(
    data.selectedSession?._id || "",
  );

  const { data: availableDates = [] } = useSessionDates();

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions(formattedDate);
  const allSessions = sessionsData?.data || [];

  const availableSessions = allSessions
    .filter((s) => s.bookedCount < s.capacity)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleContinue = () => {
    const selectedSession = availableSessions.find(
      (session) => session._id === selectedSessionId,
    );
    if (!selectedSession) return;

    updateData({
      selectedSession: {
        ...selectedSession,
        date: new Date(selectedSession.date),
      },
    });
    onNext();
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarDays className="h-5 w-5 text-primary" />
          Choose Your Session Date & Time
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select an available date, then pick a session time slot.
        </p>
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        {/* Calendar */}
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-xl border bg-muted/30 p-4">
            <Calendar
              className="w-60"
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setSelectedSessionId("");
                }
              }}
              disabled={(date) =>
                !availableDates.some(
                  (availableDate) =>
                    availableDate.toDateString() === date.toDateString(),
                )
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Only dates with available sessions can be selected.
          </p>
        </div>

        {/* Session slots */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">
              {selectedDate
                ? `Available slots — ${format(selectedDate, "EEEE, d MMM yyyy")}`
                : "Available Time Slots"}
            </span>
          </div>

          {!selectedDate ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">No date selected</p>
                <p className="text-xs text-muted-foreground/70">Pick a highlighted date above to see available time slots.</p>
              </div>
            </div>
          ) : sessionsLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2].map((n) => (
                <div key={n} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : availableSessions.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {availableSessions.map((session) => {
                const isSelected = selectedSessionId === session._id;
                const slotsLeft = session.capacity - session.bookedCount;
                const isLow = slotsLeft <= 3;

                return (
                  <button
                    key={session._id}
                    type="button"
                    onClick={() => setSelectedSessionId(session._id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                        : "bg-background hover:border-primary/50 hover:shadow-sm",
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-semibold">
                          {session.startTime} – {session.endTime}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          isLow
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        )}
                      >
                        {slotsLeft} {slotsLeft === 1 ? "slot" : "slots"} left
                      </Badge>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isSelected ? "text-primary" : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed py-10 text-center">
              <p className="text-sm text-muted-foreground">No available sessions on this date.</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Try selecting a different date.</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1"
            size="lg"
            disabled={!selectedSessionId}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1_SessionSelection;
