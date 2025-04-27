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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="c3b410fa-a0ad-441b-9737-f51f7ca55062" data-loc="137:11-137:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="82f45cbb-39e6-4831-b67f-3c50544ac240" data-loc="138:8-138:99" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="e7d0e058-0dfd-4382-b40f-a869f22649bc" data-loc="141:9-141:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="5acdd764-a683-4968-a695-d77090baec4b" data-loc="143:6-143:42" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="f043247a-72c5-4937-b91b-58ba1eeaf515" data-loc="144:8-144:61" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="flex items-center" data-unique-id="4c354968-9392-4066-9e30-6fec5c3988fb" data-loc="145:10-145:45" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="7f758fb4-1e24-4f38-9e17-dcb0140780cf" data-loc="146:12-146:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="0a0cdef7-3574-4bb5-8253-3ebfae4540fb" data-loc="149:12-149:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Card Eligibility for {customer.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" data-unique-id="722e394e-d8ad-4c7e-a381-91446baa3605" data-loc="157:6-157:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        {/* Customer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-unique-id="b39f075f-5352-4a10-b761-7fedaeca2279" data-loc="159:8-159:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="e57ac954-1de9-4603-8ba0-75ab7fd1a422" data-loc="160:10-160:65" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div data-unique-id="29698f9f-5f2f-4baf-88cb-40b4401a9908" data-loc="161:12-161:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="7ec37888-edac-4606-add0-234c1d2652c0" data-loc="162:14-162:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="f0e735e9-b579-4d72-9ee1-13b302e1b3dd" data-loc="163:14-163:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.name}</p>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="462c3c51-83f8-4120-85e8-81c4dd723dbf" data-loc="164:14-164:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.phone}</p>
            </div>
            
            <div data-unique-id="f42ee5f3-b73e-4848-83f9-f6e80fd35d07" data-loc="167:12-167:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="56d604e2-7a36-49f4-aefa-bf1bc7da600b" data-loc="168:14-168:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">CIBIL Score</h3>
              <div className="mt-1 flex items-center" data-unique-id="16828e20-04a9-486a-820a-0400478d2100" data-loc="169:14-169:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <span className={cn("text-lg font-semibold", (customer.cibilScore ?? 0) >= 750 ? "text-green-600" : (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" : (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" : (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600")} data-unique-id="cc70a121-8eba-44b6-9bd2-6562df8e432c" data-loc="170:16-170:294" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800" data-unique-id="7bfd5154-2414-45de-9b22-94adf0d690e6" data-loc="174:40-174:154" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {customer.cibilScore >= 750 ? "Excellent" : customer.cibilScore >= 700 ? "Good" : customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>}
              </div>
            </div>
            
            <div data-unique-id="1a920959-a613-4d63-8ce2-108c16ebb10f" data-loc="180:12-180:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="021ed283-e928-4cb6-b891-ac5f227d8c8d" data-loc="181:14-181:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="f80318cd-7fdc-4fc9-8157-ea4ecb8e1686" data-loc="182:14-182:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50" data-unique-id="751383e8-79ce-4d16-8c7f-cdaa70a62a92" data-loc="188:35-188:110" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <div className="flex items-start" data-unique-id="df9a29a7-766a-4a56-8b92-d0bdca6e156c" data-loc="189:14-189:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex-shrink-0" data-unique-id="2de74fcf-ed1d-408b-9565-81eacdad15eb" data-loc="190:16-190:47" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3" data-unique-id="91056f1c-e8f9-41b2-ba16-ae3f308309ea" data-loc="193:16-193:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <h3 className="text-sm font-medium text-yellow-800" data-unique-id="66957189-04e8-4dfe-ba87-e28b9436fdb7" data-loc="194:18-194:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Missing CIBIL Score</h3>
                  <div className="mt-1 text-sm text-yellow-700" data-unique-id="8b35997d-f0a2-4c37-828f-8608e7bdbadf" data-loc="195:18-195:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <p data-unique-id="8116c68b-148e-417f-b855-4fdee237098a" data-loc="196:20-196:23" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Please enter a CIBIL score to check card eligibility.</p>
                  </div>
                  <div className="mt-4" data-unique-id="23fdb630-b17d-4003-ae03-a4a0b8474c34" data-loc="198:18-198:40" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <div className="flex space-x-4" data-unique-id="185edb17-97f2-4062-a19a-ab983c95725a" data-loc="199:20-199:52" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <button type="button" onClick={() => router.push(`/dashboard/customer-form`)} className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500" data-unique-id="1cfc34cf-3f3f-4d54-8bb5-55a4260c190e" data-loc="200:22-200:243" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4" data-unique-id="b26952a1-2e65-446a-86fe-6bed4141b054" data-loc="212:12-212:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              {eligibleCards.length > 0 ? `Eligible Credit Cards (${eligibleCards.length})` : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? <>
                <div className="space-y-6" data-unique-id="ea4e99d5-17c2-4b3a-95c8-4396890e4093" data-loc="217:16-217:43" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {eligibleCards.map(card => <div key={card._id} className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-all", selectedCards.includes(card._id) ? "border-2 border-blue-500" : "border border-gray-200")} data-unique-id="921e1b79-c6f5-41f0-98f5-b21e2d438088" data-loc="218:45-218:234" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-4" data-unique-id="35ab5afa-a445-44c6-bf99-1578a8b78489" data-loc="219:22-219:71" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center" data-unique-id="e6b71b20-0c46-494e-b432-f07a75d0edd2" data-loc="220:24-220:103" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="relative h-40 w-64 md:h-full md:w-full" data-unique-id="6307a8d4-7991-43bd-8490-817797f277e8" data-loc="221:26-221:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover rounded-md" data-unique-id="3404a4b8-925b-46c1-ae31-5fa01e183b1c" data-loc="222:28-222:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6" data-unique-id="685df1a5-6913-412a-b4c0-929c4533c322" data-loc="226:24-226:59" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="flex flex-col md:flex-row justify-between" data-unique-id="a7516800-eb81-49e0-a21d-5a794c1bf83c" data-loc="227:26-227:85" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <div data-unique-id="4904a8fc-14c4-4d86-9a6b-17bf56e62e1c" data-loc="228:28-228:33" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <h3 className="text-lg font-semibold text-gray-900" data-unique-id="dc6cfa73-cb31-44dd-8b7b-4ea67fbffa7e" data-loc="229:30-229:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.name}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="28306262-5196-4d8c-8b7d-281edeef2fcd" data-loc="233:30-233:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                {card.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="75db1957-f576-4097-8e3d-0bb626962892" data-loc="234:63-234:191" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                    <Tag className="w-3 h-3 mr-1" data-unique-id={`98e9bc99-5114-41fc-89e7-1f61efe685ef_${index}`} data-loc="235:36-235:68" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                    {tag}
                                  </span>)}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0" data-unique-id="e65f5d20-9cd3-484b-bf44-34ee2b13bbaf" data-loc="241:28-241:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <div className="flex items-center text-sm text-gray-600" data-unique-id="329418e4-e98b-4148-a46a-24c1917d82c6" data-loc="242:30-242:87" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <CreditCard className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="a77a5f0d-d6b2-448f-a6af-aa43e250ffc2" data-loc="244:32-244:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Min. CIBIL: {card.minCibilScore}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600 mt-1" data-unique-id="41dd496f-746b-4837-a6db-47a7aaa15b35" data-loc="247:30-247:92" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                <DollarSign className="h-4 w-4 mr-1" /> 
                                <span data-unique-id="92a03f14-1a3d-4eb4-a82f-aeeee3291fde" data-loc="249:32-249:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Annual Fee: ₹{card.annualFee}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4" data-unique-id="684bc98c-f666-4ab8-9e73-f82bddc6bf41" data-loc="254:26-254:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <h4 className="text-sm font-medium text-gray-700 mb-2" data-unique-id="d03879f5-4f11-40cb-a604-0bb67974b30a" data-loc="255:28-255:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Key Benefits:</h4>
                            <ul className="space-y-1" data-unique-id="e23faea3-5ea3-432b-a246-34b1453afd90" data-loc="256:28-256:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              {card.benefits.map((benefit, index) => <li key={index} className="flex items-start" data-unique-id="a6fc8875-b201-459c-b50b-36758c6027b8" data-loc="257:69-257:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" data-unique-id={`547f40ce-71e1-4e25-a69e-f950e7758f0f_${index}`} data-loc="258:34-258:90" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                                  <span className="text-sm text-gray-600" data-unique-id="4af08490-5754-4ddc-9be4-586ea7095ca6" data-loc="259:34-259:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{benefit}</span>
                                </li>)}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex items-center" data-unique-id="94560c04-6644-45eb-ac19-359c1ca42d11" data-loc="264:26-264:66" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <button onClick={() => handleSelectCard(card._id)} className={cn("inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", selectedCards.includes(card._id) ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")} data-unique-id="cda747b7-ec46-45d0-bb3f-2c49d3e3ece6" data-loc="265:28-265:382" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
                <div className="mt-8 flex justify-center" data-unique-id="9da0d16d-7c24-417d-be13-c9538e15f669" data-loc="277:16-277:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <button onClick={handleWhatsAppShare} disabled={selectedCards.length === 0 || isSharing} className={cn("inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2", selectedCards.length > 0 && !isSharing ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-gray-400 cursor-not-allowed")} data-unique-id="c2b3e42c-b547-4e50-b27e-efed432322cf" data-loc="278:18-278:424" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {isSharing ? <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="a3dd6925-d69e-4736-84e6-bff287fad273" data-loc="280:24-280:151" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
              </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="1353f5ce-fff5-4798-8b6c-036be062fbd7" data-loc="291:20-291:83" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex justify-center mb-4" data-unique-id="f23b02da-8fe1-479a-b67b-02823248a4c1" data-loc="292:16-292:58" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="cc997741-1f9a-47b9-84d3-acde19a56fa6" data-loc="295:16-295:73" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  No Eligible Cards Found
                </h3>
                <p className="text-gray-600 mb-6" data-unique-id="a68c6a42-f3c8-4a71-9330-08758cc11bfc" data-loc="298:16-298:50" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  The customer does not qualify for any cards based on their current CIBIL score ({customer.cibilScore}).
                </p>
                <button onClick={() => router.push("/dashboard")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="c8722824-7b8e-4c08-95e1-fc499019a0be" data-loc="301:16-301:293" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>}
          </> : <div className="bg-white rounded-lg shadow-md p-8 text-center" data-unique-id="77991ed6-3f03-4009-869c-a763976c1cba" data-loc="306:16-306:79" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div className="flex justify-center mb-4" data-unique-id="b3218d21-682a-4147-a7ce-c79387038572" data-loc="307:12-307:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="24b4a041-5dee-48d9-96ee-668a08c047d1" data-loc="310:12-310:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              CIBIL Score Required
            </h3>
            <p className="text-gray-600 mb-6" data-unique-id="e0ae5608-faa6-407a-bbe4-bac859b42f9b" data-loc="313:12-313:46" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Please update the customer information with a valid CIBIL score to check credit card eligibility.
            </p>
            <button onClick={() => router.push(`/dashboard/customer-form`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="b21ee858-0689-473c-b1f9-dc35787c63c3" data-loc="316:12-316:303" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Update Customer Information
            </button>
          </div>}
      </main>
    </div>;
}