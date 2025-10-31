// Demo payment system - No real payment processing
import dotenv from "dotenv";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Course from "../models/courseModel.mongoose";
import Transaction from "../models/transactionModel.mongoose";
import UserCourseProgress from "../models/userCourseProgressModel.mongoose";

dotenv.config();

export const listTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

  try {
    const transactions = userId
      ? await Transaction.find({ userId }).exec()
      : await Transaction.find().exec();

    res.json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error });
  }
};

export const createDemoPaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { amount } = req.body;

  if (!amount || amount <= 0) {
    amount = 50;
  }

  try {
    // Generate a demo payment intent ID
    const demoPaymentIntentId = `pi_demo_${uuidv4()}`;
    const demoClientSecret = `${demoPaymentIntentId}_secret_${Math.random().toString(36).substring(7)}`;

    res.json({
      message: "✅ Demo payment intent created - No real charges will be made",
      data: {
        clientSecret: demoClientSecret,
        transactionId: demoPaymentIntentId, // Use transactionId instead of paymentIntentId
        amount,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating demo payment intent", error });
  }
};

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId, transactionId, amount, paymentProvider } = req.body;

  try {
    // 1. Validate required fields
    if (!userId || !courseId || !amount) {
      res.status(400).json({ 
        message: "Missing required fields: userId, courseId, amount" 
      });
      return;
    }

    // 2. Get course info
    const course = await Course.findOne({ courseId });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // 3. Check if user is already enrolled
    const existingEnrollment = course.enrollments?.find(
      (enrollment: any) => enrollment.userId === userId
    );
    if (existingEnrollment) {
      res.status(400).json({ 
        message: "User is already enrolled in this course" 
      });
      return;
    }

    // 4. Generate transaction ID if not provided (for demo payments)
    const finalTransactionId = transactionId || `DEMO_TXN_${uuidv4()}`;

    // 5. Create transaction record
    const newTransaction = new Transaction({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId: finalTransactionId,
      amount,
      paymentProvider: paymentProvider || "demo",
    });
    await newTransaction.save();

    // 6. Create initial course progress
    const initialProgress = new UserCourseProgress({
      userId,
      courseId,
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
    await initialProgress.save();

    // 7. Add enrollment to course
    course.enrollments = [...(course.enrollments || []), { userId }];
    await course.save();

    res.json({
      message: paymentProvider === "demo" 
        ? "✅ Demo purchase successful - Enrolled in course!" 
        : "Purchased course successfully",
      data: {
        transaction: newTransaction,
        courseProgress: initialProgress,
      },
    });
  } catch (error) {
    console.error("Transaction creation error:", error);
    res
      .status(500)
      .json({ message: "Error creating transaction and enrollment", error });
  }
};
