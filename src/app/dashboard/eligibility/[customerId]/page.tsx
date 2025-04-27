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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="8076ec73-25e5-45fe-ac69-02a47ec71402" data-loc="174:11-174:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="b503407b-bf4b-4af8-9758-b060db30e178" data-loc="175:8-175:99" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="28934815-456b-4d1a-bddb-1a019fce698e" data-loc="178:9-178:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
    {/* Share Modal */}
    {shareModalCard && customer && <CardShareModal card={shareModalCard} customer={customer} onClose={() => setShareModalCard(null)} onShareSuccess={() => handleShareSuccess(shareModalCard)} />}
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="3a65ce25-2c91-4947-9e20-0c8c1305c72e" data-loc="182:6-182:42" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="abf8992c-7adc-4208-81d4-30218d017cb7" data-loc="183:8-183:61" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="flex items-center" data-unique-id="6f896ffc-c507-4845-8c6a-e88738ad1eb3" data-loc="184:10-184:45" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="63b2f8ef-1330-46ef-981b-cb55bfedf0f5" data-loc="185:12-185:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="cc5e15a1-83f5-4899-84a8-fbaeb0b3c87d" data-loc="188:12-188:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Card Eligibility for {customer.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" data-unique-id="3b11656b-d6a2-4af2-83e1-440d2fc529fc" data-loc="196:6-196:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        {/* Customer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-unique-id="e6b54d67-01c8-4311-98d8-7e53dfd00de3" data-loc="198:8-198:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="93e458b9-1d69-4909-a0c4-dd268a4a6656" data-loc="199:10-199:65" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div data-unique-id="8a563584-86f2-4a70-b777-62dcd534882c" data-loc="200:12-200:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="a4018aa1-bd83-4a0c-b527-85373b972f82" data-loc="201:14-201:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="6e75cea1-b3da-4237-ae97-a405d0a9e83e" data-loc="202:14-202:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.name}</p>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="15369b12-2e86-464e-88f2-eb819e187a60" data-loc="203:14-203:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.phone}</p>
            </div>
            
            <div data-unique-id="6e49d630-c27a-42f5-862f-b7a7c8e10f51" data-loc="206:12-206:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="8dd20633-eee4-4a9b-a8a3-903329c6e71b" data-loc="207:14-207:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">CIBIL Score</h3>
              <div className="mt-1 flex items-center" data-unique-id="8938086d-6cc2-4a7a-ab8c-65794572ea8e" data-loc="208:14-208:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <span className={cn("text-lg font-semibold", (customer.cibilScore ?? 0) >= 750 ? "text-green-600" : (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" : (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" : (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600")} data-unique-id="92b93b4a-a5b8-4641-8f04-f5df41c47df1" data-loc="209:16-209:294" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800" data-unique-id="8bebc6d1-2bb0-47fa-b35b-a5d34d4a7532" data-loc="213:40-213:154" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {customer.cibilScore >= 750 ? "Excellent" : customer.cibilScore >= 700 ? "Good" : customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>}
              </div>
            </div>
            
            <div data-unique-id="7b9ece6f-2485-4ac4-a8c3-9f14142039c7" data-loc="219:12-219:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="0a8db0fa-3b92-4c8e-88cf-5ea725dc4b5c" data-loc="220:14-220:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="6341e5c8-6e1f-4430-9319-4808604699ac" data-loc="221:14-221:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50" data-unique-id="cea2d478-7cbd-4a37-b10d-ec83e50d0bfd" data-loc="227:35-227:110" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <div className="flex items-start" data-unique-id="bbf1dea3-27d1-4e19-a294-d953fc13f91b" data-loc="228:14-228:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex-shrink-0" data-unique-id="3622eaca-fa61-4ce3-bb28-96fd29f31b60" data-loc="229:16-229:47" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3" data-unique-id="41c2d232-a6f6-4a41-a462-8e8ee921c07b" data-loc="232:16-232:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <h3 className="text-sm font-medium text-yellow-800" data-unique-id="3c32dda8-ea72-4ec3-b98a-2f2fa650dbfd" data-loc="233:18-233:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Missing CIBIL Score</h3>
                  <div className="mt-1 text-sm text-yellow-700" data-unique-id="483f4158-2cad-4217-aa3b-a3b7802b0448" data-loc="234:18-234:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <p data-unique-id="a29a7863-9b98-41d3-b87c-3c50d9dd68b0" data-loc="235:20-235:23" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Please enter a CIBIL score to check card eligibility.</p>
                  </div>
                  <div className="mt-4" data-unique-id="9bb2ec0c-c120-4070-a907-3e1c83651ee3" data-loc="237:18-237:40" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <div className="flex space-x-4" data-unique-id="3f4d7e90-5c49-4c5b-8c7d-44699a3c8a09" data-loc="238:20-238:52" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <button type="button" onClick={() => router.push(`/dashboard/customer-form`)} className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500" data-unique-id="3540dc61-36dc-4cb7-962b-ce33e17323da" data-loc="239:22-239:243" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4" data-unique-id="9497de19-2658-42fe-b6d2-732958620aec" data-loc="251:12-251:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              {eligibleCards.length > 0 ? `Eligible Credit Cards (${eligibleCards.length})` : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? <>
                <div className="space-y-6" data-unique-id="8b2bc052-eba9-4ef6-b049-e6ff7dc85952" data-loc="256:16-256:43" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {eligibleCards.map(card => <div key={card._id} className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-all", selectedCards.includes(card._id) ? "border-2 border-blue-500" : "border border-gray-200")} data-unique-id="e14a7444-f69c-446e-972e-e7394ab72dff" data-loc="257:45-257:234" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-4" data-unique-id="4f63d41b-9ad5-4e1d-ae5f-5fb2c0a6b595" data-loc="258:22-258:71" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center" data-unique-id="d2e432eb-f48b-4655-87ae-bacc154ea644" data-loc="259:24-259:103" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="relative h-40 w-64 md:h-full md:w-full" data-unique-id="f3b36ae2-ef65-496f-b1b8-b56f5b35bbbe" data-loc="260:26-260:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover rounded-md" data-unique-id="ffac25b2-69a5-420b-9d37-4c159094c25a" data-loc="261:28-261:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6" data-unique-id="a2640957-4f50-46e7-97cb-bf0c74ea0311" data-loc="265:24-265:59" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="flex flex-col md:flex-row justify-between" data-unique-id="373afa50-8f09-402d-8665-64af55416511" data-loc="266:26-266:85" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <div data-unique-id="d6519081-0ed7-4ee8-915f-c89068b7b262" data-loc="267:28-267:33" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <h3 className="text-lg font-semibold text-gray-900" data-unique-id="2ad23aac-b6bf-407a-99ef-36ce9367aa6f" data-loc="268:30-268:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="9a0a31ae-5c18-45af-9ad4-d2452c73dc79" data-loc="272:30-272:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="d27666db-7332-4006-a857-4a93aa3c2be0" data-loc="273:63-273:191" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                    <Tag className="w-3 h-3 mr-1" data-unique-id={`a1955f33-7953-4b6a-b0bf-1cd4f00a6291_${index}`} data-loc="274:36-274:68" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                    {tag}
                                  </span>)}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0" data-unique-id="1597c14f-d996-44c5-a48e-71ce4a604dff" data-loc="280:28-280:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <div className="flex items-center text-sm text-gray-600" data-unique-id="db8f79bc-45e0-4ee8-9fc4-fff4cdb61c4f" data-loc="281:30-281:87" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <CreditCard className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="73a1b78d-fd63-4a60-a7ef-47b427b345e9" data-loc="283:32-283:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Min. CIBIL: {card.minCibilScore}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 mt-1" data-unique-id="c7cb01ca-cd03-46df-a063-2e4529e40cf7" data-loc="286:30-286:92" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <DollarSign className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="e08a89ad-99c3-470f-a1fb-a6420da88c47" data-loc="288:32-288:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Annual Fee: ₹{card.annualFee}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4" data-unique-id="bd8e8e9b-5867-4910-8ede-de808f93911e" data-loc="293:26-293:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="9a0a23cb-bb41-4ab1-8f5a-51d9c027dabd" data-loc="294:28-294:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Key Benefits:</h4>
                            <ul className="space-y-1" data-unique-id="324b5958-8b03-46ca-b2a1-4de6d056a206" data-loc="295:28-295:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {card.benefits.map((benefit, index) => <li key={index} className="flex items-start" data-unique-id="046fbe07-1056-46cc-b297-68d03e259176" data-loc="296:69-296:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" data-unique-id={`adb7788c-5d69-4e1c-a118-412edea05829_${index}`} data-loc="297:34-297:90" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                  <span className="text-sm text-gray-600" data-unique-id="bb6d1672-2fc2-4836-99e9-63631df49adb" data-loc="298:34-298:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{benefit}</span>
                                </li>)}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex items-center space-x-3" data-unique-id="2ba9f4f0-297f-4e7a-8129-e5bf3feddbda" data-loc="303:26-303:76" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <button onClick={() => handleSelectCard(card._id)} className={cn("inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", selectedCards.includes(card._id) ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")} data-unique-id="4f907eee-c8a1-4b92-95cc-fa30f34a4e44" data-loc="304:28-304:382" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {selectedCards.includes(card._id) ? <>
                                  <CheckCircle className="h-4 w-4 mr-2" /> Selected
                                </> : "Select Card"}
                            </button>
                            <button onClick={() => handleShareSingleCard(card)} className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="f56a52f2-0c73-4227-b033-dab8c6e752ac" data-loc="309:28-309:301" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" data-unique-id="6c371bcf-1f98-4d36-b1bf-60b510c9ec44" data-loc="310:30-310:135" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
                <div className="mt-8 flex justify-center" data-unique-id="b33c9989-e06f-4411-b3e1-4dbb83e894bb" data-loc="322:16-322:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {customer && <WhatsAppShareButton message={formatWhatsAppMessage(customer.name, eligibleCards.filter(card => selectedCards.includes(card._id)))} onShareSuccess={() => {
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
            }} className={selectedCards.length === 0 ? "opacity-50 cursor-not-allowed" : ""} disabled={selectedCards.length === 0} size="lg">
                      {selectedCards.length > 0 ? <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="abb7d998-2055-454f-bd7f-763079235407" data-loc="339:26-339:131" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Share {selectedCards.length} {selectedCards.length === 1 ? "Card" : "Cards"} via WhatsApp
                        </> : <>Select cards to share</>}
                    </WhatsAppShareButton>}
                </div>
              </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="b0bddc18-974f-456c-b3ff-e8805b4b9f8d" data-loc="346:20-346:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex justify-center mb-4" data-unique-id="7cad0110-4b2d-4753-8097-f51adc413197" data-loc="347:16-347:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="3abb5baa-5481-415d-bf91-97b5cef9212d" data-loc="350:16-350:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  No Eligible Cards Found
                </h3>
                <p className="text-gray-600 mb-6" data-unique-id="adaf9646-fc56-4041-ad01-82f0b133ba01" data-loc="353:16-353:50" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  The customer does not qualify for any cards based on their current CIBIL score ({customer.cibilScore}).
                </p>
                <button onClick={() => router.push("/dashboard")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="2c32238c-a698-47d9-86a0-a5a9bb87361c" data-loc="356:16-356:293" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>}
          </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="8b27d7dc-ba67-4957-aebb-1b01392265a1" data-loc="361:16-361:79" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div className="flex justify-center mb-4" data-unique-id="427026cd-b35e-49d6-b1ca-b2c77f7da381" data-loc="362:12-362:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="23fe98eb-6ed5-4aa6-9d46-f4603365dcce" data-loc="365:12-365:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              CIBIL Score Required
            </h3>
            <p className="text-gray-600 mb-6" data-unique-id="7a55ed65-358c-4f0d-ba15-47da3c1225a3" data-loc="368:12-368:46" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Please update the customer information with a valid CIBIL score to check credit card eligibility.
            </p>
            <button onClick={() => router.push(`/dashboard/customer-form`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="126ab0bd-1fe5-4f2e-9328-f9ecb44ff762" data-loc="371:12-371:303" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Update Customer Information
            </button>
          </div>}
      </main>
    </div>;
}