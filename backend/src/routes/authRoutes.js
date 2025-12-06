import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../config/models/User.js";

const router = express.Router();

const generateToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// POST /api/auth/login { phone }
router.post("/login", async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const user = await User.findOne({ phone });

    if (!user) {
      return res.json({ newUser: true, message: "User not found" });
    }

    const token = generateToken(user);
    res.json({
      newUser: false,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone
      },
      token
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register { name, phone, address, email }
router.post("/register", async (req, res, next) => {
  try {
    const { name, phone, address, email } = req.body;
    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone are required" });
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ name, phone, address, email });
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone
      },
      token
    });
  } catch (err) {
    next(err);
  }
});

export default router;
