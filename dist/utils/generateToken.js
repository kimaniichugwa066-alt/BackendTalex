"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id,
        role: user.role,
        email: user.email
    }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
