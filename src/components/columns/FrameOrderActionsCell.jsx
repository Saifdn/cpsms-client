import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";

import { FrameOrderViewSheet } from "@/components/frameOrders/FrameOrderViewSheet";

export function FrameOrderActionsCell({ row }) {
  const order = row.original;

  const [showViewSheet, setShowViewSheet] = useState(false);

  return (
    <>
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setShowViewSheet(true)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <FrameOrderViewSheet
        open={showViewSheet}
        onOpenChange={setShowViewSheet}
        order={order}
      />
    </>
  );
}
