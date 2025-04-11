"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, CreditCard, Tag, DollarSign, Star, 
  Share, CheckCircle, AlertCircle, Smartphone
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { db } from "@/lib/db";
import { Customer, CreditCard as CreditCardType } from "@/types";
import { cn } from "@/lib/utils";

export default function EligibilityPage() {
  const router = useRouter();
  const params = useParams<{ customerId: string }>();
  const [agent, setAgent] = useState<{ name: string; phone: string } | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [eligibleCards, setEligibleCards] = useState<CreditCardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const agentData = localStorage.getItem("salesAgent");
    if (!agentData) {
      router.push("/");
      return;
    }
    
    setAgent(JSON.parse(agentData));
    
    // Fetch customer data
    const customerId = params.customerId;
    const customerData = db.customers.getById(customerId);
    
    if (!customerData) {
      toast.error("Customer not found");
      router.push("/dashboard");
      return;
    }
    
    setCustomer(customerData);
    
    // Get eligible cards
    const cibilScore = customerData.cibilScore ?? 0;
    if (cibilScore > 0) {
      const cards = db.creditCards.getEligibleCards(cibilScore);
      setEligibleCards(cards);
    }
  }, [params.customerId, router]);
  
  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };
  
  const handleWhatsAppShare = async () => {
    if (!agent || !customer || selectedCards.length === 0) return;
    
    setIsSharing(true);
    
    try {
      // Get selected card details
      const cards = selectedCards.map(id => 
        db.creditCards.getById(id)
      ).filter(Boolean) as CreditCardType[];
      
      // Format WhatsApp message
      const message = formatWhatsAppMessage(customer.name, cards);
      
      // In a real app, this would call the Twilio API
      // For demo, we'll just log and simulate a successful send
      console.log("WhatsApp message to send:", message);
      
      // Log the activity
      db.logs.create({
        action: "card_shared",
        agentPhone: agent.phone,
        agentName: agent.name,
        customerId: customer.id,
        customerName: customer.name,
        sharedCards: selectedCards,
        details: {
          messageContent: message
        }
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Cards shared via WhatsApp successfully");
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
      toast.error("Failed to share cards via WhatsApp");
    } finally {
      setIsSharing(false);
    }
  };
  
  const formatWhatsAppMessage = (customerName: string, cards: CreditCardType[]): string => {
    const header = `Hello ${customerName},\n\nHere are the best credit cards for you:\n\n`;
    
    const cardDetails = cards.map(card => 
      `*${card.name}*\n${card.benefits.join("\n")}\n${card.utmLink}\n`
    ).join("\n");
    
    const footer = "\nReply to this message or call us if you have any questions.";
    
    return header + cardDetails + footer;
  };
  
  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.push("/dashboard")}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Card Eligibility for {customer.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {/* Customer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1">{customer.name}</p>
              <p className="text-sm text-gray-600 mt-1">{customer.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">CIBIL Score</h3>
              <div className="mt-1 flex items-center">
                <span 
                  className={cn(
                    "text-lg font-semibold",
                    (customer.cibilScore ?? 0) >= 750 ? "text-green-600" :
                    (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" :
                    (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" :
                    (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600"
                  )}
                >
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {customer.cibilScore >= 750 ? "Excellent" :
                     customer.cibilScore >= 700 ? "Good" :
                     customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && (
            <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Missing CIBIL Score</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>Please enter a CIBIL score to check card eligibility.</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/customer-form`)}
                        className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        Update Customer Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Credit Card Eligibility */}
        {customer.cibilScore && customer.cibilScore > 0 ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {eligibleCards.length > 0 
                ? `Eligible Credit Cards (${eligibleCards.length})` 
                : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? (
              <>
                <div className="space-y-6">
                  {eligibleCards.map(card => (
                    <div 
                      key={card.id}
                      className={cn(
                        "bg-white rounded-lg shadow-md overflow-hidden transition-all",
                        selectedCards.includes(card.id) 
                          ? "border-2 border-blue-500" 
                          : "border border-gray-200"
                      )}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center">
                          <div className="relative h-40 w-64 md:h-full md:w-full">
                            <Image
                              src={card.imageUrl}
                              alt={card.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {card.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {card.tags.map((tag, index) => (
                                  <span 
                                    key={index} 
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0">
                              <div className="flex items-center text-sm text-gray-600">
                                <CreditCard className="h-4 w-4 mr-1" /> 
                                <span>Min. CIBIL: {card.minCibilScore}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <DollarSign className="h-4 w-4 mr-1" /> 
                                <span>Annual Fee: ₹{card.annualFee}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Benefits:</h4>
                            <ul className="space-y-1">
                              {card.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                                  <span className="text-sm text-gray-600">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex items-center">
                            <button
                              onClick={() => handleSelectCard(card.id)}
                              className={cn(
                                "inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                selectedCards.includes(card.id)
                                  ? "bg-blue-100 text-blue-700 border-blue-300"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {selectedCards.includes(card.id) ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" /> Selected
                                </>
                              ) : (
                                "Select Card"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* WhatsApp Share Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleWhatsAppShare}
                    disabled={selectedCards.length === 0 || isSharing}
                    className={cn(
                      "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                      selectedCards.length > 0 && !isSharing
                        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        : "bg-gray-400 cursor-not-allowed"
                    )}
                  >
                    {isSharing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-5 w-5 mr-2" />
                        Share {selectedCards.length} {selectedCards.length === 1 ? "Card" : "Cards"} via WhatsApp
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Eligible Cards Found
                </h3>
                <p className="text-gray-600 mb-6">
                  The customer does not qualify for any cards based on their current CIBIL score ({customer.cibilScore}).
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              CIBIL Score Required
            </h3>
            <p className="text-gray-600 mb-6">
              Please update the customer information with a valid CIBIL score to check credit card eligibility.
            </p>
            <button
              onClick={() => router.push(`/dashboard/customer-form`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Customer Information
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
