import mongoose from "mongoose";

const mongoDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });

    console.log(`Database Connected Successfully ${mongoose.version}`);
  } catch (err) {
    console.log(`Error Connecting to MongoDB: ${err}`);
  }
};

export default mongoDBConnection;
