import express from "express";
import { auth } from "../config/middleware/auth.js";
import { Order } from "../config/models/Order.js";
import { Payment } from "../config/models/Payment.js";

const router = express.Router();

// GET /api/payments
router.get("/", auth, async (req, res, next) => {
  try {
    // join with orders of this user
    const orders = await Order.find({ userId: req.user.id }).select("_id");
    const orderIds = orders.map((o) => o._id);

    const payments = await Payment.find({ orderId: { $in: orderIds } });
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

export default router;
