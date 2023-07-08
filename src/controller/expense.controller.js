import expenseModal from "../models/expense.model.js";

export const addTransaction = async (req, res) => {
  try {
    const { title, description, price, tag, date, time } = req.body;

    if (!title || !description || !price || !tag || !date || !time) {
      return res.status(400).json({ msg: "Please Fill All The Fields" });
    }

    const isAlreadyExist = await expenseModal.findOne({ userId: "123456789" });

    if (isAlreadyExist) {
      const updated = await expenseModal.findOneAndUpdate(
        { userId: "123456789" },
        {
          $push: {
            transactions: { title, description, price, tag, date, time },
          },
        },
        { new: true }
      );
      return res.status(200).json({ msg: "Push Successfully", updated });
    }

    const newTransaction = await expenseModal.create({
      userId: "123456789",
      transactions: [{ title, description, price, tag, date, time }],
    });

    return res.status(200).json({ msg: "Add Successfully", newTransaction });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const allTransactions = await expenseModal.findOne(
      { userId: "123456789" },
      { transactions: { $slice: -10 } }
    );

    const reverseTransactions = allTransactions.transactions.reverse();

    return res.status(200).json({ allTransactions: reverseTransactions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error", err });
  }
};
