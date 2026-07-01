"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import React from "react";
import { useSearchParams } from "next/navigation";

const SignUpComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=false`;
    }

    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      return "/teacher/courses";
    }
    return "/user/courses";
  };

  return (
    <SignUp
      appearance={{
        variables: {
          colorPrimary: "#d95a2b",
          colorBackground: "#FFFFFF",
          colorText: "#181511",
          colorTextSecondary: "#8C8478",
          colorInputBackground: "#F7F2EA",
          colorInputText: "#181511",
          borderRadius: "0.75rem",
        },
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "shadow-none",
          card: "bg-customgreys-secondarybg w-full shadow-none border border-customgreys-dirtyGrey/15 rounded-lg",
          headerTitle: "font-serif text-customgreys-darkGrey",
          headerSubtitle: "text-customgreys-dirtyGrey",
          footer: {
            background: "#FFFFFF",
            padding: "0rem 2.5rem",
            "& > div > div:nth-child(1)": {
              background: "#FFFFFF",
            },
          },
          formFieldLabel: "text-customgreys-darkGrey font-normal",
          formButtonPrimary:
            "bg-primary-600 text-white-100 hover:bg-primary-700 !shadow-none",
          formFieldInput:
            "bg-customgreys-primarybg text-customgreys-darkGrey !shadow-none border border-customgreys-dirtyGrey/30",
          footerActionLink: "text-primary-600 hover:text-primary-700",
        },
      }}
      signInUrl={signInUrl}
      forceRedirectUrl={getRedirectUrl()}
      routing="hash"
      afterSignOutUrl="/"
    />
  );
};

export default SignUpComponent;
