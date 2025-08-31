import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getRecentTransaction,
  getTagsAndPaymentMethods,
} from "../controller/transaction.controller.js";
import { validateRequest } from "../middleware/validateRequest.joi.js";
import { addTransactionSchema } from "../validation/addTransactionSchema.joi.js";

const router = express.Router();

router.post("/", validateRequest(addTransactionSchema), addTransaction);
router.delete("/:transactionId", deleteTransaction);
router.get("/recent", getRecentTransaction);
router.get("/tags-payment-methods", getTagsAndPaymentMethods);

export default router;
