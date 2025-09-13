import { Schema, model } from "mongoose";
import {
  TransactionPaymentMethods,
  TransactionTags,
} from "../constants/enums.js";

const transactionSchema = new Schema(
  {
    user: {
      // type: Schema.Types.ObjectId,
      // ref: "User",
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot be more than 5000 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [1, "Amount must be at least 1"],
      max: [1000000, "Amount cannot exceed 10,00,000"],
    },
    transactionDateTime: {
      type: Date,
      required: [true, "Transaction date is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: TransactionPaymentMethods,
        message: "Please select a valid payment method",
      },
    },
    tag: {
      type: String,
      required: [true, "Transaction category is required"],
      enum: {
        values: TransactionTags,
        message: "Please select a valid category",
      },
    },
  },
  { timestamps: true }
);

// compound indexes
transactionSchema.index({ user: 1, transactionDateTime: 1 });
transactionSchema.index({ user: 1, tag: 1 });

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
