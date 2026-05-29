import { parsePhoneNumberFromString } from "libphonenumber-js";
import { StaffActionsCell } from "./StaffActionsCell";

export const staffColumns = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("fullName")}</div>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const raw = row.getValue("phone");
      const formatted =
        parsePhoneNumberFromString(
          String(raw ?? ""),
          "MY",
        )?.formatInternational() ?? raw;
      return <span>{formatted || "—"}</span>;
    },
  },
  { accessorKey: "department", header: "Department" },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <StaffActionsCell row={row} />,
  },
];
