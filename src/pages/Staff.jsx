import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { staff } from "@/data/Staff";
import { staffColumns } from "@/components/columns/staff-columns";

const Staff = () => {
  return (
    <Page>
      <PageHeader
        title="Staff Management"
        description="Manage your staff members, roles, and permissions."
      />

      <div className="grid gap-6 py-8">
        <DataTable
          title="List of Staff Members"
          description="View and manage all staff members in your organization."
          columns={staffColumns}
          data={staff}
        />
      </div>
    </Page>
  );
};

export default Staff;
