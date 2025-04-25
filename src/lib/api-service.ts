import { Customer, CreditCard, ActivityLog } from "@/types";

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
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; customers: Customer[] }>(response);
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; customer: Customer }>(response);
  },
  
  create: async (customerData: Omit<Customer, "id" | "timestamp" | "_id" | "createdAt" | "updatedAt">) => {
    console.log("API service sending customer data:", customerData);
    
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
    const response = await fetch(`${API_BASE_URL}/credit-cards`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; creditCards: CreditCard[] }>(response);
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/credit-cards/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; creditCard: CreditCard }>(response);
  },
  
  getEligible: async (cibilScore: number) => {
    const response = await fetch(`${API_BASE_URL}/credit-cards/eligible?cibilScore=${cibilScore}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; eligibleCards: CreditCard[] }>(response);
  },
  
  create: async (cardData: Omit<CreditCard, "id">) => {
    const response = await fetch(`${API_BASE_URL}/credit-cards`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData)
    });
    
    return handleResponse<{ success: boolean; creditCard: CreditCard }>(response);
  },
  
  update: async (id: string, cardData: Partial<CreditCard>) => {
    const response = await fetch(`${API_BASE_URL}/credit-cards/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData)
    });
    
    return handleResponse<{ success: boolean; creditCard: CreditCard }>(response);
  },
  
  delete: async (id: string) => {
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
    const response = await fetch(`${API_BASE_URL}/activity-logs`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse<{ success: boolean; logs: ActivityLog[] }>(response);
  },
  
  create: async (logData: Omit<ActivityLog, "id" | "timestamp" | "agentPhone" | "agentName">) => {
    const response = await fetch(`${API_BASE_URL}/activity-logs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(logData)
    });
    
    return handleResponse<{ success: boolean; log: ActivityLog }>(response);
  }
};
