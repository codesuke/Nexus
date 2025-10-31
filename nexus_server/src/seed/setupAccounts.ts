import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/courseModel.mongoose";
import Transaction from "../models/transactionModel.mongoose";
import UserCourseProgress from "../models/userCourseProgressModel.mongoose";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const STUDENT_USER_ID = "user_34n2fXjbccagz4orpy0GWABwRKF"; // codesuke@gmail.com
const TEACHER_USER_ID = "user_34nRs7tFW1yp3znNTmsvyA1XHHM"; // nightraven

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

async function setupBothAccounts() {
  try {
    console.log("🚀 Setting Up Both Accounts...\n");

    // Get all courses
    const allCourses = await Course.find();
    console.log(`📚 Found ${allCourses.length} courses in database\n`);

    // ============================================
    // SETUP TEACHER ACCOUNT - Assign as teacher
    // ============================================
    console.log("👨‍🏫 Setting up TEACHER ACCOUNT (nightraven)");
    console.log("─────────────────────────────────────");

    // Update first 3 courses to be owned by nightraven
    const coursesToAssignToTeacher = allCourses.slice(0, 3);
    
    for (const course of coursesToAssignToTeacher) {
      course.teacherId = TEACHER_USER_ID;
      course.teacherName = "Bala Murali (nightraven)";
      await course.save();
      console.log(`✅ Assigned "${course.title}" to nightraven`);
    }

    // ============================================
    // SETUP STUDENT ACCOUNT - Enroll in courses
    // ============================================
    console.log("\n\n👨‍🎓 Setting up STUDENT ACCOUNT (codesuke)");
    console.log("─────────────────────────────────────");

    // Enroll student in the last 2 courses (different from teacher's courses)
    const coursesToEnrollStudent = allCourses.slice(3, 5);

    for (const course of coursesToEnrollStudent) {
      // Check if already enrolled
      const existingTransaction = await Transaction.findOne({
        userId: STUDENT_USER_ID,
        courseId: course.courseId,
      });

      if (existingTransaction) {
        console.log(`⏭️  Already enrolled in "${course.title}"`);
        continue;
      }

      // Create transaction
      const transaction = new Transaction({
        userId: STUDENT_USER_ID,
        transactionId: `SETUP_${uuidv4()}`,
        dateTime: new Date().toISOString(),
        courseId: course.courseId,
        paymentProvider: "demo",
        amount: course.price || 0,
      });
      await transaction.save();

      // Create course progress
      const progress = new UserCourseProgress({
        userId: STUDENT_USER_ID,
        courseId: course.courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: (course.sections || []).map((section: any) => ({
          sectionId: section.sectionId,
          chapters: (section.chapters || []).map((chapter: any) => ({
            chapterId: chapter.chapterId,
            completed: false,
          })),
        })),
        lastAccessedTimestamp: new Date().toISOString(),
      });
      await progress.save();

      // Add to course enrollments
      course.enrollments = [...(course.enrollments || []), { userId: STUDENT_USER_ID }];
      await course.save();

      console.log(`✅ Enrolled in "${course.title}"`);
    }

    // ============================================
    // FINAL SUMMARY
    // ============================================
    console.log("\n\n📊 FINAL SUMMARY");
    console.log("═════════════════════════════════════");

    // Teacher summary
    const teacherCourses = await Course.find({ teacherId: TEACHER_USER_ID });
    console.log(`\n👨‍🏫 TEACHER (nightraven):`);
    console.log(`   Courses Created: ${teacherCourses.length}`);
    teacherCourses.forEach((course) => {
      console.log(`   - ${course.title}`);
    });

    // Student summary
    const studentTransactions = await Transaction.find({ userId: STUDENT_USER_ID });
    const studentProgress = await UserCourseProgress.find({ userId: STUDENT_USER_ID });
    console.log(`\n👨‍🎓 STUDENT (codesuke):`);
    console.log(`   Courses Enrolled: ${studentTransactions.length}`);
    for (const trans of studentTransactions) {
      const course = await Course.findOne({ courseId: trans.courseId });
      const prog = await UserCourseProgress.findOne({
        userId: STUDENT_USER_ID,
        courseId: trans.courseId,
      });
      console.log(`   - ${course?.title || "Unknown"} (Progress: ${((prog?.overallProgress || 0) * 100).toFixed(0)}%)`);
    }

    console.log("\n✅ Both accounts are now set up and ready to test!");
    console.log("\n🧪 TEST THE ACCOUNTS:");
    console.log("   1. Login as Student (codesuke@gmail.com) - Should see enrolled courses");
    console.log("   2. Login as Teacher (balamurali@fisstacademy.com) - Should see created courses");

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
  await setupBothAccounts();
})();
