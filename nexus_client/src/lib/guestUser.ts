// Demo/Guest user utilities for checkout without authentication

export interface GuestUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isGuest: true;
}

const GUEST_USER_KEY = "nexus_guest_user";
const GUEST_SESSION_KEY = "nexus_guest_session";

/**
 * Generate a unique demo user ID
 */
export const generateGuestUserId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Create and store a guest user in session storage
 */
export const createGuestUser = (email: string): GuestUser => {
  const guestUser: GuestUser = {
    id: generateGuestUserId(),
    email,
    isGuest: true,
  };
  
  // Store in session storage (cleared when browser closes)
  if (typeof window !== "undefined") {
    sessionStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
    sessionStorage.setItem(GUEST_SESSION_KEY, "active");
  }
  
  return guestUser;
};

/**
 * Get the current guest user from session storage
 */
export const getGuestUser = (): GuestUser | null => {
  if (typeof window === "undefined") return null;
  
  const guestUserData = sessionStorage.getItem(GUEST_USER_KEY);
  const guestSession = sessionStorage.getItem(GUEST_SESSION_KEY);
  
  if (!guestUserData || guestSession !== "active") return null;
  
  try {
    return JSON.parse(guestUserData) as GuestUser;
  } catch {
    return null;
  }
};

/**
 * Check if there's an active guest session
 */
export const hasGuestSession = (): boolean => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(GUEST_SESSION_KEY) === "active";
};

/**
 * Clear guest user data (on logout or session end)
 */
export const clearGuestUser = (): void => {
  if (typeof window === "undefined") return;
  
  sessionStorage.removeItem(GUEST_USER_KEY);
  sessionStorage.removeItem(GUEST_SESSION_KEY);
};

/**
 * Get current user (either Clerk user or guest user)
 */
export const getCurrentUser = (clerkUser?: any): { id: string; email?: string; isGuest: boolean } | null => {
  // If Clerk user exists, use that
  if (clerkUser?.id) {
    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      isGuest: false,
    };
  }
  
  // Otherwise, check for guest user
  const guestUser = getGuestUser();
  if (guestUser) {
    return guestUser;
  }
  
  return null;
};
