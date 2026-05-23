import { useState } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { useCreateBooking } from "@/hooks/studio/useBookings";
import { useAuth } from "@/context/useAuth";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import Step1_SessionSelection from "./steps/Step1_SessionSelection";
import Step2_PackageSelection from "./steps/Step2_PackageSelection";
import Step3_DeliveryDetails from "./steps/Step3_DeliveryDetails";
import Step4_ReviewPayment from "./steps/Step4_ReviewPayment";

const STEPS = [
  { label: "Session" },
  { label: "Package" },
  { label: "Delivery" },
  { label: "Review" },
];

const StepIndicator = ({ currentStep }) => (
  <div className="mb-10 px-2">
    <div className="flex items-center justify-center w-full">
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;

        return (
          <div key={stepNum} className="flex items-center min-w-0">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-all shrink-0",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30",
                  !isCompleted && !isActive && "border-muted-foreground/30 bg-background text-muted-foreground",
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-1 sm:mx-2 mb-5 h-0.5 flex-1 min-w-[40px] max-w-[80px] sm:max-w-[120px] transition-colors",
                  currentStep > stepNum ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

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

  const updateBookingData = (newData) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleComplete = async () => {
    if (!bookingData.selectedPackage || !bookingData.selectedSession) {
      return;
    }

    const payload = {
      graduate: user.id,
      package: bookingData.selectedPackage._id,
      session: bookingData.selectedSession._id,
      addons: bookingData.selectedAddons.map((a) => a._id),
      shipment: bookingData.deliveryAddress,
    };

    createBookingMutation.mutate(payload);
  };

  return (
    <Page>
      <PageHeader
        title="Book Your Studio Session"
        description="Complete the steps below to reserve your graduation photography session."
      />

      <StepIndicator currentStep={step} />

      <div className="max-w-4xl mx-auto">
        {step === 1 && (
          <Step1_SessionSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} />
        )}
        {step === 2 && (
          <Step2_PackageSelection data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />
        )}
        {step === 3 && (
          <Step3_DeliveryDetails data={bookingData} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} />
        )}
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
