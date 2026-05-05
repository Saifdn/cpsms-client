import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { useSessions } from "@/hooks/studio/useSessions";

const Step1_SessionSelection = ({ data, updateData, onNext }) => {
  const { data: sessionsData } = useSessions();

  const allSessions = sessionsData?.data || [];

  const [selectedDate, setSelectedDate] = useState(
    data.selectedSession?.date ? new Date(data.selectedSession.date) : new Date(),
  );
  const [selectedSessionId, setSelectedSessionId] = useState(
    data.selectedSession?._id || "",
  );

  const availableDates = [
    ...new Set(
      allSessions
        .filter((session) => session.bookedCount < session.capacity)
        .map((session) => new Date(session.date).toDateString()),
    ),
  ].map((dateString) => new Date(dateString));

  const availableSessions = allSessions
    .filter((s) => s.bookedCount < s.capacity)
    .filter((session) => {
      return new Date(session.date).toDateString() === selectedDate.toDateString();
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleContinue = () => {
    const selectedSession = availableSessions.find(
      (session) => session._id === selectedSessionId,
    );

    if (!selectedSession) {
      return;
    }

    updateData({
      selectedSession: {
        ...selectedSession,
        date: new Date(selectedSession.date),
      },
    });
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Choose Date & Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Calendar
          className="mx-auto w-60 rounded-md border"
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
              setSelectedSessionId("");
            }
          }}
          disabled={(date) => {
            return !availableDates.some(
              (availableDate) =>
                availableDate.toDateString() === date.toDateString(),
            );
          }}
        />

        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Available sessions for {format(selectedDate, "EEEE, MMM d, yyyy")}
          </div>

          {availableSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {availableSessions.map((session) => {
                const isSelected = selectedSessionId === session._id;
                const slotsLeft = session.capacity - session.bookedCount;

                return (
                  <button
                    key={session._id}
                    type="button"
                    onClick={() => setSelectedSessionId(session._id)}
                    className={`rounded-lg border p-4 text-left transition-all hover:border-primary hover:shadow-sm ${
                      isSelected ? "border-primary bg-primary/5" : "bg-background"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold">
                          {format(new Date(session.date), "EEEE, d MMM yyyy")}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {session.startTime} - {session.endTime}
                        </div>
                      </div>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {slotsLeft} slots left
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No available sessions on this date.
            </div>
          )}
        </div>

        <Button
          onClick={handleContinue}
          className="w-full"
          size="lg"
          disabled={!selectedSessionId}
        >
          Continue to Package Selection
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step1_SessionSelection;
