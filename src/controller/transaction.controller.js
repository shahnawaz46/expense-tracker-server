// models
import Transaction from "../models/transaction.model.js";

// constants
import { API_LIMIT } from "../constants/API.js";
import { getMonthlyTemplate } from "../utils/Chart.js";

export const getRecentTransactions = async (req, res) => {
  try {
    const { _id, year } = req.query;

    const recentTransactions = await Transaction.find({ user: _id })
      .sort({ transactionDateTime: -1 })
      .limit(15);

    const transactionsCurrentYear = await Transaction.find({
      user: _id,
      transactionDateTime: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31),
      },
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
      data: {
        chartData,
        recentTransactions,
      },
    });
  } catch (err) {
    console.log("Get recent transactions error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { _id, page } = req.query;

    const transactions = await Transaction.find({ user: _id })
      .sort({
        transactionDateTime: -1,
      })
      .limit(API_LIMIT)
      .skip((page - 1) * API_LIMIT);

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.log("Get all transactions error:", err);
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

// Get filtered transactions
export const getFilteredTransactions = async (req, res) => {
  try {
    const {
      _id,
      search,
      tag,
      paymentMethod,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      page,
    } = req.query;

    // create filter object
    const filter = { user: _id };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tag: searchRegex },
      ];
    }

    if (tag) filter.tag = tag;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      filter.transactionDateTime = {};
      if (startDate) filter.transactionDateTime.$gte = new Date(startDate);
      if (endDate) filter.transactionDateTime.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    const transactions = await Transaction.find(filter)
      .sort({ transactionDateTime: -1 })
      .limit(API_LIMIT)
      .skip((page - 1) * API_LIMIT);

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.log("Get filtered transactions error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get insights data
export const getInsightsData = async (req, res) => {
  const currentYear = new Date().getFullYear();

  try {
    const { _id } = req.query;

    // first aggregation for overview data
    const insightsData = await Transaction.aggregate([
      { $match: { user: _id } },
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalSpent: { $sum: "$amount" },
                totalTransactions: { $sum: 1 },
                largestTransaction: { $max: "$amount" },
              },
            },
          ],
          yearlySpendingOverview: [
            {
              $group: {
                _id: { $year: "$transactionDateTime" },
                amount: { $sum: "$amount" },
              },
            },
            { $sort: { amount: -1 } },
            {
              $project: {
                _id: 0,
                label: "$_id",
                value: "$amount",
              },
            },
          ],
        },
      },
    ]);

    const { overview, yearlySpendingOverview } = insightsData[0];
    const { totalSpent, totalTransactions, largestTransaction } = overview[0];

    // peak year data
    const { label: peakYear, value: peakYearSpent } =
      yearlySpendingOverview?.[0] || { label: 0, value: 0 };

    // current year transaction data
    const currentYearSpent =
      yearlySpendingOverview.find((year) => year.label === currentYear)
        ?.value || 0;

    // for yearly area chart
    const yearlySpending = yearlySpendingOverview.sort(
      (a, b) => a.label - b.label
    );

    // second aggregation for graph data(pie chart, line chart, bar chart)
    const graphData = await Transaction.aggregate([
      {
        $match: { user: _id },
      },
      {
        $facet: {
          allTimeCategoryDonut: [
            {
              $group: {
                _id: "$tag",
                amount: { $sum: "$amount" },
              },
            },
            {
              $sort: { amount: -1 },
            },
            {
              $project: {
                _id: 0,
                label: "$_id",
                value: "$amount",
              },
            },
          ],
          currentYearLineChart: [
            {
              $match: {
                transactionDateTime: {
                  $gte: new Date(currentYear, 0, 1),
                  $lte: new Date(currentYear, 11, 31, 23, 59, 59, 999),
                },
              },
            },
            {
              $group: {
                _id: { $month: "$transactionDateTime" },
                amount: { $sum: "$amount" },
              },
            },
            {
              $sort: { _id: 1 },
            },
          ],
        },
      },
    ]);

    const { allTimeCategoryDonut, currentYearLineChart } = graphData[0];

    // format current year line chart data (_id represents month in number 1-12)
    const currentYearLineChartFormatted = getMonthlyTemplate();
    for (let currentData of currentYearLineChart) {
      const monthInNumber = currentData._id - 1;
      currentYearLineChartFormatted[monthInNumber].value += currentData.amount;
    }

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalSpent,
          largestTransaction,
          peakYear,
          peakYearSpent,
          totalTransactions,
          currentYearSpent,
        },
        allTimeCategoryDonut: allTimeCategoryDonut,
        currentYearLineChart: currentYearLineChartFormatted,
        yearlySpending,
      },
    });
  } catch (err) {
    console.log("Get insights data error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get category donut data
export const getCategoryDonutData = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  try {
    // key can be allYear, currentYear, currentMonth
    const { _id, key } = req.query;

    let filer = { user: _id };
    if (key === "currentYear") {
      filer.transactionDateTime = {
        $gte: new Date(currentYear, 0, 1),
        $lte: new Date(currentYear, 11, 31, 23, 59, 59, 999),
      };
    } else if (key === "currentMonth") {
      filer.transactionDateTime = {
        $gte: new Date(currentYear, currentMonth, 1),
        $lte: new Date(currentYear, currentMonth, 31, 23, 59, 59, 999),
      };
    } else {
      return res.status(404).json({
        success: false,
        message: "Invalid key",
      });
    }

    const categoryDonutData = await Transaction.aggregate([
      { $match: filer },
      { $group: { _id: "$tag", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
      { $project: { _id: 0, label: "$_id", value: "$amount" } },
    ]);

    return res.status(200).json({
      success: true,
      data: categoryDonutData,
    });
  } catch (err) {
    console.log("Get category donut data error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get yearly area chart data
export const getMonthlyAreaChartData = async (req, res) => {
  try {
    const { _id, year } = req.query;

    const yearlyAreaChartData = await Transaction.aggregate([
      {
        $match: {
          user: _id,
          transactionDateTime: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59, 999),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$transactionDateTime" },
          amount: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // format year line chart data (_id represents month in number 1-12)
    const yearlyAreaChartFormatted = getMonthlyTemplate();
    for (let currentData of yearlyAreaChartData) {
      const monthInNumber = currentData._id - 1;
      yearlyAreaChartFormatted[monthInNumber].value = currentData.amount;
    }

    return res.status(200).json({
      success: true,
      data: yearlyAreaChartFormatted,
    });
  } catch (err) {
    console.log("Get yearly area chart data error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
