import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  Minus,
  Plus,
  Receipt,
  Search,
  UserRound,
} from "lucide-react";

import { useAdminCreateFrameOrder } from "@/hooks/frameOrders/useFrameOrders";
import { useAllFrames } from "@/hooks/frames/useFrames";
import { useGraduates } from "@/hooks/user/useGraduates";

const MALAYSIA_STATES = [
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

const EMPTY_RECEIVER = {
  name: "",
  phone_number: "",
  email: "",
  address_1: "",
  address_2: "",
  postcode: "",
  city: "",
  subdivision_code: "",
  country_code: "MY",
};

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

export const AdminCreateFrameOrderDialog = ({ open, onOpenChange }) => {
  const adminCreate = useAdminCreateFrameOrder();
  const { data: framesData, isLoading: framesLoading } = useAllFrames({ enabled: open });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: graduatesData, isLoading: graduatesLoading } = useGraduates({
    search: debouncedSearch,
    limit: 10,
    enabled: open && debouncedSearch.length >= 1,
  });

  const frames = framesData?.data ?? [];
  const graduates = graduatesData?.data ?? [];

  const [selectedGraduate, setSelectedGraduate] = useState(null);
  const [openGraduate, setOpenGraduate] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cart, setCart] = useState({});
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [receiver, setReceiver] = useState(EMPTY_RECEIVER);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setSelectedGraduate(null);
      setOpenGraduate(false);
      setPaymentMethod("cash");
      setCart({});
      setIncludeDelivery(false);
      setReceiver(EMPTY_RECEIVER);
      setSearchQuery("");
      setDebouncedSearch("");
    }
    onOpenChange(isOpen);
  };

  const increment = (frameId) =>
    setCart((prev) => ({ ...prev, [frameId]: (prev[frameId] || 0) + 1 }));

  const decrement = (frameId) =>
    setCart((prev) => {
      const qty = (prev[frameId] || 0) - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[frameId];
        return next;
      }
      return { ...prev, [frameId]: qty };
    });

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({ ...prev, [name]: value }));
  };

  const cartItems = frames
    .filter((f) => cart[f._id] > 0)
    .map((f) => ({ frame: f, quantity: cart[f._id] }));

  const total = cartItems.reduce((sum, { frame, quantity }) => sum + frame.price * quantity, 0);

  const handleSave = () => {
    if (!selectedGraduate) {
      toast.error("Please select a graduate");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Add at least one frame to the order");
      return;
    }

    const payload = {
      graduate: selectedGraduate._id,
      paymentMethod,
      items: cartItems.map(({ frame, quantity }) => ({ frame: frame._id, quantity })),
    };

    if (includeDelivery) {
      const required = ["name", "phone_number", "email", "address_1", "postcode", "city", "subdivision_code"];
      if (!required.every((f) => receiver[f]?.trim())) {
        toast.error("Please fill in all required delivery address fields");
        return;
      }
      payload.shipment = {
        receiver: {
          name: receiver.name,
          phone_number: receiver.phone_number,
          phone_number_country_code: "MY",
          email: receiver.email,
          address_1: receiver.address_1,
          address_2: receiver.address_2 || "",
          postcode: receiver.postcode,
          city: receiver.city,
          subdivision_code: receiver.subdivision_code,
          country_code: "MY",
        },
      };
    }

    adminCreate.mutate(payload, { onSuccess: () => handleOpenChange(false) });
  };

  return (
    <CreateDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Create Frame Order"
      description="Record a cash or QR payment frame order on behalf of a graduate."
      onSave={handleSave}
      isLoading={adminCreate.isPending}
      saveLabel="Create Order"
      className="sm:max-w-2xl"
    >
      <div className="max-h-[72vh] overflow-y-auto pr-1 space-y-5">

        {/* Graduate */}
        <div className="space-y-3">
          <SectionLabel>Graduate</SectionLabel>
          <Field>
            <FieldLabel>Select Graduate</FieldLabel>
            <Popover open={openGraduate} onOpenChange={setOpenGraduate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openGraduate}
                  className="w-full justify-between font-normal h-auto min-h-10 px-3 py-2"
                >
                  {selectedGraduate ? (
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {selectedGraduate.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">{selectedGraduate.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{selectedGraduate.email}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground font-normal">Search by name or email…</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Type name or email…"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  {!debouncedSearch ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <Search className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">Type to search graduates</p>
                    </div>
                  ) : graduatesLoading ? (
                    <div className="p-2 space-y-1">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center gap-3 rounded-md px-2 py-2">
                          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>
                        <div className="flex flex-col items-center gap-2 py-6">
                          <UserRound className="h-8 w-8 text-muted-foreground/40" />
                          <p className="text-sm text-muted-foreground">No graduate found</p>
                        </div>
                      </CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-auto p-1">
                        {graduates.map((grad) => {
                          const isSelected = selectedGraduate?._id === grad._id;
                          return (
                            <CommandItem
                              key={grad._id}
                              value={grad._id}
                              onSelect={() => {
                                setSelectedGraduate(grad);
                                setOpenGraduate(false);
                              }}
                              className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer"
                            >
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                {grad.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{grad.fullName}</p>
                                <p className="text-xs text-muted-foreground truncate">{grad.email}</p>
                              </div>
                              {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <SectionLabel>Payment Method</SectionLabel>
          <Field>
            <FieldLabel>Method</FieldLabel>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="qr">QR Payment</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Frames */}
        <div className="rounded-lg border p-4 space-y-3">
          <SectionLabel>Frames</SectionLabel>
          {framesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : frames.length === 0 ? (
            <p className="text-sm text-muted-foreground">No frames available in catalog</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {frames.map((frame) => {
                const qty = cart[frame._id] || 0;
                const isInCart = qty > 0;
                return (
                  <div
                    key={frame._id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${isInCart ? "border-primary bg-primary/5 ring-2 ring-primary" : "bg-background"} ${!frame.isActive ? "opacity-60" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold leading-snug">{frame.name}</div>
                      <div className="text-sm font-bold text-primary mt-0.5">
                        RM {Number(frame.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => decrement(frame._id)}
                        disabled={qty === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => increment(frame._id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <SectionLabel>Order Summary</SectionLabel>
            <div className="space-y-1.5 pt-1">
              {cartItems.map(({ frame, quantity }) => (
                <div key={frame._id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {frame.name}{" "}
                    <span className="text-foreground font-medium">×{quantity}</span>
                  </span>
                  <span className="tabular-nums font-medium">
                    RM {(frame.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span className="flex items-center gap-1.5 text-sm">
                <Receipt size={14} />
                Total
              </span>
              <span className="tabular-nums">RM {total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Optional Delivery Address */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>Delivery Address</SectionLabel>
            <button
              type="button"
              onClick={() => setIncludeDelivery((v) => !v)}
              className="text-xs text-primary hover:underline font-medium"
            >
              {includeDelivery ? "Remove delivery" : "+ Add delivery address"}
            </button>
          </div>

          {includeDelivery && (
            <div className="rounded-lg border p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="admin-name"
                    name="name"
                    placeholder="Recipient full name"
                    value={receiver.name}
                    onChange={handleReceiverChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <PhoneInput
                    international
                    defaultCountry="MY"
                    countryCallingCodeEditable={false}
                    placeholder="Enter phone number"
                    value={receiver.phone_number}
                    onChange={(value) =>
                      handleReceiverChange({ target: { name: "phone_number", value: value || "" } })
                    }
                    className={[
                      "flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors",
                      "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                      "[&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:placeholder:text-muted-foreground",
                      "[&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-0 [&_.PhoneInputCountrySelect]:outline-none",
                    ].join(" ")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="recipient@email.com"
                  value={receiver.email}
                  onChange={handleReceiverChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-address_1">
                  Address Line 1 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="admin-address_1"
                  name="address_1"
                  placeholder="House number, street name"
                  value={receiver.address_1}
                  onChange={handleReceiverChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-address_2">Address Line 2 (Optional)</Label>
                <Input
                  id="admin-address_2"
                  name="address_2"
                  placeholder="Floor, unit, landmark"
                  value={receiver.address_2}
                  onChange={handleReceiverChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-postcode">
                    Postcode <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="admin-postcode"
                    name="postcode"
                    placeholder="12345"
                    value={receiver.postcode}
                    onChange={handleReceiverChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="admin-city"
                    name="city"
                    placeholder="City name"
                    value={receiver.city}
                    onChange={handleReceiverChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={receiver.subdivision_code}
                    onValueChange={(v) =>
                      setReceiver((prev) => ({ ...prev, subdivision_code: v }))
                    }
                  >
                    <SelectTrigger id="admin-state">
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
          )}
        </div>
      </div>
    </CreateDialog>
  );
};
