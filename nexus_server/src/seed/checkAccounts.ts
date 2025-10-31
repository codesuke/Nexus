import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/courseModel.mongoose";
import Transaction from "../models/transactionModel.mongoose";
import UserCourseProgress from "../models/userCourseProgressModel.mongoose";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// User accounts to check
const STUDENT_USER_ID = "user_34n2fXjbccagz4orpy0GWABwRKF"; // codesuke@gmail.com
const TEACHER_USER_ID = "user_34nRs7tFW1yp3znNTmsvyA1XHHM"; // balamurali@fisstacademy.com (nightraven)

// MongoDB Connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected\n");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

async function checkAndSetupAccounts() {
  try {
    console.log("🔍 Checking Account Status...\n");

    // Get all courses
    const allCourses = await Course.find();
    console.log(`📚 Total Courses in Database: ${allCourses.length}\n`);

    // ============================================
    // CHECK STUDENT ACCOUNT (codesuke)
    // ============================================
    console.log("👨‍🎓 STUDENT ACCOUNT: codesuke@gmail.com");
    console.log("User ID:", STUDENT_USER_ID);
    console.log("─────────────────────────────────────");

    const studentTransactions = await Transaction.find({ userId: STUDENT_USER_ID });
    const studentProgress = await UserCourseProgress.find({ userId: STUDENT_USER_ID });

    console.log(`💳 Enrolled Courses (Transactions): ${studentTransactions.length}`);
    console.log(`📊 Course Progress Records: ${studentProgress.length}`);

    if (studentTransactions.length > 0) {
      console.log("\n📝 Enrolled Courses:");
      for (const trans of studentTransactions) {
        const course = await Course.findOne({ courseId: trans.courseId });
        console.log(`   - ${course?.title || "Unknown"} (${trans.courseId})`);
      }
    }

    // ============================================
    // CHECK TEACHER ACCOUNT (nightraven)
    // ============================================
    console.log("\n\n👨‍🏫 TEACHER ACCOUNT: balamurali@fisstacademy.com (nightraven)");
    console.log("User ID:", TEACHER_USER_ID);
    console.log("─────────────────────────────────────");

    const teacherCourses = await Course.find({ teacherId: TEACHER_USER_ID });
    const teacherTransactions = await Transaction.find({ userId: TEACHER_USER_ID });
    const teacherProgress = await UserCourseProgress.find({ userId: TEACHER_USER_ID });

    console.log(`📚 Created Courses (as Teacher): ${teacherCourses.length}`);
    console.log(`💳 Enrolled Courses (as Student): ${teacherTransactions.length}`);
    console.log(`📊 Course Progress Records: ${teacherProgress.length}`);

    if (teacherCourses.length > 0) {
      console.log("\n📝 Created Courses:");
      for (const course of teacherCourses) {
        console.log(`   - ${course.title} (${course.courseId})`);
      }
    }

    // ============================================
    // SETUP RECOMMENDATIONS
    // ============================================
    console.log("\n\n💡 RECOMMENDATIONS:");
    console.log("─────────────────────────────────────");

    if (studentTransactions.length === 0) {
      console.log("⚠️  Student account has NO enrolled courses");
      console.log("   Run: npm run setup-student-account");
    } else {
      console.log("✅ Student account has courses enrolled");
    }

    if (teacherCourses.length === 0) {
      console.log("⚠️  Teacher account has NO created courses");
      console.log("   Courses in DB need to be updated with teacher ID");
      console.log("   Run: npm run setup-teacher-account");
    } else {
      console.log("✅ Teacher account has created courses");
    }

    // ============================================
    // AUTO-SETUP OPTION
    // ============================================
    console.log("\n\n🔧 AUTO-SETUP OPTIONS:");
    console.log("─────────────────────────────────────");
    console.log("This script found the following issues. Would you like to auto-fix them?");
    console.log("\nTo auto-setup:");
    console.log("1. Student Account - Enroll in 3 courses:");
    console.log("   Run: npm run assign-student-courses");
    console.log("\n2. Teacher Account - Assign as teacher for existing courses:");
    console.log("   Run: npm run assign-teacher-courses");

  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 MongoDB connection closed");
  }
}

// Main execution
(async () => {
  await connectDB();
  await checkAndSetupAccounts();
})();
