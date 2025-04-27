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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="9bce3f65-09f7-470e-8ded-889803b38144" data-loc="124:11-124:74" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="1a726ce7-681f-4de6-9328-8adad956348a" data-loc="125:8-125:99" data-file-name="app/dashboard/customer-form/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="8dad3bc7-9779-413d-a23e-bf1f772a78e1" data-loc="128:9-128:56" data-file-name="app/dashboard/customer-form/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="9a5ffd61-0ad6-401a-acf2-b9461d7ff481" data-loc="130:6-130:42" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="e8cdb03e-cd36-4961-b650-60752c363765" data-loc="131:8-131:61" data-file-name="app/dashboard/customer-form/page.tsx">
          <div className="flex items-center" data-unique-id="7dc8dfa3-05d2-4188-acdf-3e4e76ac1da3" data-loc="132:10-132:45" data-file-name="app/dashboard/customer-form/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="3ff51b01-43d3-454d-be17-09c833289a81" data-loc="133:12-133:114" data-file-name="app/dashboard/customer-form/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="9092c3b8-3953-4f0b-9ce5-051b8e653c89" data-loc="136:12-136:60" data-file-name="app/dashboard/customer-form/page.tsx">
              New Customer Registration
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6" data-unique-id="7a1da337-c9a6-4edc-bd1b-8f64268b4238" data-loc="144:6-144:60" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="7f7e2f40-3e56-4007-9b2f-d821e0ae4751" data-loc="145:8-145:59" data-file-name="app/dashboard/customer-form/page.tsx">
          <form onSubmit={handleSubmit(onSubmit)} data-unique-id="e9d66940-fed4-4da4-9f94-2d03772fb975" data-loc="146:10-146:50" data-file-name="app/dashboard/customer-form/page.tsx">
            <div className="space-y-6" data-unique-id="eec70c2c-eac1-4965-8cba-70227b0a0368" data-loc="147:12-147:39" data-file-name="app/dashboard/customer-form/page.tsx">
              {/* Personal Information */}
              <div data-unique-id="7eb9c1de-e78f-41a7-b6fa-247aabfc16aa" data-loc="149:14-149:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="3fd10944-4578-4f7a-9eaa-53a9ae74f6d0" data-loc="150:16-150:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6 mb-6" data-unique-id="fac34bd5-9e8c-4db4-af34-04bd42c630c9" data-loc="154:16-154:61" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="b3b2a4ba-efcf-43f6-80ac-34f577ccdf46" data-loc="155:18-155:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="9c6993be-b2a8-473e-ae93-32055b8da0ae" data-loc="156:20-156:99" data-file-name="app/dashboard/customer-form/page.tsx">
                      Full Name
                    </label>
                    <div className="relative" data-unique-id="6643af3a-c1e5-416b-b4ba-1044f385fead" data-loc="159:20-159:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="59f603f6-2fee-4ac4-ac9c-213d1297764a" data-loc="160:22-160:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="name" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.name ? "border-red-300" : "border-gray-300")} placeholder="John Doe" {...register("name")} data-unique-id="d2c3e870-81c8-4aae-98d7-4b1ed9a47f80" data-loc="163:22-163:262" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600" data-unique-id="49230a77-26f4-47bc-90ab-e2fae0554add" data-loc="165:36-165:77" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.name.message}
                      </p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="26e8b82c-412c-4490-b573-0e0085674214" data-loc="171:16-171:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="5f97a279-5309-4aec-9b10-b8826c90d50f" data-loc="172:18-172:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="4f8b566c-9398-4b86-bd93-1d23294767ec" data-loc="173:20-173:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Phone Number
                    </label>
                    <div className="relative" data-unique-id="703218d8-5bf3-4ec9-8bb2-3e2689033529" data-loc="176:20-176:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="748e7786-c3d5-46ce-9303-865b586471ae" data-loc="177:22-177:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="tel" id="phone" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.phone ? "border-red-300" : "border-gray-300")} placeholder="10-digit number" maxLength={10} {...register("phone")} data-unique-id="e299d536-4a1a-4897-b05c-a96a001e8cdb" data-loc="180:22-180:286" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600" data-unique-id="0044074d-842c-4ac9-ac8f-05d1fc10e6e4" data-loc="182:37-182:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.phone.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="9ad724b5-95fe-494c-91fb-25185ff24132" data-loc="187:18-187:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="687e889a-8829-47ba-b32c-39b6e5c48266" data-loc="188:20-188:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Email Address
                    </label>
                    <div className="relative" data-unique-id="166aff0e-d69a-4f05-96c7-05dc551d5f32" data-loc="191:20-191:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="15a6bced-ea39-4e13-aff6-904b75c05267" data-loc="192:22-192:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.email ? "border-red-300" : "border-gray-300")} placeholder="john@example.com" {...register("email")} data-unique-id="2edb6bd6-f27e-4dfa-893e-5a10c6aad33b" data-loc="195:22-195:274" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600" data-unique-id="8caab120-da36-4b4b-b619-6759b7a4554e" data-loc="197:37-197:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.email.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="a8622ca1-e999-40f0-8e75-24180e83d0c1" data-loc="202:18-202:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="3350d1ca-0862-4168-82d6-7914c5efd720" data-loc="203:20-203:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      Date of Birth
                    </label>
                    <div className="relative" data-unique-id="f2e89a93-a9ef-426a-94c9-73b785310183" data-loc="206:20-206:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="e43f8cf0-e8db-4c54-b610-3647b7ef8665" data-loc="207:22-207:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Calendar className="h-5 w-5 text-gray-400" data-unique-id="e499c90a-c201-4a2c-a832-03e740d9503c" data-loc="208:24-208:70" data-file-name="app/dashboard/customer-form/page.tsx" />
                      </div>
                      <input type="date" id="dob" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.dob ? "border-red-300" : "border-gray-300")} {...register("dob")} data-unique-id="40a66e03-4298-4cb8-aeac-701b1b985eaa" data-loc="210:22-210:236" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.dob && <p className="mt-1 text-sm text-red-600" data-unique-id="5e02d085-3792-4277-8c76-d412cc0da681" data-loc="212:35-212:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.dob.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="9ff2be75-1da2-4c60-9e1a-b2aba5d15605" data-loc="217:18-217:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="9b55be56-1b84-4f78-87dd-ac2998f7f415" data-loc="218:20-218:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PAN Number
                    </label>
                    <div className="relative" data-unique-id="0fbcf916-28ed-4374-a412-cdb8ac138296" data-loc="221:20-221:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="3933dc3c-4011-41b7-b0fb-33cf9c129f59" data-loc="222:22-222:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pan" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase", errors.pan ? "border-red-300" : "border-gray-300")} placeholder="ABCDE1234F" maxLength={10} {...register("pan")} onChange={e => {
                      e.target.value = e.target.value.toUpperCase();
                    }} data-unique-id="ee1e24a3-3dc7-432e-808f-fa105d0fc455" data-loc="225:22-227:25" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pan && <p className="mt-1 text-sm text-red-600" data-unique-id="ec925758-f085-4d19-859b-5cdda2111f61" data-loc="229:35-229:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pan.message}
                      </p>}
                  </div>
                </div>
              </div>
              
              {/* Financial & Address Information */}
              <div data-unique-id="79d0e14c-3c84-4886-b10f-5e3473bd8546" data-loc="237:14-237:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="bd3076c2-4def-41fb-8690-80861b0d9569" data-loc="238:16-238:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Financial & Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-unique-id="3fb2fc9e-3ea6-4b41-ac2a-04ae3d03f847" data-loc="242:16-242:76" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="1d10f981-b364-4c73-b598-d1558f081b45" data-loc="243:18-243:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="9202fe1d-cb51-442a-99b1-94d5137f2c9e" data-loc="244:20-244:101" data-file-name="app/dashboard/customer-form/page.tsx">
                      Monthly Income (₹)
                    </label>
                    <div className="relative" data-unique-id="750056a4-76b8-4227-8653-95533b780618" data-loc="247:20-247:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="2e8811d0-a157-4497-9db6-cde89a6e9809" data-loc="248:22-248:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="number" id="salary" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.salary ? "border-red-300" : "border-gray-300")} placeholder="30000" {...register("salary", {
                      valueAsNumber: true
                    })} data-unique-id="1b8c2d97-9f45-45ed-81c3-6d4c0f8634b2" data-loc="251:22-253:26" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.salary && <p className="mt-1 text-sm text-red-600" data-unique-id="3d06f6ea-a670-4e5c-9af4-ad212a78b3d6" data-loc="255:38-255:79" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.salary.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="ee6fe109-0314-43ac-b85c-b26f7ee64bbe" data-loc="260:18-260:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="4b0fcc65-ef85-4225-a421-841826f05202" data-loc="261:20-261:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PIN Code
                    </label>
                    <div className="relative" data-unique-id="69ad0b8f-6754-40db-b8d8-fa38bd7e6efd" data-loc="264:20-264:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="9761f320-f175-4f0f-9563-0632aa7a5edd" data-loc="265:22-265:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pin" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.pin ? "border-red-300" : "border-gray-300")} placeholder="6-digit PIN code" maxLength={6} {...register("pin")} data-unique-id="c912b29b-205f-4b08-be60-12014da27fae" data-loc="268:22-268:281" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pin && <p className="mt-1 text-sm text-red-600" data-unique-id="9c6093f3-0f23-4354-b3cb-ed13b8ede31a" data-loc="270:35-270:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pin.message}
                      </p>}
                  </div>
                </div>
                
                <div className="mb-6" data-unique-id="f6081af8-00d9-44e3-9b43-6257ef1962be" data-loc="276:16-276:38" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="c467dcee-c2dc-495a-90fd-1ff2f36819a8" data-loc="277:18-277:100" data-file-name="app/dashboard/customer-form/page.tsx">
                    Address
                  </label>
                  <textarea id="address" rows={3} className={cn("block w-full py-2 px-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.address ? "border-red-300" : "border-gray-300")} placeholder="Full residential address" {...register("address")} data-unique-id="291409b0-b0a5-4915-9f46-8b3b5b4bc200" data-loc="280:18-280:280" data-file-name="app/dashboard/customer-form/page.tsx"></textarea>
                  {errors.address && <p className="mt-1 text-sm text-red-600" data-unique-id="24ba19c4-218b-4807-ae6c-1f0528803467" data-loc="281:37-281:78" data-file-name="app/dashboard/customer-form/page.tsx">
                      {errors.address.message}
                    </p>}
                </div>
                
                <div data-unique-id="ace18b17-0620-407f-ad4f-959ba39e9b74" data-loc="286:16-286:21" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="cibilScore" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="36741733-13f2-4456-8c27-31be68046ccf" data-loc="287:18-287:103" data-file-name="app/dashboard/customer-form/page.tsx">
                    CIBIL Score (Optional)
                  </label>
                  <div className="relative" data-unique-id="7ab73d54-95b8-4e1b-ad01-d46d56603384" data-loc="290:18-290:44" data-file-name="app/dashboard/customer-form/page.tsx">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="e872f0ec-bdc1-4c19-8089-eff14c17e432" data-loc="291:20-291:106" data-file-name="app/dashboard/customer-form/page.tsx">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="number" id="cibilScore" min="300" max="900" className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter score (300-900)" {...register("cibilScore", {
                    setValueAs: value => value ? parseInt(value) : undefined,
                    valueAsNumber: true
                  })} data-unique-id="cfa393aa-e76c-4858-8f42-1970ae429d47" data-loc="294:20-297:24" data-file-name="app/dashboard/customer-form/page.tsx" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="51cfa3f1-2dd2-4a7f-a901-5228fd1eb609" data-loc="299:18-299:60" data-file-name="app/dashboard/customer-form/page.tsx">
                    *In production, this would be fetched from the CIBIL API
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div data-unique-id="ec681c52-e428-4932-8079-b60f3c7cbe68" data-loc="306:14-306:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <button type="submit" disabled={isSubmitting} className={cn("w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", isSubmitting && "opacity-70 cursor-not-allowed")} data-unique-id="fad0a506-5902-4427-9e45-202dd93841cb" data-loc="307:16-307:306" data-file-name="app/dashboard/customer-form/page.tsx">
                  {isSubmitting ? <span className="flex items-center justify-center" data-unique-id="fe3b063b-e41f-4d44-8104-6bf7321aed7f" data-loc="308:34-308:85" data-file-name="app/dashboard/customer-form/page.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="5a62e7b9-7e23-44c1-80b2-bd8600bdcf87" data-loc="309:22-309:149" data-file-name="app/dashboard/customer-form/page.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span> : <span className="flex items-center justify-center" data-unique-id="79f3635c-727e-4486-9053-4082d8b47025" data-loc="314:30-314:81" data-file-name="app/dashboard/customer-form/page.tsx">
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