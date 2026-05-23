import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuth } from "@/context/useAuth";
import { LoginForm } from "@/components/auth/SignInForm";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const { user } = useAuth();

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (!user) return;
    const defaultPath = user.role === "graduate" ? "/" : "/dashboard";
    navigate(from || defaultPath, { replace: true });
  }, [user]);

  const handleLogin = ({ email, password }) => {
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          onSubmit={handleLogin}
          loading={loginMutation.isPending}     // ← Use mutation loading state
          error={loginMutation.error?.response?.data?.message} // Optional
        />
      </div>
    </div>
  );
}