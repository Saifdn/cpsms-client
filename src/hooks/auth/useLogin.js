import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/useAuth";
import toast from "react-hot-toast";

export const useLogin = () => {
  const { login: contextLogin } = useAuth();

  return useMutation({
    mutationFn: ({ email, password }) =>
      authService.login(email, password),

    onSuccess: async (response) => {
      const accessToken = response.data.accessToken;
      
      const success = await contextLogin(accessToken);
      
      if (success) {
        toast.success("Login successful! Welcome back.");
      } else {
        toast.error("Failed to process login");
      }
    },

    onError: (err) => {
      const message = err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    },
  });
};