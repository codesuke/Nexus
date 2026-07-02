"use client";

import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { Bell, BookOpen, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  DollarSign,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";

const navLinksByRole = {
  student: [
    { icon: BookOpen, label: "Courses", href: "/user/courses" },
    { icon: Briefcase, label: "Billing", href: "/user/billing" },
    { icon: UserIcon, label: "Profile", href: "/user/profile" },
    { icon: SettingsIcon, label: "Settings", href: "/user/settings" },
  ],
  teacher: [
    { icon: BookOpen, label: "Courses", href: "/teacher/courses" },
    { icon: DollarSign, label: "Billing", href: "/teacher/billing" },
    { icon: UserIcon, label: "Profile", href: "/teacher/profile" },
    { icon: SettingsIcon, label: "Settings", href: "/teacher/settings" },
  ],
};

const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const userRole = (user?.publicMetadata?.userType as "student" | "teacher") || "student";
  const navLinks = navLinksByRole[userRole];
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

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
    <nav className="dashboard-nav">
      <div className="dashboard-nav__brand-group">
        <Link href={navLinks[0].href} className="dashboard-nav__brand">
          Nexus
        </Link>
        <div className="dashboard-nav__links">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                className={cn(
                  "dashboard-nav__link",
                  isActive && "dashboard-nav__link--active"
                )}
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="dashboard-nav__actions">
        <Link
          href="/search"
          className={cn("dashboard-nav__search", {
            "!bg-customgreys-primarybg": isCoursePage,
          })}
          scroll={false}
        >
          <BookOpen size={16} className="dashboard-nav__search-icon" />
          <span className="hidden sm:inline">Search Courses</span>
        </Link>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="dashboard-nav__icon-button"
          >
            {unreadCount > 0 && (
              <span className="dashboard-nav__notification-indicator">
                {unreadCount}
              </span>
            )}
            <Bell size={18} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-customgreys-secondarybg border border-customgreys-dirtyGrey/20 rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-customgreys-dirtyGrey/20">
                <h3 className="text-customgreys-darkGrey font-semibold">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-customgreys-dirtyGrey hover:text-customgreys-darkGrey"
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
                        "p-4 border-b border-customgreys-dirtyGrey/20 hover:bg-customgreys-primarybg cursor-pointer transition-colors",
                        !notification.read && "bg-customgreys-primarybg/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                            notification.read
                              ? "bg-customgreys-dirtyGrey"
                              : "bg-primary-600"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-customgreys-darkGrey font-medium text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-customgreys-dirtyGrey text-xs mb-2">
                            {notification.message}
                          </p>
                          <span className="text-customgreys-dirtyGrey text-xs">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 text-center border-t border-customgreys-dirtyGrey/20">
                  <button className="text-sm text-primary-600 hover:text-primary-500">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => signOut()}
          className="dashboard-nav__icon-button hidden sm:flex"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>

        <UserButton
          appearance={{
            elements: {
              userButtonOuterIdentifier: "text-customgreys-darkGrey",
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
    </nav>
  );
};

export default Navbar;
