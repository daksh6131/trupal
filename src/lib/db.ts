"use client";

import { MockDatabase, Customer, CreditCard, ActivityLog, SalesAgent } from "@/types";

// Initial mock data
const initialData: MockDatabase = {
  agents: [{
    _id: "agent1",
    id: "agent1",
    name: "Agent 3210",
    phone: "9876543210",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, {
    _id: "agent2",
    id: "agent2",
    name: "Agent 3211",
    phone: "9876543211",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, {
    _id: "agent3",
    id: "agent3",
    name: "Agent 3212",
    phone: "9876543212",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }],
  customers: [],
  creditCards: [{
    _id: "card1",
    id: "card1",
    name: "Premium Travel Card",
    minCibilScore: 750,
    annualFee: 1000,
    utmLink: "https://example.com/card/premium-travel?utm=agent",
    benefits: ["4x reward points on travel", "Complimentary lounge access", "Zero forex markup fee"],
    tags: ["travel", "premium", "rewards"],
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, {
    _id: "card2",
    id: "card2",
    name: "Cashback Pro",
    minCibilScore: 700,
    annualFee: 500,
    utmLink: "https://example.com/card/cashback-pro?utm=agent",
    benefits: ["5% cashback on groceries", "3% cashback on fuel", "1% on all other spends"],
    tags: ["cashback", "essentials", "value"],
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=500&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, {
    _id: "card3",
    id: "card3",
    name: "Basic Credit Builder",
    minCibilScore: 650,
    annualFee: 0,
    utmLink: "https://example.com/card/credit-builder?utm=agent",
    benefits: ["No annual fee", "Fuel surcharge waiver", "EMI conversion facility"],
    tags: ["starter", "no-fee", "credit-builder"],
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=500&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, {
    _id: "card4",
    id: "card4",
    name: "Lifestyle Elite",
    minCibilScore: 800,
    annualFee: 2500,
    utmLink: "https://example.com/card/lifestyle-elite?utm=agent",
    benefits: ["Movie ticket discounts", "Dining privileges at select restaurants", "Premium concierge service"],
    tags: ["lifestyle", "entertainment", "premium"],
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=500&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, {
    _id: "card5",
    id: "card5",
    name: "Student Starter",
    minCibilScore: 600,
    annualFee: 0,
    utmLink: "https://example.com/card/student-starter?utm=agent",
    benefits: ["Special discounts on education platforms", "Low credit limit", "No joining fee"],
    tags: ["student", "starter", "no-fee"],
    status: "active",
    imageUrl: "https://picsum.photos/200",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }],
  activityLogs: []
};

// Initialize database from localStorage or with default values
const initializeDB = (): MockDatabase => {
  if (typeof window === 'undefined') {
    return initialData;
  }
  const storedDB = localStorage.getItem('cardSalesDB');
  if (!storedDB) {
    localStorage.setItem('cardSalesDB', JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(storedDB);
  } catch (e) {
    console.error("Error parsing stored DB:", e);
    localStorage.setItem('cardSalesDB', JSON.stringify(initialData));
    return initialData;
  }
};

// Save the entire database
const saveDB = (db: MockDatabase): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('cardSalesDB', JSON.stringify(db));
};

// Database operations
export const db = {
  // Customer operations
  customers: {
    getAll: (): Customer[] => {
      const db = initializeDB();
      return db.customers;
    },
    getById: (id: string): Customer | undefined => {
      const db = initializeDB();
      return db.customers.find(customer => customer.id === id);
    },
    getByPhone: (phone: string): Customer | undefined => {
      const db = initializeDB();
      return db.customers.find(customer => customer.phone === phone);
    },
    create: (customer: Omit<Customer, "id" | "timestamp">): Customer => {
      const db = initializeDB();
      const newCustomer: Customer = {
        ...customer,
        _id: `cust_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        id: `cust_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.customers.push(newCustomer);
      saveDB(db);
      return newCustomer;
    },
    update: (id: string, data: Partial<Customer>): Customer | null => {
      const db = initializeDB();
      const index = db.customers.findIndex(customer => customer.id === id);
      if (index === -1) return null;
      db.customers[index] = {
        ...db.customers[index],
        ...data
      };
      saveDB(db);
      return db.customers[index];
    }
  },
  // Credit card operations
  creditCards: {
    getAll: (): CreditCard[] => {
      const db = initializeDB();
      return db.creditCards;
    },
    getById: (id: string): CreditCard | undefined => {
      const db = initializeDB();
      return db.creditCards.find(card => card.id === id);
    },
    getEligibleCards: (cibilScore: number): CreditCard[] => {
      const db = initializeDB();
      return db.creditCards.filter(card => card.status === "active" && card.minCibilScore <= cibilScore);
    },
    create: (card: Omit<CreditCard, "id">): CreditCard => {
      const db = initializeDB();
      const newCard: CreditCard = {
        ...card,
        _id: `card_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        id: `card_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.creditCards.push(newCard);
      saveDB(db);
      return newCard;
    },
    update: (id: string, data: Partial<CreditCard>): CreditCard | null => {
      const db = initializeDB();
      const index = db.creditCards.findIndex(card => card.id === id);
      if (index === -1) return null;
      db.creditCards[index] = {
        ...db.creditCards[index],
        ...data
      };
      saveDB(db);
      return db.creditCards[index];
    },
    delete: (id: string): boolean => {
      const db = initializeDB();
      const initialLength = db.creditCards.length;
      db.creditCards = db.creditCards.filter(card => card.id !== id);
      if (db.creditCards.length !== initialLength) {
        saveDB(db);
        return true;
      }
      return false;
    }
  },
  // Activity logs
  logs: {
    getAll: (): ActivityLog[] => {
      const db = initializeDB();
      return db.activityLogs;
    },
    create: (log: Omit<ActivityLog, "id" | "timestamp">): ActivityLog => {
      const db = initializeDB();
      const newLog: ActivityLog = {
        ...log,
        _id: `log_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        id: `log_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.activityLogs.push(newLog);
      saveDB(db);
      return newLog;
    }
  },
  // Agent operations
  agents: {
    getAll: (): SalesAgent[] => {
      const db = initializeDB();
      return db.agents;
    },
    getByPhone: (phone: string): SalesAgent | undefined => {
      const db = initializeDB();
      return db.agents.find(agent => agent.phone === phone);
    },
    updateLastLogin: (phone: string): SalesAgent | null => {
      const db = initializeDB();
      const index = db.agents.findIndex(agent => agent.phone === phone);
      if (index === -1) return null;
      db.agents[index].lastLogin = new Date().toISOString();
      saveDB(db);
      return db.agents[index];
    }
  },
  // Reset database (for testing/development)
  resetDB: (): void => {
    saveDB(initialData);
  }
};
