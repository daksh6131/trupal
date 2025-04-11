import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dbConnect from "./db-connect";
import Agent from "./models/agent";
import Admin from "./models/admin";
import CreditCard from "./models/creditCard";

async function seedDatabase() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    // Check if data already exists
    const agentsCount = await Agent.countDocuments();
    const adminsCount = await Admin.countDocuments();
    const cardsCount = await CreditCard.countDocuments();

    if (agentsCount > 0 && adminsCount > 0 && cardsCount > 0) {
      console.log("Database already seeded. Skipping...");
      await mongoose.disconnect();
      return;
    }

    // Seed Agents
    const agents = [
      {
        name: "Agent 3210",
        phone: "9876543210",
        password: await bcrypt.hash("password123", 10),
        status: "active",
        lastLogin: new Date()
      },
      {
        name: "Agent 3211",
        phone: "9876543211",
        password: await bcrypt.hash("password123", 10),
        status: "active",
        lastLogin: new Date()
      },
      {
        name: "Agent 3212",
        phone: "9876543212",
        password: await bcrypt.hash("password123", 10),
        status: "active",
        lastLogin: new Date()
      }
    ];

    await Agent.insertMany(agents);
    console.log("Agents seeded successfully");

    // Seed Admin
    const admin = {
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin"
    };

    await Admin.create(admin);
    console.log("Admin seeded successfully");

    // Seed Credit Cards
    const creditCards = [
      {
        name: "Premium Travel Card",
        minCibilScore: 750,
        annualFee: 1000,
        utmLink: "https://example.com/card/premium-travel?utm=agent",
        benefits: ["4x reward points on travel", "Complimentary lounge access", "Zero forex markup fee"],
        tags: ["travel", "premium", "rewards"],
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"
      },
      {
        name: "Cashback Pro",
        minCibilScore: 700,
        annualFee: 500,
        utmLink: "https://example.com/card/cashback-pro?utm=agent",
        benefits: ["5% cashback on groceries", "3% cashback on fuel", "1% on all other spends"],
        tags: ["cashback", "essentials", "value"],
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=500&auto=format&fit=crop"
      },
      {
        name: "Basic Credit Builder",
        minCibilScore: 650,
        annualFee: 0,
        utmLink: "https://example.com/card/credit-builder?utm=agent",
        benefits: ["No annual fee", "Fuel surcharge waiver", "EMI conversion facility"],
        tags: ["starter", "no-fee", "credit-builder"],
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=500&auto=format&fit=crop"
      },
      {
        name: "Lifestyle Elite",
        minCibilScore: 800,
        annualFee: 2500,
        utmLink: "https://example.com/card/lifestyle-elite?utm=agent",
        benefits: ["Movie ticket discounts", "Dining privileges at select restaurants", "Premium concierge service"],
        tags: ["lifestyle", "entertainment", "premium"],
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=500&auto=format&fit=crop"
      },
      {
        name: "Student Starter",
        minCibilScore: 600,
        annualFee: 0,
        utmLink: "https://example.com/card/student-starter?utm=agent",
        benefits: ["Special discounts on education platforms", "Low credit limit", "No joining fee"],
        tags: ["student", "starter", "no-fee"],
        status: "active",
        imageUrl: "https://picsum.photos/200"
      }
    ];

    await CreditCard.insertMany(creditCards);
    console.log("Credit cards seeded successfully");

    console.log("Database seeded successfully");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
