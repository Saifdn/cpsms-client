import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm({
  className,
  onSubmit,
  loading = false,
  ...props
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit?.({ email: email.trim() });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Forgot Password?</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <Button 
                  type="submit" 
                  disabled={loading || !email.trim()} 
                  className="w-full"
                >
                  {loading ? "Sending reset link..." : "Send Reset Link"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Remember your password?{" "}
                <a href="/sign-in" className="hover:underline">
                  Sign in
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/signup.svg"
              alt="Forgot password background"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:underline">Terms of Service</a> and{" "}
        <a href="#" className="hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}