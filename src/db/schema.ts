import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  timestamp, 
  boolean,
  primaryKey,
  uuid,
  jsonb
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// Error Logs table
export const errorLogs = pgTable('error_logs', {
  id: serial('id').primaryKey(),
  message: text('message').notNull(),
  stack: text('stack'),
  type: text('type'),
  url: text('url'),
  userAgent: text('user_agent'),
  userId: text('user_id'),
  userRole: text('user_role'),
  metadata: jsonb('metadata'),
  severity: text('severity').$type<'low' | 'medium' | 'high' | 'critical'>().default('medium'),
  status: text('status').$type<'new' | 'investigating' | 'resolved' | 'ignored'>().default('new'),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: text('resolved_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// OTP table
export const otps = pgTable('otps', {
  id: serial('id').primaryKey(),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').default(false),
  attempts: integer('attempts').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Admin Phone Numbers table
export const adminPhones = pgTable('admin_phones', {
  id: serial('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  addedBy: text('added_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Agents table
export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  password: text('password').notNull(),
  status: text('status').$type<"active" | "inactive">().default("active"),
  lastLogin: timestamp('last_login').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  dob: text('dob').notNull(),
  pan: text('pan').notNull(),
  salary: integer('salary').notNull(),
  pin: text('pin').notNull(),
  address: text('address').notNull(),
  cibilScore: integer('cibil_score'),
  linkedAgent: text('linked_agent').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Credit Cards table
export const creditCards = pgTable('credit_cards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  minCibilScore: integer('min_cibil_score').notNull(),
  annualFee: integer('annual_fee').notNull(),
  utmLink: text('utm_link').notNull(),
  benefits: text('benefits').array().notNull(),
  tags: text('tags').array().notNull(),
  status: text('status').$type<"active" | "inactive">().default("active"),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Activity Logs table
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  action: text('action').$type<"form_submit" | "card_shared" | "login" | "logout">().notNull(),
  agentPhone: text('agent_phone').notNull(),
  agentName: text('agent_name').notNull(),
  customerId: text('customer_id'),
  customerName: text('customer_name'),
  sharedCards: text('shared_cards').array(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Admin table
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default("admin"),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations
export const agentsRelations = relations(agents, ({ many }) => ({
  customers: many(customers),
  activityLogs: many(activityLogs),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  agent: one(agents, {
    fields: [customers.linkedAgent],
    references: [agents.phone],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  agent: one(agents, {
    fields: [activityLogs.agentPhone],
    references: [agents.phone],
  }),
}));

// Define types for select, insert, and update operations
export type Agent = InferSelectModel<typeof agents>;
export type NewAgent = InferInsertModel<typeof agents>;

export type Customer = InferSelectModel<typeof customers>;
// Fix the NewCustomer type to properly handle timestamps
export type NewCustomer = Omit<InferInsertModel<typeof customers>, "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreditCard = InferSelectModel<typeof creditCards>;
export type NewCreditCard = InferInsertModel<typeof creditCards>;

export type ActivityLog = InferSelectModel<typeof activityLogs>;
export type NewActivityLog = InferInsertModel<typeof activityLogs>;

export type Admin = InferSelectModel<typeof admins>;
export type NewAdmin = InferInsertModel<typeof admins>;

export type ErrorLog = InferSelectModel<typeof errorLogs>;
export type NewErrorLog = InferInsertModel<typeof errorLogs>;

export type OTP = InferSelectModel<typeof otps>;
export type NewOTP = InferInsertModel<typeof otps>;

export type AdminPhone = InferSelectModel<typeof adminPhones>;
export type NewAdminPhone = InferInsertModel<typeof adminPhones>;
