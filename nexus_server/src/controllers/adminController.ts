import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

/**
 * Create a new course (Admin version - full course creation)
 * POST /admin/create-course
 */
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    teacherId,
    teacherName,
    title,
    description,
    category,
    image,
    price,
    level,
    status,
    sections,
  } = req.body;

  // Validate required fields
  if (!teacherId || !teacherName || !title) {
    res.status(400).json({
      message: "Missing required fields: teacherId, teacherName, title",
      example: {
        teacherId: "user_abc123",
        teacherName: "John Doe",
        title: "My Awesome Course",
        description: "Learn something amazing!",
        category: "Computer Science",
        image: "https://example.com/image.jpg",
        price: 4999,
        level: "Beginner",
        status: "Published",
        sections: [],
      },
    });
    return;
  }

  try {
    const newCourse = new Course({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title,
      description: description || "",
      category: category || "Uncategorized",
      image: image || "",
      price: price || 0,
      level: level || "Beginner",
      status: status || "Draft",
      sections: sections || [],
      enrollments: [],
    });

    await newCourse.save();

    res.json({
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      message: "Error creating course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Admin endpoint to assign courses to a user
 * POST /admin/assign-courses
 * Body: { userId: string, courseIds: string[] }
 */
export const assignCoursesToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseIds } = req.body;

  // Validate input
  if (!userId || !courseIds || !Array.isArray(courseIds)) {
    res.status(400).json({
      message: "Invalid request. Required: userId (string), courseIds (array)",
      example: {
        userId: "user_abc123",
        courseIds: ["course-id-1", "course-id-2"],
      },
    });
    return;
  }

  if (courseIds.length === 0) {
    res.status(400).json({ message: "courseIds array cannot be empty" });
    return;
  }

  const results = {
    success: [] as string[],
    failed: [] as { courseId: string; reason: string }[],
    skipped: [] as { courseId: string; reason: string }[],
  };

  try {
    for (const courseId of courseIds) {
      try {
        // 1. Get course info
        const course = await Course.get(courseId);
        if (!course) {
          results.failed.push({
            courseId,
            reason: "Course not found",
          });
          continue;
        }

        // 2. Check if user is already enrolled
        const existingEnrollment = course.enrollments?.find(
          (enrollment: any) => enrollment.userId === userId
        );
        if (existingEnrollment) {
          results.skipped.push({
            courseId,
            reason: "User already enrolled",
          });
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

        // 5. Add enrollment to course
        await Course.update(
          { courseId },
          {
            $ADD: {
              enrollments: [{ userId }],
            },
          }
        );

        results.success.push(courseId);
      } catch (error) {
        console.error(`Error assigning course ${courseId}:`, error);
        results.failed.push({
          courseId,
          reason: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Response summary
    res.json({
      message: `Processed ${courseIds.length} courses`,
      summary: {
        totalRequested: courseIds.length,
        successfullyAssigned: results.success.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
      },
      results,
      userId,
    });
  } catch (error) {
    console.error("Admin assign courses error:", error);
    res.status(500).json({
      message: "Error processing course assignments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get all available courses (for admin to see what's available)
 * GET /admin/courses
 */
export const listAllCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.scan().exec();

    const courseList = courses.map((course: any) => ({
      courseId: course.courseId,
      title: course.title,
      category: course.category,
      level: course.level,
      price: course.price,
      priceFormatted: `$${(course.price / 100).toFixed(2)}`,
      status: course.status,
      enrollments: course.enrollments?.length || 0,
    }));

    res.json({
      message: "Courses retrieved successfully",
      total: courseList.length,
      data: courseList,
    });
  } catch (error) {
    console.error("List courses error:", error);
    res.status(500).json({
      message: "Error retrieving courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get user's enrolled courses
 * GET /admin/user-courses/:userId
 */
export const getUserCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    // Get user's transactions
    const transactions = await Transaction.query("userId").eq(userId).exec();

    // Get course details for each transaction
    const enrolledCourses = await Promise.all(
      transactions.map(async (transaction: any) => {
        const course = await Course.get(transaction.courseId);
        return {
          courseId: transaction.courseId,
          title: course?.title || "Unknown Course",
          enrollmentDate: transaction.dateTime,
          transactionId: transaction.transactionId,
          price: transaction.amount,
        };
      })
    );

    res.json({
      message: "User courses retrieved successfully",
      userId,
      totalCourses: enrolledCourses.length,
      data: enrolledCourses,
    });
  } catch (error) {
    console.error("Get user courses error:", error);
    res.status(500).json({
      message: "Error retrieving user courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
