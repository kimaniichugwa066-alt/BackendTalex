import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import { createDefaultAdmin } from './utils/seedAdmin';
import { initializeIO } from './utils/notify';

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

const startServer = async () => {
  try {
    await createDefaultAdmin();
  } catch (err) {
    console.error('❌ Default admin creation failed:', err);
  }

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [
        'https://talex-one.vercel.app',
        'http://localhost:3000',
        'https://backendtalex.onrender.com',
      ],
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  });

  initializeIO(io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
