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
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" data-unique-id="bfd5fa20-1dae-4adb-8341-875102fcce1a" data-loc="55:9-55:105" data-file-name="components/card-share-modal.tsx">
      <div className={cn("bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all duration-300", isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0")} data-unique-id="a54de0b5-0a46-4d71-864a-0e20b8722f34" data-loc="56:6-56:170" data-file-name="components/card-share-modal.tsx">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" data-unique-id="4fdf42e5-cc77-4f87-a75c-920f91e8872b" data-loc="58:8-58:78" data-file-name="components/card-share-modal.tsx">
          <h3 className="text-lg font-medium text-gray-900" data-unique-id="79565adb-8716-4cc6-b31f-15866e988f90" data-loc="59:10-59:60" data-file-name="components/card-share-modal.tsx">Share Credit Card</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 transition-colors" data-unique-id="cbc8900a-91be-4759-8677-d7acd28696a7" data-loc="60:10-60:104" data-file-name="components/card-share-modal.tsx">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Card Preview */}
        <div className="p-6" data-unique-id="2489085f-1dc1-4f36-bf70-f618c4749ec9" data-loc="66:8-66:29" data-file-name="components/card-share-modal.tsx">
          <div className="flex items-center space-x-4 mb-6" data-unique-id="13bb2395-372f-4c1b-8fa7-5c6cf71d70f8" data-loc="67:10-67:60" data-file-name="components/card-share-modal.tsx">
            <div className="h-16 w-24 relative rounded-md overflow-hidden bg-gray-100" data-unique-id="15b4de36-c6de-4130-9adc-97c9f66a6a0d" data-loc="68:12-68:87" data-file-name="components/card-share-modal.tsx">
              <Image src={card.imageUrl} alt={card.name} fill className="object-cover" data-unique-id="b707e332-7be2-4ea3-86c6-34d393af7a52" data-loc="69:14-69:89" data-file-name="components/card-share-modal.tsx" />
            </div>
            <div data-unique-id="6d4ab65c-04a4-4970-b9b9-903227946d3f" data-loc="71:12-71:17" data-file-name="components/card-share-modal.tsx">
              <h4 className="font-medium text-gray-900" data-unique-id="6fedff34-dc79-4286-98c2-a8812dc8828e" data-loc="72:14-72:56" data-file-name="components/card-share-modal.tsx">{card.name}</h4>
              <p className="text-sm text-gray-500" data-unique-id="e7dec5d8-74cd-4b58-b31d-f53637f3abf2" data-loc="73:14-73:51" data-file-name="components/card-share-modal.tsx">Annual Fee: ₹{card.annualFee.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          {/* Message Preview */}
          <div className="mb-6" data-unique-id="fe9926f7-f39f-4baf-9ee0-d25dab16fa5b" data-loc="78:10-78:32" data-file-name="components/card-share-modal.tsx">
            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="4d44f9b1-a9ec-438d-939f-bc10df79163c" data-loc="79:12-79:67" data-file-name="components/card-share-modal.tsx">Message Preview</h4>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 max-h-48 overflow-y-auto" data-unique-id="89f5f6e5-fa2b-4aea-9a9a-efd1b972f1a4" data-loc="80:12-80:145" data-file-name="components/card-share-modal.tsx">
              {shareMessage}
            </div>
            <button onClick={copyToClipboard} className="mt-2 inline-flex items-center text-sm text-gray-500 hover:text-gray-700" data-unique-id="0bb8c0e0-8826-41cd-bc75-917c831086b2" data-loc="83:12-83:130" data-file-name="components/card-share-modal.tsx">
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
          <div className="flex flex-col space-y-3" data-unique-id="70acad6c-52f8-4eef-a5fc-fefa308fafe1" data-loc="95:10-95:51" data-file-name="components/card-share-modal.tsx">
            <WhatsAppShareButton message={shareMessage} onShareSuccess={onShareSuccess} className="w-full" />
            
            <button onClick={handleClose} className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" data-unique-id="7b358dca-ac93-47b2-aed1-309043d15a78" data-loc="98:12-98:280" data-file-name="components/card-share-modal.tsx">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>;
}