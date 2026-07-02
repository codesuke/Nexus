"use client";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChaptersSidebar from "./user/courses/[courseId]/ChaptersSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
    pathname
  );

  useEffect(() => {
    if (isCoursePage) {
      const match = pathname.match(/\/user\/courses\/([^\/]+)/);
      setCourseId(match ? match[1] : null);
    } else {
      setCourseId(null);
    }
  }, [isCoursePage, pathname]);

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to access this page.</div>;

  return (
    <div className="dashboard">
      <Navbar isCoursePage={isCoursePage} />
      <div className="dashboard__content">
        {courseId && <ChaptersSidebar />}
        <div
          className={cn(
            "dashboard__main",
            isCoursePage && "dashboard__main--not-course"
          )}
        >
          <main className="dashboard__body">{children}</main>
        </div>
      </div>
    </div>
  );
}
