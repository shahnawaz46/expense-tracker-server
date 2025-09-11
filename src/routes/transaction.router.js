import express from "express";

// controllers
import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
  getFilteredTransactions,
  getRecentTransactions,
  getTagsAndPaymentMethods,
  getInsightsData,
} from "../controller/transaction.controller.js";

// middleware
import { validateRequest } from "../middleware/validateRequest.joi.js";
import { addTransactionSchema } from "../validation/addTransactionSchema.joi.js";

const router = express.Router();

router.get("/recent_transactions", getRecentTransactions);

router.get("/", getAllTransactions);
router.post("/", validateRequest(addTransactionSchema), addTransaction);
router.delete("/:transactionId", deleteTransaction);

router.get("/tags-payment-methods", getTagsAndPaymentMethods);
router.get("/filtered", getFilteredTransactions);

router.get("/insights", getInsightsData);

export default router;
