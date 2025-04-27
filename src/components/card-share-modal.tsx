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
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" data-unique-id="32085545-6b17-4787-af6a-6c921309db17" data-loc="55:9-55:105" data-file-name="components/card-share-modal.tsx">
      <div className={cn("bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all duration-300", isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0")} data-unique-id="44ac0ac5-aeff-44a2-b9a1-262b19de84d5" data-loc="56:6-56:170" data-file-name="components/card-share-modal.tsx">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" data-unique-id="8541b381-0c97-4a58-b8a4-c4aa27b427c6" data-loc="58:8-58:78" data-file-name="components/card-share-modal.tsx">
          <h3 className="text-lg font-medium text-gray-900" data-unique-id="8c3088c7-20f3-4377-ba61-163c3d9473f4" data-loc="59:10-59:60" data-file-name="components/card-share-modal.tsx">Share Credit Card</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 transition-colors" data-unique-id="c34d05be-d68d-4126-af27-ef47b22412f0" data-loc="60:10-60:104" data-file-name="components/card-share-modal.tsx">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Card Preview */}
        <div className="p-6" data-unique-id="ec9d4d82-a908-4617-9015-120562535730" data-loc="66:8-66:29" data-file-name="components/card-share-modal.tsx">
          <div className="flex items-center space-x-4 mb-6" data-unique-id="e4aec70e-c3ff-4d6c-a2c0-44a1a8686c9b" data-loc="67:10-67:60" data-file-name="components/card-share-modal.tsx">
            <div className="h-16 w-24 relative rounded-md overflow-hidden bg-gray-100" data-unique-id="a9897056-ec94-43ca-8fd2-70accdf796ed" data-loc="68:12-68:87" data-file-name="components/card-share-modal.tsx">
              <Image src={card.imageUrl} alt={card.name} fill className="object-cover" data-unique-id="c2c0a476-2c9c-4d66-a493-9a7bf0e5b2b7" data-loc="69:14-69:89" data-file-name="components/card-share-modal.tsx" />
            </div>
            <div data-unique-id="0884808a-b9ef-4bdf-af1f-7633fd8dc70b" data-loc="71:12-71:17" data-file-name="components/card-share-modal.tsx">
              <h4 className="font-medium text-gray-900" data-unique-id="8a7ca422-8f55-4b1a-8a39-c48b50499ab3" data-loc="72:14-72:56" data-file-name="components/card-share-modal.tsx">{card.name}</h4>
              <p className="text-sm text-gray-500" data-unique-id="3adc7c71-7a0f-40aa-bf5f-164aa7ffae3c" data-loc="73:14-73:51" data-file-name="components/card-share-modal.tsx">Annual Fee: ₹{card.annualFee.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          {/* Message Preview */}
          <div className="mb-6" data-unique-id="1b022f81-e074-416b-9db1-95f4740978ad" data-loc="78:10-78:32" data-file-name="components/card-share-modal.tsx">
            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="1f0e15a6-7a1c-4234-94bc-a92ecc3d4d82" data-loc="79:12-79:67" data-file-name="components/card-share-modal.tsx">Message Preview</h4>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 max-h-48 overflow-y-auto" data-unique-id="c7a08b59-2e67-4f35-af9b-c72126c452cd" data-loc="80:12-80:145" data-file-name="components/card-share-modal.tsx">
              {shareMessage}
            </div>
            <button onClick={copyToClipboard} className="mt-2 inline-flex items-center text-sm text-gray-500 hover:text-gray-700" data-unique-id="1762b95c-e125-4d5d-a299-e5ed6c7d7be1" data-loc="83:12-83:130" data-file-name="components/card-share-modal.tsx">
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
          <div className="flex flex-col space-y-3" data-unique-id="627b63d0-9a24-4d37-9ec2-33c016d3f43e" data-loc="95:10-95:51" data-file-name="components/card-share-modal.tsx">
            <WhatsAppShareButton message={shareMessage} onShareSuccess={onShareSuccess} className="w-full" />
            
            <button onClick={handleClose} className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" data-unique-id="693e4e2d-23f3-43e7-a3bf-33d484d5be02" data-loc="98:12-98:280" data-file-name="components/card-share-modal.tsx">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>;
}