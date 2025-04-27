"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, User, Phone, Mail, Calendar, CreditCard, MapPin, DollarSign, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { customersApi, supabaseApi } from "@/lib/api-service";

// Form validation schema
const customerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  dob: z.string().refine(value => {
    const date = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age >= 18 && age <= 100;
  }, "Customer must be at least 18 years old"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)"),
  salary: z.number().min(5000, "Minimum salary is ₹5,000"),
  pin: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  cibilScore: z.number().optional()
});
type CustomerFormData = z.infer<typeof customerSchema>;
export default function CustomerFormPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    setValue
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      salary: 0
    }
  });
  useEffect(() => {
    // Check if user is logged in
    const agentData = localStorage.getItem("salesAgent");
    if (!agentData) {
      router.push("/");
      return;
    }
    setAgent(JSON.parse(agentData));
  }, [router]);
  const onSubmit = async (data: CustomerFormData) => {
    if (!agent) return;
    setIsSubmitting(true);
    try {
      console.log("Submitting customer data:", data);

      // Create new customer via API
      const response = await customersApi.create({
        name: data.name,
        phone: data.phone,
        email: data.email,
        dob: data.dob,
        pan: data.pan,
        salary: data.salary,
        pin: data.pin,
        address: data.address,
        cibilScore: data.cibilScore,
        linkedAgent: agent.phone
      });
      console.log("API response:", response);
      if (response && response.customer) {
        toast.success("Customer information saved successfully");

        // Redirect to eligibility page
        router.push(`/dashboard/eligibility/${response.customer.id}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error saving customer:", error);

      // Check if we're offline
      if (!navigator.onLine) {
        // Store data for later sync
        const offlineSyncManager = supabaseApi.getOfflineSyncManager();
        if (offlineSyncManager) {
          offlineSyncManager.queueOperation('customers', 'insert', {
            name: data.name,
            phone: data.phone,
            email: data.email,
            dob: data.dob,
            pan: data.pan,
            salary: data.salary,
            pin: data.pin,
            address: data.address,
            cibil_score: data.cibilScore,
            linked_agent: agent.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          toast.success("Customer information saved for later sync (offline mode)");
          // Redirect to dashboard since we can't get an ID for eligibility check while offline
          router.push('/dashboard');
        } else {
          toast.error("Failed to save customer information - offline mode not available");
        }
      } else {
        toast.error("Failed to save customer information");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!agent) {
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="d9329e68-fad7-43ba-b86b-07c9973f67c0" data-loc="124:11-124:74" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="04a65040-9a32-4f17-a25e-57e80583dcc5" data-loc="125:8-125:99" data-file-name="app/dashboard/customer-form/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="6356711a-d9b4-4a41-9c07-68ebf0721eeb" data-loc="128:9-128:56" data-file-name="app/dashboard/customer-form/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="f15835c5-3006-4f91-8fd1-fd5cc4dfa124" data-loc="130:6-130:42" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="e8ed08e2-af2e-401d-81ac-1c6b4cf3645d" data-loc="131:8-131:61" data-file-name="app/dashboard/customer-form/page.tsx">
          <div className="flex items-center" data-unique-id="c42e1166-e005-4aa5-99e2-7fd1ea13d2e4" data-loc="132:10-132:45" data-file-name="app/dashboard/customer-form/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="870dee9d-0d00-4951-98d5-0ff8369a311e" data-loc="133:12-133:114" data-file-name="app/dashboard/customer-form/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="c7b88a17-7315-433c-9e09-c55e2a2b52b9" data-loc="136:12-136:60" data-file-name="app/dashboard/customer-form/page.tsx">
              New Customer Registration
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6" data-unique-id="74e06dd4-9fe3-4734-bed1-e6435ff042ab" data-loc="144:6-144:60" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="25bdb94b-7107-4bb4-b90d-5e107a9f187f" data-loc="145:8-145:59" data-file-name="app/dashboard/customer-form/page.tsx">
          <form onSubmit={handleSubmit(onSubmit)} data-unique-id="1711da62-23d5-4856-9015-2b39ec4435d7" data-loc="146:10-146:50" data-file-name="app/dashboard/customer-form/page.tsx">
            <div className="space-y-6" data-unique-id="761759b8-d240-41f8-b747-8f265c8873b9" data-loc="147:12-147:39" data-file-name="app/dashboard/customer-form/page.tsx">
              {/* Personal Information */}
              <div data-unique-id="0a41d8ff-6c11-4ee3-951c-930c91278c80" data-loc="149:14-149:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="f1682b75-d354-4b75-b47d-e87735cc0f68" data-loc="150:16-150:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6 mb-6" data-unique-id="efc8a8e0-8fb9-4da9-b4cd-eb60b9b67161" data-loc="154:16-154:61" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="a68f7a5a-5e5d-44f7-ad52-1e29a928ef86" data-loc="155:18-155:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="7936b772-1857-4b52-9bc4-bd94e62d3e5a" data-loc="156:20-156:99" data-file-name="app/dashboard/customer-form/page.tsx">
                      Full Name
                    </label>
                    <div className="relative" data-unique-id="aa84a8eb-82e5-42b9-9123-e62e2238959b" data-loc="159:20-159:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="74e71a12-b963-470f-9a9a-80192ff72070" data-loc="160:22-160:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="name" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.name ? "border-red-300" : "border-gray-300")} placeholder="John Doe" {...register("name")} data-unique-id="50a87c4d-c450-4824-9f21-8c7bd14598c8" data-loc="163:22-163:262" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600" data-unique-id="2afa7748-71d2-4c7d-9664-9250a664ffb2" data-loc="165:36-165:77" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.name.message}
                      </p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="7600be24-88f4-4e80-8f6a-4b401fc210bb" data-loc="171:16-171:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="5393d08b-0dbe-4473-a42e-01f66ffc99ac" data-loc="172:18-172:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="c0aee4fa-01d8-40bf-b438-2c4cf36ba1bd" data-loc="173:20-173:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Phone Number
                    </label>
                    <div className="relative" data-unique-id="cc509b41-9fb6-45e2-b887-4d34e5427ee7" data-loc="176:20-176:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="9b76acc1-2ea2-42c6-8285-8413cf0598b9" data-loc="177:22-177:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="tel" id="phone" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.phone ? "border-red-300" : "border-gray-300")} placeholder="10-digit number" maxLength={10} {...register("phone")} data-unique-id="207f642e-3cd7-48b1-aae4-237c6afe535d" data-loc="180:22-180:286" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600" data-unique-id="0e5bf371-0425-454b-8c1b-c0020f1bbbf9" data-loc="182:37-182:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.phone.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="b5925849-82e5-4351-bb43-d4b6a2c9cf5a" data-loc="187:18-187:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="e7c44046-7710-4f70-b8a1-138a20c56a30" data-loc="188:20-188:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Email Address
                    </label>
                    <div className="relative" data-unique-id="27f43fc3-93ca-4ca8-92e4-036d14002f8d" data-loc="191:20-191:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="20f1a32b-6213-4108-ae95-7100452e013f" data-loc="192:22-192:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.email ? "border-red-300" : "border-gray-300")} placeholder="john@example.com" {...register("email")} data-unique-id="6f15f90f-795d-4ee1-8b43-0171121fabed" data-loc="195:22-195:274" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600" data-unique-id="6ee6d841-cf2c-4abd-8781-b37deb878a33" data-loc="197:37-197:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.email.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="a843d56a-99e1-4b59-9c1c-6bdc8610e19d" data-loc="202:18-202:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="50524cf5-7dfa-4835-b538-6a39825ae645" data-loc="203:20-203:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      Date of Birth
                    </label>
                    <div className="relative" data-unique-id="f16e9f4c-2cdd-4150-a79d-5f077d255b26" data-loc="206:20-206:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="4cec6123-d633-4cdd-9713-3cd52257d87e" data-loc="207:22-207:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Calendar className="h-5 w-5 text-gray-400" data-unique-id="36b63dbc-ab6b-41fa-b3a0-7c4686e8dd9b" data-loc="208:24-208:70" data-file-name="app/dashboard/customer-form/page.tsx" />
                      </div>
                      <input type="date" id="dob" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.dob ? "border-red-300" : "border-gray-300")} {...register("dob")} data-unique-id="0cd8ed95-8ce5-462c-9f0b-1ab0d0f916cd" data-loc="210:22-210:236" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.dob && <p className="mt-1 text-sm text-red-600" data-unique-id="8768fc70-076b-415b-87b8-add36e960d70" data-loc="212:35-212:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.dob.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="9ba0dced-d203-42b5-91cf-2465ff4716e8" data-loc="217:18-217:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="307a52fe-aab3-43e5-92dd-1307eae27516" data-loc="218:20-218:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PAN Number
                    </label>
                    <div className="relative" data-unique-id="460399b4-8739-4d7b-9fc8-465a953e6e3e" data-loc="221:20-221:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="d02a3eb5-1a10-4045-9db9-9bed990ea730" data-loc="222:22-222:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pan" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase", errors.pan ? "border-red-300" : "border-gray-300")} placeholder="ABCDE1234F" maxLength={10} {...register("pan")} onChange={e => {
                      e.target.value = e.target.value.toUpperCase();
                    }} data-unique-id="e3c3f6ba-b322-4328-b6b1-edbe973cc5d2" data-loc="225:22-227:25" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pan && <p className="mt-1 text-sm text-red-600" data-unique-id="19533301-11c5-4495-a513-1663e4badf7e" data-loc="229:35-229:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pan.message}
                      </p>}
                  </div>
                </div>
              </div>
              
              {/* Financial & Address Information */}
              <div data-unique-id="eaaa4b9a-cb25-4091-8368-ea8072ba3702" data-loc="237:14-237:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="e4d66ce4-e904-48f9-b75e-da7ff7a5de7a" data-loc="238:16-238:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Financial & Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-unique-id="9c2a9a35-926a-437f-8cc6-d2eadba4ce61" data-loc="242:16-242:76" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="da61e486-b629-42cd-bbbb-02ec1fa8dc61" data-loc="243:18-243:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="ec0411f0-45d9-46ff-85e7-8c5de59322ae" data-loc="244:20-244:101" data-file-name="app/dashboard/customer-form/page.tsx">
                      Monthly Income (₹)
                    </label>
                    <div className="relative" data-unique-id="e3b6d7f0-d7ab-43aa-a1c0-4c55392954b1" data-loc="247:20-247:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="67e89825-befe-4fd4-87b3-ca3f23b78eae" data-loc="248:22-248:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="number" id="salary" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.salary ? "border-red-300" : "border-gray-300")} placeholder="30000" {...register("salary", {
                      valueAsNumber: true
                    })} data-unique-id="f366cb66-c3a8-4e36-8c0a-bc0703c30108" data-loc="251:22-253:26" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.salary && <p className="mt-1 text-sm text-red-600" data-unique-id="941a42ad-8658-45e6-bf78-71c41a86aa1a" data-loc="255:38-255:79" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.salary.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="9e739104-a12b-4746-bf99-eed74600b58f" data-loc="260:18-260:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="68ef56c3-e0c9-41b4-92e2-f1fc52ba5c50" data-loc="261:20-261:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PIN Code
                    </label>
                    <div className="relative" data-unique-id="c2964c7a-85e5-42c2-b482-2d62d653f7b9" data-loc="264:20-264:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="39fae7e9-e6b9-4358-a638-1786ba0dfb42" data-loc="265:22-265:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pin" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.pin ? "border-red-300" : "border-gray-300")} placeholder="6-digit PIN code" maxLength={6} {...register("pin")} data-unique-id="4a4c3087-dbf0-498b-9ce5-400cdcb6f2b2" data-loc="268:22-268:281" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pin && <p className="mt-1 text-sm text-red-600" data-unique-id="01b356b1-c74f-4193-ae0f-02bcddb487cd" data-loc="270:35-270:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pin.message}
                      </p>}
                  </div>
                </div>
                
                <div className="mb-6" data-unique-id="f9475532-cd75-4dfb-a29a-085abad7d0f8" data-loc="276:16-276:38" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="7bb7571d-d59c-4883-844d-4e7b55bb66a1" data-loc="277:18-277:100" data-file-name="app/dashboard/customer-form/page.tsx">
                    Address
                  </label>
                  <textarea id="address" rows={3} className={cn("block w-full py-2 px-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.address ? "border-red-300" : "border-gray-300")} placeholder="Full residential address" {...register("address")} data-unique-id="f63c439b-f16d-498e-944f-ae75f5f9a74d" data-loc="280:18-280:280" data-file-name="app/dashboard/customer-form/page.tsx"></textarea>
                  {errors.address && <p className="mt-1 text-sm text-red-600" data-unique-id="09bc1fc7-a563-4408-9968-e505e5776304" data-loc="281:37-281:78" data-file-name="app/dashboard/customer-form/page.tsx">
                      {errors.address.message}
                    </p>}
                </div>
                
                <div data-unique-id="4d6657e7-be4a-400d-b54c-8d3154b4c3e3" data-loc="286:16-286:21" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="cibilScore" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="ff611f9c-8a37-44a2-8435-d1b0b3bcb7a7" data-loc="287:18-287:103" data-file-name="app/dashboard/customer-form/page.tsx">
                    CIBIL Score (Optional)
                  </label>
                  <div className="relative" data-unique-id="bb981836-3058-474e-baae-29d33f0b42b9" data-loc="290:18-290:44" data-file-name="app/dashboard/customer-form/page.tsx">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="f7dd3116-1e49-47eb-a4af-d5180c7ba479" data-loc="291:20-291:106" data-file-name="app/dashboard/customer-form/page.tsx">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="number" id="cibilScore" min="300" max="900" className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter score (300-900)" {...register("cibilScore", {
                    setValueAs: value => value ? parseInt(value) : undefined,
                    valueAsNumber: true
                  })} data-unique-id="7f6afb86-1537-49ea-aa54-25f15680e303" data-loc="294:20-297:24" data-file-name="app/dashboard/customer-form/page.tsx" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="09091971-733f-4ce5-9dee-14fc55eee960" data-loc="299:18-299:60" data-file-name="app/dashboard/customer-form/page.tsx">
                    *In production, this would be fetched from the CIBIL API
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div data-unique-id="042aeeb6-afce-4c99-9e5e-8badfb81eb62" data-loc="306:14-306:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <button type="submit" disabled={isSubmitting} className={cn("w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", isSubmitting && "opacity-70 cursor-not-allowed")} data-unique-id="85f0ba24-bd41-4ce2-ad4e-1f11559fd5ae" data-loc="307:16-307:306" data-file-name="app/dashboard/customer-form/page.tsx">
                  {isSubmitting ? <span className="flex items-center justify-center" data-unique-id="56e8cd9f-f3ea-4f88-a279-457284365952" data-loc="308:34-308:85" data-file-name="app/dashboard/customer-form/page.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="21f4022a-56f2-4654-9991-77159eabfe78" data-loc="309:22-309:149" data-file-name="app/dashboard/customer-form/page.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span> : <span className="flex items-center justify-center" data-unique-id="7769c1fa-9c39-4269-a45e-45c6a6094814" data-loc="314:30-314:81" data-file-name="app/dashboard/customer-form/page.tsx">
                      Check Credit Card Eligibility <CheckCircle className="ml-2 h-5 w-5" />
                    </span>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>;
}