import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interfaces
export interface IChapterProgress {
  chapterId: string;
  completed: boolean;
}

export interface ISectionProgress {
  sectionId: string;
  chapters?: IChapterProgress[];
}

export interface IUserCourseProgress extends Document {
  userId: string;
  courseId: string;
  enrollmentDate: string;
  overallProgress: number;
  sections?: ISectionProgress[];
  lastAccessedTimestamp: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schemas
const chapterProgressSchema = new Schema<IChapterProgress>({
  chapterId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const sectionProgressSchema = new Schema<ISectionProgress>({
  sectionId: {
    type: String,
    required: true,
  },
  chapters: {
    type: [chapterProgressSchema],
    default: [],
  },
});

const userCourseProgressSchema = new Schema<IUserCourseProgress>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    enrollmentDate: {
      type: String,
      required: true,
    },
    overallProgress: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    sections: {
      type: [sectionProgressSchema],
      default: [],
    },
    lastAccessedTimestamp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "userCourseProgress",
  }
);

// Compound index for efficient queries
userCourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
userCourseProgressSchema.index({ userId: 1, lastAccessedTimestamp: -1 });

const UserCourseProgress: Model<IUserCourseProgress> =
  mongoose.model<IUserCourseProgress>(
    "UserCourseProgress",
    userCourseProgressSchema
  );

export default UserCourseProgress;
