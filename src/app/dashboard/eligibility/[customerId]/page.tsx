"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Tag, DollarSign, Star, Share, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Customer, CreditCard as CreditCardType } from "@/types";
import { cn } from "@/lib/utils";
import { customersApi, creditCardsApi, logsApi, supabaseApi } from "@/lib/api-service";
import WhatsAppShareButton from "@/components/whatsapp-share-button";
import CardShareModal from "@/components/card-share-modal";
export default function EligibilityPage() {
  const router = useRouter();
  const params = useParams<{
    customerId: string;
  }>();
  const [agent, setAgent] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [eligibleCards, setEligibleCards] = useState<CreditCardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareModalCard, setShareModalCard] = useState<CreditCardType | null>(null);
  useEffect(() => {
    // Check if user is logged in
    const isBrowser = typeof window !== 'undefined';
    const agentData = isBrowser ? localStorage.getItem("salesAgent") : null;
    if (!agentData) {
      router.push("/");
      return;
    }
    setAgent(JSON.parse(agentData));

    // Fetch customer data via API
    const fetchCustomerData = async () => {
      try {
        const {
          customer: customerData
        } = await customersApi.getById(params.customerId);
        if (!customerData) {
          toast.error("Customer not found");
          router.push("/dashboard");
          return;
        }
        setCustomer(customerData);

        // Get eligible cards
        const cibilScore = customerData.cibilScore ?? 0;
        if (cibilScore > 0) {
          const {
            eligibleCards
          } = await creditCardsApi.getEligible(cibilScore);
          setEligibleCards(eligibleCards);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error("Failed to load customer data");
        router.push("/dashboard");
      }
    };
    fetchCustomerData();

    // Subscribe to real-time updates for customers and credit cards
    const customerUnsubscribe = supabaseApi.subscribeToTable('customers', payload => {
      if (payload.new && payload.new.id.toString() === params.customerId) {
        console.log('Customer data changed:', payload);
        fetchCustomerData();
      }
    });
    const cardsUnsubscribe = supabaseApi.subscribeToTable('credit_cards', () => {
      // If customer has a CIBIL score, refresh eligible cards when credit card data changes
      if (customer?.cibilScore) {
        creditCardsApi.getEligible(customer.cibilScore).then(({
          eligibleCards
        }) => {
          setEligibleCards(eligibleCards);
        });
      }
    });

    // Clean up subscriptions on unmount
    return () => {
      customerUnsubscribe();
      cardsUnsubscribe();
    };
  }, [params.customerId, router, customer?.cibilScore]);
  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]);
  };
  const handleWhatsAppShare = async () => {
    if (!agent || !customer || selectedCards.length === 0) return;
    setIsSharing(true);
    try {
      // Get selected card details
      const selectedCardDetails = eligibleCards.filter(card => selectedCards.includes(card._id));

      // Format WhatsApp message
      const message = formatWhatsAppMessage(customer.name, selectedCardDetails);

      // Share via WhatsApp
      const shareUrl = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${shareUrl}`, '_blank');

      // Log the activity via API
      await logsApi.create({
        action: "card_shared",
        customerId: customer._id,
        customerName: customer.name,
        sharedCards: selectedCards,
        details: {
          messageContent: message,
          sharedVia: "whatsapp"
        },
        _id: "",
        // Will be assigned by MongoDB
        createdAt: "",
        updatedAt: ""
      });

      toast.success("Cards shared via WhatsApp successfully");
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
      toast.error("Failed to share cards via WhatsApp");
    } finally {
      setIsSharing(false);
    }
  };

  // Handler for showing the share modal for a single card
  const handleShareSingleCard = (card: CreditCardType) => {
    setShareModalCard(card);
  };
  
  // Handler for completing the share process
  const handleShareSuccess = async (card: CreditCardType) => {
    if (!agent || !customer) return;
    
    try {
      // Log the activity
      await logsApi.create({
        action: "card_shared",
        customerId: customer._id,
        customerName: customer.name,
        sharedCards: [card._id],
        details: {
          sharedVia: "whatsapp_single"
        },
        _id: "",
        createdAt: "",
        updatedAt: ""
      });
      
      setShareModalCard(null);
      toast.success(`${card.name} shared successfully`);
    } catch (error) {
      console.error("Error logging card share:", error);
    }
  };
  const formatWhatsAppMessage = (customerName: string, cards: CreditCardType[]): string => {
    const header = `Hello ${customerName},\n\nHere are the best credit cards for you:\n\n`;
    const cardDetails = cards.map(card => {
      // Format each card with a nice structure
      const cardDetail = `*${card.name}*\n`;
      const benefits = card.benefits.slice(0, 3).map(b => `✅ ${b}`).join('\n');
      const annualFee = `💳 Annual Fee: ₹${card.annualFee.toLocaleString('en-IN')}`;
      const applyLink = `🔗 Apply now: ${card.utmLink}`;
      
      return `${cardDetail}${benefits}\n${annualFee}\n${applyLink}`;
    }).join("\n\n");
    
    const footer = "\nReply to this message or call us if you have any questions.";
    return header + cardDetails + footer;
  };
  if (!customer) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12">
    {/* Share Modal */}
    {shareModalCard && customer && (
      <CardShareModal 
        card={shareModalCard} 
        customer={customer}
        onClose={() => setShareModalCard(null)}
        onShareSuccess={() => handleShareSuccess(shareModalCard)}
      />
    )}
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100">
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
                <span className={cn("text-lg font-semibold", (customer.cibilScore ?? 0) >= 750 ? "text-green-600" : (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" : (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" : (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600")}>
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {customer.cibilScore >= 750 ? "Excellent" : customer.cibilScore >= 700 ? "Good" : customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50">
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
                      <button type="button" onClick={() => router.push(`/dashboard/customer-form`)} className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        Update Customer Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>
        
        {/* Credit Card Eligibility */}
        {customer.cibilScore && customer.cibilScore > 0 ? <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {eligibleCards.length > 0 ? `Eligible Credit Cards (${eligibleCards.length})` : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? <>
                <div className="space-y-6">
                  {eligibleCards.map(card => <div key={card._id} className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-all", selectedCards.includes(card._id) ? "border-2 border-blue-500" : "border border-gray-200")}>
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center">
                          <div className="relative h-40 w-64 md:h-full md:w-full">
                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover rounded-md" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {card.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {card.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </span>)}
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
                              {card.benefits.map((benefit, index) => <li key={index} className="flex items-start">
                                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                                  <span className="text-sm text-gray-600">{benefit}</span>
                                </li>)}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex items-center space-x-3">
                            <button onClick={() => handleSelectCard(card._id)} className={cn("inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", selectedCards.includes(card._id) ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")}>
                              {selectedCards.includes(card._id) ? <>
                                  <CheckCircle className="h-4 w-4 mr-2" /> Selected
                                </> : "Select Card"}
                            </button>
                            <button 
                              onClick={() => handleShareSingleCard(card)} 
                              className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                              </svg>
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                
                {/* WhatsApp Share Button */}
                <div className="mt-8 flex justify-center">
                  {customer && (
                    <WhatsAppShareButton
                      message={formatWhatsAppMessage(customer.name, eligibleCards.filter(card => selectedCards.includes(card._id)))}
                      onShareSuccess={() => {
                        // Log activity after successful share
                        logsApi.create({
                          action: "card_shared",
                          customerId: customer._id,
                          customerName: customer.name,
                          sharedCards: selectedCards,
                          details: {
                            sharedVia: "whatsapp_bulk"
                          },
                          _id: "",
                          createdAt: "",
                          updatedAt: ""
                        }).catch(error => console.error("Error logging share:", error));
                      }}
                      className={selectedCards.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
                      disabled={selectedCards.length === 0}
                      size="lg"
                    >
                      {selectedCards.length > 0 ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Share {selectedCards.length} {selectedCards.length === 1 ? "Card" : "Cards"} via WhatsApp
                        </>
                      ) : (
                        <>Select cards to share</>
                      )}
                    </WhatsAppShareButton>
                  )}
                </div>
              </> : <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Eligible Cards Found
                </h3>
                <p className="text-gray-600 mb-6">
                  The customer does not qualify for any cards based on their current CIBIL score ({customer.cibilScore}).
                </p>
                <button onClick={() => router.push("/dashboard")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>}
          </> : <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              CIBIL Score Required
            </h3>
            <p className="text-gray-600 mb-6">
              Please update the customer information with a valid CIBIL score to check credit card eligibility.
            </p>
            <button onClick={() => router.push(`/dashboard/customer-form`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Update Customer Information
            </button>
          </div>}
      </main>
    </div>;
}
