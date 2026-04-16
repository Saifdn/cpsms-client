import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

// ==================== QUERY ====================
// Fetch all graduates
export const useGraduates = () => {
  return useQuery({
    queryKey: ["graduates"],
    queryFn: () => userService.graduates.getAll().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

// ==================== MUTATIONS ====================

// Create Graduate
export const useCreateGraduate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => userService.graduates.create(data),
    onSuccess: () => {
      toast.success("Graduate created successfully");
      queryClient.invalidateQueries({ queryKey: ["graduates"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create graduate");
    },
  });
};

// Update Graduate
export const useUpdateGraduate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => userService.graduates.update(id, data),
    onSuccess: () => {
      toast.success("Graduate updated successfully");
      queryClient.invalidateQueries({ queryKey: ["graduates"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update graduate");
    },
  });
};

// Delete Graduate
export const useDeleteGraduate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.graduates.delete(id),
    onSuccess: () => {
      toast.success("Graduate deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["graduates"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete graduate");
    },
  });
};