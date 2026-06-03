import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, User, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { MALAYSIA_STATES } from "@/lib/malaysia";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useAuth } from "@/context/useAuth";
import { useProfile } from "@/hooks/user/useProfile";

const DeliveryFormSkeleton = ({ onPrev }) => (
  <Card className="border-0 shadow-md">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72 mt-1" />
    </CardHeader>
    <CardContent className="space-y-8 pt-4">
      <Skeleton className="h-14 rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 rounded-md" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-36" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="lg" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button size="lg" disabled className="flex-1">
          Continue to Review
        </Button>
      </div>
    </CardContent>
  </Card>
);

const DeliveryForm = ({ profile, user, data, updateData, onNext, onPrev }) => {
  const receiver = data.receiver ?? {};

  const rawPhone = receiver.phone_number || profile?.phone || "";
  let initialPhone = rawPhone;
  if (rawPhone && !rawPhone.startsWith("+")) {
    const countryCode = receiver.phone_number_country_code || "MY";
    const parsed = parsePhoneNumberFromString(rawPhone, countryCode);
    if (parsed) initialPhone = parsed.format("E.164");
  }

  const [formData, setFormData] = useState({
    name: receiver.name || profile?.fullName || user?.fullName || "",
    phone_number: initialPhone,
    email: receiver.email || profile?.email || user?.email || "",
    address_1: receiver.address_1 || "",
    address_2: receiver.address_2 || "",
    postcode: receiver.postcode || "",
    city: receiver.city || "",
    subdivision_code: receiver.subdivision_code || "",
    country_code: receiver.country_code || "MY",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() &&
    formData.phone_number.trim() &&
    formData.email.trim() &&
    formData.address_1.trim() &&
    formData.postcode.trim() &&
    formData.city.trim() &&
    formData.subdivision_code;

  const handleContinue = () => {
    if (!isFormValid) return;

    let phoneNational = formData.phone_number;
    let phoneCountryCode = formData.country_code;
    const parsed = parsePhoneNumberFromString(formData.phone_number);
    if (parsed) {
      phoneNational = parsed.nationalNumber;
      phoneCountryCode = parsed.country;
    }

    updateData({
      receiver: {
        name: formData.name,
        phone_number: phoneNational,
        phone_number_country_code: phoneCountryCode,
        email: formData.email,
        address_1: formData.address_1,
        address_2: formData.address_2 || "",
        postcode: formData.postcode,
        city: formData.city,
        subdivision_code: formData.subdivision_code,
        country_code: "MY",
      },
    });

    onNext();
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5 text-primary" />
          Delivery Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your frames will be shipped to this address.
        </p>
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Please ensure your address is accurate. We will use this to ship your frames after your order is processed.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Recipient Information</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone_number">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <PhoneInput
                international
                defaultCountry="MY"
                countryCallingCodeEditable={false}
                placeholder="Enter phone number"
                value={formData.phone_number}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phone_number: value || "" }))
                }
                onCountryChange={(country) =>
                  setFormData((prev) => ({ ...prev, country_code: country || "MY" }))
                }
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors",
                  "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                  "[&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:placeholder:text-muted-foreground",
                  "[&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-0 [&_.PhoneInputCountrySelect]:outline-none",
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Delivery Address</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address_1">
              Address Line 1 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address_1"
              name="address_1"
              placeholder="House number, street name"
              value={formData.address_1}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address_2">
              Address Line 2{" "}
              <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="address_2"
              name="address_2"
              placeholder="Floor, unit, landmark"
              value={formData.address_2}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="postcode">
                Postcode <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postcode"
                name="postcode"
                placeholder="12345"
                value={formData.postcode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="City name"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subdivision_code">
                State <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.subdivision_code}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, subdivision_code: v }))
                }
              >
                <SelectTrigger id="subdivision_code">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {MALAYSIA_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="lg" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button size="lg" onClick={handleContinue} disabled={!isFormValid} className="flex-1">
            Continue to Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Step2_DeliveryDetails = ({ data, updateData, onNext, onPrev }) => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return <DeliveryFormSkeleton onPrev={onPrev} />;
  }

  return (
    <DeliveryForm
      profile={profile?.data}
      user={user}
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default Step2_DeliveryDetails;
