import React from "react";
import DemoPaymentProvider from "./DemoPaymentProvider";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useClerk, useUser } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation } from "@/state/api";
import { toast } from "sonner";
import { getCurrentUser, clearGuestUser, getGuestUser } from "@/lib/guestUser";

const PaymentPageContent = () => {
  const [createTransaction] = useCreateTransactionMutation();
  const { navigateToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get current user (Clerk or guest)
    const currentUser = getCurrentUser(clerkUser);
    
    if (!currentUser || !courseId || !course) {
      toast.error("Missing required information");
      return;
    }

    setIsProcessing(true);

    try {
      // Get the demo payment intent data from the provider
      const paymentSection = document.querySelector('[data-client-secret]');
      const transactionId = paymentSection?.getAttribute('data-transaction-id');

      if (!transactionId) {
        toast.error("Payment information not available");
        return;
      }

      // Create the transaction in the database
      const transactionData: Partial<Transaction> = {
        transactionId: transactionId,
        userId: currentUser.id,
        courseId: courseId,
        paymentProvider: "demo",
        amount: course.price || 0,
      };

      await createTransaction(transactionData).unwrap();
      
      const userType = currentUser.isGuest ? "demo" : "registered";
      toast.success(`Payment successful! (${userType} user)`);
      navigateToStep(3);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOutAndNavigate = async () => {
    const guestUser = getGuestUser();
    
    if (guestUser) {
      // Clear guest session
      clearGuestUser();
      toast.info("Guest session ended");
    } else {
      // Clerk sign out
      await signOut();
    }
    
    navigateToStep(1);
  };

  if (!course) return null;
  
  // Get display info for current user
  const currentUser = getCurrentUser(clerkUser);
  const displayEmail = currentUser?.email || (currentUser?.isGuest ? "Guest User" : "Unknown");

  return (
    <div className="payment">
      <div className="payment__container">
        {/* Order Summary */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>

        {/* Pyament Form */}
        <div className="payment__form-container">
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="payment__form"
          >
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                Fill out the payment details below to complete your purchase.
              </p>
              
              {/* User Info Display */}
              <div className="mb-4 p-3 bg-customgreys-secondarybg rounded-lg border border-customgreys-darkGrey">
                <p className="text-sm text-gray-400">
                  {currentUser?.isGuest ? "🎭 Demo Mode - " : "👤 Logged in as: "}
                  <span className="text-white-50 font-medium">{displayEmail}</span>
                </p>
              </div>

              <div className="payment__method">
                <h3 className="payment__method-title">Payment Method</h3>

                <div className="payment__card-container">
                  <div className="payment__card-header">
                    <CreditCard size={24} />
                    <span>Credit/Debit Card (Demo Mode)</span>
                  </div>
                  <div className="payment__card-element">
                    {/* Demo Card Information */}
                    <div className="space-y-4 p-4 bg-customgreys-secondarybg rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number</label>
                        <input
                          type="text"
                          value="4242 4242 4242 4242"
                          disabled
                          className="w-full p-2 bg-customgreys-primarybg border border-customgreys-darkGrey rounded"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date</label>
                          <input
                            type="text"
                            value="12/25"
                            disabled
                            className="w-full p-2 bg-customgreys-primarybg border border-customgreys-darkGrey rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVC</label>
                          <input
                            type="text"
                            value="123"
                            disabled
                            className="w-full p-2 bg-customgreys-primarybg border border-customgreys-darkGrey rounded"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Demo payment - No real transaction will be processed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        <Button
          form="payment-form"
          type="submit"
          className="payment__submit"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Complete Demo Payment"}
        </Button>
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <DemoPaymentProvider>
    <PaymentPageContent />
  </DemoPaymentProvider>
);

export default PaymentPage;
