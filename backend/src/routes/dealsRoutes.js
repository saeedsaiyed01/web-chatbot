import express from "express";
import { auth } from "../config/middleware/auth.js";
import { Deal } from "../config/models/Deal.js";

const router = express.Router();

// GET /api/deals
router.get("/", auth, async (req, res, next) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    next(err);
  }
});

export default router;
