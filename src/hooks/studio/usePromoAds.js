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