import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Course from "../models/courseModel.mongoose";
import Transaction from "../models/transactionModel.mongoose";
import UserCourseProgress from "../models/userCourseProgressModel.mongoose";

dotenv.config();

// MongoDB Connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Clear all collections
async function clearCollections() {
  try {
    console.log("🗑️  Clearing existing data...");
    
    await Course.deleteMany({});
    console.log("   ✓ Courses collection cleared");
    
    await Transaction.deleteMany({});
    console.log("   ✓ Transactions collection cleared");
    
    await UserCourseProgress.deleteMany({});
    console.log("   ✓ UserCourseProgress collection cleared");
    
    console.log("✅ All collections cleared\n");
  } catch (error) {
    console.error("❌ Error clearing collections:", error);
    throw error;
  }
}

// Seed data from JSON files
async function seedData(modelName: string, filePath: string) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  console.log(`📥 Seeding ${modelName}...`);

  let Model;
  switch (modelName.toLowerCase()) {
    case "courses":
      Model = Course;
      break;
    case "transactions":
      Model = Transaction;
      break;
    case "usercourseprogress":
      Model = UserCourseProgress;
      break;
    default:
      console.warn(`⚠️  Unknown model: ${modelName}`);
      return;
  }

  try {
    for (const item of data) {
      const doc = new Model(item);
      await doc.save();
    }
    console.log(`   ✓ Successfully seeded ${data.length} ${modelName}`);
  } catch (error) {
    console.error(`   ❌ Error seeding ${modelName}:`, error);
    throw error;
  }
}

// Main seed function
export default async function seed() {
  try {
    console.log("\n🚀 Starting MongoDB Seed Script...\n");

    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await clearCollections();

    // Seed new data
    const seedDataPath = path.join(__dirname, "./data");
    const files = fs
      .readdirSync(seedDataPath)
      .filter((file) => file.endsWith(".json"));

    console.log("📊 Seeding data from files:\n");
    for (const file of files) {
      const modelName = path.basename(file, ".json");
      const filePath = path.join(seedDataPath, file);
      await seedData(modelName, filePath);
    }

    console.log("\n🎉 Seed script completed successfully!\n");
    
    // Display summary
    const courseCount = await Course.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    const progressCount = await UserCourseProgress.countDocuments();

    console.log("📈 Database Summary:");
    console.log(`   Courses: ${courseCount}`);
    console.log(`   Transactions: ${transactionCount}`);
    console.log(`   UserCourseProgress: ${progressCount}\n`);

  } catch (error) {
    console.error("\n❌ Seed script failed:", error);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("👋 MongoDB connection closed");
  }
}

// Run seed script if called directly
if (require.main === module) {
  seed().catch((error) => {
    console.error("Failed to run seed script:", error);
    process.exit(1);
  });
}
