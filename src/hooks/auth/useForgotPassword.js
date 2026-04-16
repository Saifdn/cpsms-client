import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),

    onSuccess: (response) => {
      toast.success(response.data?.message || "Reset link sent to your email!");
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    },
  });
};