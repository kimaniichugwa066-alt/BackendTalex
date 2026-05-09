import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
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
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = function(password: string) {
  return bcrypt.compare(password, this.password);
};

// Match password (alias for comparePassword)
userSchema.methods.matchPassword = function(password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
