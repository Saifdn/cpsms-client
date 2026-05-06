// pages/booking/Booking.jsx
import { useState } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCreateBooking } from "@/hooks/studio/useBookings";
import { useAuth } from "@/context/useAuth";

import Step1_SessionSelection from "./steps/Step1_SessionSelection";
import Step2_PackageSelection from "./steps/Step2_PackageSelection";
import Step3_DeliveryDetails from "./steps/Step3_DeliveryDetails";
import Step4_ReviewPayment from "./steps/Step4_ReviewPayment";
// import { u } from "node_modules/react-router/dist/development/index-react-server-client-C4tCIird";

const Booking = () => {

  const createBookingMutation = useCreateBooking();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    selectedSession: null,
    selectedPackage: null,
    selectedAddons: [],
    deliveryAddress: {},
    notes: "",
  });

  const totalSteps = 4;

  const updateBookingData = (newData) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Final Step Handler
  const handleComplete = async () => {
    if (!bookingData.selectedPackage || !bookingData.selectedSession) {
      alert("Please complete all previous steps");
      return;
    }

    const payload = {
      graduate: user.id,
      package: bookingData.selectedPackage._id,
      session: bookingData.selectedSession._id,
      addons: bookingData.selectedAddons.map(a => a._id),
      shipment: bookingData.deliveryAddress,
    };

    createBookingMutation.mutate(payload, {
      onSuccess: (data) => {

      },
      onError: (err) => {

      }
    });
  };

  return (
    <Page>
      <PageHeader
        title="Book Your Studio Session"
        description={`Step ${step} of ${totalSteps}`}
      />

      <div className="mb-10">
        <Progress value={(step / totalSteps) * 100} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Session</span>
          <span>Package</span>
          <span>Details</span>
          <span>Review</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {step === 1 && <Step1_SessionSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} />}
        {step === 2 && <Step2_PackageSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />}
        {step === 3 && <Step3_DeliveryDetails data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />}
        {step === 4 && (
          <Step4_ReviewPayment 
            data={bookingData} 
            onPrev={prevStep} 
            onComplete={handleComplete} 
            isLoading={createBookingMutation.isPending}
          />
        )}
      </div>
    </Page>
  );
};

export default Booking;