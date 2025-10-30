import dotenv from "dotenv";
import path from "path";
import * as dynamoose from "dynamoose";
import Course from "../models/courseModel";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Configure DynamoDB Local
dynamoose.aws.ddb.local();

/**
 * Shows detailed course structure including video URLs
 */

const showCourseDetails = async () => {
  try {
    const courseId = "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d";
    
    console.log(`\n🔍 Fetching course details...`);
    
    const course = await Course.get(courseId);
    
    if (!course) {
      console.log("❌ Course not found!");
      return;
    }

    console.log(`\n📚 Course: ${course.title}`);
    console.log(`\n📖 Sections and Videos:\n`);

    course.sections?.forEach((section: any, sIndex: number) => {
      console.log(`${sIndex + 1}. ${section.sectionTitle}`);
      section.chapters?.forEach((chapter: any, cIndex: number) => {
        console.log(`   ${cIndex + 1}. ${chapter.title} (${chapter.type})`);
        if (chapter.type === "Video") {
          console.log(`      Video URL: ${chapter.video || "NOT SET"}`);
          console.log(`      Content: ${chapter.content || "NOT SET"}`);
        }
      });
      console.log("");
    });

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
};

// Run the script
showCourseDetails()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
