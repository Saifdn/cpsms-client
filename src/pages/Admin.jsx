import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { admin } from "@/data/Admin";
import { adminColumns } from "@/components/columns/admin-columns";
import QrScanner from "@/components/QrScanner";
import { useState } from "react";

const Admin = () => {
  const [message, setMessage] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = async (bookingId) => {
    try {
      setMessage("✅ Check-in successful: " + bookingId);
      setIsScannerOpen(false); // auto close after scan
    } catch (err) {
      setMessage("❌ Error scanning");
    }
  };

  return (
    <Page>
      <PageHeader
        title="Admin Management"
        description="Manage your admins, roles, and permissions."
      />

      <div className="grid gap-6 py-8">
        <DataTable
          title="List of Admins"
          description="View and manage Admins."
          columns={adminColumns}
          data={admin}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Booking Check In</h2>

        {!isScannerOpen ? (
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Open QR Scanner
          </button>
        ) : (
          <button
            onClick={() => setIsScannerOpen(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Close Scanner
          </button>
        )}

        <QrScanner
          isActive={isScannerOpen}
          onScanSuccess={handleScan}
          onClose={() => setIsScannerOpen(false)}
        />

        <p className="font-medium">{message}</p>
      </div>
    </Page>
  );
};

export default Admin;