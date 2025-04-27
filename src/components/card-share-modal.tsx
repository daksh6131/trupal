'use client';

import { useState, useEffect } from 'react';
import { CreditCard as CreditCardType } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { X, Check, Copy } from 'lucide-react';
import WhatsAppShareButton from './whatsapp-share-button';
interface CardShareModalProps {
  card: CreditCardType;
  customer: {
    name: string;
  };
  onClose: () => void;
  onShareSuccess?: () => void;
}
export default function CardShareModal({
  card,
  customer,
  onClose,
  onShareSuccess
}: CardShareModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Create message for WhatsApp sharing
  const shareMessage = `Hello ${customer.name},\n\nI'd like to recommend the *${card.name}* for you:\n\n*Benefits:*\n${card.benefits.slice(0, 3).map(b => `✅ ${b}`).join('\n')}\n\n💳 Annual Fee: ₹${card.annualFee.toLocaleString('en-IN')}\n\nApply now: ${card.utmLink}\n\nFeel free to contact me if you have any questions!`;

  // Copy message to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.error('Failed to copy:', err));
  };

  // Handle close with animation
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={cn("bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all duration-300", isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0")}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Share Credit Card</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Card Preview */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-24 relative rounded-md overflow-hidden bg-gray-100">
              <Image src={card.imageUrl} alt={card.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{card.name}</h4>
              <p className="text-sm text-gray-500">Annual Fee: ₹{card.annualFee.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          {/* Message Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview</h4>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 max-h-48 overflow-y-auto">
              {shareMessage}
            </div>
            <button onClick={copyToClipboard} className="mt-2 inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              {copied ? <>
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Copied!
                </> : <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy message
                </>}
            </button>
          </div>
          
          {/* Share Options */}
          <div className="flex flex-col space-y-3">
            <WhatsAppShareButton message={shareMessage} onShareSuccess={onShareSuccess} className="w-full" />
            
            <button onClick={handleClose} className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>;
}