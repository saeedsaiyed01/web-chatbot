import dotenv from "dotenv";
import mongoose from "mongoose";
import { Deal } from "../config/models/Deal.js";
import { Order } from "../config/models/Order.js";
import { User } from "../config/models/User.js";

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
  },
  {
    title: "Wireless Bluetooth Earbuds",
    description: "Premium sound quality with noise cancellation and long battery life",
    price: 349,
    imageURL: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400"
  },
  {
    title: "Smart LED Bulb",
    description: "Voice-controlled smart bulb with multiple colors and scheduling options",
    price: 599,
    imageURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  },
  {
    title: "Portable Power Bank",
    description: "20000mAh fast charging power bank with multiple ports",
    price: 1299,
    imageURL: "https://images.unsplash.com/photo-1609592806732-57aa9b5a95d0?w=400"
  }
];

const sampleUsers = [
  {
    name: "John Doe",
    phone: "9876543210",
    email: "john@example.com",
    address: "123 Main St, Mumbai, Maharashtra 400001"
  },
  {
    name: "Jane Smith", 
    phone: "9876543211",
    email: "jane@example.com",
    address: "456 Oak Ave, Delhi, Delhi 110001"
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/chatbot";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Order.deleteMany({});
    await Deal.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    // Insert sample deals
    const deals = await Deal.insertMany(sampleDeals);
    console.log(`Inserted ${deals.length} deals`);

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    // Create sample orders with different price ranges
    const sampleOrders = [
      {
        userId: users[0]._id,
        dealId: deals[0]._id, // iPhone 15 Pro Max - 159900
        quantity: 1,
        totalAmount: 159900,
        status: "completed",
        paymentStatus: "paid",
        shippingAddress: {
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India"
        }
      },
      {
        userId: users[0]._id,
        dealId: deals[2]._id, // Sony WH-1000XM5 - 29990
        quantity: 1,
        totalAmount: 29990,
        status: "processing",
        paymentStatus: "paid",
        shippingAddress: {
          street: "123 Main St",
          city: "Mumbai", 
          state: "Maharashtra",
          zipCode: "400001",
          country: "India"
        }
      },
      {
        userId: users[0]._id,
        dealId: deals[5]._id, // Wireless Bluetooth Earbuds - 349
        quantity: 2,
        totalAmount: 698,
        status: "confirmed",
        paymentStatus: "paid",
        shippingAddress: {
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra", 
          zipCode: "400001",
          country: "India"
        }
      },
      {
        userId: users[0]._id,
        dealId: deals[6]._id, // Smart LED Bulb - 599
        quantity: 1,
        totalAmount: 599,
        status: "pending",
        paymentStatus: "pending",
        shippingAddress: {
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001", 
          country: "India"
        }
      },
      {
        userId: users[1]._id,
        dealId: deals[7]._id, // Portable Power Bank - 1299
        quantity: 1,
        totalAmount: 1299,
        status: "completed",
        paymentStatus: "paid",
        shippingAddress: {
          street: "456 Oak Ave",
          city: "Delhi",
          state: "Delhi",
          zipCode: "110001",
          country: "India"
        }
      },
      {
        userId: users[1]._id,
        dealId: deals[4]._id, // Apple Watch Series 9 - 41900
        quantity: 1,
        totalAmount: 41900,
        status: "processing",
        paymentStatus: "paid",
        shippingAddress: {
          street: "456 Oak Ave",
          city: "Delhi",
          state: "Delhi",
          zipCode: "110001",
          country: "India"
        }
      }
    ];

    const orders = await Order.insertMany(sampleOrders);
    console.log(`Inserted ${orders.length} orders`);

    await mongoose.disconnect();
    console.log("Database seeding completed successfully!");
    console.log("\nSample Data Created:");
    console.log("- Deals: Various products with different price ranges");
    console.log("- Users: 2 sample users for testing");
    console.log("- Orders: Orders in different price ranges (₹349, ₹599, ₹1299, ₹29990, ₹41900, ₹159900)");
    console.log("- Order statuses: pending, confirmed, processing, completed");
    console.log("\nTest Queries:");
    console.log('- "show me orders with 300-400 range"');
    console.log('- "my orders"');
    console.log('- "orders under 1000"');
    console.log('- "orders above 30000"');
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();
