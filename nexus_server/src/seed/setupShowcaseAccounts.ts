import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

/**
 * Setup showcase accounts for demos
 * Usage: npm run setup-showcase
 */

const setupShowcaseAccounts = async () => {
  try {
    console.log("\n🎬 Setting up showcase accounts...\n");

    // List all users to find the accounts
    const users = await clerkClient.users.getUserList();

    console.log("📋 Current Users:\n");
    users.data.forEach((user, index) => {
      const email = user.emailAddresses[0]?.emailAddress || "No email";
      const userType = user.publicMetadata.userType || "not set";
      console.log(
        `${index + 1}. ${user.fullName || "No name"} (${email}) - Type: ${userType}`
      );
      console.log(`   User ID: ${user.id}\n`);
    });

    // Find teacher@nexus.com and student@nexus.com
    const teacherUser = users.data.find(
      (u) => u.emailAddresses[0]?.emailAddress === "teacher@nexus.com"
    );
    const studentUser = users.data.find(
      (u) => u.emailAddresses[0]?.emailAddress === "student@nexus.com"
    );

    if (!teacherUser && !studentUser) {
      console.log("\n⚠️  No showcase accounts found!");
      console.log("\n📝 Next Steps:");
      console.log("1. Go to your app: http://localhost:3000/signup");
      console.log("2. Create account: teacher@nexus.com");
      console.log("3. Create account: student@nexus.com");
      console.log("4. Run this script again: npm run setup-showcase\n");
      return;
    }

    // Update teacher account
    if (teacherUser) {
      console.log("\n✏️  Updating teacher@nexus.com...");
      await clerkClient.users.updateUserMetadata(teacherUser.id, {
        publicMetadata: {
          userType: "teacher",
        },
      });
      console.log("✅ Set as TEACHER");
      console.log(`   User ID: ${teacherUser.id}`);
    } else {
      console.log("\n⚠️  teacher@nexus.com not found - create it first!");
    }

    // Update student account
    if (studentUser) {
      console.log("\n✏️  Updating student@nexus.com...");
      await clerkClient.users.updateUserMetadata(studentUser.id, {
        publicMetadata: {
          userType: "student",
        },
      });
      console.log("✅ Set as STUDENT");
      console.log(`   User ID: ${studentUser.id}`);
    } else {
      console.log("\n⚠️  student@nexus.com not found - create it first!");
    }

    console.log("\n🎉 Showcase accounts configured!");
    console.log("\n📚 To assign courses to these accounts:");
    console.log("   Update src/seed/assignCoursesToShowcase.ts with the User IDs");
    console.log("   Then run: npm run assign-showcase\n");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

// Run the script
setupShowcaseAccounts()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
