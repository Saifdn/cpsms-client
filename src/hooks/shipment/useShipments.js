// hooks/shipment/useShipments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "@/services/shipmentService";
import toast from "react-hot-toast";

// ==================== QUERIES ====================

// Get all pending shipments
export const usePendingShipments = () => {
  return useQuery({
    queryKey: ["pendingShipments"],
    queryFn: () => shipmentService.getPendingShipments().then(res => res.data),
    staleTime: 2 * 60 * 1000,
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
      queryClient.invalidateQueries({
        queryKey: ["pendingShipments"],
      });

      // Optional:
      // refresh shipment history list too
      queryClient.invalidateQueries({
        queryKey: ["shipments"],
      });
    },

    onError: (err) => {
      const data = err.response?.data;

      // OAuth required
      if (data?.oauthRequired) {
        toast.loading(
          "Redirecting to EasyParcel..."
        );

        window.location.href =
          data.connectUrl;

        return;
      }

      toast.error(
        data?.message ||
        "Failed to process shipments"
      );
    },
  });
};

export const useDeleteShipment = () => {

}



