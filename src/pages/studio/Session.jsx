import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, CalendarX, Plus, XCircle } from "lucide-react";

import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateDialog } from "@/components/dialog/CreateDialog";
import { DataTable } from "@/components/ui/data-table";
import { GenerateSessionForm } from "@/components/session/GenerateSessionForm";
import { SessionStatsRow } from "@/components/session/SessionStatsRow";
import { sessionColumns } from "@/components/columns/SessionColumns";
import { useSessions, useGenerateSessions, useSessionDates } from "@/hooks/studio/useSessions";

const FORM_DEFAULTS = {
  fromDate: "",
  toDate: "",
  startTime: "08:00",
  endTime: "17:00",
  breakStartTime: "",
  breakEndTime: "",
  duration: 60,
  capacity: 5,
};

function SessionPageSkeleton() {
  return (
    <div className="grid gap-6 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-7 w-10" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-48" />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SessionEmptyState({ onGenerate }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <CalendarX className="h-10 w-10 text-muted-foreground" />
      <p className="font-medium">No sessions on this date</p>
      <p className="text-sm text-muted-foreground">
        Generate sessions for this date range or pick a different date.
      </p>
      <Button onClick={onGenerate} className="gap-2 mt-1">
        <Plus className="h-4 w-4" />
        Generate Sessions
      </Button>
    </div>
  );
}

const Session = () => {
  const [filterDate, setFilterDate] = useState(new Date());
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  const form = useForm({ defaultValues: FORM_DEFAULTS });

  const { data: availableDates = [] } = useSessionDates();
  const dateParam = filterDate ? format(filterDate, "yyyy-MM-dd") : null;
  const { data: sessionsData, isLoading, isError, refetch } = useSessions(dateParam);
  const generateSessionsMutation = useGenerateSessions();

  const sessions = useMemo(() => sessionsData?.data ?? [], [sessionsData]);

  const stats = useMemo(
    () => ({
      total: sessions.length,
      available: sessions.filter((s) => s.status === "available").length,
      full: sessions.filter((s) => s.status !== "available").length,
      utilisation: sessions.reduce((sum, s) => sum + (s.bookedCount ?? 0), 0),
    }),
    [sessions],
  );

  const handleGenerate = form.handleSubmit((values) => {
    generateSessionsMutation.mutate(values, {
      onSuccess: () => {
        setShowGenerateDialog(false);
        form.reset();
      },
    });
  });

  const handleDialogOpenChange = (open) => {
    setShowGenerateDialog(open);
    if (!open) form.reset();
  };

  if (isError) {
    return (
      <Page>
        <PageHeader
          title="Session Management"
          description="Generate and manage daily studio sessions automatically"
        />
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <XCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Failed to load sessions. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Session Management"
        description="Generate and manage daily studio sessions automatically"
      />

      {isLoading ? (
        <SessionPageSkeleton />
      ) : (
        <div className="grid gap-6 py-8">
          <SessionStatsRow stats={stats} />

          <div className="flex items-center justify-between gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "dd MMM yyyy") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={(date) => setFilterDate(date)}
                  disabled={(date) =>
                    !availableDates.some((d) => d.toDateString() === date.toDateString())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button onClick={() => setShowGenerateDialog(true)} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Generate Sessions
            </Button>
          </div>

          {sessions.length === 0 ? (
            <SessionEmptyState onGenerate={() => setShowGenerateDialog(true)} />
          ) : (
            <DataTable
              title="Sessions"
              description={`Sessions for ${filterDate ? format(filterDate, "dd MMM yyyy") : "selected date"}`}
              columns={sessionColumns}
              data={sessions}
              isLoading={isLoading}
            />
          )}
        </div>
      )}

      <CreateDialog
        open={showGenerateDialog}
        onOpenChange={handleDialogOpenChange}
        title="Generate Sessions"
        description="Set the rules below. Sessions will be auto-created for every day in the date range."
        onSave={handleGenerate}
        isLoading={generateSessionsMutation.isPending}
        saveLabel="Generate Sessions"
      >
        <GenerateSessionForm
          register={form.register}
          errors={form.formState.errors}
          disabled={generateSessionsMutation.isPending}
        />
      </CreateDialog>
    </Page>
  );
};

export default Session;
