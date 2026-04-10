import { StaffActionsCell } from "./StaffActionsCell";

export const staffColumns = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("fullName")}</div>,
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "department", header: "Department" },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <StaffActionsCell row={row} />,
  },
];