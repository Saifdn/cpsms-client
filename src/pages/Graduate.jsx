import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { graduate } from "@/data/Graduate";
import { graduateColumns } from "@/components/columns/graduate-columns";

const Graduate = () => {
  return (
    <Page>
      <PageHeader
        title="Graduate Management"
        description="Manage your graduate, roles, and permissions."
      />

      <div className="grid gap-6 py-8">
        <DataTable
          title="List of Graduate"
          description="View and manage all graduate in your organization."
          columns={graduateColumns}
          data={graduate}
        />
      </div>
    </Page>
  );
};

export default Graduate;
