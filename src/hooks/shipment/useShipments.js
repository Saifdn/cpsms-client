// hooks/shipment/useShipments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "@/services/shipmentService";
import toast from "react-hot-toast";

// ==================== QUERIES ====================

// Get all pending shipments
export const usePendingShipments = ({ date = null, page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: ["shipments", "pending", date, page, limit],
    queryFn: () =>
      shipmentService.getPendingShipments({ date, page, limit }).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

export const useSubmittedShipments = ({ date = null, page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: ["shipments", "submitted", date, page, limit],
    queryFn: () =>
      shipmentService.getSubmittedShipments({ date, page, limit }).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Get single shipment
export const useShipmentById = (id) => {
  return useQuery({
    queryKey: ["shipment", id],
    queryFn: () => shipmentService.getShipmentById(id).then(res => res.data),
    enabled: !!id,
  });
};

// Get shipment by booking
export const useShipmentByBooking = (bookingId) => {
  return useQuery({
    queryKey: ["shipment", "booking", bookingId],
    queryFn: () => shipmentService.getShipmentByBooking(bookingId).then(res => res.data),
    enabled: !!bookingId,
  });
};

// ==================== MUTATIONS ====================


// Get Quotation for selected bookings
export const useGetQuotation = () => {
  return useMutation({
    mutationFn: (bookingIds) => shipmentService.getQuotation(bookingIds),

    onSuccess: (response) => {
      toast.success(`Found ${response.data?.totalQuotationsFound || 0} quotation options`);
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to get quotation");
    },
  });
};

// Submit Orders to EasyParcel
export const useBulkProcessShipments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      shipmentService.submitOrder(payload),

    onSuccess: (response) => {
      const data = response?.data;

      toast.success(
        data.message ||
        "Shipments processed successfully"
      );

      // Refresh pending shipments table
      // Query key is ['shipments','pending'] — invalidate that exact key
      queryClient.invalidateQueries({
        queryKey: ["shipments", "pending"],
      });

      // Optional:
      // refresh shipment history list too
      queryClient.invalidateQueries({
        queryKey: ["shipments"],
      });
    },

    onError: (err) => {
      const data = err.response?.data;
      toast.error(data?.message || "Failed to process shipments");
    },
  });
};

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ["shipmentWalletBalance"],
    queryFn: () => shipmentService.getWalletBalance().then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteShipment = () => {

};

export const useDownloadMergedAwb = () => {
  return useMutation({
    mutationFn: (shipmentIds = []) => shipmentService.mergeAwb(shipmentIds),

    onSuccess: (response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "awb-labels.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },

    onError: (err) => {
      if (err.response?.status === 404) {
        toast.error("No AWB labels available to download");
      } else if (err.response?.status >= 500) {
        toast.error("Something went wrong, try again");
      } else {
        toast.error("Failed to download labels. Please try again.");
      }
    },
  });
};
