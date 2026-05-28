export const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value || "—"}</span>
  </div>
);

export const SectionCard = ({ icon, title, children }) => {
  const Icon = icon;
  return (
    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="rounded-md p-1.5 bg-primary/10 text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};
