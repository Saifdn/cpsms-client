import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }) =>
      authService.resetPassword(token, password),

    onSuccess: (response) => {
      toast.success(response.data?.message || "Password reset successfully!");
    },

    onError: (err) => {
      const message = err.response?.data?.message || "Failed to reset password. Token may be expired.";
      toast.error(message);
    },
  });
};