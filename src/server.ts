import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || '';

// Connect to MongoDB (optional - for legacy Mongoose models)
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
      console.warn("⚠️ MongoDB connection failed (optional):", err.message);
    });
} else {
  console.log("ℹ️ MongoDB not configured - using PostgreSQL only");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
