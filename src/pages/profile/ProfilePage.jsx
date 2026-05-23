import Avatar from "react-avatar";
import { MailIcon, PhoneIcon, ShieldIcon, KeyRoundIcon } from "lucide-react";

import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/context/useAuth";
import { useProfile } from "@/hooks/user/useProfile";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

const ROLE_LABELS = {
  graduate: "Graduate",
  staff: "Staff",
  admin: "Admin",
  superadmin: "Super Admin",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate font-medium">{value || "—"}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { mutate: sendResetLink, isPending } = useForgotPassword();

  const displayName = profile?.fullName || user?.fullName || "";
  const email = profile?.email || user?.email || "";
  const phone = profile?.phone || "";
  const role = profile?.role || user?.role || "";

  return (
    <Page>
      <PageHeader title="Profile" description="View your account details and manage security settings." />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={displayName || email || "User"} size="64px" round="12px" />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{isLoading ? "Loading…" : displayName}</p>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {ROLE_LABELS[role] || role}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <InfoRow icon={MailIcon} label="Email address" value={email} />
              <InfoRow icon={PhoneIcon} label="Phone number" value={phone} />
              <InfoRow icon={ShieldIcon} label="Role" value={ROLE_LABELS[role] || role} />
            </div>

            <p className="text-xs text-muted-foreground">
              Email address cannot be changed. Contact your administrator if you need to update it.
            </p>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <KeyRoundIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  We'll send a password reset link to <span className="font-medium">{email}</span>.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              disabled={isPending || !email}
              onClick={() => sendResetLink(email)}
              className="w-full"
            >
              {isPending ? "Sending…" : "Send Reset Link"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default ProfilePage;
