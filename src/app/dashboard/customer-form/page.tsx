"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowLeft, User, Phone, Mail, Calendar, CreditCard,
  MapPin, DollarSign, FileText, AlertCircle, CheckCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { customersApi } from "@/lib/api-service";

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
  cibilScore: z.number().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerFormPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<{ name: string; phone: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      salary: 0,
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
      // Create new customer via API
      const { customer } = await customersApi.create({
        name: data.name,
        phone: data.phone,
        email: data.email,
        dob: data.dob,
        pan: data.pan,
        salary: data.salary,
        pin: data.pin,
        address: data.address,
        cibilScore: data.cibilScore,
        linkedAgent: agent.phone,
      });
      
      toast.success("Customer information saved successfully");
      
      // Redirect to eligibility page
      router.push(`/dashboard/eligibility/${customer._id}`);
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Failed to save customer information");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.push("/dashboard")}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              New Customer Registration
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        className={cn(
                          "block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                          errors.name ? "border-red-300" : "border-gray-300"
                        )}
                        placeholder="John Doe"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        className={cn(
                          "block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                          errors.phone ? "border-red-300" : "border-gray-300"
                        )}
                        placeholder="10-digit number"
                        maxLength={10}
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        className={cn(
                          "block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                          errors.email ? "border-red-300" : "border-gray-300"
                        )}
                        placeholder="john@example.com"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="dob"
                        className={cn(
                          "block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                          errors.dob ? "border-red-300" : "border-gray-300"
                        )}
                        {...register("dob")}
                      />
                    </div>
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="pan"
                        className={cn(
                          "block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase",
                          errors.pan ? "border-red-300" : "border-gray-300"
                        )}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        {...register("pan")}
                        onChange={e => {
                          e.target.value = e.target.value.toUpperCase();
                        }}
                      />
                    </div>
                    {errors.pan && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pan.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Financial & Address Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Financial & Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Income (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="salary"
                        className={cn(
                          "block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                          errors.salary ? "border-red-300" : "border-gray-300"
                        )}
                        placeholder="30000"
                        {...register("salary", { valueAsNumber: true })}
                      />
                    </div>
                    {errors.salary && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.salary.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="pin"
                        className={cn(
                          "block w-full pl-10 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                          errors.pin ? "border-red-300" : "border-gray-300"
                        )}
                        placeholder="6-digit PIN code"
                        maxLength={6}
                        {...register("pin")}
                      />
                    </div>
                    {errors.pin && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pin.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    className={cn(
                      "block w-full py-2 px-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
                      errors.address ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="Full residential address"
                    {...register("address")}
                  ></textarea>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cibilScore" className="block text-sm font-medium text-gray-700 mb-1">
                    CIBIL Score (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="cibilScore"
                      min="300"
                      max="900"
                      className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter score (300-900)"
                      {...register("cibilScore", { 
                        setValueAs: value => value ? parseInt(value) : undefined,
                        valueAsNumber: true 
                      })}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    *In production, this would be fetched from the CIBIL API
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Check Credit Card Eligibility <CheckCircle className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
