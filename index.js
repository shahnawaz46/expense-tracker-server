import express from "express";
import cors from "cors";
import transactionRouter from "./src/routes/transaction.router.js";
import authRouter from "./src/routes/auth.router.js";
// import { errorHandler } from "./src/validation/addTransactionSchema.joi.js";

// dotenv
import dotenv from "dotenv";
dotenv.config();

// database connection
import mongoDBConnection from "./src/config/mongo.config.js";
mongoDBConnection();

// making app for middlewares and routes
const app = express();

// middlewares
app.use(express.json());
app.use(cors({ origin: true }));

// routes
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);

// Error handling middleware (must be last)
// app.use(errorHandler);

const Port = process.env.PORT || 9000;
app.listen(Port, () => {
  console.log(`Server is Running at Port No ${Port}`);
});
