import { Schema, model } from "mongoose";
import {
  TransactionPaymentMethods,
  TransactionTags,
} from "../constants/enums.js";

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
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
      required: [true, "Transaction tag is required"],
      enum: {
        values: TransactionTags,
        message: "Please select a valid tag",
      },
    },
  },
  { timestamps: true }
);

// compound indexes
// transactionSchema.index({ user: 1, transactionDateTime: 1 });
// transactionSchema.index({ user: 1, tag: 1 });

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
