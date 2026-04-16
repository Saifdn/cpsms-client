import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export function DeleteAlertDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone.",
  itemName = "this item",
  isLoading = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 text-destructive rounded-full">
              <Trash2 className="h-5 w-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          
          <AlertDialogDescription>
            {description} <strong>{itemName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}