"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Mock notifications - replace with actual data later
  const notifications = [
    {
      id: 1,
      title: "Welcome to Nexus LMS!",
      message: "Start exploring courses and begin your learning journey.",
      time: "Just now",
      read: false,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        <div className="dashboard-navbar__search">
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/search"
                className={cn("dashboard-navbar__search-input", {
                  "!bg-customgreys-secondarybg": isCoursePage,
                })}
                scroll={false}
              >
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen className="dashboard-navbar__search-icon" size={18} />
            </div>
          </div>
        </div>

        <div className="dashboard-navbar__actions">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="nondashboard-navbar__notification-button"
            >
              {unreadCount > 0 && (
                <span className="nondashboard-navbar__notification-indicator">
                  {unreadCount}
                </span>
              )}
              <Bell className="nondashboard-navbar__notification-icon" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-customgreys-secondarybg border border-customgreys-darkGrey rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between p-4 border-b border-customgreys-darkGrey">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-customgreys-dirtyGrey hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-customgreys-dirtyGrey">
                      <Bell size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 border-b border-customgreys-darkGrey hover:bg-customgreys-primarybg cursor-pointer transition-colors",
                          !notification.read && "bg-customgreys-primarybg/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                              notification.read
                                ? "bg-customgreys-darkGrey"
                                : "bg-blue-500"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-customgreys-dirtyGrey text-xs mb-2">
                              {notification.message}
                            </p>
                            <span className="text-customgreys-darkGrey text-xs">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 text-center border-t border-customgreys-darkGrey">
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <UserButton
            appearance={{
              baseTheme: dark,
              elements: {
                userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                userButtonBox: "scale-90 sm:scale-100",
              },
            }}
            showName={true}
            userProfileMode="navigation"
            userProfileUrl={
              userRole === "teacher" ? "/teacher/profile" : "/user/profile"
            }
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
