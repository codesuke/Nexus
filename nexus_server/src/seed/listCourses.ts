import dotenv from "dotenv";
import dynamoose from "dynamoose";
import Course from "../models/courseModel";

dotenv.config();

// Configure DynamoDB Local
dynamoose.aws.ddb.local();

async function listCourses() {
  try {
    console.log("\n📚 Available Courses:\n");
    console.log("=" .repeat(80));

    const courses = await Course.scan().exec();

    courses.forEach((course: any, index: number) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   ID: ${course.courseId}`);
      console.log(`   Category: ${course.category}`);
      console.log(`   Level: ${course.level}`);
      console.log(`   Price: $${(course.price / 100).toFixed(2)}`);
      console.log(`   Status: ${course.status}`);
      console.log(`   Enrollments: ${course.enrollments?.length || 0} students`);
    });

    console.log("\n" + "=".repeat(80));
    console.log(`\nTotal: ${courses.length} courses\n`);

    // Output as array for easy copying
    console.log("📋 Course IDs (copy to use in assignCoursesToUser.ts):\n");
    const courseIds = courses.map((c: any) => `  "${c.courseId}", // ${c.title}`);
    console.log("[\n" + courseIds.join("\n") + "\n]\n");

  } catch (error) {
    console.error("❌ Error:", error);
  }
  process.exit(0);
}

listCourses();
