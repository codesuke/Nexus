import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

/**
 * Checks a user's metadata to verify teacher access
 * Usage: npm run check-user
 */

const checkUserMetadata = async (userId: string) => {
  try {
    console.log(`\n🔍 Checking user ${userId}...`);

    const user = await clerkClient.users.getUser(userId);

    console.log(`\n✅ User found!`);
    console.log(`User ID: ${user.id}`);
    console.log(`Email: ${user.emailAddresses[0]?.emailAddress || "N/A"}`);
    console.log(`Full Name: ${user.fullName || "N/A"}`);
    console.log(`\n📋 Public Metadata:`);
    console.log(JSON.stringify(user.publicMetadata, null, 2));
    console.log(`\n📋 Private Metadata:`);
    console.log(JSON.stringify(user.privateMetadata, null, 2));

    const userType = user.publicMetadata.userType;
    console.log(`\n🎯 User Type: ${userType || "NOT SET"}`);

    if (userType === "teacher") {
      console.log(`✅ User has TEACHER access!`);
      console.log(`   Can access: /teacher/courses`);
    } else {
      console.log(`⚠️  User does NOT have teacher access`);
      console.log(`   Current access: /user/courses`);
    }

    return user;
  } catch (error) {
    console.error("❌ Error checking user:", error);
    throw error;
  }
};

// Run the script
const userId = "user_34n2fXjbccagz4orpy0GWABwRKF";
checkUserMetadata(userId)
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed to check user:", error.message);
    process.exit(1);
  });
