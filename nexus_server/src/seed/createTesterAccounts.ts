import mongoose from "mongoose";
import dotenv from "dotenv";
import { createClerkClient } from "@clerk/backend";
import Course from "../models/courseModel.mongoose";
import Transaction from "../models/transactionModel.mongoose";
import UserCourseProgress from "../models/userCourseProgressModel.mongoose";
import { v4 as uuidv4 } from "uuid";
import { TEACHER_EMAIL, STUDENT_EMAIL } from "./testerAccounts.constants";

dotenv.config();

const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) throw new Error("CLERK_SECRET_KEY is not defined");
const clerkClient = createClerkClient({ secretKey });

const testerPasswordEnv = process.env.TESTER_PASSWORD;
if (!testerPasswordEnv) {
  throw new Error(
    "TESTER_PASSWORD is not defined. Set it in .env (never commit a real password) before running this script."
  );
}
const TESTER_PASSWORD: string = testerPasswordEnv;

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) throw new Error("MONGODB_URI is not defined");
  if (process.env.ALLOW_TESTER_SEED !== "true") {
    throw new Error(
      "Refusing to run: this script reassigns course ownership, which is destructive against a real database. " +
        "Set ALLOW_TESTER_SEED=true in .env only when MONGODB_URI points at a local/throwaway database."
    );
  }
  await mongoose.connect(mongoURI);
  console.log("MongoDB connected");
}

async function findOrCreateClerkUser(emailAddress: string, firstName: string, lastName: string, userType: "student" | "teacher") {
  const existing = await clerkClient.users.getUserList({ emailAddress: [emailAddress] });
  const found = existing.data[0];
  if (found) {
    console.log(`Reusing existing Clerk user for ${emailAddress}`);
    return found;
  }
  const user = await clerkClient.users.createUser({
    emailAddress: [emailAddress],
    password: TESTER_PASSWORD,
    firstName,
    lastName,
    publicMetadata: { userType },
  });
  console.log(`Created Clerk user ${emailAddress} -> ${user.id}`);
  return user;
}

async function main() {
  await connectDB();

  const teacher = await findOrCreateClerkUser(TEACHER_EMAIL, "Tester", "Teacher", "teacher");
  const student = await findOrCreateClerkUser(STUDENT_EMAIL, "Tester", "Student", "student");

  const allCourses = await Course.find();
  console.log(`Found ${allCourses.length} courses`);

  const teacherCourses = allCourses.slice(0, 3);
  for (const course of teacherCourses) {
    course.teacherId = teacher.id;
    course.teacherName = "Tester Teacher";
    await course.save();
    console.log(`Assigned "${course.title}" to tester teacher`);
  }

  const studentCourses = allCourses.slice(3, 5);
  for (const course of studentCourses) {
    const existing = await Transaction.findOne({ userId: student.id, courseId: course.courseId });
    if (existing) continue;

    await new Transaction({
      userId: student.id,
      transactionId: `SETUP_${uuidv4()}`,
      dateTime: new Date().toISOString(),
      courseId: course.courseId,
      paymentProvider: "demo",
      amount: course.price || 0,
    }).save();

    await new UserCourseProgress({
      userId: student.id,
      courseId: course.courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0.35,
      sections: (course.sections || []).map((section: any) => ({
        sectionId: section.sectionId,
        chapters: (section.chapters || []).map((chapter: any, i: number) => ({
          chapterId: chapter.chapterId,
          completed: i === 0,
        })),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    }).save();

    course.enrollments = [...(course.enrollments || []), { userId: student.id }];
    await course.save();
    console.log(`Enrolled tester student in "${course.title}"`);
  }

  console.log("\nDone.");
  console.log(`Teacher login: ${TEACHER_EMAIL}`);
  console.log(`Student login: ${STUDENT_EMAIL}`);
  console.log("Password: see TESTER_PASSWORD in .env");

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
