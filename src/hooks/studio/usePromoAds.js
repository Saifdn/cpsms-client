import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services/packageService";
import toast from "react-hot-toast";

export const usePromoAds = () => {
  return useQuery({
    queryKey: ["promoAds"],
    queryFn: () => packageService.getAllPromoAds().then(res => res.data),
  });
};

export const useCreatePromoAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: packageService.createPromoAd,
    onSuccess: () => {
      toast.success("Promo Ad created successfully");
      queryClient.invalidateQueries({ queryKey: ["promoAds"] });
    },
  });
};

export const useUpdatePromoAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => packageService.updatePromoAd(id, data),
    onSuccess: () => {
      toast.success("Promo Ad updated successfully");
      queryClient.invalidateQueries({ queryKey: ["promoAds"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update Promo Ad");
    },
  });
};

export const useDeletePromoAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: packageService.deletePromoAd,
    onSuccess: () => {
      toast.success("Promo Ad deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["promoAds"] });
    },
  });
};