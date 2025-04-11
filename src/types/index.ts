export interface SalesAgent {
  name: string;
  phone: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface Customer {
  id: string;
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
  timestamp: string;
}

export interface CreditCard {
  id: string;
  name: string;
  minCibilScore: number;
  annualFee: number;
  utmLink: string;
  benefits: string[];
  tags: string[];
  status: "active" | "inactive";
  imageUrl: string;
}

export interface ActivityLog {
  id: string;
  action: "form_submit" | "card_shared" | "login" | "logout";
  agentPhone: string;
  agentName: string;
  customerId?: string;
  customerName?: string;
  sharedCards?: string[];
  timestamp: string;
  details?: Record<string, any>;
}

export interface MockDatabase {
  agents: SalesAgent[];
  customers: Customer[];
  creditCards: CreditCard[];
  activityLogs: ActivityLog[];
}
