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
  getCategoryDonutData,
  getMonthlyAreaChartData,
} from "../controller/transaction.controller.js";

// middleware
import { validateRequest } from "../middleware/validateRequest.middleware.joi.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

// validation schemas
import { addTransactionSchema } from "../validation/transactionValidation.joi.js";

const router = express.Router();

// middleware to authenticate token for all routes below this
router.use(authenticateToken);

router.get("/recent_transactions", getRecentTransactions);

router.get("/", getAllTransactions);
router.post("/", validateRequest(addTransactionSchema), addTransaction);
router.delete("/:transactionId", deleteTransaction);

router.get("/tags-payment-methods", getTagsAndPaymentMethods);
router.get("/filtered", getFilteredTransactions);

router.get("/insights", getInsightsData);
router.get("/category-donut", getCategoryDonutData);
router.get("/monthly-area-chart", getMonthlyAreaChartData);

export default router;
