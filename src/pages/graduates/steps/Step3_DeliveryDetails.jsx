import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/context/useAuth";
import { useProfile } from "@/hooks/user/useProfile";
import { MapPin, User, Info } from "lucide-react";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const malaysiaStates = [
  { code: "MY-01", name: "Johor" },
  { code: "MY-02", name: "Kedah" },
  { code: "MY-03", name: "Kelantan" },
  { code: "MY-04", name: "Melaka" },
  { code: "MY-05", name: "Negeri Sembilan" },
  { code: "MY-06", name: "Pahang" },
  { code: "MY-07", name: "Pulau Pinang" },
  { code: "MY-08", name: "Perak" },
  { code: "MY-09", name: "Perlis" },
  { code: "MY-10", name: "Selangor" },
  { code: "MY-11", name: "Terengganu" },
  { code: "MY-12", name: "Sabah" },
  { code: "MY-13", name: "Sarawak" },
  { code: "MY-14", name: "Wilayah Persekutuan Kuala Lumpur" },
  { code: "MY-15", name: "Wilayah Persekutuan Labuan" },
  { code: "MY-16", name: "Wilayah Persekutuan Putrajaya" },
];

const DeliveryForm = ({ profile, user, data, updateData, onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    name: profile?.fullName || user?.fullName || "",
    phone_number: profile?.phone || "",
    email: profile?.email || user?.email || "",
    address_1: data.deliveryAddress?.receiver?.address_1 || "",
    address_2: data.deliveryAddress?.receiver?.address_2 || "",
    postcode: data.deliveryAddress?.receiver?.postcode || "",
    city: data.deliveryAddress?.receiver?.city || "",
    subdivision_code: data.deliveryAddress?.receiver?.subdivision_code || "",
    country_code: "MY",
    notes: data.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (value) => {
    setFormData((prev) => ({ ...prev, subdivision_code: value }));
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

    const receiverData = {
      name: formData.name,
      phone_number_country_code: phoneCountryCode,
      phone_number: phoneNational,
      email: formData.email,
      address_1: formData.address_1,
      address_2: formData.address_2 || "",
      postcode: formData.postcode,
      city: formData.city,
      subdivision_code: formData.subdivision_code,
      country_code: "MY",
    };

    updateData({
      deliveryAddress: { receiver: receiverData },
      notes: formData.notes,
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
          Your graduation photos will be shipped to this address after the event.
        </p>
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        {/* Info callout */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Please ensure your address is accurate. We'll use this to ship your printed photos after convocation.
          </p>
        </div>

        {/* Recipient info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Recipient Information</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone_number">Phone Number <span className="text-destructive">*</span></Label>
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
                  "[&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-0 [&_.PhoneInputCountrySelect]:outline-none"
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
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

        {/* Delivery address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Delivery Address</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address_1">Address Line 1 <span className="text-destructive">*</span></Label>
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
              <Label htmlFor="postcode">Postcode <span className="text-destructive">*</span></Label>
              <Input
                id="postcode"
                name="postcode"
                placeholder="12345"
                value={formData.postcode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
              <Input
                id="city"
                name="city"
                placeholder="City name"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subdivision_code">State <span className="text-destructive">*</span></Label>
              <Select value={formData.subdivision_code} onValueChange={handleStateChange}>
                <SelectTrigger id="subdivision_code">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {malaysiaStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!isFormValid} className="flex-1">
            Continue to Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Step3_DeliveryDetails = ({ data, updateData, onNext, onPrev }) => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return null;

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

export default Step3_DeliveryDetails;
