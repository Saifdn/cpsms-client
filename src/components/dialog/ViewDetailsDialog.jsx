import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function ViewDetailsDialog({
  open,
  onOpenChange,
  title = "Details",
  data = {},
  fields = [],          
  children,             
}) {
  if (!data) return null;

  const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {children ? (
            children
          ) : (
            fields.map((field) => {
              const value = getNestedValue(data, field.key);
              if (value === undefined || value === null) return null;

              return (
                <div key={field.key}>
                  <p className="text-sm text-muted-foreground">{field.label}</p>
                  {field.isBadge ? (
                    <Badge variant="secondary">{value}</Badge>
                  ) : field.isDate ? (
                    <p className="font-medium">
                      {new Date(value).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="font-medium wrap-break-word">{value}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}