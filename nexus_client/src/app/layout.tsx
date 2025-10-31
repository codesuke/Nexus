import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Suspense } from "react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Nexus LMS - Learn, Grow, Excel",
  description: "A modern Learning Management System for students and educators. Create courses, track progress, and manage enrollments with an intuitive platform designed for online learning.",
  keywords: ["LMS", "Learning Management System", "Online Courses", "Education Platform", "E-Learning", "Course Management"],
  authors: [{ name: "Codesuke" }],
  creator: "Codesuke",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexus-beta-two.vercel.app/",
    title: "Nexus LMS - Learn, Grow, Excel",
    description: "A modern Learning Management System for students and educators",
    siteName: "Nexus LMS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus LMS - Learn, Grow, Excel",
    description: "A modern Learning Management System for students and educators",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${dmSans.className}`}>
          <Providers>
            <Suspense fallback={null}>
              <div className="root-layout">{children}</div>
            </Suspense>
            <Toaster richColors closeButton />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
