import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

/**
 * Checks nightraven's account metadata
 */

const checkNightraven = async () => {
  try {
    const userId = "user_34nRs7tFW1yp3znNTmsvyA1XHHM";
    
    console.log(`\n🔍 Checking nightraven's account...\n`);

    const user = await clerkClient.users.getUser(userId);

    console.log(`✅ User found!`);
    console.log(`User ID: ${user.id}`);
    console.log(`Email: ${user.emailAddresses[0]?.emailAddress || "N/A"}`);
    console.log(`Full Name: ${user.fullName || "N/A"}`);
    console.log(`\n📋 Public Metadata:`);
    console.log(JSON.stringify(user.publicMetadata, null, 2));

    const userType = user.publicMetadata.userType;
    console.log(`\n🎯 User Type: ${userType || "NOT SET"}`);

    if (userType === "teacher") {
      console.log(`✅ Has TEACHER access!`);
      console.log(`   Can access: /teacher/courses`);
    } else {
      console.log(`⚠️  Does NOT have teacher access`);
      console.log(`   Current access: /user/courses`);
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

checkNightraven()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
