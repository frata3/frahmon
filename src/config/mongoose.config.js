import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const mongoUrl = process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    mongoose.set('autoIndex', process.env.NODE_ENV !== 'production');

    await mongoose.connect(mongoUrl, {
      maxPoolSize: 5
    });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}