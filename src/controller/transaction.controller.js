// models
import Transaction from "../models/transaction.model.js";

// constants
import { API_LIMIT } from "../constants/API.js";

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
    // console.log("getAllTransactions", _id, page);

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
    // console.log("addTransaction", transactionData);

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
  const currentYearDate = new Date().getFullYear();
  const currentMonthDate = new Date().getMonth();

  try {
    const { _id } = req.query;

    const insightsData = await Transaction.aggregate([
      { $match: { user: _id } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
          largestTransaction: { $max: "$amount" },
        },
      },
    ]);

    const yearlySpent = await Transaction.aggregate([
      { $match: { user: _id } },
      {
        $group: {
          _id: { $year: "$transactionDateTime" },
          yearlySpent: { $sum: "$amount" },
        },
      },
      { $sort: { yearlySpent: -1 } },
      // { $limit: 1 },
    ]);

    const {
      totalSpent = 0,
      totalTransactions = 0,
      largestTransaction = 0,
    } = insightsData[0];

    // peak year transaction data
    const { _id: peakYear, yearlySpent: peakYearSpent } = yearlySpent[0];

    // current year transaction data
    const currentYearSpent =
      yearlySpent.find((year) => year._id === currentYearDate)?.yearlySpent ||
      0;

    // pie/donut charts data (for All Time, current year and current month)
    const getPieChartDataPipeline = async (matchStage) => {
      const pieChartData = await Transaction.aggregate([
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: "$tag",
            amount: { $sum: "$amount" },
          },
        },
        {
          $sort: { amount: -1 },
        },
      ]);

      const pieChartDataFormatted = pieChartData.map((value) => ({
        label: value._id,
        value: value.amount,
      }));

      return pieChartDataFormatted;
    };

    const pieChartAllTime = await getPieChartDataPipeline({ user: _id });
    const pieChartCurrentYear = await getPieChartDataPipeline({
      user: _id,
      transactionDateTime: {
        $gte: new Date(currentYearDate, 0, 1),
        $lte: new Date(currentYearDate, 11, 31, 23, 59, 59, 999),
      },
    });
    const pieChartCurrentMonth = await getPieChartDataPipeline({
      user: _id,
      transactionDateTime: {
        $gte: new Date(currentYearDate, currentMonthDate, 1),
        $lte: new Date(
          currentYearDate,
          currentMonthDate + 1,
          0,
          23,
          59,
          59,
          999
        ),
      },
    });

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
        categoryDonut: {
          allTime: pieChartAllTime,
          currentYear: pieChartCurrentYear,
          currentMonth: pieChartCurrentMonth,
        },
      },
    });

    // Enhance: provide chart-ready arrays while preserving above fields
    const now = new Date();
    const currentYearForChartsForCharts = now.getFullYear();
    const lastYear = currentYearForChartsForCharts - 1;

    // Yearly data across all available years
    const yearlyAgg = await Transaction.aggregate([
      { $match: { user: _id } },
      {
        $group: {
          _id: { $year: "$transactionDateTime" },
          value: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const yearlyData = yearlyAgg.map((y) => ({
      label: String(y._id),
      value: y.value,
    }));

    // Monthly data for current year
    const monthlyAgg = await Transaction.aggregate([
      {
        $match: {
          user: _id,
          transactionDateTime: {
            $gte: new Date(currentYearForCharts, 0, 1),
            $lte: new Date(currentYearForCharts, 11, 31, 23, 59, 59, 999),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$transactionDateTime" },
          value: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyMap = new Map(monthlyAgg.map((m) => [m._id, m.value]));
    const monthlyData = monthLabels.map((label, idx) => ({
      label,
      value: monthlyMap.get(idx + 1) || 0,
    }));

    // Category data (per tag) with colors
    const categoryAgg = await Transaction.aggregate([
      { $match: { user: _id } },
      {
        $group: {
          _id: "$tag",
          value: { $sum: "$amount" },
        },
      },
      { $sort: { value: -1 } },
    ]);
    const tagColorMap = {
      food: "#ef4444",
      transport: "#3b82f6",
      shopping: "#06b6d4",
      entertainment: "#8b5cf6",
      health: "#10b981",
      education: "#84cc16",
      bills: "#f59e0b",
      travel: "#f97316",
      investment: "#eab308",
      other: "#6b7280",
    };
    const capitalize = (s) =>
      s ? s.charAt(0).toUpperCase() + s.slice(1) : "Other";
    const categoryData = categoryAgg.map((c) => ({
      text: capitalize(c._id),
      value: c.value,
      color: tagColorMap[c._id] || tagColorMap.other,
    }));

    // Category data for current year
    const categoryAggYear = await Transaction.aggregate([
      {
        $match: {
          user: _id,
          transactionDateTime: {
            $gte: new Date(currentYearForCharts, 0, 1),
            $lte: new Date(currentYearForCharts, 11, 31, 23, 59, 59, 999),
          },
        },
      },
      {
        $group: {
          _id: "$tag",
          value: { $sum: "$amount" },
        },
      },
      { $sort: { value: -1 } },
    ]);
    const categoryDataCurrentYear = categoryAggYear.map((c) => ({
      text: capitalize(c._id),
      value: c.value,
      color: tagColorMap[c._id] || tagColorMap.other,
    }));

    // Category data for current month
    const currentMonthForChartsForCharts = now.getMonth();
    const categoryAggMonth = await Transaction.aggregate([
      {
        $match: {
          user: _id,
          transactionDateTime: {
            $gte: new Date(currentYearForCharts, currentMonthForCharts, 1),
            $lte: new Date(
              currentYearForCharts,
              currentMonthForCharts + 1,
              0,
              23,
              59,
              59,
              999
            ),
          },
        },
      },
      {
        $group: {
          _id: "$tag",
          value: { $sum: "$amount" },
        },
      },
      { $sort: { value: -1 } },
    ]);
    const categoryDataCurrentMonth = categoryAggMonth.map((c) => ({
      text: capitalize(c._id),
      value: c.value,
      color: tagColorMap[c._id] || tagColorMap.other,
    }));

    // Distribution data (histogram by amount ranges)
    const boundaries = [0, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
    const distributionAgg = await Transaction.aggregate([
      { $match: { user: _id } },
      {
        $bucket: {
          groupBy: "$amount",
          boundaries: boundaries.concat([Number.MAX_SAFE_INTEGER]),
          default: "100000+",
          output: { count: { $sum: 1 } },
        },
      },
    ]);
    const distributionLabels = [];
    for (let i = 0; i < boundaries.length - 1; i++) {
      distributionLabels.push(`${boundaries[i]}-${boundaries[i + 1]}`);
    }
    distributionLabels.push(`${boundaries[boundaries.length - 1]}+`);
    const distEntries = distributionAgg.map((d) => {
      if (typeof d._id === "string") return [d._id, d.count];
      const idx = boundaries.indexOf(d._id);
      if (idx !== -1 && idx < boundaries.length - 1) {
        return [`${boundaries[idx]}-${boundaries[idx + 1]}`, d.count];
      }
      return [String(d._id), d.count];
    });
    const distMap = new Map(distEntries);
    const distributionData = distributionLabels.map((label) => ({
      label,
      value: distMap.get(label) || 0,
    }));

    // Trend data: this year vs last year monthly
    const buildTrend = async (year) => {
      const agg = await Transaction.aggregate([
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
            value: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const map = new Map(agg.map((m) => [m._id, m.value]));
      return monthLabels.map((label, idx) => ({
        label,
        value: map.get(idx + 1) || 0,
      }));
    };
    const [thisYearTrend, lastYearTrend] = await Promise.all([
      buildTrend(currentYearForCharts),
      buildTrend(lastYear),
    ]);
    const trendData = [
      { series: "This Year", data: thisYearTrend },
      { series: "Last Year", data: lastYearTrend },
    ];

    // Max transaction amount
    // const maxTransaction = await Transaction.aggregate([
    //   { $match: { user: _id } },
    //   { $group: { _id: null, maxTransaction: { $max: "$amount" } } },
    // ]);
    // const maxTransaction = (maxAgg[0] && maxAgg[0].maxTransaction) || 0;

    return res.status(200).json({
      success: true,
      data: {
        // existing fields
        totalSpent,
        totalTransactions,
        peakYear,
        peakYearSpent,
        largestTransaction,
        // new overview aliases/fields

        // charts
        monthlyData,
        yearlyData,
        categoryData,
        categoryDataCurrentYear,
        categoryDataCurrentMonth,
        distributionData,
        trendData,
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
