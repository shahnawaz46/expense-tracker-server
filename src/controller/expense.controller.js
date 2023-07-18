import expenseModal from "../models/expense.model.js";
import lodash from "lodash";
const { cloneDeep } = lodash;

const chart_array = [
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

export const addTransaction = async (req, res) => {
  try {
    const { title, description, price, tag, date, time, _id } = req.body;
    const [day, month, year] = date.split("/");

    if (!title || !description || !price || !tag || !date || !time) {
      return res.status(400).json({ msg: "Please Fill All The Fields" });
    }

    const isAlreadyExist = await expenseModal.findOne({ userId: _id });

    if (isAlreadyExist) {
      // here i am pushing the data on transactions array by using each and also slicing the last 15 elements for return.
      const updated = await expenseModal.findOneAndUpdate(
        { userId: _id },
        {
          $push: {
            transactions: {
              $each: [{ title, description, price, tag, date, time }],
              $slice: -15,
            },
          },
        },
        { new: true }
      );

      // if transaction year present then update it otherwise add new year inside chart_data array
      var updatedChartData;
      if (updated.chart_data[year]) {
        const label = chart_array[parseInt(month) - 1].label;

        updatedChartData = await expenseModal.findOneAndUpdate(
          {
            userId: _id,
            ["chart_data." + year + ".label"]: label,
          },
          {
            $inc: { ["chart_data." + year + ".$.value"]: price },
          },
          { new: true }
        );
      } else {
        let updated_chart_array = cloneDeep(chart_array);
        updated_chart_array[parseInt(month) - 1].value = price;

        updatedChartData = await expenseModal.findOneAndUpdate(
          { userId: _id },
          {
            $set: { ["chart_data." + year]: updated_chart_array },
          },
          { new: true }
        );
      }

      const reverseTransactions = updated.transactions.reverse();
      return res.status(200).json({
        msg: "Transaction Add Successfully",
        recent_transaction: reverseTransactions,
        chart_data: updatedChartData.chart_data[year],
      });
    }

    // here i am using cloneDeep for making deep copy of nested Object
    let updated_chart_array = cloneDeep(chart_array);
    updated_chart_array[parseInt(month) - 1].value = price;

    const newTransaction = await expenseModal.create({
      userId: _id,
      transactions: [{ title, description, price, tag, date, time }],
      chart_data: { [year]: updated_chart_array },
    });

    return res.status(200).json({
      msg: "Transaction Add Successfully",
      recent_transaction: newTransaction.transactions,
      chart_data: newTransaction.chart_data[year],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getRecentTransaction = async (req, res) => {
  try {
    const { _id, year } = req.query;
    const allTransactions = await expenseModal.findOne(
      { userId: _id },
      { transactions: { $slice: -15 } } // this line means slice last 15 results from transactions Array.
    );

    if (!allTransactions) {
      return res
        .status(404)
        .json({ msg: "Not Data Found Please Add Transaction" });
    }

    const reverseTransactions = allTransactions.transactions.reverse();

    return res.status(200).json({
      recent_transaction: reverseTransactions,
      chart_data: allTransactions.chart_data[year],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error", err });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { _id, transactionId, date, price } = req.body;
    const [day, month, year] = date.split("/");

    // deleting the transaction from the transaction array by _id
    await expenseModal.findOneAndUpdate(
      { userId: _id },
      {
        $pull: { transactions: { _id: transactionId } },
      },
      { new: true }
    );

    // decrement the value from the chart_data object by year and month
    const label = chart_array[parseInt(month) - 1].label;
    const updatedChartData = await expenseModal.findOneAndUpdate(
      { userId: _id, ["chart_data." + year + ".label"]: label },
      { $inc: {["chart_data." + year + ".$.value"]: -price} },
      { new: true }
    );

    return res.status(200).json({
      recent_transaction: updatedChartData.transactions.slice(-15),
      chart_data: updatedChartData.chart_data[year],
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error", err });
  }
};
