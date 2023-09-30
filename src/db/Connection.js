import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({});

const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'expenseTracker',
      autoIndex: false,
    });

    console.log('Database Connected');
  } catch (err) {
    console.log(err);
  }
};

export default Connection;
