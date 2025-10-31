import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interfaces
export interface IComment {
  commentId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface IChapter {
  chapterId: string;
  type: "Text" | "Quiz" | "Video";
  title: string;
  content: string;
  comments?: IComment[];
  video?: string;
}

export interface ISection {
  sectionId: string;
  sectionTitle: string;
  sectionDescription?: string;
  chapters?: IChapter[];
}

export interface IEnrollment {
  userId: string;
}

export interface ICourse extends Document {
  courseId: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description?: string;
  category: string;
  image?: string;
  price?: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Draft" | "Published";
  sections?: ISection[];
  enrollments?: IEnrollment[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schemas
const commentSchema = new Schema<IComment>({
  commentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const chapterSchema = new Schema<IChapter>({
  chapterId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Text", "Quiz", "Video"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  video: {
    type: String,
  },
});

const sectionSchema = new Schema<ISection>({
  sectionId: {
    type: String,
    required: true,
  },
  sectionTitle: {
    type: String,
    required: true,
  },
  sectionDescription: {
    type: String,
  },
  chapters: {
    type: [chapterSchema],
    default: [],
  },
});

const enrollmentSchema = new Schema<IEnrollment>({
  userId: {
    type: String,
    required: true,
  },
});

const courseSchema = new Schema<ICourse>(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teacherId: {
      type: String,
      required: true,
      index: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Published"],
      default: "Draft",
      index: true,
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    enrollments: {
      type: [enrollmentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "courses",
  }
);

// Indexes for better query performance
courseSchema.index({ status: 1, category: 1 });
courseSchema.index({ teacherId: 1, status: 1 });
courseSchema.index({ title: "text", description: "text" });

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
