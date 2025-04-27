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
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" data-unique-id="3db211f3-912d-46a2-a511-45de45b39090" data-loc="55:9-55:105" data-file-name="components/card-share-modal.tsx">
      <div className={cn("bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all duration-300", isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0")} data-unique-id="62d29159-c9af-43a3-b8ca-7ef753263a20" data-loc="56:6-56:170" data-file-name="components/card-share-modal.tsx">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" data-unique-id="603deb12-3dbf-4e0e-a929-777a8c97cd16" data-loc="58:8-58:78" data-file-name="components/card-share-modal.tsx">
          <h3 className="text-lg font-medium text-gray-900" data-unique-id="f8c74153-835e-4503-ab14-c26b05cdf5ba" data-loc="59:10-59:60" data-file-name="components/card-share-modal.tsx">Share Credit Card</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 transition-colors" data-unique-id="f2d3a1eb-623e-407c-94fb-a2611660fcc7" data-loc="60:10-60:104" data-file-name="components/card-share-modal.tsx">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Card Preview */}
        <div className="p-6" data-unique-id="06eb55ee-0d25-4665-993e-541703c654f2" data-loc="66:8-66:29" data-file-name="components/card-share-modal.tsx">
          <div className="flex items-center space-x-4 mb-6" data-unique-id="575ccebf-fdbf-4106-b187-e295645ad3dd" data-loc="67:10-67:60" data-file-name="components/card-share-modal.tsx">
            <div className="h-16 w-24 relative rounded-md overflow-hidden bg-gray-100" data-unique-id="ac66251d-eb6f-4051-b291-5bc7f1b3c5b5" data-loc="68:12-68:87" data-file-name="components/card-share-modal.tsx">
              <Image src={card.imageUrl} alt={card.name} fill className="object-cover" data-unique-id="7e92d366-ddef-490d-84ba-b97718eeef05" data-loc="69:14-69:89" data-file-name="components/card-share-modal.tsx" />
            </div>
            <div data-unique-id="6a3b928b-6ae4-4784-8bcb-3b1952ccd807" data-loc="71:12-71:17" data-file-name="components/card-share-modal.tsx">
              <h4 className="font-medium text-gray-900" data-unique-id="50304478-08b9-40f4-87f1-a09f867e605e" data-loc="72:14-72:56" data-file-name="components/card-share-modal.tsx">{card.name}</h4>
              <p className="text-sm text-gray-500" data-unique-id="61402d54-e72f-42d4-a7e4-437a73fe3471" data-loc="73:14-73:51" data-file-name="components/card-share-modal.tsx">Annual Fee: ₹{card.annualFee.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          {/* Message Preview */}
          <div className="mb-6" data-unique-id="239bd81b-f167-43e5-b6e0-aa7ac52cc44b" data-loc="78:10-78:32" data-file-name="components/card-share-modal.tsx">
            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="86567e68-48b2-4f7a-8868-1fd50e439940" data-loc="79:12-79:67" data-file-name="components/card-share-modal.tsx">Message Preview</h4>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 max-h-48 overflow-y-auto" data-unique-id="d1865193-8373-4012-b639-a9333f1c3b24" data-loc="80:12-80:145" data-file-name="components/card-share-modal.tsx">
              {shareMessage}
            </div>
            <button onClick={copyToClipboard} className="mt-2 inline-flex items-center text-sm text-gray-500 hover:text-gray-700" data-unique-id="c9c2d92f-178e-4f77-b560-68970d91a0db" data-loc="83:12-83:130" data-file-name="components/card-share-modal.tsx">
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
          <div className="flex flex-col space-y-3" data-unique-id="5b9e3069-1ec5-4330-abef-84386ec29deb" data-loc="95:10-95:51" data-file-name="components/card-share-modal.tsx">
            <WhatsAppShareButton message={shareMessage} onShareSuccess={onShareSuccess} className="w-full" />
            
            <button onClick={handleClose} className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" data-unique-id="9e31716e-8844-4ccc-bade-211b6483b033" data-loc="98:12-98:280" data-file-name="components/card-share-modal.tsx">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>;
}