"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    resume: {
        type: String // Cloudinary URL
    }
}, { timestamps: true });
// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password"))
        return next();
    user.password = await bcryptjs_1.default.hash(user.password, 10);
    next();
});
// 🔑 Compare password
userSchema.methods.comparePassword = function (password) {
    return bcryptjs_1.default.compare(password, this.password);
};
// Match password (alias for comparePassword)
userSchema.methods.matchPassword = function (password) {
    return bcryptjs_1.default.compare(password, this.password);
};
exports.default = mongoose_1.default.model("User", userSchema);
