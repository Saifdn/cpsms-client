import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { frameService } from "@/services/frameService";
import toast from "react-hot-toast";

// ==================== QUERIES ====================

export const useFrames = (options = {}) =>
  useQuery({
    queryKey: ["frames"],
    queryFn: () => frameService.getActive().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });

export const useAllFrames = (options = {}) =>
  useQuery({
    queryKey: ["frames", "all"],
    queryFn: () => frameService.getAll().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });

// ==================== MUTATIONS ====================

export const useCreateFrame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: frameService.create,
    onSuccess: () => {
      toast.success("Frame created successfully");
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create frame");
    },
  });
};

export const useUpdateFrame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => frameService.update(id, data),
    onSuccess: () => {
      toast.success("Frame updated successfully");
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update frame");
    },
  });
};

export const useDeleteFrame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: frameService.delete,
    onSuccess: () => {
      toast.success("Frame deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete frame");
    },
  });
};
