import Joi from "joi";
import {
  TransactionPaymentMethods,
  TransactionTags,
} from "../constants/enums.js";

// Validation schemas
export const addTransactionSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Transaction title is required",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Transaction title is required",
  }),
  description: Joi.string().trim().max(5000).allow("").optional().messages({
    "string.max": "Description cannot exceed 5000 characters",
  }),
  amount: Joi.number().min(1).max(1000000000).required().messages({
    "number.base": "Amount must be a valid number",
    "number.min": "Amount must be at least 1",
    "number.max": "Amount cannot exceed 10,00,00,0000",
    "any.required": "Transaction amount is required",
  }),
  tag: Joi.string()
    .valid(...TransactionTags)
    .required()
    .messages({
      "any.only": "Please select a valid tag",
      "any.required": "Tag is required",
    }),
  transactionDateTime: Joi.date().iso().required().messages({
    "date.base": "Invalid date format",
    "any.required": "Transaction date is required",
  }),
  paymentMethod: Joi.string()
    .valid(...TransactionPaymentMethods)
    .required()
    .messages({
      "any.only": "Please select a valid payment method",
      "any.required": "Payment method is required",
    }),
});
