import express from 'express'
import {addTransaction, deleteTransaction, getRecentTransaction} from '../controller/expense.controller.js'

const router = express.Router()

router.post("/transaction", addTransaction)
router.delete("/transaction", deleteTransaction)
router.get("/recent_transaction", getRecentTransaction)

export default router