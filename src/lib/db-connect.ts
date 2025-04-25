import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the type for the cached mongoose connection
interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
}

// Define the global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose;
}

let cached: CachedMongoose = global.mongoose || { conn: null, promise: null, isConnected: false };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isConnected: false };
}

async function dbConnect() {
  // If we don't have a MongoDB URI, we'll use local storage instead
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not defined, falling back to local storage");
    cached.isConnected = false;
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        cached.isConnected = true;
        console.log("Connected to MongoDB");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached.isConnected = false;
        return null;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    cached.isConnected = false;
    return null;
  }
}

// Helper function to check if MongoDB is connected
export function isMongoConnected() {
  return cached.isConnected;
}

export default dbConnect;
