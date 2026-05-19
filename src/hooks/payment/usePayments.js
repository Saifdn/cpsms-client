import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";
import toast from "react-hot-toast";


export const usePaymentById = (id, enabled = false) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentService.getPaymentById(id).then(res => res.data),
    enabled: !!id && enabled,
  });
};

export const usePaymentStatusById = (id, options = {}) => {
  return useQuery({
    queryKey: ["paymentStatus", id],
    queryFn: () => paymentService.getPaymentStatusById(id).then(res => res.data),
    enabled: !!id,
    ...options,  // ← add this
  });
};