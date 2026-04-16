import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

// ==================== QUERY ====================
// Fetch all staff
export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => userService.staff.getAll().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

// ==================== MUTATIONS ====================

// Create Staff
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => userService.staff.create(data),
    onSuccess: () => {
      toast.success("Staff created successfully");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create staff");
    },
  });
};

// Update Staff
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => userService.staff.update(id, data),
    onSuccess: () => {
      toast.success("Staff updated successfully");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update staff");
    },
  });
};

// Delete Staff
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.staff.delete(id),
    onSuccess: () => {
      toast.success("Staff deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete staff");
    },
  });
};