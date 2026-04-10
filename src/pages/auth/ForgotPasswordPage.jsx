import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const handleForgotPassword = ({ email }) => {
    forgotPasswordMutation.mutate(
      email,
      {
        onSuccess: () => {
          // Optional: You can navigate or show a success message
          // navigate("/sign-in"); // Uncomment if you want to redirect
        },
      }
    );
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          loading={forgotPasswordMutation.isPending}
        />
      </div>
    </div>
  );
}