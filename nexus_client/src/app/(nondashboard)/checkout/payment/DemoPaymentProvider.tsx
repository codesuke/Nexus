"use client";

import React, { useEffect, useState } from "react";
import { useCreatePaymentIntentMutation } from "@/state/api";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import Loading from "@/components/Loading";
import { toast } from "sonner";

const DemoPaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const { course } = useCurrentCourse();

  useEffect(() => {
    if (!course) return;
    
    const fetchPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Creating payment intent for course:", course.courseId, "Price:", course.price);
        
        const result = await createPaymentIntent({
          amount: course?.price ?? 9999999999999,
        }).unwrap();

        console.log("Payment intent result:", result);

        if (!result.clientSecret || !result.transactionId) {
          throw new Error("Invalid payment intent response");
        }

        setClientSecret(result.clientSecret);
        setTransactionId(result.transactionId);
        toast.success("Payment initialized!");
      } catch (error: any) {
        console.error("Failed to create payment intent:", error);
        const errorMessage = error?.data?.message || error?.message || "Failed to connect to backend";
        setError(errorMessage);
        toast.error(`Payment initialization failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [createPaymentIntent, course?.price, course]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-red-400 mb-2">⚠️ Payment System Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            Make sure the backend server is running on <code className="bg-black/30 px-2 py-1 rounded">http://localhost:8001</code>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return <Loading />;
  }

  // Pass the payment intent data to children via context or props
  return (
    <div data-client-secret={clientSecret} data-transaction-id={transactionId}>
      {children}
    </div>
  );
};

export default DemoPaymentProvider;
