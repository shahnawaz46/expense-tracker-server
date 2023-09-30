import { Schema, model } from 'mongoose';

const expenseSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    transactions: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        tag: {
          type: String,
          required: true,
        },
        timestamps: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    chart_data: {},
  },
  { timestamps: true }
);

export default model('expenses', expenseSchema);
