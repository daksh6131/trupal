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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="4beb73c0-1997-4c71-9734-12019f6f47f3" data-loc="174:11-174:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="a658ef8a-1a6f-456f-af70-9e408808f6d6" data-loc="175:8-175:99" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="87d4655e-a082-4a00-8523-bb0a262d0ea7" data-loc="178:9-178:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
    {/* Share Modal */}
    {shareModalCard && customer && <CardShareModal card={shareModalCard} customer={customer} onClose={() => setShareModalCard(null)} onShareSuccess={() => handleShareSuccess(shareModalCard)} />}
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="e77f395f-ab3a-45ad-b788-e643ceeb417d" data-loc="182:6-182:42" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="36634472-deca-4d3e-8e81-df5827c3c1e0" data-loc="183:8-183:61" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="flex items-center" data-unique-id="66e06d3d-11f3-454c-a9af-20519c354843" data-loc="184:10-184:45" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="ba86d0b0-f98b-44cf-a916-4f65427a22c0" data-loc="185:12-185:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="bca69cad-7ee2-4c54-a9bb-5fdbb86393be" data-loc="188:12-188:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Card Eligibility for {customer.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" data-unique-id="02d9e39d-5dc5-40a2-8cb9-de057f6a3c70" data-loc="196:6-196:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        {/* Customer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-unique-id="9ac735c3-3ded-45db-9b52-29780095f752" data-loc="198:8-198:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="2ca27b66-4e48-4b3f-958a-997fcdb675e4" data-loc="199:10-199:65" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div data-unique-id="d57a389c-a614-44e2-a11c-dd4a93490690" data-loc="200:12-200:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="6b31825d-d002-4f09-8290-729a99349902" data-loc="201:14-201:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="9c5040cf-cdd3-4c0c-9f99-d3e3d1b5da77" data-loc="202:14-202:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.name}</p>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="1b7cab40-8ed9-4eca-9000-ab7bf5db8312" data-loc="203:14-203:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.phone}</p>
            </div>
            
            <div data-unique-id="123b4cef-08fe-47aa-95b6-3168d3558704" data-loc="206:12-206:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="5f4ad107-faca-48d5-aa98-6a6884ef2514" data-loc="207:14-207:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">CIBIL Score</h3>
              <div className="mt-1 flex items-center" data-unique-id="6de159a1-8d5c-428f-a614-72373206f686" data-loc="208:14-208:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <span className={cn("text-lg font-semibold", (customer.cibilScore ?? 0) >= 750 ? "text-green-600" : (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" : (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" : (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600")} data-unique-id="ba4bd0b4-bbe3-425a-b569-d06070d9be28" data-loc="209:16-209:294" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800" data-unique-id="88ad9261-ccf0-4312-8cf9-32eb057e7af3" data-loc="213:40-213:154" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {customer.cibilScore >= 750 ? "Excellent" : customer.cibilScore >= 700 ? "Good" : customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>}
              </div>
            </div>
            
            <div data-unique-id="4b9d6024-ed5f-446f-b204-9db0a283f91b" data-loc="219:12-219:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="3a85f597-3356-4fb9-a353-2fc32c43a832" data-loc="220:14-220:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="8dead581-d9da-400c-90e5-a59fee032464" data-loc="221:14-221:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50" data-unique-id="aab41f72-4026-428e-b568-f8b1d3697220" data-loc="227:35-227:110" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <div className="flex items-start" data-unique-id="ec9317fe-ad4c-4101-aec1-c327c2282de5" data-loc="228:14-228:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex-shrink-0" data-unique-id="e91c5cef-4f76-4b25-ae72-dee53ab941ff" data-loc="229:16-229:47" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3" data-unique-id="c1768ab0-6d85-4865-ad1d-d50932821860" data-loc="232:16-232:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <h3 className="text-sm font-medium text-yellow-800" data-unique-id="c16574a4-112f-49d5-910e-d25d15d83a73" data-loc="233:18-233:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Missing CIBIL Score</h3>
                  <div className="mt-1 text-sm text-yellow-700" data-unique-id="ec9b9a94-68d8-4338-adf9-c2e96f3443ce" data-loc="234:18-234:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <p data-unique-id="749a0997-41ed-445a-a92e-4f1d3476e2bb" data-loc="235:20-235:23" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Please enter a CIBIL score to check card eligibility.</p>
                  </div>
                  <div className="mt-4" data-unique-id="03186578-7686-4546-863e-afb9ecc785c5" data-loc="237:18-237:40" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <div className="flex space-x-4" data-unique-id="28ff264f-aaa1-48fa-a092-640ecba5f660" data-loc="238:20-238:52" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <button type="button" onClick={() => router.push(`/dashboard/customer-form`)} className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500" data-unique-id="d35cae96-4b60-44be-b3f7-1f3d80f2a4db" data-loc="239:22-239:243" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4" data-unique-id="b6347700-142b-43c0-a04a-d1c7f40f03e8" data-loc="251:12-251:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              {eligibleCards.length > 0 ? `Eligible Credit Cards (${eligibleCards.length})` : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? <>
                <div className="space-y-6" data-unique-id="8c8124a9-57d7-4847-8b95-2277192b4710" data-loc="256:16-256:43" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {eligibleCards.map(card => <div key={card._id} className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-all", selectedCards.includes(card._id) ? "border-2 border-blue-500" : "border border-gray-200")} data-unique-id="4e4baeb5-fc3a-46ba-aa0b-cc9fd1c117ab" data-loc="257:45-257:234" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-4" data-unique-id="cbe6ad19-d2fb-4054-a4a1-11497c3457dc" data-loc="258:22-258:71" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center" data-unique-id="055f3d02-604f-4e25-9810-1aba1c330b75" data-loc="259:24-259:103" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="relative h-40 w-64 md:h-full md:w-full" data-unique-id="c25d10ea-805e-4cb9-ac3d-7a11ea49d5be" data-loc="260:26-260:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover rounded-md" data-unique-id="f5dcc5b6-4843-482e-b3c4-ec7973d7d557" data-loc="261:28-261:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6" data-unique-id="0ac41928-72fc-40e1-b24a-aed6460b9a2c" data-loc="265:24-265:59" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="flex flex-col md:flex-row justify-between" data-unique-id="1e4ca940-9e32-4f32-bb1c-5c9818cada1a" data-loc="266:26-266:85" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <div data-unique-id="b7e31e36-fdba-43b5-9310-564b07aa2d53" data-loc="267:28-267:33" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <h3 className="text-lg font-semibold text-gray-900" data-unique-id="824583e5-b0c1-4f75-9a76-45f668fc1183" data-loc="268:30-268:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="3672a942-acc4-45d7-9ae9-ed9b292767d0" data-loc="272:30-272:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="383bc128-7421-4b24-8818-99bf1441d00d" data-loc="273:63-273:191" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                    <Tag className="w-3 h-3 mr-1" data-unique-id={`437a7610-e18b-40e3-b524-a60af008007e_${index}`} data-loc="274:36-274:68" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                    {tag}
                                  </span>)}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0" data-unique-id="8dca78b0-4c2f-479e-b4dd-4d17dbdf3ebd" data-loc="280:28-280:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <div className="flex items-center text-sm text-gray-600" data-unique-id="17701361-d0f1-4217-9803-ee7fafbb5de8" data-loc="281:30-281:87" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <CreditCard className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="da77323c-f3e1-476e-a1c6-83a2f4fb1f2b" data-loc="283:32-283:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Min. CIBIL: {card.minCibilScore}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 mt-1" data-unique-id="948bb49f-d7cc-4c04-86f9-80fbc886ff83" data-loc="286:30-286:92" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <DollarSign className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="be864ad0-4261-43e8-83c1-e10a0b60a075" data-loc="288:32-288:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Annual Fee: ₹{card.annualFee}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4" data-unique-id="6198d2fd-d505-4d59-85ab-0382d687c6a9" data-loc="293:26-293:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="eee0a7d7-f9d4-4bb2-9e06-f9531aed0f04" data-loc="294:28-294:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Key Benefits:</h4>
                            <ul className="space-y-1" data-unique-id="8580a9d0-d2f4-4ba0-a8d7-10e995f740a0" data-loc="295:28-295:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {card.benefits.map((benefit, index) => <li key={index} className="flex items-start" data-unique-id="0c83c443-78db-4596-98d4-6f75b4fd89fb" data-loc="296:69-296:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" data-unique-id={`13611bf4-fc9a-4e0e-9efb-ae344b35a8bc_${index}`} data-loc="297:34-297:90" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                  <span className="text-sm text-gray-600" data-unique-id="319584b9-d5c5-4aea-b823-1a285c7bd580" data-loc="298:34-298:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{benefit}</span>
                                </li>)}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex items-center space-x-3" data-unique-id="62af3975-a2e5-44d8-adf5-4d92d0ecff57" data-loc="303:26-303:76" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <button onClick={() => handleSelectCard(card._id)} className={cn("inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", selectedCards.includes(card._id) ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")} data-unique-id="1629b9c0-aae1-4855-8f13-155e25bbbbe5" data-loc="304:28-304:382" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {selectedCards.includes(card._id) ? <>
                                  <CheckCircle className="h-4 w-4 mr-2" /> Selected
                                </> : "Select Card"}
                            </button>
                            <button onClick={() => handleShareSingleCard(card)} className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="999275ce-a0b5-4e65-b8fa-47e217eee84e" data-loc="309:28-309:301" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" data-unique-id="fa76a1d2-0587-445c-98c0-c342d1ed9897" data-loc="310:30-310:135" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
                <div className="mt-8 flex justify-center" data-unique-id="5703b5d1-4401-4c0b-a061-a93b5a1c5ccb" data-loc="322:16-322:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="10f416bf-9441-4884-98a9-5eed5a5c6530" data-loc="339:26-339:131" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Share {selectedCards.length} {selectedCards.length === 1 ? "Card" : "Cards"} via WhatsApp
                        </> : <>Select cards to share</>}
                    </WhatsAppShareButton>}
                </div>
              </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="e2e18806-57f4-4afd-865a-a770ba417c29" data-loc="346:20-346:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex justify-center mb-4" data-unique-id="754badfa-60df-4a22-8918-9662eecd4f84" data-loc="347:16-347:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="69cb510b-6f0b-45f6-980a-844ea116c8f7" data-loc="350:16-350:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  No Eligible Cards Found
                </h3>
                <p className="text-gray-600 mb-6" data-unique-id="c46856e7-8a53-466b-bfa8-74daaad1b0c9" data-loc="353:16-353:50" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  The customer does not qualify for any cards based on their current CIBIL score ({customer.cibilScore}).
                </p>
                <button onClick={() => router.push("/dashboard")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="92000329-800f-4bc3-862d-6800cc97c9dc" data-loc="356:16-356:293" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>}
          </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="f080d047-a4c5-46df-b0b2-dc3ae5b7561b" data-loc="361:16-361:79" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div className="flex justify-center mb-4" data-unique-id="18872035-d0ff-4f57-a9b7-4c4ee2aa5f1e" data-loc="362:12-362:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="7983870c-62a6-4475-a4ea-c434a1b872a9" data-loc="365:12-365:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              CIBIL Score Required
            </h3>
            <p className="text-gray-600 mb-6" data-unique-id="7b597a39-621b-47e3-ac01-064a5a7a433f" data-loc="368:12-368:46" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Please update the customer information with a valid CIBIL score to check credit card eligibility.
            </p>
            <button onClick={() => router.push(`/dashboard/customer-form`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="3dc8f887-a8a4-457e-9135-7a2b4ed0736d" data-loc="371:12-371:303" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Update Customer Information
            </button>
          </div>}
      </main>
    </div>;
}