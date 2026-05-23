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
import { Logo } from "@/assets/Logo";

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
      <Card className="overflow-hidden p-0 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            <FieldGroup>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center justify-center">
                  <Logo size={36} />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-10"
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full h-10"
                >
                  {loading ? "Sending reset link..." : "Send reset link"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Remember your password?{" "}
                <a href="/sign-in" className="font-medium text-foreground hover:text-primary transition-colors">
                  Sign in
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/signup.svg"
              alt="Forgot password background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-75"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs">
        By submitting, you agree to our{" "}
        <a href="#" className="hover:underline">Terms of Service</a> and{" "}
        <a href="#" className="hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}