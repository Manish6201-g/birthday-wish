import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not defined in environment variables.");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 6000, // 6 seconds fast timeout instead of hanging 30s
      connectTimeoutMS: 6000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB Atlas Connection Failed:", e.message);
    throw new Error(
      "Database connection timeout. Please check your MongoDB Atlas IP Whitelist (0.0.0.0/0) or cluster status."
    );
  }

  return cached.conn;
}
