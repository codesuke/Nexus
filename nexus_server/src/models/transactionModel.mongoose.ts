import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface
export interface ITransaction extends Document {
  userId: string;
  transactionId: string;
  dateTime: string;
  courseId: string;
  paymentProvider: "stripe" | "demo";
  amount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema
const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    paymentProvider: {
      type: String,
      enum: ["stripe", "demo"],
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

// Indexes for better query performance
transactionSchema.index({ userId: 1, dateTime: -1 });
transactionSchema.index({ courseId: 1, dateTime: -1 });
transactionSchema.index({ transactionId: 1 }, { unique: true });

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
