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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="137fdf18-1ecc-4331-9e54-321c1f5a8367" data-loc="174:11-174:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="00bec2a6-de83-4288-8eeb-41137524ee78" data-loc="175:8-175:99" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="933d42ef-dd24-465c-a846-369e6c81ca1b" data-loc="178:9-178:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
    {/* Share Modal */}
    {shareModalCard && customer && <CardShareModal card={shareModalCard} customer={customer} onClose={() => setShareModalCard(null)} onShareSuccess={() => handleShareSuccess(shareModalCard)} />}
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="379c2700-ef84-47e9-81ab-6a22efba9fe3" data-loc="182:6-182:42" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="bb4f6db4-9b41-4441-a553-4554d32eb0bf" data-loc="183:8-183:61" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="flex items-center" data-unique-id="efefbcd2-ebbe-4ffd-8c6a-a807a81ae9fd" data-loc="184:10-184:45" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="04e3dff3-7476-48f3-b665-55613fc68e33" data-loc="185:12-185:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="5b41baa9-e90c-4540-9714-8bbfce21de54" data-loc="188:12-188:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Card Eligibility for {customer.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" data-unique-id="17878d62-325b-4189-98ea-3ffa6738c779" data-loc="196:6-196:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        {/* Customer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-unique-id="00e40e8b-13cb-4c6e-af5e-90aad52a48ea" data-loc="198:8-198:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="2a91a066-db18-4211-ae55-db18fa09761a" data-loc="199:10-199:65" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div data-unique-id="4e5abe36-4350-4dc7-951c-2d37aa07a1e8" data-loc="200:12-200:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="159f70ac-bf4e-4c31-96c2-4e76c8512d7e" data-loc="201:14-201:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="ff010bad-c9a7-451b-af9b-2e24d307b7d7" data-loc="202:14-202:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.name}</p>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="eeeda494-9033-4b19-bfc9-bce3d3071b48" data-loc="203:14-203:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.phone}</p>
            </div>
            
            <div data-unique-id="66df0528-658e-4e30-980d-8bbae533a94d" data-loc="206:12-206:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="48343488-21c0-4a41-8aee-bc6dfdf6d573" data-loc="207:14-207:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">CIBIL Score</h3>
              <div className="mt-1 flex items-center" data-unique-id="deb29b65-9cd7-42e6-99e5-ee50ffc4b07f" data-loc="208:14-208:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <span className={cn("text-lg font-semibold", (customer.cibilScore ?? 0) >= 750 ? "text-green-600" : (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" : (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" : (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600")} data-unique-id="c766638c-00a7-4e1b-b3ca-688ed008c9e9" data-loc="209:16-209:294" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800" data-unique-id="520e50d1-739a-4909-82b8-f119dcd14736" data-loc="213:40-213:154" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {customer.cibilScore >= 750 ? "Excellent" : customer.cibilScore >= 700 ? "Good" : customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>}
              </div>
            </div>
            
            <div data-unique-id="b2e22a26-7437-42d7-83ad-8d104009c7e6" data-loc="219:12-219:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="5a69a51b-1446-411d-a811-07cbb2d2dfaf" data-loc="220:14-220:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="be5a7637-0508-45bd-8426-699879280ec2" data-loc="221:14-221:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50" data-unique-id="ac0059ad-2346-4f3c-9b46-5d309f1861fe" data-loc="227:35-227:110" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <div className="flex items-start" data-unique-id="6c55f8ba-8c91-46c6-9ca6-61cc3f8805cc" data-loc="228:14-228:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex-shrink-0" data-unique-id="31dfcb41-0ea4-4b0c-b68e-beb11571323f" data-loc="229:16-229:47" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3" data-unique-id="553e5059-ecef-4590-a864-85989c0bd5d7" data-loc="232:16-232:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <h3 className="text-sm font-medium text-yellow-800" data-unique-id="9d498bc6-e31f-4286-bf5f-8237dab4c6eb" data-loc="233:18-233:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Missing CIBIL Score</h3>
                  <div className="mt-1 text-sm text-yellow-700" data-unique-id="17775afa-57c1-44c2-8684-9af65f7cf109" data-loc="234:18-234:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <p data-unique-id="d0d3aef4-054d-43c2-bc9e-0c07cd11af3a" data-loc="235:20-235:23" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Please enter a CIBIL score to check card eligibility.</p>
                  </div>
                  <div className="mt-4" data-unique-id="db95bbd7-bb5e-40e4-ab0b-aa5963b9cdb5" data-loc="237:18-237:40" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <div className="flex space-x-4" data-unique-id="d1fcf71b-2d8d-4aa8-8d78-e79f9927b142" data-loc="238:20-238:52" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <button type="button" onClick={() => router.push(`/dashboard/customer-form`)} className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500" data-unique-id="ebdec4ef-ad6e-42ed-9e21-07298c9d3b1c" data-loc="239:22-239:243" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4" data-unique-id="af59ed34-bac9-43bd-b1d1-380c0ea52848" data-loc="251:12-251:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              {eligibleCards.length > 0 ? `Eligible Credit Cards (${eligibleCards.length})` : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? <>
                <div className="space-y-6" data-unique-id="f9d89296-f35c-4a46-9d16-122c464946a2" data-loc="256:16-256:43" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {eligibleCards.map(card => <div key={card._id} className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-all", selectedCards.includes(card._id) ? "border-2 border-blue-500" : "border border-gray-200")} data-unique-id="42371588-d739-4b6a-8bf7-ffa3cc9bf6a0" data-loc="257:45-257:234" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-4" data-unique-id="e9aaa5c5-6e09-4ddf-8768-43f17fd5ab08" data-loc="258:22-258:71" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center" data-unique-id="9b35bff8-228f-4087-982c-3b0ef6845735" data-loc="259:24-259:103" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="relative h-40 w-64 md:h-full md:w-full" data-unique-id="bbdcc20a-3244-4b89-8ceb-e1e91b9748d5" data-loc="260:26-260:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover rounded-md" data-unique-id="e3b6a370-58a2-4fb9-97f5-5e85b80d3d1a" data-loc="261:28-261:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6" data-unique-id="d4c6145d-d8e6-49bd-bc76-b8ce06a5637c" data-loc="265:24-265:59" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="flex flex-col md:flex-row justify-between" data-unique-id="7fc851a8-0901-4cf4-a103-78478c0b7601" data-loc="266:26-266:85" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <div data-unique-id="8c982edc-00d8-433a-8614-7e59107d2de5" data-loc="267:28-267:33" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <h3 className="text-lg font-semibold text-gray-900" data-unique-id="37cc7bd3-1385-4ef0-b790-a731cbded9ec" data-loc="268:30-268:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="32e15679-41f7-4c0d-8932-3418f35c975e" data-loc="272:30-272:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="5eb54836-4ac5-44d1-8d12-e0bdde8ac69a" data-loc="273:63-273:191" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                    <Tag className="w-3 h-3 mr-1" data-unique-id={`102cd7f9-55fd-491b-8f8d-d1fce35a37ad_${index}`} data-loc="274:36-274:68" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                    {tag}
                                  </span>)}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0" data-unique-id="dd6aded6-3096-4cad-b160-01d925314b14" data-loc="280:28-280:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <div className="flex items-center text-sm text-gray-600" data-unique-id="744ba405-08be-4766-9724-02c205ac7c41" data-loc="281:30-281:87" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <CreditCard className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="3ce4246b-69bb-44e8-9c17-2084a64b4206" data-loc="283:32-283:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Min. CIBIL: {card.minCibilScore}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 mt-1" data-unique-id="5bd09ec3-356b-422a-8d95-a301cf2b70f0" data-loc="286:30-286:92" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <DollarSign className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="a271f85a-9cf9-4707-83a4-480f06962ed5" data-loc="288:32-288:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Annual Fee: ₹{card.annualFee}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4" data-unique-id="c3b47eed-5d2b-4d26-aee8-621f16ca30ed" data-loc="293:26-293:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="62cf6fe6-8414-451d-9216-b086ff6d405d" data-loc="294:28-294:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Key Benefits:</h4>
                            <ul className="space-y-1" data-unique-id="57aebb06-1c84-44c2-a2cb-37d1e46468b1" data-loc="295:28-295:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {card.benefits.map((benefit, index) => <li key={index} className="flex items-start" data-unique-id="3034e926-f1d4-45af-8e44-4a716c52556f" data-loc="296:69-296:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" data-unique-id={`fa47edf0-d248-49a0-84c9-0b13460f6f95_${index}`} data-loc="297:34-297:90" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                  <span className="text-sm text-gray-600" data-unique-id="2d195b24-8bac-40fe-8aa5-50ef51d6d8cd" data-loc="298:34-298:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{benefit}</span>
                                </li>)}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex items-center space-x-3" data-unique-id="4ec36a0a-5987-4698-8fdb-1d95fd8177ff" data-loc="303:26-303:76" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <button onClick={() => handleSelectCard(card._id)} className={cn("inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", selectedCards.includes(card._id) ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")} data-unique-id="c410844a-03a7-457d-ad88-b3f70166e2d8" data-loc="304:28-304:382" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {selectedCards.includes(card._id) ? <>
                                  <CheckCircle className="h-4 w-4 mr-2" /> Selected
                                </> : "Select Card"}
                            </button>
                            <button onClick={() => handleShareSingleCard(card)} className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="7c0fa990-b4cb-49f8-b5ee-b77a680d5c79" data-loc="309:28-309:301" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" data-unique-id="656d134a-ad58-4fa6-9576-647cd74b61b9" data-loc="310:30-310:135" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
                <div className="mt-8 flex justify-center" data-unique-id="abd2b90c-44aa-4864-93ad-e7cc34109473" data-loc="322:16-322:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="a11dfbd7-32aa-4228-8549-9768ede2f142" data-loc="339:26-339:131" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Share {selectedCards.length} {selectedCards.length === 1 ? "Card" : "Cards"} via WhatsApp
                        </> : <>Select cards to share</>}
                    </WhatsAppShareButton>}
                </div>
              </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="e0bfe2c2-1632-40b0-9b6c-c52ec54c8f46" data-loc="346:20-346:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex justify-center mb-4" data-unique-id="79b6192d-cb0b-4eac-a0e3-62a926f7af8c" data-loc="347:16-347:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="ee808f4d-8eca-44d9-b8a0-bcbf2702113b" data-loc="350:16-350:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  No Eligible Cards Found
                </h3>
                <p className="text-gray-600 mb-6" data-unique-id="0b348206-01fe-4df8-b50c-85635219dbf7" data-loc="353:16-353:50" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  The customer does not qualify for any cards based on their current CIBIL score ({customer.cibilScore}).
                </p>
                <button onClick={() => router.push("/dashboard")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="4398d524-5fec-4521-b92a-1a49309b3c95" data-loc="356:16-356:293" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>}
          </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="a4a470fa-3334-4cf4-9c7e-316494d05d07" data-loc="361:16-361:79" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div className="flex justify-center mb-4" data-unique-id="dc370c29-640a-4710-b491-30aa7a46031c" data-loc="362:12-362:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="4868eb09-151c-406e-9651-a7ee598b043c" data-loc="365:12-365:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              CIBIL Score Required
            </h3>
            <p className="text-gray-600 mb-6" data-unique-id="2f3c2fb5-2581-4583-8677-07294a90b281" data-loc="368:12-368:46" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Please update the customer information with a valid CIBIL score to check credit card eligibility.
            </p>
            <button onClick={() => router.push(`/dashboard/customer-form`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="be11428d-3215-4b72-a16a-29241bee308c" data-loc="371:12-371:303" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Update Customer Information
            </button>
          </div>}
      </main>
    </div>;
}