"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const seedAdmin_1 = require("./utils/seedAdmin");
const notify_1 = require("./utils/notify");
dotenv_1.default.config();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI?.trim();
if (MONGO_URI) {
    mongoose_1.default.connect(MONGO_URI)
        .then(() => {
        console.log("✅ MongoDB Connected");
    })
        .catch((err) => {
        console.warn("⚠️ MongoDB connection failed:", err.message);
        console.warn("⚠️ Continuing without MongoDB. Ensure MONGO_URI is correct in production.");
    });
}
else {
    console.warn("ℹ️ MONGO_URI is not configured. Skipping MongoDB connection.");
}
const startServer = async () => {
    try {
        await (0, seedAdmin_1.createDefaultAdmin)();
    }
    catch (err) {
        console.error('❌ Default admin creation failed:', err);
    }
    const server = http_1.default.createServer(app_1.default);
    const io = new socket_io_1.Server(server, {
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
    (0, notify_1.initializeIO)(io);
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer();
