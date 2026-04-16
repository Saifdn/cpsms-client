import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import { useState } from "react";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";

import { useSessions, useGenerateSessions } from "@/hooks/studio/useSessions";
import { sessionColumns } from "@/components/columns/SessionColumns";

const Session = () => {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  // Form data
  const [generateForm, setGenerateForm] = useState({
    fromDate: "",
    toDate: "",
    startTime: "08:00",
    endTime: "17:00",
    breakStartTime: "",
    breakEndTime: "",
    duration: 60,
    capacity: 5,
  });

  // Data & Mutation
  const { data: sessionsData, isLoading } = useSessions();
  const generateSessionsMutation = useGenerateSessions();

  const sessions = sessionsData?.data || [];

  const handleGenerateSessions = () => {
    generateSessionsMutation.mutate(generateForm, {
      onSuccess: () => {
        setShowGenerateDialog(false);
        // Reset form
        setGenerateForm({
          fromDate: "",
          toDate: "",
          startTime: "08:00",
          endTime: "17:00",
          breakStartTime: "",
          breakEndTime: "",
          duration: 60,
          capacity: 5,
        });
      },
    });
  };

  return (
    <Page>
      <PageHeader
        title="Session Management"
        description="Generate and manage daily studio sessions automatically"
      />

      <div className="flex justify-between items-center mb-6 pt-8">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Total Sessions: <strong>{sessions.length}</strong>
          </span>
        </div>

        <Button onClick={() => setShowGenerateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Generate Sessions
        </Button>
      </div>

      {/* Sessions Table */}
      <DataTable
        title="All Sessions"
        description="List of all sessions across selected date ranges"
        columns={sessionColumns}
        data={sessions}
        isLoading={isLoading}
      />

      {/* Generate Sessions Dialog */}
      <CreateDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        title="Generate Sessions"
        description="Set the rules below. The system will automatically create sessions for every day in the date range."
        onSave={handleGenerateSessions}
        isLoading={generateSessionsMutation.isPending}
        saveLabel="Generate Sessions"
      >
        <div className="space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="fromDate">From Date</FieldLabel>
              <Input
                id="fromDate"
                type="date"
                value={generateForm.fromDate}
                onChange={(e) => setGenerateForm({ ...generateForm, fromDate: e.target.value })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="toDate">To Date</FieldLabel>
              <Input
                id="toDate"
                type="date"
                value={generateForm.toDate}
                onChange={(e) => setGenerateForm({ ...generateForm, toDate: e.target.value })}
              />
            </Field>
          </div>

          {/* Daily Time Settings */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
              <Input
                id="startTime"
                type="time"
                value={generateForm.startTime}
                onChange={(e) => setGenerateForm({ ...generateForm, startTime: e.target.value })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="endTime">End Time</FieldLabel>
              <Input
                id="endTime"
                type="time"
                value={generateForm.endTime}
                onChange={(e) => setGenerateForm({ ...generateForm, endTime: e.target.value })}
              />
            </Field>
          </div>

          {/* Break Time - Start & End */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="breakStartTime">Break Start Time</FieldLabel>
              <Input
                id="breakStartTime"
                type="time"
                value={generateForm.breakStartTime}
                onChange={(e) => setGenerateForm({ ...generateForm, breakStartTime: e.target.value })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="breakEndTime">Break End Time</FieldLabel>
              <Input
                id="breakEndTime"
                type="time"
                value={generateForm.breakEndTime}
                onChange={(e) => setGenerateForm({ ...generateForm, breakEndTime: e.target.value })}
              />
            </Field>
          </div>

          {/* Duration & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="duration">Duration per session (minutes)</FieldLabel>
              <Input
                id="duration"
                type="number"
                value={generateForm.duration}
                onChange={(e) => setGenerateForm({ ...generateForm, duration: Number(e.target.value) })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="capacity">Capacity per session</FieldLabel>
              <Input
                id="capacity"
                type="number"
                value={generateForm.capacity}
                onChange={(e) => setGenerateForm({ ...generateForm, capacity: Number(e.target.value) })}
              />
            </Field>
          </div>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Session;