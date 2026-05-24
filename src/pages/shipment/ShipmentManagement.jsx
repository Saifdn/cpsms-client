import { useState, useMemo, useEffect } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { shipmentColumns } from "@/components/columns/ShipmentColumns";
import { submittedColumns } from "@/components/columns/SubmittedColumns";

import {
  usePendingShipments,
  useSubmittedShipments,
  useGetQuotation,
  useBulkProcessShipments,
} from "@/hooks/shipment/useShipments";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RefreshCw, Calculator, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import QuotationModal from "@/pages/shipment/QuotationModal";
import ShipmentConfirmationModal from "@/pages/shipment/ShipmentConfirmationModal";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "submitted", label: "Submitted" },
];

const ShipmentManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const dateParam = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const {
    data: pendingData,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = usePendingShipments({ date: dateParam, page: currentPage, limit });

  const {
    data: submittedData,
    isLoading: submittedLoading,
    refetch: refetchSubmitted,
  } = useSubmittedShipments({ date: dateParam, page: currentPage, limit });

  const getQuotationMutation = useGetQuotation();
  const bulkProcessMutation = useBulkProcessShipments();

  const pendingShipments = pendingData?.data || [];
  const submittedShipments = submittedData?.data || [];
  // const pagination = isPending ? pendingData?.pagination : submittedData?.pagination;

  const [rowSelection, setRowSelection] = useState({});
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationResult, setQuotationResult] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Reset page when date or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, activeTab, limit]);


  const handleTabChange = (key) => {
    setActiveTab(key);
    setRowSelection({});
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setRowSelection({});
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    setRowSelection({});
  };

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key] === true)
      .map((key) => pendingShipments[Number(key)]?._id)
      .filter(Boolean);
  }, [rowSelection, pendingShipments]);

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
    setSelectedService(selectedOption);
    setShowConfirmationModal(true);
  };

  const handleConfirmShipment = (payload) => {
    if (!selectedService) return;
    bulkProcessMutation.mutate({
      bookingIds: selectedIds,
      serviceId: selectedService.serviceId,
      serviceName: selectedService.serviceName,
      courierName: selectedService.courierName,
      collectionDate: payload.collectionDate,
      sender: payload.sender,
      packageDetails: payload.packageDetails,
      features: payload.features,
    });
    setShowConfirmationModal(false);
  };

  const isPending = activeTab === "pending";
  const isLoading = isPending ? pendingLoading : submittedLoading;
  const refetch = isPending ? refetchPending : refetchSubmitted;
  const pagination = isPending ? pendingData?.pagination : submittedData?.pagination;

  return (
    <Page>
      <PageHeader
        title="Shipment Management"
        description="Get quotation and create shipments in bulk"
      />

      {/* Tab bar */}
      <div className="border-b mb-6">
        <div className="flex gap-0">
          {TABS.map((tab) => {
            const count =
              tab.key === "pending"
                ? pendingData?.pagination?.total ?? pendingShipments.length
                : submittedData?.pagination?.total ?? submittedShipments.length;

            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`
                  px-5 py-2.5 text-sm flex items-center gap-2 border-b-2 transition-colors
                  ${activeTab === tab.key
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"}
                `}
              >
                {tab.label}
                <span className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${activeTab === tab.key
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"}
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar — shared across both tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Clear date */}
          {selectedDate && (
            <Button variant="ghost" size="sm" onClick={handleClearDate}>
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}

          <span className="text-sm text-muted-foreground">
            {isPending ? (
              <>
                {pagination?.total ?? pendingShipments.length} bookings ready •{" "}
                <span className="font-medium text-foreground">
                  {selectedIds.length} selected
                </span>
              </>
            ) : (
              <>{pagination?.total ?? submittedShipments.length} orders submitted</>
            )}
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={refetch} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          {isPending && (
            <Button
              onClick={handleGetQuotation}
              disabled={selectedIds.length === 0 || getQuotationMutation.isPending}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Get Quotation
            </Button>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuotationModal
        open={showQuotationModal}
        onOpenChange={setShowQuotationModal}
        quotationResult={quotationResult}
        onProceed={handleProceedWithService}
        isProcessing={bulkProcessMutation.isPending}
      />
      <ShipmentConfirmationModal
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
        service={selectedService}
        totalBookings={selectedIds.length}
        onConfirm={handleConfirmShipment}
        isProcessing={bulkProcessMutation.isPending}
      />

      {/* Pending tab */}
      {isPending && (
        <DataTable
          title="Pending Shipments"
          description="Select bookings and click Get Quotation"
          columns={shipmentColumns}
          data={pendingShipments}
          enableRowSelection={true}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          isLoading={pendingLoading}
          onRefresh={refetchPending}
          // pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
          limit={limit}
          onLimitChange={(val) => setLimit(val)}
        />
      )}

      {/* Submitted tab */}
      {!isPending && (
        <DataTable
          title="Submitted Shipments"
          description="Orders that have been submitted for shipping"
          columns={submittedColumns}
          data={submittedShipments}
          enableRowSelection={false}
          isLoading={submittedLoading}
          onRefresh={refetchSubmitted}
          // pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
          limit={limit}
          onLimitChange={(val) => setLimit(val)}
        />
      )}
    </Page>
  );
};

export default ShipmentManagement;