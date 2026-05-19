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
import { useState, useEffect } from "react";
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
    name: data.deliveryAddress?.receiver?.name || user?.fullName || "",
    phone_number: data.deliveryAddress?.receiver?.phone_number || user?.phone?.replace("+60", "") || "",
    email: data.deliveryAddress?.receiver?.email || user?.email || "",

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
    if (!isFormValid) {
      alert("Please fill in all required fields");
      return;
    }

    // Transform to match EasyParcel receiver structure
    const receiverData = {
      name: formData.name,
      phone_number_country_code: "MY",
      phone_number: formData.phone_number,
      email: formData.email,
      address_1: formData.address_1,
      address_2: formData.address_2 || "",
      postcode: formData.postcode,
      city: formData.city,
      subdivision_code: formData.subdivision_code,
      country_code: "MY",
    };

    updateData({
      deliveryAddress: {
        receiver: receiverData,
      },
      notes: formData.notes,
    });

    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Delivery Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <div className="flex">
              <div className="bg-muted px-3 flex items-center text-sm border border-r-0 border-input rounded-l-md">
                +60
              </div>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="123456789"
                value={formData.phone_number}
                onChange={handleChange}
                className="rounded-l-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_1">Address Line 1 *</Label>
          <Input
            id="address_1"
            name="address_1"
            placeholder="House number, street name"
            value={formData.address_1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_2">Address Line 2 (Optional)</Label>
          <Input
            id="address_2"
            name="address_2"
            placeholder="Floor, unit, landmark (optional)"
            value={formData.address_2}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode *</Label>
            <Input
              id="postcode"
              name="postcode"
              placeholder="12345"
              value={formData.postcode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              placeholder="City name"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdivision_code">State *</Label>
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

        {/* <div className="space-y-2">
          <Label htmlFor="notes">Delivery Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Special instructions, leave at door, etc."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div> */}

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!isFormValid}
            className="flex-1"
          >
            Continue to Review & Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3_DeliveryDetails;