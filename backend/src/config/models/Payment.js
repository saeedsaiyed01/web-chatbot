import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    amountPaid: { type: Number, required: true },
    pendingAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
