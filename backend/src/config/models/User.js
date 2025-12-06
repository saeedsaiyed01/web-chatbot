import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
    email: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
