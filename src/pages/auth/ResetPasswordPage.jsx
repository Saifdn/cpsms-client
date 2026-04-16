import { useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const resetMutation = useResetPassword();

  const handleResetPassword = ({ password }) => {
    if (!token) {
      // This should rarely happen if route is correct
      console.error("No token found in URL");
      return;
    }

    resetMutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          // Redirect to login after success message
          setTimeout(() => {
            navigate("/sign-in", { replace: true });
          }, 1800);
        },
      }
    );
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ResetPasswordForm
          onSubmit={handleResetPassword}
          loading={resetMutation.isPending}
          // We can remove error and success props if we want to rely only on toast
        />
      </div>
    </div>
  );
}