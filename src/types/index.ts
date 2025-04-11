export interface SalesAgent {
  _id: string;
  id: string; // For backward compatibility
  name: string;
  phone: string;
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  id: string; // For backward compatibility
  name: string;
  phone: string;
  email: string;
  dob: string;
  pan: string;
  salary: number;
  pin: string;
  address: string;
  cibilScore?: number;
  linkedAgent: string;
  createdAt: string;
  updatedAt: string;
  timestamp?: string; // For backward compatibility
}

export interface CreditCard {
  _id: string;
  id: string; // For backward compatibility
  name: string;
  minCibilScore: number;
  annualFee: number;
  utmLink: string;
  benefits: string[];
  tags: string[];
  status: "active" | "inactive";
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  id: string; // For backward compatibility
  action: "form_submit" | "card_shared" | "login" | "logout";
  agentPhone: string;
  agentName: string;
  customerId?: string;
  customerName?: string;
  sharedCards?: string[];
  details?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  timestamp?: string; // For backward compatibility
}

export interface Admin {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// For backward compatibility with existing code
export interface MockDatabase {
  agents: SalesAgent[];
  customers: Customer[];
  creditCards: CreditCard[];
  activityLogs: ActivityLog[];
}
