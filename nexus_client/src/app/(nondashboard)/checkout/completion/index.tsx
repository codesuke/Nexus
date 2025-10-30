"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getGuestUser } from "@/lib/guestUser";
import { useUser } from "@clerk/nextjs";

const CompletionPage = () => {
  const { user: clerkUser } = useUser();
  const guestUser = getGuestUser();
  const isGuest = !!guestUser;
  
  return (
    <div className="completion">
      <div className="completion__content">
        <div className="completion__icon">
          <Check className="w-16 h-16" />
        </div>
        <h1 className="completion__title">COMPLETED</h1>
        <p className="completion__message">
          🎉 You have made a course purchase successfully! 🎉
        </p>
        {isGuest && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-200">
              ℹ️ <strong>Demo Mode:</strong> This was a demonstration purchase using guest checkout.
              No actual payment was processed. Create a real account to access your courses!
            </p>
          </div>
        )}
      </div>
      <div className="completion__support">
        <p>
          Need help? Contact our{" "}
          <Button variant="link" asChild className="p-0 m-0 text-primary-700">
            <a href="mailto:support@example.com">customer support</a>
          </Button>
          .
        </p>
      </div>
      <div className="completion__action">
        {isGuest ? (
          <Link href="/search" scroll={false}>
            Browse More Courses
          </Link>
        ) : (
          <Link href="user/courses" scroll={false}>
            Go to Courses
          </Link>
        )}
      </div>
    </div>
  );
};

export default CompletionPage;
