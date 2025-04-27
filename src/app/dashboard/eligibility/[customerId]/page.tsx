"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Tag, DollarSign, Star, Share, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Customer, CreditCard as CreditCardType } from "@/types";
import { cn } from "@/lib/utils";
import { customersApi, creditCardsApi, logsApi, supabaseApi } from "@/lib/api-service";
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

      // In a real app, this would call the Twilio API
      // For demo, we'll just log and simulate a successful send
      console.log("WhatsApp message to send:", message);

      // Log the activity via API
      await logsApi.create({
        action: "card_shared",
        customerId: customer._id,
        customerName: customer.name,
        sharedCards: selectedCards,
        details: {
          messageContent: message
        },
        _id: "",
        // Will be assigned by MongoDB
        createdAt: "",
        updatedAt: ""
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
    const cardDetails = cards.map(card => `*${card.name}*\n${card.benefits.join("\n")}\n${card.utmLink}\n`).join("\n");
    const footer = "\nReply to this message or call us if you have any questions.";
    return header + cardDetails + footer;
  };
  if (!customer) {
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="b8db596a-a93c-429a-9c45-020b3ba7bdb4" data-loc="137:11-137:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="3849d5f1-ab3f-4c63-b3c4-11277c7d06b4" data-loc="138:8-138:99" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="7c1a56c3-50bb-4d45-9e1a-6fe01a7ae837" data-loc="141:9-141:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="82737dd7-2106-430e-85ae-6c64272ee662" data-loc="143:6-143:42" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="f4288fec-d010-4570-9e76-d1549441cb14" data-loc="144:8-144:61" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="flex items-center" data-unique-id="5c38f60c-9e69-4e08-82bd-2034573b163b" data-loc="145:10-145:45" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="57073623-6a2b-487f-b970-ca9da2ddecee" data-loc="146:12-146:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="106ae3a4-673f-45d2-9bb5-11e445f331d0" data-loc="149:12-149:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Card Eligibility for {customer.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" data-unique-id="dc434d65-7f2c-4dc1-9a29-33fd10d40eaf" data-loc="157:6-157:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        {/* Customer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-unique-id="6d78995c-55d4-4889-9684-585296e56dd2" data-loc="159:8-159:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="e363fc2a-620b-4327-aff0-a4f7353023ec" data-loc="160:10-160:65" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div data-unique-id="6721791d-0c97-4111-845d-581fe07af655" data-loc="161:12-161:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="a981e9de-c9a8-49e9-a010-3a9f9b22e9fb" data-loc="162:14-162:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="e63d458a-0d57-4fbf-8f15-d6910ef44bf9" data-loc="163:14-163:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.name}</p>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="0f311c77-fdc2-4e4c-bcb5-d475f6c8fbea" data-loc="164:14-164:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.phone}</p>
            </div>
            
            <div data-unique-id="b264fa30-d203-4591-8a23-3dff149e86cf" data-loc="167:12-167:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="7e990442-72ef-44d3-8fc0-b444e51242fb" data-loc="168:14-168:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">CIBIL Score</h3>
              <div className="mt-1 flex items-center" data-unique-id="938081dc-6b25-439a-84ed-6e2c969dd9dc" data-loc="169:14-169:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <span className={cn("text-lg font-semibold", (customer.cibilScore ?? 0) >= 750 ? "text-green-600" : (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" : (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" : (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600")} data-unique-id="2df8580c-2685-4084-af94-cc118d8d5472" data-loc="170:16-170:294" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800" data-unique-id="254c206f-1ea2-4f00-9d7f-092f6d9bf58f" data-loc="174:40-174:154" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {customer.cibilScore >= 750 ? "Excellent" : customer.cibilScore >= 700 ? "Good" : customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>}
              </div>
            </div>
            
            <div data-unique-id="b141b9a7-3680-4073-a881-bf506974b190" data-loc="180:12-180:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="6ab5469e-4ff8-42b5-b6c9-96b0a877e6d1" data-loc="181:14-181:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="8cef28cd-37d2-4dcf-a62f-e2fc2677482e" data-loc="182:14-182:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50" data-unique-id="6be7ccbd-b8b3-46e9-b48c-6c3199b5ba5b" data-loc="188:35-188:110" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <div className="flex items-start" data-unique-id="ad368c02-13c1-4060-9a60-fed5b08d8fda" data-loc="189:14-189:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex-shrink-0" data-unique-id="f30ad850-7970-4841-8a03-4276fce5671c" data-loc="190:16-190:47" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3" data-unique-id="266121d6-ddfb-4976-93fd-042036cbead7" data-loc="193:16-193:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <h3 className="text-sm font-medium text-yellow-800" data-unique-id="545fbc93-2ecb-4923-aa04-c6db54812a61" data-loc="194:18-194:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Missing CIBIL Score</h3>
                  <div className="mt-1 text-sm text-yellow-700" data-unique-id="31b3c68d-13af-4aa6-af20-19801fa0b1a6" data-loc="195:18-195:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <p data-unique-id="cfcdacc8-b74f-4138-9d59-38b0e6a7b0d6" data-loc="196:20-196:23" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Please enter a CIBIL score to check card eligibility.</p>
                  </div>
                  <div className="mt-4" data-unique-id="17998daf-fb11-4dc7-a2cf-345644490a31" data-loc="198:18-198:40" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <div className="flex space-x-4" data-unique-id="d601e4b8-7eea-486a-aa2b-47dbd7dd092d" data-loc="199:20-199:52" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <button type="button" onClick={() => router.push(`/dashboard/customer-form`)} className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500" data-unique-id="5d4ddc70-e6f2-422c-b632-6358cfd14abb" data-loc="200:22-200:243" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4" data-unique-id="0a3cd270-36a6-465b-8aab-0ce495e1d058" data-loc="212:12-212:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              {eligibleCards.length > 0 ? `Eligible Credit Cards (${eligibleCards.length})` : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? <>
                <div className="space-y-6" data-unique-id="0fe4ac51-11ab-4f7f-8c0e-44c7056a213b" data-loc="217:16-217:43" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {eligibleCards.map(card => <div key={card._id} className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-all", selectedCards.includes(card._id) ? "border-2 border-blue-500" : "border border-gray-200")} data-unique-id="7e13c312-a31b-48a6-a789-06dec444f146" data-loc="218:45-218:234" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-4" data-unique-id="10983317-4d16-4dd0-a422-ff7bf35a32dd" data-loc="219:22-219:71" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center" data-unique-id="880bf3a6-0000-467b-841e-44e1cb104650" data-loc="220:24-220:103" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="relative h-40 w-64 md:h-full md:w-full" data-unique-id="155c353b-3bbf-42a5-a044-19749379f30a" data-loc="221:26-221:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover rounded-md" data-unique-id="803ab572-2d3a-4416-9646-0767c09b8361" data-loc="222:28-222:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6" data-unique-id="141ca4af-b049-47a0-b668-04b591458e61" data-loc="226:24-226:59" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="flex flex-col md:flex-row justify-between" data-unique-id="58ff3e44-c64a-4153-a296-943f122f34fc" data-loc="227:26-227:85" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <div data-unique-id="a7568451-07f5-466f-b98b-431dbeefe347" data-loc="228:28-228:33" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <h3 className="text-lg font-semibold text-gray-900" data-unique-id="38296f74-0365-4aec-bad4-c7b21ada30de" data-loc="229:30-229:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="d9c4440e-1e6e-4b5c-a481-68ed67e15345" data-loc="233:30-233:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="af57a9ab-40de-4529-9e67-d92188e42705" data-loc="234:63-234:191" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                    <Tag className="w-3 h-3 mr-1" data-unique-id={`6649f253-11bb-4b7d-b2bc-5009d768c6ba_${index}`} data-loc="235:36-235:68" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                    {tag}
                                  </span>)}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0" data-unique-id="ab558f68-a2bd-407d-8279-eae5ff2c7a12" data-loc="241:28-241:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <div className="flex items-center text-sm text-gray-600" data-unique-id="5bba34c7-f1bb-4170-9cf8-942c8737738f" data-loc="242:30-242:87" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <CreditCard className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="75f85c11-b90a-46ad-987c-0ba7bdcf93ce" data-loc="244:32-244:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Min. CIBIL: {card.minCibilScore}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 mt-1" data-unique-id="728fca8d-d108-400e-bcc7-161b7322c654" data-loc="247:30-247:92" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <DollarSign className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="e7388b19-9bf4-4533-8666-14e6b8dce2a4" data-loc="249:32-249:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Annual Fee: ₹{card.annualFee}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4" data-unique-id="2063ef80-e7e1-4f66-99fa-fa35aa344446" data-loc="254:26-254:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="fbc4c904-fe4d-4c3a-a8e6-a9d9088b132a" data-loc="255:28-255:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Key Benefits:</h4>
                            <ul className="space-y-1" data-unique-id="22945c30-56aa-49f5-ac75-450c550f4634" data-loc="256:28-256:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {card.benefits.map((benefit, index) => <li key={index} className="flex items-start" data-unique-id="3e046d8c-4157-42e4-b17f-cf1c5d2e9577" data-loc="257:69-257:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" data-unique-id={`f99004bc-9580-47c8-b2a7-ae554ab9e6b2_${index}`} data-loc="258:34-258:90" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                  <span className="text-sm text-gray-600" data-unique-id="14402f31-18b7-4903-b4cc-50b6564bc339" data-loc="259:34-259:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{benefit}</span>
                                </li>)}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex items-center" data-unique-id="a757d2db-1de2-4c07-8d5d-33d92e321dfa" data-loc="264:26-264:66" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <button onClick={() => handleSelectCard(card._id)} className={cn("inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", selectedCards.includes(card._id) ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")} data-unique-id="901e7cad-7375-4711-ab20-55e0319ffc4a" data-loc="265:28-265:382" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {selectedCards.includes(card._id) ? <>
                                  <CheckCircle className="h-4 w-4 mr-2" /> Selected
                                </> : "Select Card"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                
                {/* WhatsApp Share Button */}
                <div className="mt-8 flex justify-center" data-unique-id="272f1917-289c-49c5-9ea8-c0af23ed6a6e" data-loc="277:16-277:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <button onClick={handleWhatsAppShare} disabled={selectedCards.length === 0 || isSharing} className={cn("inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2", selectedCards.length > 0 && !isSharing ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-gray-400 cursor-not-allowed")} data-unique-id="093260de-e66c-4c6b-ae86-b9c379771c93" data-loc="278:18-278:424" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {isSharing ? <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="42733cae-f9f2-40fe-b63e-3d63b06a0931" data-loc="280:24-280:151" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sharing...
                      </> : <>
                        <Smartphone className="h-5 w-5 mr-2" />
                        Share {selectedCards.length} {selectedCards.length === 1 ? "Card" : "Cards"} via WhatsApp
                      </>}
                  </button>
                </div>
              </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="3f26f9c4-e238-4d1b-a3c4-e968911d4fc6" data-loc="291:20-291:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex justify-center mb-4" data-unique-id="88fbf777-e346-4fd9-a801-00efa5fbc3b5" data-loc="292:16-292:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="710f92b9-f279-4d8b-b94c-0d9faf25db08" data-loc="295:16-295:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  No Eligible Cards Found
                </h3>
                <p className="text-gray-600 mb-6" data-unique-id="91f89b5a-ea77-4ed3-b122-5c82d3237804" data-loc="298:16-298:50" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  The customer does not qualify for any cards based on their current CIBIL score ({customer.cibilScore}).
                </p>
                <button onClick={() => router.push("/dashboard")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="f6f6e7b2-bb46-4a4f-9a06-ebbc77aea457" data-loc="301:16-301:293" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>}
          </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="6055d3d0-fdda-40cc-9a87-0bb62df0301c" data-loc="306:16-306:79" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div className="flex justify-center mb-4" data-unique-id="a2825467-cc98-43d8-b47e-22363ce4649f" data-loc="307:12-307:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="7904a2db-c82e-4b67-9bf9-dc2b5b745606" data-loc="310:12-310:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              CIBIL Score Required
            </h3>
            <p className="text-gray-600 mb-6" data-unique-id="31432cd1-1504-4bba-b187-c041301e51a2" data-loc="313:12-313:46" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Please update the customer information with a valid CIBIL score to check credit card eligibility.
            </p>
            <button onClick={() => router.push(`/dashboard/customer-form`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="45f87614-7834-4b60-a1df-6a87df403e8f" data-loc="316:12-316:303" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Update Customer Information
            </button>
          </div>}
      </main>
    </div>;
}