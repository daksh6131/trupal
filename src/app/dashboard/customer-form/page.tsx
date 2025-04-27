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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="d1af166d-4fa0-47d0-bd9f-a93cf9534c19" data-loc="124:11-124:74" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="bee9fa8a-06b7-4143-be90-d2b62e179575" data-loc="125:8-125:99" data-file-name="app/dashboard/customer-form/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-12" data-unique-id="870a0752-ed70-41d1-8618-3095fcf88549" data-loc="128:9-128:56" data-file-name="app/dashboard/customer-form/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="8701e255-7df5-4f19-a5e3-ab168f955636" data-loc="130:6-130:42" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="2da30040-0211-426f-a26b-e6c8270af8d0" data-loc="131:8-131:61" data-file-name="app/dashboard/customer-form/page.tsx">
          <div className="flex items-center" data-unique-id="32f29160-d318-45b8-abef-17af49f604f3" data-loc="132:10-132:45" data-file-name="app/dashboard/customer-form/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="d6008756-9bbd-4929-96a0-639bf09df6b3" data-loc="133:12-133:114" data-file-name="app/dashboard/customer-form/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="3158b077-d314-42f2-9568-c24608051a45" data-loc="136:12-136:60" data-file-name="app/dashboard/customer-form/page.tsx">
              New Customer Registration
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6" data-unique-id="d7cc9cb4-a63c-4062-b4a8-1431fde6e819" data-loc="144:6-144:60" data-file-name="app/dashboard/customer-form/page.tsx">
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="e2748d14-bebd-4444-a494-d7b28a62a06e" data-loc="145:8-145:59" data-file-name="app/dashboard/customer-form/page.tsx">
          <form onSubmit={handleSubmit(onSubmit)} data-unique-id="5603da07-be67-497c-855d-c607f713d370" data-loc="146:10-146:50" data-file-name="app/dashboard/customer-form/page.tsx">
            <div className="space-y-6" data-unique-id="af48ba32-1e48-4741-8326-6130ac401ab7" data-loc="147:12-147:39" data-file-name="app/dashboard/customer-form/page.tsx">
              {/* Personal Information */}
              <div data-unique-id="d677b41c-9319-4386-acb7-16ec89498319" data-loc="149:14-149:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="03cb57dc-a47a-45a0-87ad-4db40ef30184" data-loc="150:16-150:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6 mb-6" data-unique-id="0a8fc051-b69b-43c0-9d47-e259c45c7713" data-loc="154:16-154:61" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="4dd10c90-03f6-4d4a-8be0-34f06484aef5" data-loc="155:18-155:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="8954aded-f4ee-4050-8948-eabc4b7d07d5" data-loc="156:20-156:99" data-file-name="app/dashboard/customer-form/page.tsx">
                      Full Name
                    </label>
                    <div className="relative" data-unique-id="beb889c8-c41f-4952-a4e0-4708ebeadb93" data-loc="159:20-159:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="084ec8d6-42b3-42b0-874b-94e22f935103" data-loc="160:22-160:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="name" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.name ? "border-red-300" : "border-gray-300")} placeholder="John Doe" {...register("name")} data-unique-id="e69431e5-cc31-4a66-8176-e0c120d1bd76" data-loc="163:22-163:262" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600" data-unique-id="1f90d79a-5ef1-451c-a0dd-15def0b36583" data-loc="165:36-165:77" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.name.message}
                      </p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="809a93a2-37cb-4999-91ff-bb26b19cb184" data-loc="171:16-171:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="4eac9cbc-ff28-40d7-8cb6-896f34dd44d9" data-loc="172:18-172:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="18337cd4-964e-40ad-8766-d44c207e0a4b" data-loc="173:20-173:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Phone Number
                    </label>
                    <div className="relative" data-unique-id="9b90b870-5b42-4041-a29b-d37f6b6b42da" data-loc="176:20-176:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="b4816b24-816e-425b-995b-ad211789cde0" data-loc="177:22-177:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="tel" id="phone" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.phone ? "border-red-300" : "border-gray-300")} placeholder="10-digit number" maxLength={10} {...register("phone")} data-unique-id="f9ebeb4d-d3d2-4bce-8330-6117e90a6b2b" data-loc="180:22-180:286" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600" data-unique-id="8a1b973a-7b50-4a20-a573-aa73fc1150e0" data-loc="182:37-182:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.phone.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="7b5efb1c-ba71-40a7-9683-d6fe2b8fb35a" data-loc="187:18-187:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="6e506049-cb53-4036-af92-115fa1dfee3b" data-loc="188:20-188:100" data-file-name="app/dashboard/customer-form/page.tsx">
                      Email Address
                    </label>
                    <div className="relative" data-unique-id="172a1b0a-d180-4a85-8998-965fa13dc67d" data-loc="191:20-191:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="b5f64472-7252-4b70-910d-f3e6017ae2a5" data-loc="192:22-192:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.email ? "border-red-300" : "border-gray-300")} placeholder="john@example.com" {...register("email")} data-unique-id="9efb6f00-d8c9-4102-8080-c28627319026" data-loc="195:22-195:274" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600" data-unique-id="10c14a37-2d54-45bd-9e2c-c10e2006583c" data-loc="197:37-197:78" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.email.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="ea3309a6-3e8d-4cb8-86e7-9aca1e057f85" data-loc="202:18-202:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="ebe718d5-797f-4b84-aad4-558e3ba063af" data-loc="203:20-203:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      Date of Birth
                    </label>
                    <div className="relative" data-unique-id="9e6845ba-dd92-4f3f-a3f1-d22b989637f7" data-loc="206:20-206:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="6bec64ae-4c68-4535-b612-4b16ffd3a1ee" data-loc="207:22-207:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <Calendar className="h-5 w-5 text-gray-400" data-unique-id="a54566b0-576c-421a-85e3-1341a7a6f788" data-loc="208:24-208:70" data-file-name="app/dashboard/customer-form/page.tsx" />
                      </div>
                      <input type="date" id="dob" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.dob ? "border-red-300" : "border-gray-300")} {...register("dob")} data-unique-id="fe63eb24-43f1-442b-82f2-d3f81010c591" data-loc="210:22-210:236" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.dob && <p className="mt-1 text-sm text-red-600" data-unique-id="eaededc0-2efb-4cb8-b837-9c085b36fbe4" data-loc="212:35-212:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.dob.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="0a385974-4a63-477f-b9e2-09cad8fe16d0" data-loc="217:18-217:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="1b170e38-f3cf-4f5d-a827-82a06a813cfa" data-loc="218:20-218:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PAN Number
                    </label>
                    <div className="relative" data-unique-id="fd1c1138-c5cf-4f59-8f91-f1ad686e12ce" data-loc="221:20-221:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="82d055ff-0ed0-463c-a26f-66476b533b4c" data-loc="222:22-222:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pan" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase", errors.pan ? "border-red-300" : "border-gray-300")} placeholder="ABCDE1234F" maxLength={10} {...register("pan")} onChange={e => {
                      e.target.value = e.target.value.toUpperCase();
                    }} data-unique-id="d361bc71-e723-4933-8273-94af045c3dce" data-loc="225:22-227:25" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pan && <p className="mt-1 text-sm text-red-600" data-unique-id="5fe6f453-5780-4aad-9dd0-275f55cc1754" data-loc="229:35-229:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pan.message}
                      </p>}
                  </div>
                </div>
              </div>
              
              {/* Financial & Address Information */}
              <div data-unique-id="e221a561-b559-48cc-92a8-899c8d21a940" data-loc="237:14-237:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <h2 className="text-lg font-medium text-gray-900 mb-4" data-unique-id="fc1a5dfe-9c0d-44c8-84bc-b8ec88bded7b" data-loc="238:16-238:71" data-file-name="app/dashboard/customer-form/page.tsx">
                  Financial & Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-unique-id="450b53c3-4303-4f79-b2f9-7396e15ce518" data-loc="242:16-242:76" data-file-name="app/dashboard/customer-form/page.tsx">
                  <div data-unique-id="d27e9a0c-ad5a-45d2-84a0-85f8d58ed41a" data-loc="243:18-243:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="faff2dcb-fe98-41a9-8d01-343f18161ed5" data-loc="244:20-244:101" data-file-name="app/dashboard/customer-form/page.tsx">
                      Monthly Income (₹)
                    </label>
                    <div className="relative" data-unique-id="31ea7b3b-27bd-4326-a855-15e2d721c9c7" data-loc="247:20-247:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="219a5831-7bea-4e2c-b755-7f2dc31098a1" data-loc="248:22-248:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="number" id="salary" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.salary ? "border-red-300" : "border-gray-300")} placeholder="30000" {...register("salary", {
                      valueAsNumber: true
                    })} data-unique-id="46b7dff2-0610-4d54-8a60-3f5155c3656a" data-loc="251:22-253:26" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.salary && <p className="mt-1 text-sm text-red-600" data-unique-id="0e60c35f-13d9-4f50-83a5-62f2f84237dc" data-loc="255:38-255:79" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.salary.message}
                      </p>}
                  </div>
                  
                  <div data-unique-id="7f65daf0-7bb7-414a-8670-c85e29bcbec9" data-loc="260:18-260:23" data-file-name="app/dashboard/customer-form/page.tsx">
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="45317504-ef74-48d4-aafe-08c285d11564" data-loc="261:20-261:98" data-file-name="app/dashboard/customer-form/page.tsx">
                      PIN Code
                    </label>
                    <div className="relative" data-unique-id="e0e71950-03b4-47f4-b692-e73e61c582c5" data-loc="264:20-264:46" data-file-name="app/dashboard/customer-form/page.tsx">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="d22af437-9577-4fa4-892a-c7b2ee805f17" data-loc="265:22-265:108" data-file-name="app/dashboard/customer-form/page.tsx">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="pin" className={cn("block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.pin ? "border-red-300" : "border-gray-300")} placeholder="6-digit PIN code" maxLength={6} {...register("pin")} data-unique-id="5ec77b5b-656c-46e6-8a79-b553c9b00ae4" data-loc="268:22-268:281" data-file-name="app/dashboard/customer-form/page.tsx" />
                    </div>
                    {errors.pin && <p className="mt-1 text-sm text-red-600" data-unique-id="11d33297-b215-4755-b47c-310ada8a09ea" data-loc="270:35-270:76" data-file-name="app/dashboard/customer-form/page.tsx">
                        {errors.pin.message}
                      </p>}
                  </div>
                </div>
                
                <div className="mb-6" data-unique-id="c146e1c3-0866-47d5-af31-ed5af06d79c5" data-loc="276:16-276:38" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="61082e1b-ae3c-43b3-857d-981abccbe4b6" data-loc="277:18-277:100" data-file-name="app/dashboard/customer-form/page.tsx">
                    Address
                  </label>
                  <textarea id="address" rows={3} className={cn("block w-full py-2 px-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", errors.address ? "border-red-300" : "border-gray-300")} placeholder="Full residential address" {...register("address")} data-unique-id="6fd5bd17-2251-40d5-8867-804e2cc20bb7" data-loc="280:18-280:280" data-file-name="app/dashboard/customer-form/page.tsx"></textarea>
                  {errors.address && <p className="mt-1 text-sm text-red-600" data-unique-id="025babea-d090-440b-8916-c87c0a613a07" data-loc="281:37-281:78" data-file-name="app/dashboard/customer-form/page.tsx">
                      {errors.address.message}
                    </p>}
                </div>
                
                <div data-unique-id="1de81094-e538-44f5-b73d-69da37d31c55" data-loc="286:16-286:21" data-file-name="app/dashboard/customer-form/page.tsx">
                  <label htmlFor="cibilScore" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="282592ad-bbd0-4c16-83bd-2514aaf4ade7" data-loc="287:18-287:103" data-file-name="app/dashboard/customer-form/page.tsx">
                    CIBIL Score (Optional)
                  </label>
                  <div className="relative" data-unique-id="cadd019b-8a18-43e8-ac65-9baf0828a23d" data-loc="290:18-290:44" data-file-name="app/dashboard/customer-form/page.tsx">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="db53d82c-b30f-4693-b1bc-5ac8598f2419" data-loc="291:20-291:106" data-file-name="app/dashboard/customer-form/page.tsx">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="number" id="cibilScore" min="300" max="900" className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter score (300-900)" {...register("cibilScore", {
                    setValueAs: value => value ? parseInt(value) : undefined,
                    valueAsNumber: true
                  })} data-unique-id="7af7fc0f-b6cd-43f7-8046-1c9d5a35b5a0" data-loc="294:20-297:24" data-file-name="app/dashboard/customer-form/page.tsx" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500" data-unique-id="f55ed0a9-5702-4b6f-8237-3e3960c3abdc" data-loc="299:18-299:60" data-file-name="app/dashboard/customer-form/page.tsx">
                    *In production, this would be fetched from the CIBIL API
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div data-unique-id="b3f1c593-fd17-4c4a-aa34-b6e0df99fb7a" data-loc="306:14-306:19" data-file-name="app/dashboard/customer-form/page.tsx">
                <button type="submit" disabled={isSubmitting} className={cn("w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", isSubmitting && "opacity-70 cursor-not-allowed")} data-unique-id="c7d809e2-8c4c-4f05-8e38-80923bacc952" data-loc="307:16-307:306" data-file-name="app/dashboard/customer-form/page.tsx">
                  {isSubmitting ? <span className="flex items-center justify-center" data-unique-id="1d670bca-a57e-431c-91df-29aaa7466140" data-loc="308:34-308:85" data-file-name="app/dashboard/customer-form/page.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="d44d4ad5-ba99-44ef-8f54-dd95ced76024" data-loc="309:22-309:149" data-file-name="app/dashboard/customer-form/page.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span> : <span className="flex items-center justify-center" data-unique-id="6fc1cfa8-515c-4d72-acad-aa3ee3db75d2" data-loc="314:30-314:81" data-file-name="app/dashboard/customer-form/page.tsx">
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