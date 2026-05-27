import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

export const useTasks = () =>
  useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskService.getAll().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });

export const useMyTasks = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: ["myTasks"],
    queryFn: () => taskService.getMy().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
    enabled,
  });

export const useAllStaff = () =>
  useQuery({
    queryKey: ["staff", "all"],
    queryFn: () =>
      userService.staff.getAll({ page: 1, limit: 100 }).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => taskService.create(data),
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create task"),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => taskService.update(id, data),
    onSuccess: () => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update task"),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => taskService.delete(id),
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete task"),
  });
};
