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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="0cb9a342-e483-4afa-b0a6-8dbe933412ab" data-loc="137:11-137:74" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="794dd8b2-d0d5-4bf4-ac4b-e7971d6c4299" data-loc="138:8-138:99" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="0b1fe4d6-8977-4dfe-87e4-9801c6ae23e1" data-loc="141:9-141:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="ae01f693-38d5-4640-b3b2-4d9f26ad4c59" data-loc="143:6-143:42" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="fdb96156-0276-492a-97fc-fb360d9416a4" data-loc="144:8-144:61" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="flex items-center" data-unique-id="d247e094-2eb3-44be-a03c-307c957eb468" data-loc="145:10-145:45" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="ee284344-e036-445e-a163-3a8196ed14ce" data-loc="146:12-146:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="b228b1c8-7be8-4981-803e-832a6452d444" data-loc="149:12-149:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              Card Eligibility for {customer.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" data-unique-id="dfd87ee9-90c4-4565-ab09-5df85ac7bc20" data-loc="157:6-157:60" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
        {/* Customer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-unique-id="c42e5033-dd4b-4ab8-ab4c-be00e41d278b" data-loc="159:8-159:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="c8e8bf55-b300-413e-9f20-70422b51ed60" data-loc="160:10-160:65" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
            <div data-unique-id="d8705a15-5242-4c64-9a9d-72ef2d0194fb" data-loc="161:12-161:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="59510a53-f574-4306-8f58-304a234a14ca" data-loc="162:14-162:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="0875d1d9-3093-4d9c-91ab-d11249902af2" data-loc="163:14-163:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.name}</p>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="175ed8d8-e079-40db-8671-451c77c18c2d" data-loc="164:14-164:56" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">{customer.phone}</p>
            </div>
            
            <div data-unique-id="feaf99ef-f1ad-49aa-9a3a-4ca0443e1389" data-loc="167:12-167:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="5910dd71-187a-4fd0-b660-12d2166efb21" data-loc="168:14-168:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">CIBIL Score</h3>
              <div className="mt-1 flex items-center" data-unique-id="ccc74a6b-1fa3-430a-b1cf-18f560ef2878" data-loc="169:14-169:54" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <span className={cn("text-lg font-semibold", (customer.cibilScore ?? 0) >= 750 ? "text-green-600" : (customer.cibilScore ?? 0) >= 700 ? "text-blue-600" : (customer.cibilScore ?? 0) >= 650 ? "text-yellow-600" : (customer.cibilScore ?? 0) > 0 ? "text-red-600" : "text-gray-600")} data-unique-id="055b1ad9-7361-4de3-87e6-1b65202e93ac" data-loc="170:16-170:294" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {customer.cibilScore ?? "Not Available"}
                </span>
                
                {customer.cibilScore && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800" data-unique-id="fee41dc1-4ce0-42d3-9c88-d227d70ba4d8" data-loc="174:40-174:154" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    {customer.cibilScore >= 750 ? "Excellent" : customer.cibilScore >= 700 ? "Good" : customer.cibilScore >= 650 ? "Fair" : "Poor"}
                  </span>}
              </div>
            </div>
            
            <div data-unique-id="6a2ec936-b724-49bb-a94e-c712475fd90b" data-loc="180:12-180:17" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <h3 className="text-sm font-medium text-gray-500" data-unique-id="8f96626c-ca09-48a3-aba5-3e383612c8f4" data-loc="181:14-181:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Monthly Income</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1" data-unique-id="3f38f5cf-44b1-42d3-8f8d-320c134ab4c7" data-loc="182:14-182:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                ₹{customer.salary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          {!customer.cibilScore && <div className="mt-6 p-4 border border-yellow-200 rounded-md bg-yellow-50" data-unique-id="0775733c-8d14-49ac-94d6-4e2f9438be96" data-loc="188:35-188:110" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              <div className="flex items-start" data-unique-id="f8aeb054-8dfe-49af-b061-3996a15064e6" data-loc="189:14-189:48" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                <div className="flex-shrink-0" data-unique-id="5fb2fef9-0523-4070-a318-0406307c8a77" data-loc="190:16-190:47" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3" data-unique-id="222f71e7-4628-4ca1-ad99-addd5ab27f0f" data-loc="193:16-193:38" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  <h3 className="text-sm font-medium text-yellow-800" data-unique-id="9558c3b4-0afd-4fa0-8b2c-999ee6e66e26" data-loc="194:18-194:70" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Missing CIBIL Score</h3>
                  <div className="mt-1 text-sm text-yellow-700" data-unique-id="def83440-c09e-47ec-addc-c260c1f02fb3" data-loc="195:18-195:64" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <p data-unique-id="a8f66677-8419-4381-8c22-9c7ecd3cff93" data-loc="196:20-196:23" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">Please enter a CIBIL score to check card eligibility.</p>
                  </div>
                  <div className="mt-4" data-unique-id="76b44af0-3b90-417d-9cb0-ef65acbf920d" data-loc="198:18-198:40" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                    <div className="flex space-x-4" data-unique-id="f5b59f95-1aa0-4be4-aa13-9d8284d31648" data-loc="199:20-199:52" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <button type="button" onClick={() => router.push(`/dashboard/customer-form`)} className="rounded-md px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500" data-unique-id="beba1361-b229-4de0-b863-080cc048bb88" data-loc="200:22-200:243" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4" data-unique-id="429dbf07-eff0-45db-aa36-1d11eb622862" data-loc="212:12-212:69" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
              {eligibleCards.length > 0 ? `Eligible Credit Cards (${eligibleCards.length})` : "No Eligible Cards Found"}
            </h2>
            
            {eligibleCards.length > 0 ? <>
                <div className="space-y-6" data-unique-id="caa5f49b-9ca0-44e8-8b81-8bf18d9bc0f6" data-loc="217:16-217:43" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                  {eligibleCards.map(card => <div key={card._id} className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-all", selectedCards.includes(card._id) ? "border-2 border-blue-500" : "border border-gray-200")} data-unique-id="08cd4d9d-ed4b-4482-b507-b0f6fa8c1771" data-loc="218:45-218:234" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-4" data-unique-id="d252f5e5-2204-44b9-bc62-bf2add271763" data-loc="219:22-219:71" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                        <div className="md:col-span-1 p-6 bg-gray-50 flex items-center justify-center" data-unique-id="e39666c0-ccbe-476c-92f4-047fc164cd8a" data-loc="220:24-220:103" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="relative h-40 w-64 md:h-full md:w-full" data-unique-id="ec72471b-1d0c-4b49-80a1-5eafec36fe92" data-loc="221:26-221:82" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover rounded-md" data-unique-id="12d3df55-c0b6-44aa-a901-e25d410058dc" data-loc="222:28-222:114" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6" data-unique-id="a88cfc44-9917-4638-8b82-d4444d937600" data-loc="226:24-226:59" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                          <div className="flex flex-col md:flex-row justify-between" data-unique-id="3b1170b6-11cc-4450-9d15-755ed9d857a8" data-loc="227:26-227:85" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                            <div data-unique-id="5332f9b5-3d18-4b6b-b6f9-0fb7dd61017c" data-loc="228:28-228:33" data-file-name="app/dashboard/eligibility/[customerId]/page.tsx">
                              <h3 className="text-lg font-semibold text-gray-900" data-