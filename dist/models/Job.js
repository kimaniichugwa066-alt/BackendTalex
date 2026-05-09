"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: Number
    },
    description: {
        type: String,
        required: true
    },
    requirements: [
        {
            type: String
        }
    ],
    postedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Job", jobSchema);
