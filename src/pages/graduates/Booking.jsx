import { useState } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import Step1_SessionSelection from "./steps/Step1_SessionSelection";
import Step2_PackageSelection from "./steps/Step2_PackageSelection";
import Step3_DeliveryDetails from "./steps/Step3_DeliveryDetails";
import Step4_ReviewPayment from "./steps/Step4_ReviewPayment";

const Booking = () => {
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

  return (
    <Page>
      <PageHeader
        title="Book Your Studio Session"
        description="Complete your booking in 4 easy steps"
      />

      {/* Progress Bar */}
      <div className="mb-10">
        <Progress value={(step / totalSteps) * 100} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Session</span>
          <span>Package</span>
          <span>Details</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {step === 1 && (
          <Step1_SessionSelection 
            data={bookingData} 
            updateData={updateBookingData} 
            onNext={nextStep} 
          />
        )}

        {step === 2 && (
          <Step2_PackageSelection 
            data={bookingData} 
            updateData={updateBookingData} 
            onNext={nextStep} 
            onPrev={prevStep} 
          />
        )}

        {step === 3 && (
          <Step3_DeliveryDetails 
            data={bookingData} 
            updateData={updateBookingData} 
            onNext={nextStep} 
            onPrev={prevStep} 
          />
        )}

        {step === 4 && (
          <Step4_ReviewPayment 
            data={bookingData} 
            onPrev={prevStep} 
            onComplete={() => alert("Booking Completed!")} 
          />
        )}
      </div>
    </Page>
  );
};

export default Booking;