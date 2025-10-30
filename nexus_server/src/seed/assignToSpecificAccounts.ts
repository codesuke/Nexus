import dotenv from "dotenv";
import path from "path";
import * as dynamoose from "dynamoose";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";
import { v4 as uuidv4 } from "uuid";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Configure DynamoDB Local
dynamoose.aws.ddb.local();

/**
 * Assigns courses to specific showcase accounts
 * Usage: npm run assign-accounts
 */

const assignCoursesToAccounts = async () => {
  try {
    console.log("\n📚 Assigning courses to showcase accounts...\n");

    const STUDENT_USER_ID = "user_34n2fXjbccagz4orpy0GWABwRKF"; // codesuke@gmail.com
    const TEACHER_USER_ID = "user_34nRs7tFW1yp3znNTmsvyA1XHHM"; // balamurali@fisstacademy.com

    // Get all courses
    const courses = await Course.scan().exec();
    console.log(`Found ${courses.length} courses\n`);

    // Function to enroll user in a course
    const enrollUser = async (
      userId: string,
      course: any,
      userName: string
    ) => {
      // Check if already enrolled
      const existing = await Transaction.query("userId")
        .eq(userId)
        .where("courseId")
        .eq(course.courseId)
        .exec();

      if (existing.length > 0) {
        console.log(`     ⏭️  Already enrolled`);
        return false;
      }

      // Create transaction
      await Transaction.create({
        transactionId: `demo_${uuidv4()}`,
        userId: userId,
        courseId: course.courseId,
        paymentProvider: "demo",
        amount: course.price || 0,
        dateTime: new Date().toISOString(),
      });

      // Create progress
      await UserCourseProgress.create({
        userId: userId,
        courseId: course.courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: course.sections?.map((section: any) => ({
          sectionId: section.sectionId,
          chapters: section.chapters?.map((chapter: any) => ({
            chapterId: chapter.chapterId,
            completed: false,
          })),
        })),
        lastAccessedTimestamp: new Date().toISOString(),
      });

      console.log(`     ✅ Enrolled`);
      return true;
    };

    // Assign first 3 courses to STUDENT (codesuke)
    const studentCourses = courses.slice(0, 3);
    console.log("👨‍🎓 Assigning to STUDENT (codesuke@gmail.com):");
    let studentEnrolled = 0;
    for (const course of studentCourses) {
      console.log(`   - ${course.title}`);
      const enrolled = await enrollUser(
        STUDENT_USER_ID,
        course,
        "codesuke"
      );
      if (enrolled) studentEnrolled++;
    }

    // Assign ALL courses to TEACHER (nightraven)
    console.log("\n👨‍🏫 Assigning to TEACHER (balamurali@fisstacademy.com):");
    let teacherEnrolled = 0;
    for (const course of courses) {
      console.log(`   - ${course.title}`);
      const enrolled = await enrollUser(
        TEACHER_USER_ID,
        course,
        "nightraven"
      );
      if (enrolled) teacherEnrolled++;
    }

    console.log("\n🎉 Showcase courses assigned!");
    console.log("\n📊 Summary:");
    console.log(`   Student (codesuke): ${studentEnrolled} new enrollments`);
    console.log(`   Teacher (nightraven): ${teacherEnrolled} new enrollments`);
    console.log("\n📱 Test Accounts:");
    console.log("   👨‍🎓 Student: codesuke@gmail.com");
    console.log("      - Can view and take 3 courses");
    console.log("      - Access: /user/courses");
    console.log("\n   👨‍🏫 Teacher: balamurali@fisstacademy.com");
    console.log("      - Can create, edit, and manage all courses");
    console.log("      - Access: /teacher/courses\n");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

// Run the script
assignCoursesToAccounts()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
