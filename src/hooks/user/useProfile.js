import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { profileService } from "@/services/profileService";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getMe().then((res) => res.data),
    staleTime: 60_000,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileService.updateMe(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });
};
