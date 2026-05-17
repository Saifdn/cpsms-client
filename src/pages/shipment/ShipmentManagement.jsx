// pages/admin/ShipmentManagement.jsx
import { useState, useMemo } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { shipmentColumns } from "@/components/columns/shipmentColumns";

import { 
  usePendingShipments, 
  useGetQuotation,
  useBulkProcessShipments
} from "@/hooks/shipment/useShipments";

import { Button } from "@/components/ui/button";
import { Truck, RefreshCw, Calculator } from "lucide-react";
import QuotationModal from "@/pages/shipment/QuotationModal";

const ShipmentManagement = () => {
  const { data, isLoading, refetch } = usePendingShipments();
  const getQuotationMutation = useGetQuotation();
  const bulkProcessMutation = useBulkProcessShipments();

  const shipments = data?.data || [];
  const [rowSelection, setRowSelection] = useState({});
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationResult, setQuotationResult] = useState(null);

  // Get selected booking IDs
  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key] === true)
      .map((key) => shipments[Number(key)]?._id)
      .filter(Boolean);
  }, [rowSelection, shipments]);

  const handleGetQuotation = () => {
    if (selectedIds.length === 0) return;

    getQuotationMutation.mutate(selectedIds, {
      onSuccess: (res) => {
        setQuotationResult(res.data);
        setShowQuotationModal(true);
      },
    });
  };

  const handleProceedWithService = (selectedOption) => {
    setShowQuotationModal(false);

    bulkProcessMutation.mutate({
      bookingIds: selectedIds,
      serviceId: selectedOption.serviceId,
      serviceName: selectedOption.serviceName,
      courierName: selectedOption.courierName,
    });
  };

  return (
    <Page>
      <PageHeader
        title="Shipment Management"
        description="Get quotation and create shipments in bulk"
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-sm text-muted-foreground">
            {shipments.length} bookings ready for shipment •{" "}
            <span className="font-medium text-foreground">
              {selectedIds.length} selected
            </span>
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={refetch} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={handleGetQuotation}
            disabled={selectedIds.length === 0 || getQuotationMutation.isPending}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Get Quotation
          </Button>
        </div>
      </div>

      {/* Quotation Modal */}
      <QuotationModal
        open={showQuotationModal}
        onOpenChange={setShowQuotationModal}
        quotationResult={quotationResult}
        onProceed={handleProceedWithService}
        isProcessing={bulkProcessMutation.isPending}
      />

      <DataTable
        title="Pending Shipments"
        description="Select bookings and click Get Quotation"
        columns={shipmentColumns}
        data={shipments}
        enableRowSelection={true}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        isLoading={isLoading}
        onRefresh={refetch}
      />
    </Page>
  );
};

export default ShipmentManagement;