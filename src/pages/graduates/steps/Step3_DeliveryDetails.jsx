// pages/booking/steps/Step3_DeliveryDetails.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/context/useAuth";

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

const Step3_DeliveryDetails = ({ data, updateData, onNext, onPrev }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    countryCode: "+60",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    state: "",
    city: "",
    notes: "",
    ...(data.deliveryAddress || {}),
  });

  const cleanPhone = (value = "") => value.replace(/\s+/g, "").trim();

  const composePhoneWithCountryCode = () => {
    const providedPhone = cleanPhone(
      formData.phone || user?.phone || user?.phoneNumber || "",
    );

    if (!providedPhone) return "";
    if (providedPhone.startsWith("+")) return providedPhone;

    const selectedCode = cleanPhone(formData.countryCode || "+60");
    return `${selectedCode}${providedPhone}`;
  };

  const finalFormData = {
    ...formData,
    fullName: formData.fullName || user?.fullName || "",
    // phone: composePhoneWithCountryCode(),
    email: formData.email || user?.email || "",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requiredFieldsFilled =
    finalFormData.fullName.trim() &&
    finalFormData.phone.trim() &&
    finalFormData.email.trim() &&
    finalFormData.addressLine1.trim() &&
    finalFormData.addressLine2.trim() &&
    finalFormData.postcode.trim() &&
    finalFormData.state.trim() &&
    finalFormData.city.trim();

  const handleContinue = () => {
    if (!requiredFieldsFilled) {
      alert("Please fill in all required fields");
      return;
    }

    updateData({ deliveryAddress: finalFormData });
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Delivery Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter full name"
              value={finalFormData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                name="countryCode"
                placeholder="Code"
                value={formData.countryCode}
                onChange={handleChange}
              />
              <Input
                name="phone"
                placeholder="e.g. 123456789"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter email"
            value={finalFormData.email}
            onChange={handleChange}
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1</Label>
          <Input
            id="addressLine1"
            name="addressLine1"
            placeholder="Enter address line 1"
            value={formData.addressLine1}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input
            id="addressLine2"
            name="addressLine2"
            placeholder="Enter address line 2"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              name="postcode"
              placeholder="Enter postcode"
              value={formData.postcode}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={formData.state}
            onValueChange={(value) =>
              setFormData({ ...formData, state: value })
            }
          >
            <SelectTrigger id="state">
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

        <div className="flex gap-4">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1"
            disabled={!requiredFieldsFilled}
          >
            Continue to Review & Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3_DeliveryDetails;
