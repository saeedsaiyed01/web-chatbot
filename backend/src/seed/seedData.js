import dotenv from "dotenv";
import mongoose from "mongoose";
import { Deal } from "../config/models/Deal.js";

dotenv.config();

const sampleDeals = [
  {
    title: "iPhone 15 Pro Max",
    description: "Latest Apple flagship with A17 Pro chip, titanium design, and 48MP camera system",
    price: 159900,
    imageURL: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Premium Android phone with S Pen, 200MP camera, and Galaxy AI features",
    price: 134999,
    imageURL: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"
  },
  {
    title: "Sony WH-1000XM5",
    description: "Industry-leading noise cancelling headphones with 30-hour battery life",
    price: 29990,
    imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
  },
  {
    title: "MacBook Air M3",
    description: "Supercharged by M3 chip, 18-hour battery, stunning Liquid Retina display",
    price: 114900,
    imageURL: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"
  },
  {
    title: "Apple Watch Series 9",
    description: "Advanced health features, always-on display, and carbon neutral options",
    price: 41900,
    imageURL: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400"
  }
];

async function seedDeals() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/chatbot";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing deals
    await Deal.deleteMany({});
    console.log("Cleared existing deals");

    // Insert sample deals
    const result = await Deal.insertMany(sampleDeals);
    console.log(`Inserted ${result.length} deals`);

    await mongoose.disconnect();
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedDeals();
