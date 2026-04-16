import { GraduateActionsCell } from "./GraduateActionsCell";

export const graduateColumns = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("fullName")}</div>,
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <GraduateActionsCell row={row} />,
  },
];