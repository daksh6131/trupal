import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a WhatsApp share URL with the provided message
 * @param message The message to share via WhatsApp
 * @returns A WhatsApp web API URL
 */
export function createWhatsAppShareUrl(message: string): string {
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/?text=${encodedMessage}`
}

/**
 * Formats a credit card for sharing via WhatsApp
 * @param card The credit card details
 * @param includeImage Whether to include image URL in the message
 * @returns A formatted message string
 */
export function formatCardForWhatsApp(
  card: { 
    name: string; 
    benefits: string[]; 
    annualFee: number;
    imageUrl?: string;
    utmLink: string;
  }, 
  includeImage: boolean = false
): string {
  // Start with the card name as a header
  let message = `*${card.name}*\n\n`;
  
  // Add card benefits (up to 3 to keep message concise)
  message += "*Benefits:*\n";
  const topBenefits = card.benefits.slice(0, 3);
  message += topBenefits.map(benefit => `✅ ${benefit}`).join('\n');
  
  if (card.benefits.length > 3) {
    message += '\n...and more benefits';
  }
  
  // Add annual fee
  message += `\n\n*Annual Fee:* ₹${card.annualFee.toLocaleString('en-IN')}`;
  
  // Add image if requested and available
  if (includeImage && card.imageUrl) {
    message += `\n\n${card.imageUrl}`;
  }
  
  // Add call to action with UTM link
  message += `\n\nApply now: ${card.utmLink}`;
  
  return message;
}

/**
 * Checks if WhatsApp is available on the device
 */
export function isWhatsAppAvailable(): boolean {
  const isBrowser = typeof window !== 'undefined';
  const isMobile = isBrowser && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // WhatsApp Web works on all desktop browsers,
  // and the WhatsApp app is likely installed on mobile devices
  return true;
}

/**
 * Share content via WhatsApp
 * @param message The message to share
 * @returns Promise that resolves when sharing is initiated
 */
export async function shareViaWhatsApp(message: string): Promise<boolean> {
  try {
    const shareUrl = createWhatsAppShareUrl(message);
    
    // Open WhatsApp in a new tab/window
    window.open(shareUrl, '_blank');
    return true;
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    return false;
  }
}
