import express from 'express'
import {addTransaction, getTransaction} from '../controller/expense.controller.js'

const router = express.Router()

router.post("/add_transaction", addTransaction)
router.get("/transaction", getTransaction)

export default router