import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageURL: { type: String }
  },
  { timestamps: true }
);

export const Deal = mongoose.model("Deal", dealSchema);
