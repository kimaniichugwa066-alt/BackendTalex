import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model("Application", applicationSchema);
