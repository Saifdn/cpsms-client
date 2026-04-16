import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services/packageService";
import toast from "react-hot-toast";

// ==================== QUERY ====================
export const useAddons = () => {
  return useQuery({
    queryKey: ["addons"],
    queryFn: () => packageService.getAllAddons().then(res => res.data),
  });
};

// ==================== MUTATIONS ====================

export const useCreateAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: packageService.createAddon,
    onSuccess: () => {
      toast.success("Add-on created successfully");
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create add-on");
    },
  });
};

export const useUpdateAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => packageService.updateAddon(id, data),
    onSuccess: () => {
      toast.success("Add-on updated successfully");
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update add-on");
    },
  });
};

export const useDeleteAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: packageService.deleteAddon,
    onSuccess: () => {
      toast.success("Add-on deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete add-on");
    },
  });
};