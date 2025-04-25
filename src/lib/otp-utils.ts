'use server';

import { db } from "@/db";
import { otps, adminPhones, NewOTP } from "@/db/schema";
import { eq, and, gt, lt } from "drizzle-orm";

// Constants
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 3;
const MAX_OTP_REQUESTS_PER_HOUR = 5;

// Generate a random OTP code
export async function generateOTPCode(length = 6): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

// Create a new OTP
export async function createOTP(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
  try {
    // Check rate limiting - how many OTPs have been generated for this phone in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await db.select()
      .from(otps)
      .where(
        and(
          eq(otps.phone, phone),
          gt(otps.createdAt, oneHourAgo)
        )
      );

    if (recentOTPs.length >= MAX_OTP_REQUESTS_PER_HOUR) {
      return {
        success: false,
        message: "Too many OTP requests. Please try again later."
      };
    }

    // Generate new OTP
    const code = await generateOTPCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store OTP in database
    const newOTP: NewOTP = {
      phone,
      code,
      expiresAt,
      verified: false,
      attempts: 0,
      createdAt: new Date()
    };

    await db.insert(otps).values(newOTP);

    // In a real production environment, you would send the OTP via SMS
    // For development, we'll return the OTP in the response
    console.log(`OTP for ${phone}: ${code}`);

    return {
      success: true,
      message: "OTP generated successfully",
      otp: code // Only for development, remove in production
    };
  } catch (error) {
    console.error("Error creating OTP:", error);
    return {
      success: false,
      message: "Failed to generate OTP"
    };
  }
}

// Verify an OTP
export async function verifyOTP(phone: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find the most recent OTP for this phone number
    const otpRecords = await db.select()
      .from(otps)
      .where(eq(otps.phone, phone))
      .orderBy(otps.createdAt);

    if (!otpRecords.length) {
      return {
        success: false,
        message: "No OTP found for this phone number"
      };
    }

    const otpRecord = otpRecords[otpRecords.length - 1];

    // Check if OTP is already verified
    if (otpRecord.verified) {
      return {
        success: false,
        message: "OTP already used"
      };
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      return {
        success: false,
        message: "OTP has expired"
      };
    }

    // Check if max attempts reached
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      return {
        success: false,
        message: "Maximum verification attempts reached"
      };
    }

    // Increment attempt counter
    await db.update(otps)
      .set({ attempts: otpRecord.attempts + 1 })
      .where(eq(otps.id, otpRecord.id));

    // Check if OTP matches
    if (otpRecord.code !== code) {
      return {
        success: false,
        message: "Invalid OTP"
      };
    }

    // Mark OTP as verified
    await db.update(otps)
      .set({ verified: true })
      .where(eq(otps.id, otpRecord.id));

    return {
      success: true,
      message: "OTP verified successfully"
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: "Failed to verify OTP"
    };
  }
}

// Check if a phone number is in the admin whitelist
export async function isAdminPhone(phone: string): Promise<boolean> {
  try {
    const adminPhone = await db.select()
      .from(adminPhones)
      .where(eq(adminPhones.phone, phone));

    return adminPhone.length > 0;
  } catch (error) {
    console.error("Error checking admin phone:", error);
    return false;
  }
}

// Add a phone number to the admin whitelist
export async function addAdminPhone(phone: string, addedBy: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if phone already exists
    const existingPhone = await db.select()
      .from(adminPhones)
      .where(eq(adminPhones.phone, phone));

    if (existingPhone.length > 0) {
      return {
        success: false,
        message: "Phone number already in admin whitelist"
      };
    }

    // Add phone to whitelist
    await db.insert(adminPhones)
      .values({
        phone,
        addedBy,
        createdAt: new Date()
      });

    return {
      success: true,
      message: "Phone number added to admin whitelist"
    };
  } catch (error) {
    console.error("Error adding admin phone:", error);
    return {
      success: false,
      message: "Failed to add phone to admin whitelist"
    };
  }
}

// Remove a phone number from the admin whitelist
export async function removeAdminPhone(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await db.delete(adminPhones)
      .where(eq(adminPhones.phone, phone))
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        message: "Phone number not found in admin whitelist"
      };
    }

    return {
      success: true,
      message: "Phone number removed from admin whitelist"
    };
  } catch (error) {
    console.error("Error removing admin phone:", error);
    return {
      success: false,
      message: "Failed to remove phone from admin whitelist"
    };
  }
}

// Get all admin phone numbers
export async function getAdminPhones(): Promise<any[]> {
  try {
    // Try drizzle first
    const phones = await db.select().from(adminPhones);
    console.log("Admin phones from drizzle:", phones);
    
    if (!phones || phones.length === 0) {
      // Try direct Supabase query as fallback
      const { data: supabasePhones, error: supabaseError } = await supabase
        .from('admin_phones')
        .select('*');
      
      if (supabaseError) throw supabaseError;
      
      console.log("Admin phones from Supabase:", supabasePhones);
      return supabasePhones || [];
    }
    
    return phones;
  } catch (error) {
    console.error("Error getting admin phones:", error);
    return [];
  }
}

// Check admin phone status
export async function checkAdminPhoneStatus(phone: string): Promise<{
  exists: boolean;
  source?: 'drizzle' | 'supabase';
  error?: string;
}> {
  try {
    // Try drizzle first
    const phones = await db.select()
      .from(adminPhones)
      .where(eq(adminPhones.phone, phone));
    
    if (phones && phones.length > 0) {
      return { exists: true, source: 'drizzle' };
    }
    
    // Try Supabase as fallback
    const { data: supabasePhones, error: supabaseError } = await supabase
      .from('admin_phones')
      .select('*')
      .eq('phone', phone);
    
    if (supabaseError) throw supabaseError;
    
    return {
      exists: !!(supabasePhones && supabasePhones.length > 0),
      source: 'supabase'
    };
    
  } catch (error) {
    console.error("Error checking admin phone status:", error);
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Initialize admin phones with default number
export async function initializeAdminPhones(): Promise<void> {
  try {
    const existingPhones = await getAdminPhones();
    console.log("Current admin phones:", existingPhones);
    
    if (existingPhones.length === 0) {
      // Add the default admin phone number
      await db.insert(adminPhones)
        .values({
          phone: "8076492495", // Default admin phone
          addedBy: "system",
          createdAt: new Date()
        });
      console.log("Default admin phone number (8076492495) added successfully");
    } else {
      console.log("Admin phones already exist:", existingPhones);
    }
  } catch (error) {
    console.error("Error initializing admin phones:", error);
    // Try direct Supabase query as fallback
    try {
      const { data: phones, error: supabaseError } = await supabase
        .from('admin_phones')
        .select('*');
      
      if (supabaseError) throw supabaseError;
      
      console.log("Admin phones from Supabase:", phones);
      
      if (!phones || phones.length === 0) {
        const { error: insertError } = await supabase
          .from('admin_phones')
          .insert({
            phone: "8076492495",
            added_by: "system",
            created_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
        console.log("Default admin phone added via Supabase");
      }
    } catch (supabaseError) {
      console.error("Supabase fallback also failed:", supabaseError);
    }
  }
}
