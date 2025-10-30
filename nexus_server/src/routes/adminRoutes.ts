import express from "express";
import {
  assignCoursesToUser,
  listAllCourses,
  getUserCourses,
  createCourse,
} from "../controllers/adminController";

const router = express.Router();

// Create a new course
router.post("/create-course", createCourse);

// Assign courses to a user
router.post("/assign-courses", assignCoursesToUser);

// List all available courses
router.get("/courses", listAllCourses);

// Get user's enrolled courses
router.get("/user-courses/:userId", getUserCourses);

export default router;
