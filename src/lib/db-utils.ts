import { db, supabase } from "@/db";
import { 
  agents, 
  customers, 
  creditCards, 
  activityLogs, 
  admins,
  NewAgent,
  NewCustomer,
  NewCreditCard,
  NewActivityLog,
  NewAdmin
} from "@/db/schema";
import { eq, lte, and } from "drizzle-orm";
import { hash, compare } from "bcrypt";

// Agent operations
export const agentOperations = {
  getAll: async () => {
    return await db.select().from(agents);
  },
  
  getByPhone: async (phone: string) => {
    const results = await db.select().from(agents).where(eq(agents.phone, phone));
    return results.length > 0 ? results[0] : null;
  },
  
  create: async (data: NewAgent) => {
    const results = await db.insert(agents).values(data).returning();
    return results[0];
  },
  
  updateLastLogin: async (phone: string) => {
    const results = await db.update(agents)
      .set({ lastLogin: new Date() })
      .where(eq(agents.phone, phone))
      .returning();
    return results[0];
  },
  
  verifyPassword: async (phone: string, password: string) => {
    const agent = await agentOperations.getByPhone(phone);
    if (!agent) return false;
    return await compare(password, agent.password);
  }
};

// Customer operations
export const customerOperations = {
  getAll: async () => {
    return await db.select().from(customers);
  },
  
  getByAgentPhone: async (phone: string) => {
    return await db.select().from(customers).where(eq(customers.linkedAgent, phone));
  },
  
  getById: async (id: number) => {
    const results = await db.select().from(customers).where(eq(customers.id, id));
    return results.length > 0 ? results[0] : null;
  },
  
  create: async (data: NewCustomer) => {
    const results = await db.insert(customers).values(data).returning();
    return results[0];
  },
  
  update: async (id: number, data: Partial<NewCustomer>) => {
    const results = await db.update(customers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return results[0];
  }
};

// Credit card operations
export const creditCardOperations = {
  getAll: async () => {
    return await db.select().from(creditCards);
  },
  
  getById: async (id: number) => {
    const results = await db.select().from(creditCards).where(eq(creditCards.id, id));
    return results.length > 0 ? results[0] : null;
  },
  
  getEligibleCards: async (cibilScore: number) => {
    return await db.select()
      .from(creditCards)
      .where(
        and(
          eq(creditCards.status, "active"),
          lte(creditCards.minCibilScore, cibilScore)
        )
      );
  },
  
  create: async (data: NewCreditCard) => {
    const results = await db.insert(creditCards).values(data).returning();
    return results[0];
  },
  
  update: async (id: number, data: Partial<NewCreditCard>) => {
    const results = await db.update(creditCards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(creditCards.id, id))
      .returning();
    return results[0];
  },
  
  delete: async (id: number) => {
    const results = await db.delete(creditCards)
      .where(eq(creditCards.id, id))
      .returning();
    return results.length > 0;
  }
};

// Activity log operations
export const activityLogOperations = {
  getAll: async () => {
    return await db.select().from(activityLogs);
  },
  
  getByAgentPhone: async (phone: string) => {
    return await db.select().from(activityLogs).where(eq(activityLogs.agentPhone, phone));
  },
  
  create: async (data: NewActivityLog) => {
    const results = await db.insert(activityLogs).values(data).returning();
    return results[0];
  }
};

// Admin operations
export const adminOperations = {
  getByEmail: async (email: string) => {
    const results = await db.select().from(admins).where(eq(admins.email, email));
    return results.length > 0 ? results[0] : null;
  },
  
  create: async (data: NewAdmin) => {
    const results = await db.insert(admins).values(data).returning();
    return results[0];
  },
  
  verifyPassword: async (email: string, password: string) => {
    const admin = await adminOperations.getByEmail(email);
    if (!admin) return false;
    return await compare(password, admin.password);
  }
};

// Seed database function
export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const agentsCount = await db.select().from(agents);
    const adminsCount = await db.select().from(admins);
    const cardsCount = await db.select().from(creditCards);

    if (agentsCount.length > 0 && adminsCount.length > 0 && cardsCount.length > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    // Seed Agents
    const agentData = [
      {
        name: "Agent 3210",
        phone: "9876543210",
        password: await hash("password123", 10),
        status: "active" as const,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Agent 3211",
        phone: "9876543211",
        password: await hash("password123", 10),
        status: "active" as const,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Agent 3212",
        phone: "9876543212",
        password: await hash("password123", 10),
        status: "active" as const,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.insert(agents).values(agentData);
    console.log("Agents seeded successfully");

    // Seed Admin
    const adminData = {
      email: "admin@example.com",
      password: await hash("admin123", 10),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(admins).values(adminData);
    console.log("Admin seeded successfully");

    // Seed Credit Cards
    const creditCardData = [
      {
        name: "Premium Travel Card",
        minCibilScore: 750,
        annualFee: 1000,
        utmLink: "https://example.com/card/premium-travel?utm=agent",
        benefits: ["4x reward points on travel", "Complimentary lounge access", "Zero forex markup fee"],
        tags: ["travel", "premium", "rewards"],
        status: "active" as const,
        imageUrl: "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cashback Pro",
        minCibilScore: 700,
        annualFee: 500,
        utmLink: "https://example.com/card/cashback-pro?utm=agent",
        benefits: ["5% cashback on groceries", "3% cashback on fuel", "1% on all other spends"],
        tags: ["cashback", "essentials", "value"],
        status: "active" as const,
        imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=500&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Basic Credit Builder",
        minCibilScore: 650,
        annualFee: 0,
        utmLink: "https://example.com/card/credit-builder?utm=agent",
        benefits: ["No annual fee", "Fuel surcharge waiver", "EMI conversion facility"],
        tags: ["starter", "no-fee", "credit-builder"],
        status: "active" as const,
        imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=500&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Lifestyle Elite",
        minCibilScore: 800,
        annualFee: 2500,
        utmLink: "https://example.com/card/lifestyle-elite?utm=agent",
        benefits: ["Movie ticket discounts", "Dining privileges at select restaurants", "Premium concierge service"],
        tags: ["lifestyle", "entertainment", "premium"],
        status: "active" as const,
        imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=500&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Student Starter",
        minCibilScore: 600,
        annualFee: 0,
        utmLink: "https://example.com/card/student-starter?utm=agent",
        benefits: ["Special discounts on education platforms", "Low credit limit", "No joining fee"],
        tags: ["student", "starter", "no-fee"],
        status: "active" as const,
        imageUrl: "https://picsum.photos/200",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.insert(creditCards).values(creditCardData);
    console.log("Credit cards seeded successfully");

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
