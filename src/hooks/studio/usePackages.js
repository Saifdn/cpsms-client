import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services/packageService";
import toast from "react-hot-toast";

// Packages
export const usePackages = () => {
  return useQuery({
    queryKey: ["packages"],
    queryFn: () => packageService.getAll().then(res => res.data),
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: packageService.create,
    onSuccess: () => {
      toast.success("Package created successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create package"),
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => packageService.update(id, data),
    onSuccess: () => {
      toast.success("Package updated successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: packageService.delete,
    onSuccess: () => {
      toast.success("Package deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};