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
      family: 4, // Force IPv4 resolution
      serverSelectionTimeoutMS: 6000,
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
    if (e.message && e.message.includes("bad auth")) {
      throw new Error(
        "MongoDB Authentication Error: Invalid database username or password in MONGODB_URI. Please update Database Access credentials in MongoDB Atlas."
      );
    }
    throw new Error(
      "Database connection error. Please check MongoDB Atlas IP Whitelist (0.0.0.0/0) or cluster status."
    );
  }

  return cached.conn;
}
