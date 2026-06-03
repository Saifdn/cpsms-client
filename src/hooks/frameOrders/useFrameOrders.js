import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { frameOrderService } from "@/services/frameOrderService";
import toast from "react-hot-toast";

// ==================== GRADUATE QUERIES ====================

export const useMyFrameOrders = ({ status } = {}, options = {}) =>
  useQuery({
    queryKey: ["myFrameOrders", status],
    queryFn: () => frameOrderService.getMyOrders({ status }).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });

export const useMyFrameOrderById = (id, options = {}) =>
  useQuery({
    queryKey: ["myFrameOrders", id],
    queryFn: () => frameOrderService.getMyOrderById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 60_000,
    ...options,
  });

// ==================== ADMIN QUERIES ====================

export const useFrameOrders = ({ status, search, page = 1, limit = 20 } = {}, options = {}) =>
  useQuery({
    queryKey: ["frameOrders", status, search, page, limit],
    queryFn: () =>
      frameOrderService.getAllOrders({ status, search, page, limit }).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
    ...options,
  });

export const useFrameOrderById = (id, options = {}) =>
  useQuery({
    queryKey: ["frameOrders", id],
    queryFn: () => frameOrderService.getOrderById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 60_000,
    ...options,
  });

// ==================== MUTATIONS ====================

export const useCreateFrameOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: frameOrderService.createOrder,
    onSuccess: (response) => {
      const { paymentUrl, frameOrderId } = response.data;
      if (frameOrderId) {
        sessionStorage.setItem("pendingFrameOrderId", frameOrderId);
      }
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        queryClient.invalidateQueries({ queryKey: ["myFrameOrders"] });
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to place frame order");
    },
  });
};

export const useCancelFrameOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: frameOrderService.cancelOrder,
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["myFrameOrders"] });
      queryClient.invalidateQueries({ queryKey: ["frameOrders"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    },
  });
};

export const useAdminCreateFrameOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: frameOrderService.adminCreateOrder,
    onSuccess: () => {
      toast.success("Frame order created successfully");
      queryClient.invalidateQueries({ queryKey: ["frameOrders"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create frame order");
    },
  });
};

export const useUpdateFrameOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => frameOrderService.updateOrder(id, data),
    onSuccess: (_, variables) => {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["frameOrders"] });
      queryClient.invalidateQueries({ queryKey: ["frameOrders", variables.id] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update order");
    },
  });
};
