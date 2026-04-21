import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studioService } from "@/services/studioService";
import toast from "react-hot-toast";

// ==================== QUERY ====================
// Fetch all studios
export const useStudios = () => {
  return useQuery({
    queryKey: ["studios"],
    queryFn: () => studioService.getAllStudios().then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });
};

// ==================== MUTATIONS ====================

// Create Studio
export const useCreateStudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studioService.createStudio(data),

    onSuccess: () => {
      toast.success("Studio created successfully");
      queryClient.invalidateQueries({ queryKey: ["studios"] });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create studio");
    },
  });
};

// Update Studio
export const useUpdateStudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => studioService.updateStudio(id, data),

    onSuccess: () => {
      toast.success("Studio updated successfully");
      queryClient.invalidateQueries({ queryKey: ["studios"] });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update studio");
    },
  });
};

// Delete Studio
export const useDeleteStudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => studioService.deleteStudio(id),

    onSuccess: () => {
      toast.success("Studio deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["studios"] });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete studio");
    },
  });
};

// Toggle Studio Availability
export const useToggleStudioAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }) => 
      studioService.toggleAvailability(id, isAvailable),

    onSuccess: (response) => {
      const status = response.data?.isAvailable ? "Available" : "Unavailable";
      toast.success(response?.data?.message || `Studio is now ${status}`);
      queryClient.invalidateQueries({ queryKey: ["studios"] });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update availability");
    },
  });
};