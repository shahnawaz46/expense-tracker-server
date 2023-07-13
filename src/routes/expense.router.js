import express from 'express'
import {addTransaction, getRecentTransaction} from '../controller/expense.controller.js'

const router = express.Router()

router.post("/add_transaction", addTransaction)
router.get("/recent_transaction", getRecentTransaction)

export default router