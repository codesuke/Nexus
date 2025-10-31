import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

/**
 * Forces a Clerk session refresh for a user
 * This invalidates old JWT tokens and forces browser to fetch new metadata
 * Usage: npm run refresh-session
 */

const refreshUserSession = async (userId: string) => {
  try {
    console.log(`\n🔄 Refreshing sessions for user ${userId}...`);

    // Get all active sessions for the user
    const sessions = await clerkClient.users.getUserList({
      userId: [userId],
    });

    if (sessions.data.length === 0) {
      console.log("❌ User not found");
      return;
    }

    const user = sessions.data[0];
    
    if (!user) {
      console.log("❌ User data is undefined");
      return;
    }
    
    console.log(`✅ Found user: ${user.emailAddresses[0]?.emailAddress}`);
    console.log(`📋 Current metadata: ${JSON.stringify(user.publicMetadata)}`);

    // Force update to trigger session refresh
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        userType: "teacher",
        _refreshedAt: new Date().toISOString(), // Timestamp forces JWT regeneration
      },
    });

    console.log(`\n✅ Session refresh triggered!`);
    console.log(`\n📱 Next steps:`);
    console.log(`   1. In your browser, sign out of Clerk`);
    console.log(`   2. Sign back in`);
    console.log(`   3. Go to /teacher/courses`);
    console.log(`\n💡 Or use this in browser console to force reload:`);
    console.log(`   window.Clerk.session.reload().then(() => location.reload())`);

    return user;
  } catch (error) {
    console.error("❌ Error refreshing session:", error);
    throw error;
  }
};

// Run the script
const userId = "user_34n2fXjbccagz4orpy0GWABwRKF";
refreshUserSession(userId)
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
