// pages/booking/steps/Step4_ReviewPayment.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const malaysiaStates = {
  "MY-01": "Johor",
  "MY-02": "Kedah",
  "MY-03": "Kelantan",
  "MY-04": "Melaka",
  "MY-05": "Negeri Sembilan",
  "MY-06": "Pahang",
  "MY-07": "Pulau Pinang",
  "MY-08": "Perak",
  "MY-09": "Perlis",
  "MY-10": "Selangor",
  "MY-11": "Terengganu",
  "MY-12": "Sabah",
  "MY-13": "Sarawak",
  "MY-14": "Wilayah Persekutuan Kuala Lumpur",
  "MY-15": "Wilayah Persekutuan Labuan",
  "MY-16": "Wilayah Persekutuan Putrajaya",
};

const formatDate = (date) => {
  if (!date) return "-";
  const normalizedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(normalizedDate.getTime())) return "-";

  return normalizedDate.toDateString();
};

const Step4_ReviewPayment = ({ data, onPrev, onComplete }) => {
  const deliveryAddress = data.deliveryAddress || {};
  const session = data.selectedSession || {};
  const selectedPackage = data.selectedPackage || {};
  const selectedAddons = data.selectedAddons || [];

  const packagePrice = Number(selectedPackage.price) || 0;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);
  const totalPrice = packagePrice + addonsTotal;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Review & Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold">Booking Summary</h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Session Details
              </div>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-right">{formatDate(session.date)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-right">
                    {session.startTime && session.endTime ? `${session.startTime} - ${session.endTime}` : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Package Details
              </div>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-right">{selectedPackage.name || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-right">
                    {selectedPackage.price ? `RM ${selectedPackage.price}` : "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Services</div>
                  <div className="text-xs leading-5 text-right space-y-1">
                    {selectedPackage.services?.length > 0 ? (
                      selectedPackage.services.map((service, index) => (
                        <div key={index}>{service}</div>
                      ))
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Add-on Details
              </div>
              <div className="space-y-2">
                {selectedAddons.length > 0 ? (
                  selectedAddons.map((addon) => (
                    <div key={addon._id} className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{addon.name}</span>
                      <span className="font-medium text-right">RM {addon.price || 0}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No add-ons selected</div>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Delivery Details
              </div>
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-right">{deliveryAddress.fullName || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium text-right">{(deliveryAddress.countryCode || "+60") + (deliveryAddress.phone || "-")}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-right break-all">{deliveryAddress.email || "-"}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Address</div>
                  <div className="text-right leading-5">
                    <div>{deliveryAddress.addressLine1 || "-"}</div>
                    {deliveryAddress.addressLine2 ? <div>{deliveryAddress.addressLine2}</div> : null}
                    <div>
                      {[deliveryAddress.postcode, deliveryAddress.city].filter(Boolean).join(", ") || "-"}
                    </div>
                    <div>
                      {deliveryAddress.state ? `${deliveryAddress.state} - ${malaysiaStates[deliveryAddress.state] || deliveryAddress.state}` : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-4 text-sm flex justify-between gap-4">
            <span className="font-medium">Total</span>
            <span className="font-bold">RM {totalPrice}</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <Button onClick={onComplete} className="w-full" size="lg">
            Proceed to Payment
          </Button>
          <Button variant="outline" onClick={onPrev} className="w-full mt-3">
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4_ReviewPayment;