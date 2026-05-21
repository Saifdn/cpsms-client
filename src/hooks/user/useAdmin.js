import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

// ==================== QUERY ====================
// Fetch all admins
export const useAdmins = ({ page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: ["admins", page, limit],
    queryFn: () =>
      userService.admins.getAll({ page, limit }).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

// ==================== MUTATIONS ====================

// Create Admin
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => userService.admins.create(data),
    onSuccess: () => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create admin");
    },
  });
};

// Update Admin
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => userService.admins.update(id, data),
    onSuccess: () => {
      toast.success("Admin updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update admin");
    },
  });
};

// Delete Admin
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.admins.delete(id),
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete admin");
    },
  });
};