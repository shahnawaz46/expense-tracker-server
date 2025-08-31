import Transaction from "../models/transaction.model.js";
import lodash from "lodash";

// Get available tags from the schema
export const getTagsAndPaymentMethods = async (req, res) => {
  try {
    // Get tags from the Transaction schema
    const tagEnum = Transaction.schema.path("tag").enumValues;
    const paymentMethodEnum =
      Transaction.schema.path("paymentMethod").enumValues;

    const tags = tagEnum.map((tag) => ({
      id: tag,
      name: tag.charAt(0).toUpperCase() + tag.slice(1), // Capitalize first letter
    }));

    const paymentMethods = paymentMethodEnum.map((method) => ({
      id: method,
      name: method.charAt(0).toUpperCase() + method.slice(1), // Capitalize first letter
    }));

    return res.status(200).json({
      success: true,
      tags,
      paymentMethods,
    });
  } catch (err) {
    console.log("Get tags error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const transactionData = req.body;

    // Create new transaction
    const newTransaction = await Transaction.create(transactionData);

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: newTransaction,
    });
  } catch (err) {
    console.log("Add transaction error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRecentTransaction = async (req, res) => {
  try {
    const { _id, year } = req.query;

    // Get recent transactions for the user
    const transactions = await Transaction.find({ user: _id })
      .sort({ createdAt: -1 })
      .limit(15);

    const transactionsCurrentYear = await Transaction.find({
      user: _id,
      createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
    });

    // chart format
    const chartData = [
      { label: "Jan", value: 0 },
      { label: "Feb", value: 0 },
      { label: "Mar", value: 0 },
      { label: "Apr", value: 0 },
      { label: "May", value: 0 },
      { label: "Jun", value: 0 },
      { label: "Jul", value: 0 },
      { label: "Aug", value: 0 },
      { label: "Sep", value: 0 },
      { label: "Oct", value: 0 },
      { label: "Nov", value: 0 },
      { label: "Dec", value: 0 },
    ];

    transactionsCurrentYear.forEach((transaction) => {
      const month = transaction.transactionDateTime.getMonth();
      chartData[month].value += transaction.amount;
    });

    return res.status(200).json({
      success: true,
      recent_transaction: transactions,
      chart_data: chartData,
    });
  } catch (err) {
    console.log("Get recent transactions error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const deletedTransaction = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.log("Delete transaction error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
