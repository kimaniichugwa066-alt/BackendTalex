"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const applicationSchema = new mongoose_1.default.Schema({
    applicant: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    status: {
        type: String,
        enum: ["applied", "under_review", "interview_scheduled", "offer_sent", "hired", "rejected"],
        default: "applied"
    },
    interviewDate: Date,
    interviewLink: String,
    coverLetter: {
        type: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Application", applicationSchema);
