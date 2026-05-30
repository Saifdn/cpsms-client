import { useState } from "react";
import Avatar from "react-avatar";
import { MailIcon, PhoneIcon, ShieldIcon, KeyRoundIcon, PencilIcon } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { EditDialog } from "@/components/dialog/EditDialog";

import { useAuth } from "@/context/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/user/useProfile";
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
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "" });

  const displayName = profile?.data.fullName || user?.fullName || "";
  const email = profile?.data.email || user?.email || "";
  const phone = profile?.data.phone || "";
  const role = profile?.data.role || user?.role || "";

  const handleEditClick = () => {
    setFormData({ fullName: displayName, phone });
    setShowEditDialog(true);
  };

  const handleSave = () => {
    updateProfile(formData, {
      onSuccess: () => setShowEditDialog(false),
    });
  };

  return (
    <Page>
      <PageHeader title="Profile" description="View your account details and manage security settings." />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Profile Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Account Details</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleEditClick}
              disabled={isLoading}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
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

      <EditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Profile"
        description="Update your name and phone number."
        onSave={handleSave}
        isLoading={isUpdating}
      >
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              value={email}
              disabled
              className="cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <PhoneInput
              international
              defaultCountry="MY"
              countryCallingCodeEditable={false}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(value) => setFormData((prev) => ({ ...prev, phone: value || "" }))}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors",
                "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                "[&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:placeholder:text-muted-foreground",
                "[&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-0 [&_.PhoneInputCountrySelect]:outline-none"
              )}
            />
          </Field>
        </div>
      </EditDialog>
    </Page>
  );
};

export default ProfilePage;
