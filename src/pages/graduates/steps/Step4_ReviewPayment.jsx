// pages/booking/steps/Step4_ReviewPayment.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Step4_ReviewPayment = ({ data, onPrev, onComplete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Review & Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-medium">{data.selectedPackage?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{data.selectedSession?.date?.toDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold">RM {data.selectedPackage?.price}</span>
            </div>
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