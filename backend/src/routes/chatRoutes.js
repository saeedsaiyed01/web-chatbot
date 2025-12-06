import express from "express";
import { auth } from "../config/middleware/auth.js";
import { Deal } from "../config/models/Deal.js";
import { Order } from "../config/models/Order.js";
import { Payment } from "../config/models/Payment.js";
import { detectIntent } from "../utils/intent.js";
import {
  buildDealsPayload,
  buildOrdersPayload,
  buildPaymentsPayload,
  buildTextMessage
} from "../utils/responseBuilders.js";

const router = express.Router();

// POST /api/chat { message }
router.post("/", auth, async (req, res, next) => {
  try {
    const { message } = req.body;
    const intent = detectIntent(message);

    const replies = [];

    switch (intent) {
      case "DEALS": {
        const deals = await Deal.find().limit(5).sort({ createdAt: -1 });
        replies.push(buildTextMessage("Here are the latest deals for you:"));
        replies.push(buildDealsPayload(deals));
        break;
      }

      case "ORDERS": {
        const orders = await Order.find({ userId: req.user.id }).sort({
          createdAt: -1
        });
        if (!orders.length) {
          replies.push(buildTextMessage("You don't have any orders yet."));
        } else {
          replies.push(buildTextMessage("Here is your order history:"));
          replies.push(buildOrdersPayload(orders));
        }
        break;
      }

      case "PAYMENTS": {
        const orders = await Order.find({ userId: req.user.id }).select("_id");
        const orderIds = orders.map((o) => o._id);
        const payments = await Payment.find({
          orderId: { $in: orderIds }
        });

        if (!payments.length) {
          replies.push(buildTextMessage("No payment records found."));
        } else {
          replies.push(buildTextMessage("Here is your payment summary:"));
          replies.push(buildPaymentsPayload(payments));
        }
        break;
      }

      case "REGISTER": {
        replies.push(
          buildTextMessage(
            "You're already logged in. If you want to update details, please contact support."
          )
        );
        break;
      }

      case "MENU": {
        replies.push(
          buildTextMessage(
            "You can say: 'show deals', 'my orders', 'payment status', or 'help'."
          )
        );
        break;
      }

      default: {
        replies.push(
          buildTextMessage(
            "Sorry, I didn't understand that. Try 'show deals', 'my orders', or 'payment status'."
          )
        );
      }
    }

    res.json({ intent, replies });
  } catch (err) {
    next(err);
  }
});

export default router;
