'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Smartphone } from 'lucide-react';
interface WhatsAppShareButtonProps {
  message: string;
  onShareSuccess?: () => void;
  onShareError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}
export default function WhatsAppShareButton({
  message,
  onShareSuccess,
  onShareError,
  className,
  children,
  size = 'md',
  variant = 'default',
  disabled = false
}: WhatsAppShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-green-600 hover:bg-green-700 text-white border-transparent',
    outline: 'bg-white text-green-600 border-green-300 hover:bg-green-50',
    ghost: 'bg-transparent hover:bg-green-100 text-green-600 border-transparent'
  };
  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Check if navigator.share is available (mobile devices)
      if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // Use Web Share API for mobile
        await navigator.share({
          text: message
        });
        onShareSuccess?.();
        toast.success('Shared successfully');
      } else {
        // Fallback to WhatsApp web
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

        // Open in new tab
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        onShareSuccess?.();
        toast.success('WhatsApp opened in a new tab');
      }
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      const err = error instanceof Error ? error : new Error('Failed to share via WhatsApp');
      onShareError?.(err);
      if (error instanceof Error && error.name === 'AbortError') {
        // User canceled the share
        toast('Sharing canceled');
      } else {
        toast.error('Could not share via WhatsApp');
      }
    } finally {
      setIsSharing(false);
    }
  };
  return <button onClick={handleShare} disabled={isSharing || disabled} className={cn('inline-flex items-center justify-center font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors', sizeClasses[size], variantClasses[variant], (isSharing || disabled) && 'opacity-70 cursor-not-allowed', className)} type="button" data-unique-id="0aa31433-2bc6-44b0-bc33-3556566f3a39" data-loc="77:9-77:390" data-file-name="components/whatsapp-share-button.tsx">
      {isSharing ? <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="fc252b00-3253-40a0-923f-9a0a8f34019a" data-loc="79:10-79:126" data-file-name="components/whatsapp-share-button.tsx">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sharing...
        </> : children || <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="4a8e5f1d-0edf-4eb5-8720-8898bc68e9d7" data-loc="85:10-85:115" data-file-name="components/whatsapp-share-button.tsx">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share via WhatsApp
        </>}
    </button>;
}