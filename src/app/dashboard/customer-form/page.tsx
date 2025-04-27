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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="d65e8c16-fa4b-4cec-9e21-5a7c80cf268a" data-loc="124:11-124:74" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="6e9cb35d-07ab-4d63-81ec-849c6a0071a3" data-loc="125:8-125:99" data-file-name="app/dashboard/customer-form/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="fa154f84-0f6e-47fc-965f-8d0f4643279f" data-loc="128:9-128:56" data-file-name="app/dashboard/customer-form/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="a63d60b9-f6bf-4076-aecc-3b4fa2e11ae4" data-loc="130:6-130:42" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="bc4aaa90-0d67-4a95-a4ae-28e9461c2c57" data-loc="131:8-131:61" data-file-name="app/dashboard/customer-form/page.tsx">
          <div className="flex items-center" data-unique-id="21a65ee1-ee05-42e0-b206-637a8123788d" data-loc="132:10-132:45" data-file-name="app/dashboard/customer-form/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="05297a3f-6abe-4c12-a4e9-e35842f6f06b" data-loc="133:12-133:114" data-file-name="app/dashboard/customer-form/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="ae1bafde-db48-4bcf-8598-cf7bfc902764" data-loc="136:12-136:60" data-file-name="app/dashboard/customer-form/page.tsx">
              New Customer Registration
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6" data-unique-id="0db0cd36-3089-4305-b526-8b13620b7bf1" data-loc="144:6-144:60" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="4a45cc5d-62b2-4eec-8f0d-51f1e1556c52" data-loc="145:8-145:59" data-file-name="app/dashboard/customer-form/page.tsx">
          <form onSubmit={handleSubmit(onSubmit)} data-unique-id="0f12b827-b662-4505-b470-62254c3d5326" data-loc="146:10-146:50" data-file-name="app/dashboard/customer-form/page.tsx">
            <div className="space-y-6" data-unique-id="bd8e29e1-738f-47f8-b288-ea89b36247ae" data-loc="147:12-147:39" data-file-name="app/dashboard/customer-form/page.tsx">
              {/* Personal Information */}
              <div data-unique-id="eda9ec05-100f-44e7-8532-b4cbff1ad442" data-loc="149:14-149:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="5d3cd568-5df9-4934-b23c-fec022657e6b" data-loc="150:16-150:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6 mb-6" data-unique-id="a4ae6dd9-25f7-4c16-b277-ab6353d78378" data-loc="154:16-154:61" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="a10a8676-3521-4804-8a43-7100cb5f5f27" data-loc="155:18-155:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="13ac5740-7d6d-47c8-8e4f-667709827dd4" data-loc="156:20-156:99" data-file-name="app/dashboard/customer-form/page.tsx">
                      Full Name
                    </label>
                    <div className="relative" data-unique-id="145ba4c4-c943-466f-9a74-fe6487c2bc1f" data-loc="159:20-159:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="0cd78adf-2009-4723-a760-01fc2a797c5c" data-loc="160:22-160:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="name" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.name ? "border-red-300" : "border-gray-300")} placeholder="John Doe" {...register("name")} data-unique-id="b58f434e-472d-4f9d-8ed2-b1f16412effc" data-loc="163:22-163:262" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600" data-unique-id="75101aae-2471-4597-91a9-a6cd625832e0" data-loc="165:36-165:77" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.name.message}
                      </p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="acea643c-007f-43e8-be72-16c5cdf2c03b" data-loc="171:16-171:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="7c1274d8-30e8-4313-a293-2b041cbb3757" data-loc="172:18-172:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="ed7aacfe-66eb-4185-b72e-2b62dfb4e322" data-loc="173:20-173:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Phone Number
                    </label>
                    <div className="relative" data-unique-id="117e54c1-a43a-46ba-ad88-e2ea27feec6b" data-loc="176:20-176:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="b934fbcf-ced8-494f-8379-829ab8f82f48" data-loc="177:22-177:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="tel" id="phone" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.phone ? "border-red-300" : "border-gray-300")} placeholder="10-digit number" maxLength={10} {...register("phone")} data-unique-id="f0fa0c6e-7427-4d67-81d9-56061c359318" data-loc="180:22-180:286" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600" data-unique-id="6d232e3f-efb4-4a4b-874a-045c5e5c4654" data-loc="182:37-182:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.phone.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="fd6b61d9-9813-458f-a024-b0a4cd216899" data-loc="187:18-187:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="34c78c70-539a-4ef5-abc3-7c646e2f63f5" data-loc="188:20-188:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Email Address
                    </label>
                    <div className="relative" data-unique-id="829406e7-dafb-49bc-94ed-fbbbd5427100" data-loc="191:20-191:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="9336a3f4-cd74-4757-b69b-2a1316235980" data-loc="192:22-192:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.email ? "border-red-300" : "border-gray-300")} placeholder="john@example.com" {...register("email")} data-unique-id="317f340a-b866-49d8-954d-42dea0ca26e0" data-loc="195:22-195:274" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600" data-unique-id="5f45ceb0-bf00-40b9-8d2b-237702e87bfd" data-loc="197:37-197:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.email.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="b03e1444-46a3-4e5c-ac95-08866d8116e3" data-loc="202:18-202:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="1100f018-20f1-43b9-b024-61201b585809" data-loc="203:20-203:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      Date of Birth
                    </label>
                    <div className="relative" data-unique-id="4ff6cffe-e545-4d22-89ce-4ad9fec6bfe0" data-loc="206:20-206:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="8c707052-831f-4622-9686-7605a16712c3" data-loc="207:22-207:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Calendar className="h-5 w-5 text-gray-400" data-unique-id="4454d6f6-1935-4a78-b6b4-ea8c3f1f0901" data-loc="208:24-208:70" data-file-name="app/dashboard/customer-form/page.tsx" />
                      </div>
                      <input type="date" id="dob" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.dob ? "border-red-300" : "border-gray-300")} {...register("dob")} data-unique-id="9c89d243-b19e-4c3f-b415-1cbbb72cffed" data-loc="210:22-210:236" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.dob && <p className="mt-1 text-sm text-red-600" data-unique-id="7bc1fc35-ce6f-4e51-a5c7-8d7b04ed178a" data-loc="212:35-212:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.dob.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="3b305ab0-cd5c-4c78-8eec-ec2e53108e23" data-loc="217:18-217:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="3e626c50-3764-4d1d-8f01-a07d79ad93cc" data-loc="218:20-218:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PAN Number
                    </label>
                    <div className="relative" data-unique-id="cd1b34c6-ab26-406c-bda1-e1fab4dd9967" data-loc="221:20-221:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="b8cc2885-6f63-4670-bb59-95f7ebe7ba8b" data-loc="222:22-222:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pan" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase", errors.pan ? "border-red-300" : "border-gray-300")} placeholder="ABCDE1234F" maxLength={10} {...register("pan")} onChange={e => {
                      e.target.value = e.target.value.toUpperCase();
                    }} data-unique-id="2e73e5a2-f2b5-4bfa-840e-b5005a05b098" data-loc="225:22-227:25" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pan && <p className="mt-1 text-sm text-red-600" data-unique-id="b14a0470-3626-44f3-a7c6-cce9b23e64d3" data-loc="229:35-229:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pan.message}
                      </p>}
                  </div>
                </div>
              </div>
              
              {/* Financial & Address Information */}
              <div data-unique-id="ed6e3cec-8964-4392-bf85-007a0a5e0485" data-loc="237:14-237:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="436ff889-cbe6-4461-bfa4-a10ca0cc6c7c" data-loc="238:16-238:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Financial & Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-unique-id="5602d1f8-8802-4cc7-a403-5356ffa01d2b" data-loc="242:16-242:76" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="551b5f7f-a786-4fca-a79e-661157558032" data-loc="243:18-243:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="34f47e43-4dad-493c-8264-ea3de23fa8ab" data-loc="244:20-244:101" data-file-name="app/dashboard/customer-form/page.tsx">
                      Monthly Income (₹)
                    </label>
                    <div className="relative" data-unique-id="f5992e72-32dd-49a7-8313-d5ae8b060ece" data-loc="247:20-247:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="5e60746f-4711-428e-9efe-4a2677b23a1c" data-loc="248:22-248:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="number" id="salary" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.salary ? "border-red-300" : "border-gray-300")} placeholder="30000" {...register("salary", {
                      valueAsNumber: true
                    })} data-unique-id="d8e9c2c8-3b6a-41ac-86e1-9bd7e29b187a" data-loc="251:22-253:26" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.salary && <p className="mt-1 text-sm text-red-600" data-unique-id="d70d5bc0-c665-4577-bacb-168d2a31b781" data-loc="255:38-255:79" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.salary.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="a66fa032-1286-41dc-88ce-6f1198fe0f1c" data-loc="260:18-260:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="0e853c79-cbe9-469c-8d67-7c369550fc20" data-loc="261:20-261:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PIN Code
                    </label>
                    <div className="relative" data-unique-id="a2cbf1e0-9b54-48cc-9c8b-a8e1d9bd0884" data-loc="264:20-264:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="818080cb-9d12-4ae1-bd0b-8a6a57f4acab" data-loc="265:22-265:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pin" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.pin ? "border-red-300" : "border-gray-300")} placeholder="6-digit PIN code" maxLength={6} {...register("pin")} data-unique-id="1fbf2a3f-952c-4c2f-8c9e-73d2c1061e71" data-loc="268:22-268:281" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pin && <p className="mt-1 text-sm text-red-600" data-unique-id="13d4dd7d-b104-4c5b-ae9e-baf1ba951840" data-loc="270:35-270:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pin.message}
                      </p>}
                  </div>
                </div>
                
                <div className="mb-6" data-unique-id="e910bf17-483c-4297-8898-10d34dbbf5c8" data-loc="276:16-276:38" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="f0784957-1720-4331-a6ac-b047b52c5d4d" data-loc="277:18-277:100" data-file-name="app/dashboard/customer-form/page.tsx">
                    Address
                  </label>
                  <textarea id="address" rows={3} className={cn("block w-full py-2 px-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.address ? "border-red-300" : "border-gray-300")} placeholder="Full residential address" {...register("address")} data-unique-id="067117a6-f2d6-4460-a0f0-010fc24c3645" data-loc="280:18-280:280" data-file-name="app/dashboard/customer-form/page.tsx"></textarea>
                  {errors.address && <p className="mt-1 text-sm text-red-600" data-unique-id="236b6848-d007-4854-b669-337fb6388fee" data-loc="281:37-281:78" data-file-name="app/dashboard/customer-form/page.tsx">
                      {errors.address.message}
                    </p>}
                </div>
                
                <div data-unique-id="d2d286f6-0a20-49d2-a96e-c9faeafdaf88" data-loc="286:16-286:21" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="cibilScore" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="e281aa34-8c4a-459e-bad7-8924e7c344a4" data-loc="287:18-287:103" data-file-name="app/dashboard/customer-form/page.tsx">
                    CIBIL Score (Optional)
                  </label>
                  <div className="relative" data-unique-id="57feba42-21cd-4278-81ee-492b43987357" data-loc="290:18-290:44" data-file-name="app/dashboard/customer-form/page.tsx">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="ea24b4d4-4364-4e53-af74-1f5d71d0eaf0" data-loc="291:20-291:106" data-file-name="app/dashboard/customer-form/page.tsx">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="number" id="cibilScore" min="300" max="900" className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter score (300-900)" {...register("cibilScore", {
                    setValueAs: value => value ? parseInt(value) : undefined,
                    valueAsNumber: true
                  })} data-unique-id="db699c76-7f00-49f9-9950-8b3fc70fa6bb" data-loc="294:20-297:24" data-file-name="app/dashboard/customer-form/page.tsx" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="60fe206e-e658-401a-ad79-6e2ea406f258" data-loc="299:18-299:60" data-file-name="app/dashboard/customer-form/page.tsx">
                    *In production, this would be fetched from the CIBIL API
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div data-unique-id="726e0a5b-90c8-4dd5-acf4-c0aaba40a6d5" data-loc="306:14-306:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <button type="submit" disabled={isSubmitting} className={cn("w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", isSubmitting && "opacity-70 cursor-not-allowed")} data-unique-id="671ef7eb-8534-4150-82ac-d7e1960933c7" data-loc="307:16-307:306" data-file-name="app/dashboard/customer-form/page.tsx">
                  {isSubmitting ? <span className="flex items-center justify-center" data-unique-id="967cb186-6c6d-4765-aead-91537a532b93" data-loc="308:34-308:85" data-file-name="app/dashboard/customer-form/page.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="5f8cb475-c4c1-432b-8dc5-fada8b67b362" data-loc="309:22-309:149" data-file-name="app/dashboard/customer-form/page.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span> : <span className="flex items-center justify-center" data-unique-id="73cca756-5eee-4f94-b179-761c06dcc549" data-loc="314:30-314:81" data-file-name="app/dashboard/customer-form/page.tsx">
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