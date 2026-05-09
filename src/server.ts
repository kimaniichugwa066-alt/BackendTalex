import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI?.trim();

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
      console.warn("⚠️ MongoDB connection failed:", err.message);
      console.warn("⚠️ Continuing without MongoDB. Ensure MONGO_URI is correct in production.");
    });
} else {
  console.warn("ℹ️ MONGO_URI is not configured. Skipping MongoDB connection.");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
