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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="a2d0c93e-e6a9-49e7-a747-e3659f4e3ad1" data-loc="124:11-124:74" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="18dc9cb0-5040-4e06-a01a-ca1cdcda1b83" data-loc="125:8-125:99" data-file-name="app/dashboard/customer-form/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="05e459e0-9431-4628-8084-3c27480e2609" data-loc="128:9-128:56" data-file-name="app/dashboard/customer-form/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="3b5b7db6-6303-4fcb-832a-ea7a0adab05a" data-loc="130:6-130:42" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="da006c2f-754f-4f37-8ec9-013d2ab87517" data-loc="131:8-131:61" data-file-name="app/dashboard/customer-form/page.tsx">
          <div className="flex items-center" data-unique-id="68db8811-38ed-48fc-b6e7-5595a70feae9" data-loc="132:10-132:45" data-file-name="app/dashboard/customer-form/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="912c4e21-8266-4b9b-9604-cdd3d11b228b" data-loc="133:12-133:114" data-file-name="app/dashboard/customer-form/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="3bf461c5-0cdc-42cb-be6a-6225454ef333" data-loc="136:12-136:60" data-file-name="app/dashboard/customer-form/page.tsx">
              New Customer Registration
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6" data-unique-id="68343ce9-bf76-4b2a-ad36-7e0ca8a6e904" data-loc="144:6-144:60" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="5d63ae62-4c8c-480e-b819-ed84d2c674e2" data-loc="145:8-145:59" data-file-name="app/dashboard/customer-form/page.tsx">
          <form onSubmit={handleSubmit(onSubmit)} data-unique-id="4e10c34b-4722-41f4-9237-7e6ae0bcc91c" data-loc="146:10-146:50" data-file-name="app/dashboard/customer-form/page.tsx">
            <div className="space-y-6" data-unique-id="bf8b894c-f241-4979-91f8-7ee6e71cbeda" data-loc="147:12-147:39" data-file-name="app/dashboard/customer-form/page.tsx">
              {/* Personal Information */}
              <div data-unique-id="01d4a4c7-2489-4f2d-8822-baa3eb910a1a" data-loc="149:14-149:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="6dab1a16-f7be-4f71-aaf4-48961f1f2cbd" data-loc="150:16-150:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6 mb-6" data-unique-id="fc38d013-ee44-4026-b611-ebef40ee159d" data-loc="154:16-154:61" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="89993073-bd6e-4d0f-aef8-ad16a3e8195a" data-loc="155:18-155:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="33e600d8-6cf4-4d8e-9e35-10e0cd8da773" data-loc="156:20-156:99" data-file-name="app/dashboard/customer-form/page.tsx">
                      Full Name
                    </label>
                    <div className="relative" data-unique-id="578da41f-af8e-4879-bb4c-4deaec16ff12" data-loc="159:20-159:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="aa1348df-da7d-4b9f-8292-fbab541945ee" data-loc="160:22-160:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="name" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.name ? "border-red-300" : "border-gray-300")} placeholder="John Doe" {...register("name")} data-unique-id="310379c5-4ca9-4b77-a399-66a3d412617b" data-loc="163:22-163:262" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600" data-unique-id="8a9026a9-2f5f-4365-a387-b32cfcb857a5" data-loc="165:36-165:77" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.name.message}
                      </p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="445495a1-2d18-4036-ba1b-7ecf046ae3a6" data-loc="171:16-171:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="8af194c3-0453-41b8-97a6-1b7a0b6f97bd" data-loc="172:18-172:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="d05b4b93-5c97-4197-b183-426b717cee55" data-loc="173:20-173:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Phone Number
                    </label>
                    <div className="relative" data-unique-id="8a3f49e3-c2b4-4aa2-8633-c5c6c305cfcd" data-loc="176:20-176:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="45da0219-f9b8-4779-9e0d-a8794759c3c1" data-loc="177:22-177:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="tel" id="phone" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.phone ? "border-red-300" : "border-gray-300")} placeholder="10-digit number" maxLength={10} {...register("phone")} data-unique-id="3868184f-5f22-4766-8f54-09d3e9ed3a9d" data-loc="180:22-180:286" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600" data-unique-id="f8f6ecf2-fd1e-4702-9fe3-e13634bec616" data-loc="182:37-182:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.phone.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="12239758-6d81-4dc4-8338-c67989bac569" data-loc="187:18-187:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="620541b8-f2a4-47f9-90dd-61855bcb207a" data-loc="188:20-188:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Email Address
                    </label>
                    <div className="relative" data-unique-id="f85d7e4d-084b-4b93-a6c1-4d10ae246a68" data-loc="191:20-191:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="71a0e531-3b49-4bd8-bf9a-dfdaa0fbec7a" data-loc="192:22-192:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.email ? "border-red-300" : "border-gray-300")} placeholder="john@example.com" {...register("email")} data-unique-id="0996571e-9ab6-47cb-9b77-925ff817e5a6" data-loc="195:22-195:274" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600" data-unique-id="3b3cb5c3-0e63-4d23-aa42-0469deb06e0e" data-loc="197:37-197:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.email.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="41608927-7b3e-406e-8773-dd064fd122db" data-loc="202:18-202:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="a3ff777a-de24-4f3d-8892-a77fb136e5dc" data-loc="203:20-203:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      Date of Birth
                    </label>
                    <div className="relative" data-unique-id="0c847faa-4181-409c-8b45-6afbad6c4feb" data-loc="206:20-206:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="22d21fb4-1a80-4c5a-beaa-c21f0604f67d" data-loc="207:22-207:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Calendar className="h-5 w-5 text-gray-400" data-unique-id="c6140e2a-6440-42a2-a1f8-f090939b1a5a" data-loc="208:24-208:70" data-file-name="app/dashboard/customer-form/page.tsx" />
                      </div>
                      <input type="date" id="dob" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.dob ? "border-red-300" : "border-gray-300")} {...register("dob")} data-unique-id="018d7e0c-9e1e-4cf5-be79-28e181dfe9ca" data-loc="210:22-210:236" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.dob && <p className="mt-1 text-sm text-red-600" data-unique-id="efea010e-ef95-4a8d-95c4-cb36f43c7b75" data-loc="212:35-212:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.dob.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="42d52593-7221-48fb-aa52-2253030d78ef" data-loc="217:18-217:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="743cfd44-2111-4b16-adc0-811ff6a1ea77" data-loc="218:20-218:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PAN Number
                    </label>
                    <div className="relative" data-unique-id="d366e74f-6597-4122-ba5f-4cff388c02e1" data-loc="221:20-221:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="e1f37358-fe14-4eb7-a5c0-0cb2cda67e8d" data-loc="222:22-222:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pan" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase", errors.pan ? "border-red-300" : "border-gray-300")} placeholder="ABCDE1234F" maxLength={10} {...register("pan")} onChange={e => {
                      e.target.value = e.target.value.toUpperCase();
                    }} data-unique-id="f6c92478-0851-4a81-a79a-6a4b876a652d" data-loc="225:22-227:25" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pan && <p className="mt-1 text-sm text-red-600" data-unique-id="81f4b5f6-9ed6-46f9-b901-6c5138bcf779" data-loc="229:35-229:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pan.message}
                      </p>}
                  </div>
                </div>
              </div>
              
              {/* Financial & Address Information */}
              <div data-unique-id="0e227934-7c66-4aa3-a683-d89aa329dc94" data-loc="237:14-237:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="23f0e54c-0e19-48b5-aa16-fa2bf8192adf" data-loc="238:16-238:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Financial & Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-unique-id="1ae5fd6d-c747-47d2-b6f9-c285111e1175" data-loc="242:16-242:76" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="48924991-e7bd-48c4-9002-6ab837ff1d15" data-loc="243:18-243:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="fe8e7c66-d118-4f27-8b79-1e79ac6ca8b3" data-loc="244:20-244:101" data-file-name="app/dashboard/customer-form/page.tsx">
                      Monthly Income (₹)
                    </label>
                    <div className="relative" data-unique-id="1a241c79-4886-44e3-b5ae-1f3d397b6157" data-loc="247:20-247:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="c25e986c-0365-46b1-a39c-33f5be96adb0" data-loc="248:22-248:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="number" id="salary" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.salary ? "border-red-300" : "border-gray-300")} placeholder="30000" {...register("salary", {
                      valueAsNumber: true
                    })} data-unique-id="46cf7c39-ae5e-4d6e-82c0-152d7309265c" data-loc="251:22-253:26" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.salary && <p className="mt-1 text-sm text-red-600" data-unique-id="5dfadbe6-7094-4a98-9dd6-52f6cae168e2" data-loc="255:38-255:79" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.salary.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="ebd93a29-3693-4191-b11f-d0751069e829" data-loc="260:18-260:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="e84bbb58-2a7e-4043-9831-45e252586a6d" data-loc="261:20-261:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PIN Code
                    </label>
                    <div className="relative" data-unique-id="1912b1f7-75d2-4e77-a1ec-8fcd753e9942" data-loc="264:20-264:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="2c00e981-e0fa-4aa6-8c6d-da8fcbf97700" data-loc="265:22-265:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pin" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.pin ? "border-red-300" : "border-gray-300")} placeholder="6-digit PIN code" maxLength={6} {...register("pin")} data-unique-id="09069bd8-2ebc-4320-9fea-3204b05a7a29" data-loc="268:22-268:281" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pin && <p className="mt-1 text-sm text-red-600" data-unique-id="c5969db2-c796-4143-b4fc-650ca63ab79a" data-loc="270:35-270:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pin.message}
                      </p>}
                  </div>
                </div>
                
                <div className="mb-6" data-unique-id="7148b193-6c51-4d3e-a2e9-2a14770d02b4" data-loc="276:16-276:38" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="99635ccc-38e9-46fd-bde7-1030ad0e5b7f" data-loc="277:18-277:100" data-file-name="app/dashboard/customer-form/page.tsx">
                    Address
                  </label>
                  <textarea id="address" rows={3} className={cn("block w-full py-2 px-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.address ? "border-red-300" : "border-gray-300")} placeholder="Full residential address" {...register("address")} data-unique-id="b40a360f-11db-409c-91a9-a7033503f0db" data-loc="280:18-280:280" data-file-name="app/dashboard/customer-form/page.tsx"></textarea>
                  {errors.address && <p className="mt-1 text-sm text-red-600" data-unique-id="6dfcca8a-7c55-4d97-93d1-f0f8b412c3f1" data-loc="281:37-281:78" data-file-name="app/dashboard/customer-form/page.tsx">
                      {errors.address.message}
                    </p>}
                </div>
                
                <div data-unique-id="5564c898-9845-40b6-84fa-1e4990837b66" data-loc="286:16-286:21" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="cibilScore" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="5cb0cc53-bb5c-4a11-9e81-286727b3d69d" data-loc="287:18-287:103" data-file-name="app/dashboard/customer-form/page.tsx">
                    CIBIL Score (Optional)
                  </label>
                  <div className="relative" data-unique-id="24f6f2bd-f26d-4d23-a684-5534f6f1ce51" data-loc="290:18-290:44" data-file-name="app/dashboard/customer-form/page.tsx">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="c85ab31e-d05a-41ad-8983-064846e9f3c9" data-loc="291:20-291:106" data-file-name="app/dashboard/customer-form/page.tsx">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="number" id="cibilScore" min="300" max="900" className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter score (300-900)" {...register("cibilScore", {
                    setValueAs: value => value ? parseInt(value) : undefined,
                    valueAsNumber: true
                  })} data-unique-id="2125aa53-be2e-47ea-940c-8e86273ecce6" data-loc="294:20-297:24" data-file-name="app/dashboard/customer-form/page.tsx" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="a662da84-06ed-4594-af12-4b08ff4547f7" data-loc="299:18-299:60" data-file-name="app/dashboard/customer-form/page.tsx">
                    *In production, this would be fetched from the CIBIL API
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div data-unique-id="c8ade028-26c9-4fdc-b105-634da6e03d39" data-loc="306:14-306:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <button type="submit" disabled={isSubmitting} className={cn("w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", isSubmitting && "opacity-70 cursor-not-allowed")} data-unique-id="c944485a-b6c9-4a56-bfcc-16906eebf894" data-loc="307:16-307:306" data-file-name="app/dashboard/customer-form/page.tsx">
                  {isSubmitting ? <span className="flex items-center justify-center" data-unique-id="c2b37fb0-660c-4c3a-9862-7f452508fa67" data-loc="308:34-308:85" data-file-name="app/dashboard/customer-form/page.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="cb02e61b-cc2e-4f43-ab74-7f9d9660aefc" data-loc="309:22-309:149" data-file-name="app/dashboard/customer-form/page.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span> : <span className="flex items-center justify-center" data-unique-id="00ddfe78-b580-43c7-960a-c283e9317e5f" data-loc="314:30-314:81" data-file-name="app/dashboard/customer-form/page.tsx">
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