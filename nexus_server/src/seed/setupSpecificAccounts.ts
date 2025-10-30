import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

/**
 * Setup specific showcase accounts
 * Usage: npm run setup-accounts
 */

const setupAccounts = async () => {
  try {
    console.log("\n🎬 Setting up showcase accounts...\n");

    const STUDENT_USER_ID = "user_34n2fXjbccagz4orpy0GWABwRKF";
    const TEACHER_USER_ID = "user_34nRs7tFW1yp3znNTmsvyA1XHHM";

    // Update student account
    console.log("👨‍🎓 Updating student account (codesuke@gmail.com)...");
    const studentUser = await clerkClient.users.updateUserMetadata(
      STUDENT_USER_ID,
      {
        publicMetadata: {
          userType: "student",
        },
      }
    );
    console.log("✅ Set as STUDENT");
    console.log(`   User ID: ${STUDENT_USER_ID}`);
    console.log(`   Email: codesuke@gmail.com`);
    console.log(`   Username: codesuke\n`);

    // Update teacher account
    console.log("👨‍🏫 Updating teacher account (balamurali@fisstacademy.com)...");
    const teacherUser = await clerkClient.users.updateUserMetadata(
      TEACHER_USER_ID,
      {
        publicMetadata: {
          userType: "teacher",
        },
      }
    );
    console.log("✅ Set as TEACHER");
    console.log(`   User ID: ${TEACHER_USER_ID}`);
    console.log(`   Email: balamurali@fisstacademy.com`);
    console.log(`   Username: nightraven\n`);

    console.log("🎉 Both accounts configured!");
    console.log("\n📚 Next step: Assign courses");
    console.log("   Run: npm run assign-accounts\n");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

// Run the script
setupAccounts()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
