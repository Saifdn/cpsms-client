import { useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/auth/useRegister";   // ← New hook
import { SignupForm } from "@/components/auth/SignUpForm";

export default function SignUp() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSignup = ({ fullName, email, phone, password }) => {
    registerMutation.mutate(
      { fullName, email, phone, password },
      {
        onSuccess: () => {
          // Redirect to login after successful registration
          setTimeout(() => {
            navigate("/sign-in");
          }, 1500);
        },
      }
    );
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm
          onSubmit={handleSignup}
          loading={registerMutation.isPending}     // ← Better loading state
        />
      </div>
    </div>
  );
}