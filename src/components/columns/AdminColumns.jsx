import { parsePhoneNumberFromString } from "libphonenumber-js";
import { AdminActionsCell } from "./AdminActionsCell";

export const adminColumns = [
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
  { accessorKey: "adminLevel", header: "Admin Level" },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <AdminActionsCell row={row} />,
  },
];
