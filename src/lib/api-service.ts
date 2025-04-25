import { Customer, CreditCard, ActivityLog } from "@/types";
import { 
  saveToSupabase, 
  updateInSupabase, 
  deleteFromSupabase, 
  fetchFromSupabase,
  getOfflineSyncManager
} from "@/lib/supabase-sync";
import { supabase } from "@/db";

const API_BASE_URL = "/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders() {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem("authToken") : null;
  
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Auth API
export const authApi = {
  generateOTP: async (phone: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    
    return handleResponse<{
      success: boolean;
      message: string;
      otp?: string;
      error?: string;
    }>(response);
  },
  
  verifyOTP: async (phone: string, code: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code })
    });
    
    return handleResponse<{
      success: boolean;
      agent?: { name: string; phone: string };
      token?: string;
      error?: string;
    }>(response);
  },
  
  verifyAdminOTP: async (phone: string, code: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, isAdmin: true })
    });
    
    return handleResponse<{
      success: boolean;
      admin?: { phone: string; role: string };
      token?: string;
      error?: string;
    }>(response);
  },
  
  login: async (phone: string, otp: string) => {
    return authApi.verifyOTP(phone, otp);
  },
  
  adminLogin: async (phone: string, otp: string) => {
    return authApi.verifyAdminOTP(phone, otp);
  },
  
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    
    const data = await handleResponse<{ success: boolean }>(response);
    
    // Clear stored data
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("salesAgent");
    }
    
    return data;
  }
};

// Customers API
export const customersApi = {
  getAll: async () => {
    try {
      // Try to get data from Supabase first
      const customers = await fetchFromSupabase<Customer>('customers', {
        orderBy: { column: 'created_at', ascending: false }
      });
      
      return { success: true, customers };
    } catch (error) {
      console.error("Error fetching customers from Supabase, falling back to API:", error);
      
      // Fall back to API if Supabase fails
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: getAuthHeaders()
      });
      
      return handleResponse<{ success: boolean; customers: Customer[] }>(response);
    }
  },
  
  getById: async (id: string) => {
    try {
      // Try to get data from Supabase first
      const customers = await fetchFromSupabase<Customer>('customers', {
        column: 'id',
        value: parseInt(id)
      });
      
      if (customers.length > 0) {
        return { success: true, customer: customers[0] };
      }
      
      // If not found in Supabase, fall back to API
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        headers: getAuthHeaders()
      });
      
      return handleResponse<{ success: boolean; customer: Customer }>(response);
    } catch (error) {
      console.error("Error fetching customer from Supabase, falling back to API:", error);
      
      // Fall back to API if Supabase fails
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        headers: getAuthHeaders()
      });
      
      return handleResponse<{ success: boolean; customer: Customer }>(response);
    }
  },
  
  create: async (customerData: Omit<Customer, "id" | "timestamp" | "_id" | "createdAt" | "updatedAt">) => {
    console.log("API service sending customer data:", customerData);
    
    // First try to save directly to Supabase
    const offlineSyncManager = getOfflineSyncManager();
    
    try {
      // Convert field names to snake_case for Supabase
      const supabaseData = {
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        dob: customerData.dob,
        pan: customerData.pan,
        salary: customerData.salary,
        pin: customerData.pin,
        address: customerData.address,
        cibil_score: customerData.cibilScore,
        linked_agent: customerData.linkedAgent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try to save to Supabase first
      const savedCustomer = await saveToSupabase('customers', supabaseData);
      
      if (savedCustomer && 'id' in savedCustomer) {
        // Convert back to camelCase for the application
        const customer: Customer = {
          _id: savedCustomer.id.toString(),
          id: savedCustomer.id.toString(),
          name: savedCustomer.name,
          phone: savedCustomer.phone,
          email: savedCustomer.email,
          dob: savedCustomer.dob,
          pan: savedCustomer.pan,
          salary: savedCustomer.salary,
          pin: savedCustomer.pin,
          address: savedCustomer.address,
          cibilScore: savedCustomer.cibil_score,
          linkedAgent: savedCustomer.linked_agent,
          createdAt: savedCustomer.created_at,
          updatedAt: savedCustomer.updated_at,
        };
        
        return { success: true, customer };
      }
    } catch (error) {
      console.error("Error saving customer to Supabase:", error);
      
      // Queue for offline sync if available
      if (offlineSyncManager) {
        offlineSyncManager.queueOperation('customers', 'insert', {
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          dob: customerData.dob,
          pan: customerData.pan,
          salary: customerData.salary,
          pin: customerData.pin,
          address: customerData.address,
          cibil_score: customerData.cibilScore,
          linked_agent: customerData.linkedAgent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    // Fall back to API if Supabase fails
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    
    const result = await handleResponse<{ success: boolean; customer: Customer }>(response);
    console.log("API service received response:", result);
    return result;
  },
  
  update: async (id: string, customerData: Partial<Customer>) => {
    // First try to update directly in Supabase
    const offlineSyncManager = getOfflineSyncManager();
    
    try {
      // Convert field names to snake_case for Supabase
      const supabaseData: Record<string, any> = {};
      
      if (customerData.name !== undefined) supabaseData.name = customerData.name;
      if (customerData.phone !== undefined) supabaseData.phone = customerData.phone;
      if (customerData.email !== undefined) supabaseData.email = customerData.email;
      if (customerData.dob !== undefined) supabaseData.dob = customerData.dob;
      if (customerData.pan !== undefined) supabaseData.pan = customerData.pan;
      if (customerData.salary !== undefined) supabaseData.salary = customerData.salary;
      if (customerData.pin !== undefined) supabaseData.pin = customerData.pin;
      if (customerData.address !== undefined) supabaseData.address = customerData.address;
      if (customerData.cibilScore !== undefined) supabaseData.cibil_score = customerData.cibilScore;
      if (customerData.linkedAgent !== undefined) supabaseData.linked_agent = customerData.linkedAgent;
      
      // Always update the updated_at timestamp
      supabaseData.updated_at = new Date().toISOString();
      
      // Try to update in Supabase first
      const updatedCustomer = await updateInSupabase('customers', parseInt(id), supabaseData);
      
      if (updatedCustomer) {
        // Convert back to camelCase for the application
        const customer: Customer = {
          _id: updatedCustomer.id.toString(),
          id: updatedCustomer.id.toString(),
          name: updatedCustomer.name,
          phone: updatedCustomer.phone,
          email: updatedCustomer.email,
          dob: updatedCustomer.dob,
          pan: updatedCustomer.pan,
          salary: updatedCustomer.salary,
          pin: updatedCustomer.pin,
          address: updatedCustomer.address,
          cibilScore: updatedCustomer.cibil_score,
          linkedAgent: updatedCustomer.linked_agent,
          createdAt: updatedCustomer.created_at,
          updatedAt: updatedCustomer.updated_at,
        };
        
        return { success: true, customer };
      }
    } catch (error) {
      console.error("Error updating customer in Supabase:", error);
      
      // Queue for offline sync if available
      if (offlineSyncManager) {
        const supabaseData: Record<string, any> = {};
        
        if (customerData.name !== undefined) supabaseData.name = customerData.name;
        if (customerData.phone !== undefined) supabaseData.phone = customerData.phone;
        if (customerData.email !== undefined) supabaseData.email = customerData.email;
        if (customerData.dob !== undefined) supabaseData.dob = customerData.dob;
        if (customerData.pan !== undefined) supabaseData.pan = customerData.pan;
        if (customerData.salary !== undefined) supabaseData.salary = customerData.salary;
        if (customerData.pin !== undefined) supabaseData.pin = customerData.pin;
        if (customerData.address !== undefined) supabaseData.address = customerData.address;
        if (customerData.cibilScore !== undefined) supabaseData.cibil_score = customerData.cibilScore;
        if (customerData.linkedAgent !== undefined) supabaseData.linked_agent = customerData.linkedAgent;
        
        supabaseData.updated_at = new Date().toISOString();
        
        offlineSyncManager.queueOperation('customers', 'update', supabaseData, parseInt(id));
      }
    }
    
    // Fall back to API if Supabase fails
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    
    return handleResponse<{ success: boolean; customer: Customer }>(response);
  }
};

// Credit Cards API
export const creditCardsApi = {
  getAll: async () => {
    try {
      // Try to get data from Supabase first
      const creditCards = await fetchFromSupabase<CreditCard>('credit_cards', {
        orderBy: { column: 'created_at', ascending: false }
      });
      
      // Convert snake_case to camelCase
      const formattedCards = creditCards.map(card => ({
        _id: card.id.toString(),
        id: card.id.toString(),
        name: card.name,
        minCibilScore: card.minCibilScore,
        annualFee: card.annualFee,
        utmLink: card.utmLink,
        benefits: card.benefits,
        tags: card.tags,
        status: card.status,
        imageUrl: card.imageUrl,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt
      } as CreditCard));
      
      return { success: true, creditCards: formattedCards };
    } catch (error) {
      console.error("Error fetching credit cards from Supabase, falling back to API:", error);
      
      // Fall back to API if Supabase fails
      const response = await fetch(`${API_BASE_URL}/credit-cards`, {
        headers: getAuthHeaders()
      });
      
      return handleResponse<{ success: boolean; creditCards: CreditCard[] }>(response);
    }
  },
  
  getById: async (id: string) => {
    try {
      // Try to get data from Supabase first
      const cards = await fetchFromSupabase<any>('credit_cards', {
        column: 'id',
        value: parseInt(id)
      });
      
      if (cards.length > 0) {
        const card = cards[0];
        
        // Convert snake_case to camelCase
        const formattedCard: CreditCard = {
          _id: card.id.toString(),
          id: card.id.toString(),
          name: card.name,
          minCibilScore: card.minCibilScore,
          annualFee: card.annualFee,
          utmLink: card.utmLink,
          benefits: card.benefits,
          tags: card.tags,
          status: card.status,
          imageUrl: card.imageUrl,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt
        };
        
        return { success: true, creditCard: formattedCard };
      }
    } catch (error) {
      console.error("Error fetching credit card from Supabase, falling back to API:", error);
    }
    
    // Fall back to API if Supabase fails
    const response = await fetch(`${API_BASE_URL}/credit-cards/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; creditCard: CreditCard }>(response);
  },
  
  getEligible: async (cibilScore: number) => {
    try {
      // Try to get data from Supabase first
      const creditCards = await fetchFromSupabase<any>('credit_cards', {
        orderBy: { column: 'min_cibil_score', ascending: true }
      });
      
      // Filter eligible cards
      const eligibleCards = creditCards
        .filter(card => card.status === 'active' && card.min_cibil_score <= cibilScore)
        .map(card => ({
          _id: card.id.toString(),
          id: card.id.toString(),
          name: card.name,
          minCibilScore: card.min_cibil_score,
          annualFee: card.annual_fee,
          utmLink: card.utm_link,
          benefits: card.benefits,
          tags: card.tags,
          status: card.status,
          imageUrl: card.image_url,
          createdAt: card.created_at,
          updatedAt: card.updated_at
        }));
      
      return { success: true, eligibleCards };
    } catch (error) {
      console.error("Error fetching eligible cards from Supabase, falling back to API:", error);
      
      // Fall back to API if Supabase fails
      const response = await fetch(`${API_BASE_URL}/credit-cards/eligible?cibilScore=${cibilScore}`, {
        headers: getAuthHeaders()
      });
      
      return handleResponse<{ success: boolean; eligibleCards: CreditCard[] }>(response);
    }
  },
  
  create: async (cardData: Omit<CreditCard, "id">) => {
    // First try to save directly to Supabase
    const offlineSyncManager = getOfflineSyncManager();
    
    try {
      // Convert field names to snake_case for Supabase
      const supabaseData = {
        name: cardData.name,
        min_cibil_score: cardData.minCibilScore,
        annual_fee: cardData.annualFee,
        utm_link: cardData.utmLink,
        benefits: cardData.benefits,
        tags: cardData.tags,
        status: cardData.status,
        image_url: cardData.imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try to save to Supabase first
      const savedCard = await saveToSupabase('credit_cards', supabaseData);
      
      if (savedCard && 'id' in savedCard) {
        // Convert back to camelCase for the application
        const creditCard: CreditCard = {
          _id: savedCard.id.toString(),
          id: savedCard.id.toString(),
          name: savedCard.name,
          minCibilScore: savedCard.min_cibil_score,
          annualFee: savedCard.annual_fee,
          utmLink: savedCard.utm_link,
          benefits: savedCard.benefits,
          tags: savedCard.tags,
          status: savedCard.status,
          imageUrl: savedCard.image_url,
          createdAt: savedCard.created_at,
          updatedAt: savedCard.updated_at
        };
        
        return { success: true, creditCard };
      }
    } catch (error) {
      console.error("Error saving credit card to Supabase:", error);
      
      // Queue for offline sync if available
      if (offlineSyncManager) {
        offlineSyncManager.queueOperation('credit_cards', 'insert', {
          name: cardData.name,
          min_cibil_score: cardData.minCibilScore,
          annual_fee: cardData.annualFee,
          utm_link: cardData.utmLink,
          benefits: cardData.benefits,
          tags: cardData.tags,
          status: cardData.status,
          image_url: cardData.imageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    // Fall back to API if Supabase fails
    const response = await fetch(`${API_BASE_URL}/credit-cards`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData)
    });
    
    return handleResponse<{ success: boolean; creditCard: CreditCard }>(response);
  },
  
  update: async (id: string, cardData: Partial<CreditCard>) => {
    // First try to update directly in Supabase
    const offlineSyncManager = getOfflineSyncManager();
    
    try {
      // Convert field names to snake_case for Supabase
      const supabaseData: Record<string, any> = {};
      
      if (cardData.name !== undefined) supabaseData.name = cardData.name;
      if (cardData.minCibilScore !== undefined) supabaseData.min_cibil_score = cardData.minCibilScore;
      if (cardData.annualFee !== undefined) supabaseData.annual_fee = cardData.annualFee;
      if (cardData.utmLink !== undefined) supabaseData.utm_link = cardData.utmLink;
      if (cardData.benefits !== undefined) supabaseData.benefits = cardData.benefits;
      if (cardData.tags !== undefined) supabaseData.tags = cardData.tags;
      if (cardData.status !== undefined) supabaseData.status = cardData.status;
      if (cardData.imageUrl !== undefined) supabaseData.image_url = cardData.imageUrl;
      
      // Always update the updated_at timestamp
      supabaseData.updated_at = new Date().toISOString();
      
      // Try to update in Supabase first
      const updatedCard = await updateInSupabase('credit_cards', parseInt(id), supabaseData);
      
      if (updatedCard) {
        // Convert back to camelCase for the application
        const creditCard: CreditCard = {
          _id: updatedCard.id.toString(),
          id: updatedCard.id.toString(),
          name: updatedCard.name,
          minCibilScore: updatedCard.min_cibil_score,
          annualFee: updatedCard.annual_fee,
          utmLink: updatedCard.utm_link,
          benefits: updatedCard.benefits,
          tags: updatedCard.tags,
          status: updatedCard.status,
          imageUrl: updatedCard.image_url,
          createdAt: updatedCard.created_at,
          updatedAt: updatedCard.updated_at
        };
        
        return { success: true, creditCard };
      }
    } catch (error) {
      console.error("Error updating credit card in Supabase:", error);
      
      // Queue for offline sync if available
      if (offlineSyncManager) {
        const supabaseData: Record<string, any> = {};
        
        if (cardData.name !== undefined) supabaseData.name = cardData.name;
        if (cardData.minCibilScore !== undefined) supabaseData.min_cibil_score = cardData.minCibilScore;
        if (cardData.annualFee !== undefined) supabaseData.annual_fee = cardData.annualFee;
        if (cardData.utmLink !== undefined) supabaseData.utm_link = cardData.utmLink;
        if (cardData.benefits !== undefined) supabaseData.benefits = cardData.benefits;
        if (cardData.tags !== undefined) supabaseData.tags = cardData.tags;
        if (cardData.status !== undefined) supabaseData.status = cardData.status;
        if (cardData.imageUrl !== undefined) supabaseData.image_url = cardData.imageUrl;
        
        supabaseData.updated_at = new Date().toISOString();
        
        offlineSyncManager.queueOperation('credit_cards', 'update', supabaseData, parseInt(id));
      }
    }
    
    // Fall back to API if Supabase fails
    const response = await fetch(`${API_BASE_URL}/credit-cards/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData)
    });
    
    return handleResponse<{ success: boolean; creditCard: CreditCard }>(response);
  },
  
  delete: async (id: string) => {
    // First try to delete directly from Supabase
    const offlineSyncManager = getOfflineSyncManager();
    
    try {
      // Try to delete from Supabase first
      await deleteFromSupabase('credit_cards', parseInt(id));
      return { success: true, message: "Credit card deleted successfully" };
    } catch (error) {
      console.error("Error deleting credit card from Supabase:", error);
      
      // Queue for offline sync if available
      if (offlineSyncManager) {
        offlineSyncManager.queueOperation('credit_cards', 'delete', {}, parseInt(id));
      }
    }
    
    // Fall back to API if Supabase fails
    const response = await fetch(`${API_BASE_URL}/credit-cards/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; message: string }>(response);
  }
};

// Activity Logs API
export const logsApi = {
  getAll: async () => {
    try {
      // Try to get data from Supabase first
      const logs = await fetchFromSupabase<any>('activity_logs', {
        orderBy: { column: 'created_at', ascending: false }
      });
      
      // Convert snake_case to camelCase
      const formattedLogs = logs.map(log => ({
        _id: log.id.toString(),
        id: log.id.toString(),
        action: log.action,
        agentPhone: log.agent_phone,
        agentName: log.agent_name,
        customerId: log.customer_id,
        customerName: log.customer_name,
        sharedCards: log.shared_cards,
        details: log.details ? JSON.parse(log.details) : undefined,
        createdAt: log.created_at,
        updatedAt: log.updated_at,
        timestamp: log.created_at
      }));
      
      return { success: true, logs: formattedLogs };
    } catch (error) {
      console.error("Error fetching activity logs from Supabase, falling back to API:", error);
      
      // Fall back to API if Supabase fails
      const response = await fetch(`${API_BASE_URL}/activity-logs`, {
        headers: getAuthHeaders()
      });
      
      return handleResponse<{ success: boolean; logs: ActivityLog[] }>(response);
    }
  },
  
  create: async (logData: Omit<ActivityLog, "id" | "timestamp" | "agentPhone" | "agentName">) => {
    // First try to save directly to Supabase
    const offlineSyncManager = getOfflineSyncManager();
    
    try {
      // Get agent info from localStorage
      const isBrowser = typeof window !== 'undefined';
      const agentData = isBrowser ? localStorage.getItem("salesAgent") : null;
      const agent = agentData ? JSON.parse(agentData) : null;
      
      if (!agent) {
        throw new Error("Agent information not found");
      }
      
      // Convert field names to snake_case for Supabase
      const supabaseData = {
        action: logData.action,
        agent_phone: agent.phone,
        agent_name: agent.name,
        customer_id: logData.customerId,
        customer_name: logData.customerName,
        shared_cards: logData.sharedCards,
        details: logData.details ? JSON.stringify(logData.details) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try to save to Supabase first
      const savedLog = await saveToSupabase('activity_logs', supabaseData);
      
      if (savedLog && 'id' in savedLog) {
        // Convert back to camelCase for the application
        const log: ActivityLog = {
          _id: savedLog.id.toString(),
          id: savedLog.id.toString(),
          action: savedLog.action,
          agentPhone: savedLog.agent_phone,
          agentName: savedLog.agent_name,
          customerId: savedLog.customer_id,
          customerName: savedLog.customer_name,
          sharedCards: savedLog.shared_cards,
          details: savedLog.details ? JSON.parse(savedLog.details) : undefined,
          createdAt: savedLog.created_at,
          updatedAt: savedLog.updated_at,
          timestamp: savedLog.created_at
        };
        
        return { success: true, log };
      }
    } catch (error) {
      console.error("Error saving activity log to Supabase:", error);
      
      // Queue for offline sync if available
      if (offlineSyncManager) {
        // Get agent info from localStorage
        const isBrowser = typeof window !== 'undefined';
        const agentData = isBrowser ? localStorage.getItem("salesAgent") : null;
        const agent = agentData ? JSON.parse(agentData) : null;
        
        if (agent) {
          offlineSyncManager.queueOperation('activity_logs', 'insert', {
            action: logData.action,
            agent_phone: agent.phone,
            agent_name: agent.name,
            customer_id: logData.customerId,
            customer_name: logData.customerName,
            shared_cards: logData.sharedCards,
            details: logData.details ? JSON.stringify(logData.details) : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
    }
    
    // Fall back to API if Supabase fails
    const response = await fetch(`${API_BASE_URL}/activity-logs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(logData)
    });
    
    return handleResponse<{ success: boolean; log: ActivityLog }>(response);
  }
};

// Supabase direct API for real-time data
export const supabaseApi = {
  // Subscribe to real-time changes
  subscribeToTable: (tableName: string, callback: (payload: any) => void) => {
    return subscribeToTable(tableName, callback);
  },
  
  // Get offline sync manager
  getOfflineSyncManager: () => {
    return getOfflineSyncManager();
  },
  
  // Get pending operations count
  getPendingOperationsCount: () => {
    const manager = getOfflineSyncManager();
    return manager ? manager.getPendingOperationsCount() : 0;
  },
  
  // Force sync pending operations
  forceSyncPendingOperations: async () => {
    const manager = getOfflineSyncManager();
    if (manager) {
      // Use public method to trigger sync
      await manager.performSync();
      return { success: true, pendingCount: manager.getPendingOperationsCount() };
    }
    return { success: false, error: "Offline sync manager not available" };
  }
};

// Helper function to subscribe to real-time changes
function subscribeToTable(
  tableName: string,
  callback: (payload: any) => void,
  options: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'; filter?: string } = {}
) {
  const { event = '*', filter } = options;
  
  let channel = supabase.channel(`table-changes:${tableName}`)
    .on('postgres_changes' as any, { 
      event, 
      schema: 'public', 
      table: tableName,
      ...(filter ? { filter } : {})
    }, callback)
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error(`Failed to subscribe to ${tableName} changes:`, status);
      }
    });
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
