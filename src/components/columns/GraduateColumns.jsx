import { parsePhoneNumberFromString } from "libphonenumber-js";
import { GraduateActionsCell } from "./GraduateActionsCell";

export const graduateColumns = [
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
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <GraduateActionsCell row={row} />,
  },
];
