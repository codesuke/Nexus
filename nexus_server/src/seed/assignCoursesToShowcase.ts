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
 * Assigns showcase courses to demo accounts
 * Usage: npm run assign-showcase
 */

const assignShowcaseCourses = async () => {
  try {
    console.log("\n📚 Assigning showcase courses...\n");

    // UPDATE THESE WITH YOUR ACTUAL USER IDs from signup
    const TEACHER_USER_ID = "REPLACE_WITH_TEACHER_USER_ID"; // From Clerk
    const STUDENT_USER_ID = "REPLACE_WITH_STUDENT_USER_ID"; // From Clerk

    if (
      TEACHER_USER_ID.includes("REPLACE") ||
      STUDENT_USER_ID.includes("REPLACE")
    ) {
      console.log("⚠️  Please update the User IDs first!");
      console.log("\n📝 Steps:");
      console.log("1. Create accounts via signup: teacher@nexus.com & student@nexus.com");
      console.log("2. Run: npm run setup-showcase");
      console.log("3. Copy the User IDs from the output");
      console.log("4. Edit src/seed/assignCoursesToShowcase.ts");
      console.log("5. Replace TEACHER_USER_ID and STUDENT_USER_ID");
      console.log("6. Run this script again\n");
      return;
    }

    // Get all courses
    const courses = await Course.scan().exec();
    console.log(`Found ${courses.length} courses\n`);

    // Assign first 3 courses to student
    const studentCourses = courses.slice(0, 3);
    console.log("📖 Assigning to student@nexus.com:");
    for (const course of studentCourses) {
      console.log(`   - ${course.title}`);

      // Check if already enrolled
      const existing = await Transaction.query("userId")
        .eq(STUDENT_USER_ID)
        .where("courseId")
        .eq(course.courseId)
        .exec();

      if (existing.length > 0) {
        console.log(`     ⏭️  Already enrolled`);
        continue;
      }

      // Create transaction
      await Transaction.create({
        transactionId: `demo_${uuidv4()}`,
        userId: STUDENT_USER_ID,
        courseId: course.courseId,
        paymentProvider: "demo",
        amount: course.price || 0,
        dateTime: new Date().toISOString(),
      });

      // Create progress
      await UserCourseProgress.create({
        userId: STUDENT_USER_ID,
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
    }

    // Assign all courses to teacher (so they can edit them)
    console.log("\n👨‍🏫 Assigning to teacher@nexus.com:");
    for (const course of courses) {
      console.log(`   - ${course.title}`);

      // Check if already enrolled
      const existing = await Transaction.query("userId")
        .eq(TEACHER_USER_ID)
        .where("courseId")
        .eq(course.courseId)
        .exec();

      if (existing.length > 0) {
        console.log(`     ⏭️  Already enrolled`);
        continue;
      }

      // Create transaction
      await Transaction.create({
        transactionId: `demo_${uuidv4()}`,
        userId: TEACHER_USER_ID,
        courseId: course.courseId,
        paymentProvider: "demo",
        amount: course.price || 0,
        dateTime: new Date().toISOString(),
      });

      // Create progress
      await UserCourseProgress.create({
        userId: TEACHER_USER_ID,
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
    }

    console.log("\n🎉 Showcase courses assigned!");
    console.log("\n📱 Test Accounts:");
    console.log("   Teacher: teacher@nexus.com (can create & edit courses)");
    console.log("   Student: student@nexus.com (enrolled in 3 courses)\n");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

// Run the script
assignShowcaseCourses()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
