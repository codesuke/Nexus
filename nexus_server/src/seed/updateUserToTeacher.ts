import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

/**
 * Updates a user's metadata to grant teacher access
 * Usage: npm run update-teacher
 */

const updateUserToTeacher = async (userId: string) => {
  try {
    console.log(`\n🔄 Updating user ${userId} to teacher...`);

    // Update user's public metadata
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        userType: "teacher",
      },
    });

    console.log(`✅ Successfully updated user to teacher!`);
    console.log(`User ID: ${updatedUser.id}`);
    console.log(
      `Email: ${updatedUser.emailAddresses[0]?.emailAddress || "N/A"}`
    );
    console.log(
      `User Type: ${updatedUser.publicMetadata.userType || "student"}`
    );

    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw error;
  }
};

// Run the script
const userId = "user_34n2fXjbccagz4orpy0GWABwRKF"; // Your Clerk user ID
updateUserToTeacher(userId)
  .then(() => {
    console.log("\n✨ Done! You can now access /teacher/courses");
    console.log("   Refresh your browser to see the changes.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed to update user:", error.message);
    process.exit(1);
  });
