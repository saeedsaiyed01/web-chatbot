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
    const { intent, params } = detectIntent(message);

    const replies = [];

    switch (intent) {
      case "DEALS": {
        const deals = await Deal.find().limit(5).sort({ createdAt: -1 });
        replies.push(buildTextMessage("Here are the latest deals for you:"));
        replies.push(buildDealsPayload(deals));
        break;
      }

      case "ORDERS": {
        let ordersQuery = { userId: req.user.id };
        
        // Apply price filters if present
        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
          ordersQuery.totalAmount = {};
          if (params.minPrice !== undefined) {
            ordersQuery.totalAmount.$gte = params.minPrice;
          }
          if (params.maxPrice !== undefined) {
            ordersQuery.totalAmount.$lte = params.maxPrice;
          }
        }

        const orders = await Order.find(ordersQuery)
          .populate('dealId')
          .sort({ createdAt: -1 });
          
        if (!orders.length) {
          let message = "You don't have any orders yet.";
          if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            message = `No orders found in the price range of ₹${params.minPrice || 0} - ₹${params.maxPrice || 'any'}.`;
          }
          replies.push(buildTextMessage(message));
        } else {
          let message = "Here is your order history:";
          if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            message = `Here are your orders in the price range of ₹${params.minPrice || 0} - ₹${params.maxPrice || 'any'}:`;
          }
          replies.push(buildTextMessage(message));
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
            "I'm here to help! You can ask me about:\n\n📱 Deals & Products - 'show me deals' or 'what can I buy'\n📦 Order History - 'my orders' or 'show me past orders'\n💰 Payment Status - 'payment status' or 'my bills'\n🆘 General Support - Just tell me what you need!\n\nWhat would you like to know?"
          )
        );
        break;
      }

      default: {
        // Try to provide helpful suggestions based on common patterns
        const lowerMessage = message.toLowerCase();
        let helpfulMessage = "I'm here to help! You can ask me about:\n\n";
        
        if (lowerMessage.includes("watch") || lowerMessage.includes("phone") || lowerMessage.includes("headphone")) {
          helpfulMessage += "📱 Products - I can show you deals on watches, phones, and more!\n";
        }
        if (lowerMessage.includes("order") || lowerMessage.includes("buy") || lowerMessage.includes("purchase")) {
          helpfulMessage += "📦 Orders - Ask about 'my orders' or 'order history'\n";
        }
        if (lowerMessage.includes("money") || lowerMessage.includes("pay") || lowerMessage.includes("bill")) {
          helpfulMessage += "💰 Payments - Ask about 'payment status' or billing\n";
        }
        
        helpfulMessage += "\nOr simply say 'help' for more options!";
        
        replies.push(buildTextMessage(helpfulMessage));
      }
    }

    res.json({ intent, replies });
  } catch (err) {
    next(err);
  }
});

export default router;
