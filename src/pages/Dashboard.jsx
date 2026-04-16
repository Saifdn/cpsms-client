import { Page, PageHeader } from "@/components/layout/Page";
import BookingChart from "@/components/dashboard/BookingChart";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { TotalBookChart } from "@/components/dashboard/TotalBookChart";

import { DataTable } from "@/components/ui/data-table";
import { staff } from "@/data/Staff";
import { staffColumns } from "@/components/columns/StaffColumns";

const Dashboard = () => {
  return (
    <Page>
      <PageHeader
        title="Dashboard"
        description="Overview of your business performance and key metrics."
      />
      <div className="grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <DashboardCard
          title="Booking Overview"
          description="View your booking statistics and trends."
          buttonText="View Details"
        >
          <div className="">
            <BookingChart />
          </div>
        </DashboardCard>

        <TotalBookChart />

        
      </div>
      <div>
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

export default Dashboard;
