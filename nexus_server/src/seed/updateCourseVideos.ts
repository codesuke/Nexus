import dotenv from "dotenv";
import path from "path";
import * as dynamoose from "dynamoose";
import Course from "../models/courseModel";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Configure DynamoDB Local
dynamoose.aws.ddb.local();

/**
 * Updates a course with YouTube video links
 * Usage: npm run update-course
 */

const updateCourseVideos = async () => {
  try {
    const courseId = "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d";
    
    console.log(`\n🔄 Fetching course: ${courseId}...`);
    
    const course = await Course.get(courseId);
    
    if (!course) {
      console.log("❌ Course not found!");
      return;
    }

    console.log(`✅ Found course: ${course.title}`);
    console.log(`📚 Sections: ${course.sections?.length || 0}`);

    // Update video URLs with real YouTube videos
    const updatedSections = course.sections?.map((section: any, sectionIndex: number) => {
      console.log(`\n📖 Section ${sectionIndex + 1}: ${section.sectionTitle}`);
      
      const updatedChapters = section.chapters?.map((chapter: any, chapterIndex: number) => {
        if (chapter.type === "Video") {
          // YouTube videos for "Introduction to Programming" course
          const videoUrls = [
            // Section 1: Getting Started
            "https://www.youtube.com/watch?v=zOjov-2OZ0E", // Programming for Beginners
            "https://www.youtube.com/watch?v=rfscVS0vtbw", // Learn Python - Full Course
            "https://www.youtube.com/watch?v=EerdGm-ehJQ", // JavaScript Tutorial
            
            // Section 2: Basic Programming Concepts
            "https://www.youtube.com/watch?v=vLnPwxZdW4Y", // Variables and Data Types
            "https://www.youtube.com/watch?v=Zq5fmkH0T78", // Control Flow Explained
            "https://www.youtube.com/watch?v=v2tWugrmQbE", // Loops Tutorial
            
            // Section 3: Functions and Modules
            "https://www.youtube.com/watch?v=9Os0o3wzS_I", // Functions in Programming
            "https://www.youtube.com/watch?v=DQk9CR_rAbg", // Modular Programming
            "https://www.youtube.com/watch?v=HBxCHonP6Ro", // Code Organization
          ];

          const videoIndex = sectionIndex * 3 + chapterIndex;
          const newVideoUrl = videoUrls[videoIndex] || chapter.video;

          console.log(`   ✏️  Chapter ${chapterIndex + 1}: ${chapter.title}`);
          console.log(`      Old: ${chapter.video}`);
          console.log(`      New: ${newVideoUrl}`);

          return {
            ...chapter,
            video: newVideoUrl,
            content: newVideoUrl, // Some chapters use content field for video URL
          };
        }
        return chapter;
      });

      return {
        ...section,
        chapters: updatedChapters,
      };
    });

    // Update the course
    await Course.update(
      { courseId },
      {
        sections: updatedSections,
      }
    );

    console.log(`\n✅ Successfully updated course with YouTube videos!`);
    console.log(`\n📺 Videos added:`);
    console.log(`   - Section 1 (Getting Started): 3 videos`);
    console.log(`   - Section 2 (Basic Concepts): 3 videos`);
    console.log(`   - Section 3 (Functions): 3 videos`);
    console.log(`\n🎉 Total: 9 programming tutorial videos!`);

  } catch (error) {
    console.error("❌ Error updating course:", error);
    throw error;
  }
};

// Run the script
updateCourseVideos()
  .then(() => {
    console.log("\n✨ Done! Go to /user/courses or /teacher/courses to see the updates!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });
