import dotenv from "dotenv";
import dynamoose from "dynamoose";
import { v4 as uuidv4 } from "uuid";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config();

// Configure DynamoDB Local
dynamoose.aws.ddb.local();

interface AssignCourseOptions {
  userId: string;
  courseIds: string[];
}

/**
 * Assigns courses to a specific user by:
 * 1. Creating transaction records
 * 2. Creating course progress records
 * 3. Adding user to course enrollments
 */
async function assignCoursesToUser(options: AssignCourseOptions): Promise<void> {
  const { userId, courseIds } = options;

  console.log(`\n🎓 Assigning ${courseIds.length} courses to user: ${userId}\n`);

  for (const courseId of courseIds) {
    try {
      // 1. Get course info
      const course = await Course.get(courseId);
      if (!course) {
        console.log(`❌ Course not found: ${courseId}`);
        continue;
      }

      console.log(`📚 Processing: ${course.title} ($${(course.price / 100).toFixed(2)})`);

      // 2. Check if user is already enrolled
      const existingEnrollment = course.enrollments?.find(
        (enrollment: any) => enrollment.userId === userId
      );
      if (existingEnrollment) {
        console.log(`   ⚠️  User already enrolled - skipping`);
        continue;
      }

      // 3. Create transaction record
      const transactionId = `ADMIN_ASSIGN_${uuidv4()}`;
      const newTransaction = new Transaction({
        dateTime: new Date().toISOString(),
        userId,
        courseId,
        transactionId,
        amount: course.price,
        paymentProvider: "demo",
      });
      await newTransaction.save();
      console.log(`   ✅ Transaction created: ${transactionId}`);

      // 4. Create course progress record
      const initialProgress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: course.sections.map((section: any) => ({
          sectionId: section.sectionId,
          chapters: section.chapters.map((chapter: any) => ({
            chapterId: chapter.chapterId,
            completed: false,
          })),
        })),
        lastAccessedTimestamp: new Date().toISOString(),
      });
      await initialProgress.save();
      console.log(`   ✅ Progress tracking initialized`);

      // 5. Add enrollment to course
      await Course.update(
        { courseId },
        {
          $ADD: {
            enrollments: [{ userId }],
          },
        }
      );
      console.log(`   ✅ User enrolled in course\n`);

    } catch (error) {
      console.error(`❌ Error assigning course ${courseId}:`, error);
    }
  }

  console.log(`\n🎉 Course assignment complete!\n`);
}

/**
 * Get all available course IDs
 */
async function getAllCourseIds(): Promise<string[]> {
  const courses = await Course.scan().exec();
  return courses.map((course: any) => course.courseId);
}

/**
 * Main function - Update the userId and courseIds here
 */
async function main() {
  try {
    console.log("🔄 Connecting to DynamoDB Local...\n");

    // ============================================
    // 🎯 CONFIGURE THIS SECTION:
    // ============================================
    
    // Replace with your Clerk user ID (get it from signing up on the site)
    const userId = "user_34n2fXjbccagz4orpy0GWABwRKF";
    
    // Option 1: Assign specific courses
    const courseIds = [
      "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d", // Introduction to Programming
      "8b4f7d9c-4b1c-4b1c-8b4f-7d9c8b4f7d9c", // Advanced Web Development
    ];
    
    // Option 2: Assign ALL courses (uncomment below)
    // const courseIds = await getAllCourseIds();
    
    // ============================================

    await assignCoursesToUser({ userId, courseIds });
    
    console.log("✅ Done! You can now log in and see your courses at /user/courses\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { assignCoursesToUser, getAllCourseIds };
