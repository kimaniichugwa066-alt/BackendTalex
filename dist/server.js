"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
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
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
