// src/hooks/auth/useRegister.js
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) => authService.register(userData),

    onSuccess: (response) => {
      toast.success(response.data?.message || "Account created successfully!");
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Signup failed");
    },
  });
};