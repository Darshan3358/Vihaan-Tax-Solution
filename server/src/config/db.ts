import mongoose from 'mongoose';

// Disable Mongoose query buffering so operations fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb+srv://fanqie:fanqie123@cluster0.f8acy45.mongodb.net/tax';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Warning: ${(error as Error).message}`);
    // Do not throw so request continues to fallback data
  }
};
