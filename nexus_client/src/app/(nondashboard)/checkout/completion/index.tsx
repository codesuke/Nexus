"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { getGuestUser } from "@/lib/guestUser";
import { useUser } from "@clerk/nextjs";

const CompletionPage = () => {
  const { user: clerkUser } = useUser();
  const guestUser = getGuestUser();
  const isGuest = !!guestUser;

  return (
    <div className="completion">
      <div className="completion__content">
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="completion__icon"
        >
          <Check className="w-16 h-16 text-white-100" />
        </motion.div>
        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="completion__title"
        >
          COMPLETED
        </motion.h1>
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="completion__message"
        >
          🎉 You have made a course purchase successfully! 🎉
        </motion.p>
        {isGuest && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-800">
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
