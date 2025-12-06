import express from "express";
import { auth } from "../config/middleware/auth.js";
import { Order } from "../config/models/Order.js";

const router = express.Router();

// GET /api/orders
router.get("/", auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
