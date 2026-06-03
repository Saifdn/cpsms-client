import { useState } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { useCreateFrameOrder } from "@/hooks/frameOrders/useFrameOrders";
import { useAuth } from "@/context/useAuth";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import Step1_FrameSelection from "./steps/Step1_FrameSelection";
import Step2_DeliveryDetails from "./steps/Step2_DeliveryDetails";
import Step3_ReviewPayment from "./steps/Step3_ReviewPayment";

const STEPS = [
  { label: "Frames" },
  { label: "Delivery" },
  { label: "Review" },
];

const EMPTY_RECEIVER = {
  name: "",
  phone_number: "",
  phone_number_country_code: "MY",
  email: "",
  address_1: "",
  address_2: "",
  postcode: "",
  city: "",
  subdivision_code: "",
  country_code: "MY",
};

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

const FrameShop = () => {
  const createOrder = useCreateFrameOrder();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    cart: {},
    frames: [],
    receiver: { ...EMPTY_RECEIVER },
  });

  const updateOrderData = (newData) =>
    setOrderData((prev) => ({ ...prev, ...newData }));

  const nextStep = () => setStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleComplete = () => {
    const cartItems = (orderData.frames ?? [])
      .filter((f) => orderData.cart[f._id] > 0)
      .map((f) => ({ frame: f._id, quantity: orderData.cart[f._id] }));

    createOrder.mutate({
      graduate: user.id,
      items: cartItems,
      shipment: {
        receiver: orderData.receiver,
      },
    });
  };

  return (
    <Page>
      <PageHeader
        title="Frame Shop"
        description="Order physical frames for your graduation photos."
      />

      <StepIndicator currentStep={step} />

      <div className="max-w-4xl mx-auto">
        {step === 1 && (
          <Step1_FrameSelection
            data={orderData}
            updateData={updateOrderData}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <Step2_DeliveryDetails
            data={orderData}
            updateData={updateOrderData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {step === 3 && (
          <Step3_ReviewPayment
            data={orderData}
            onPrev={prevStep}
            onComplete={handleComplete}
            isLoading={createOrder.isPending}
          />
        )}
      </div>
    </Page>
  );
};

export default FrameShop;
