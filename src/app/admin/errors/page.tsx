"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, Clock, Filter, Search, ArrowLeft, RefreshCw, AlertCircle, XCircle, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ErrorLog } from "@/db/schema";
export default function ErrorsPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    status?: string;
    severity?: string;
    search?: string;
  }>({});
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [expandedErrors, setExpandedErrors] = useState<Record<number, boolean>>({});

  // Fetch errors
  const fetchErrors = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.severity) params.append('severity', filter.severity);
      const response = await fetch(`/api/errors?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setErrors(data.errors);
      } else {
        console.error("Failed to fetch errors:", data.error);
      }
    } catch (error) {
      console.error("Error fetching errors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchErrors();
  }, [filter.status, filter.severity]);

  // Filter errors by search term
  const filteredErrors = errors.filter(error => {
    if (!filter.search) return true;
    const searchTerm = filter.search.toLowerCase();
    return error.message?.toLowerCase().includes(searchTerm) || error.type?.toLowerCase().includes(searchTerm) || error.url?.toLowerCase().includes(searchTerm) || error.userId?.toLowerCase().includes(searchTerm);
  });

  // Update error status
  const updateErrorStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/errors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          resolvedBy: 'admin' // In a real app, get the actual admin email
        })
      });
      const data = await response.json();
      if (data.success) {
        // Update local state
        setErrors(errors.map(error => error.id === id ? {
          ...error,
          status: status as "new" | "investigating" | "resolved" | "ignored"
        } : error));
        if (selectedError?.id === id) {
          setSelectedError({
            ...selectedError,
            status: status as "new" | "investigating" | "resolved" | "ignored"
          });
        }
      } else {
        console.error("Failed to update error status:", data.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // View error details
  const viewErrorDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/errors/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedError(data.error);
      } else {
        console.error("Failed to fetch error details:", data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  // Toggle expanded state for an error
  const toggleExpanded = (id: number) => {
    setExpandedErrors(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'investigating':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'ignored':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="min-h-screen bg-gray-50" data-unique-id="6ebeda80-48c0-4389-a9e0-488c3cc419f5" data-loc="142:9-142:50" data-file-name="app/admin/errors/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="e49baefe-6788-42f5-a04e-293432024d78" data-loc="144:6-144:42" data-file-name="app/admin/errors/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="90e2a01c-568a-4aa8-a181-3468cd89f03e" data-loc="145:8-145:61" data-file-name="app/admin/errors/page.tsx">
          <div className="flex items-center" data-unique-id="ad273e0e-d6b6-411c-9765-5b1ea74a9a0a" data-loc="146:10-146:45" data-file-name="app/admin/errors/page.tsx">
            <button onClick={() => router.push("/admin")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="7d260b5e-cfaf-42ab-baa7-eea92c3c0b0a" data-loc="147:12-147:110" data-file-name="app/admin/errors/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="6f231e42-5c2d-4e2b-938e-e307891de81d" data-loc="150:12-150:60" data-file-name="app/admin/errors/page.tsx">
              Error Logs
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="c1522e84-1df8-4b57-92e6-5936c55c44a0" data-loc="158:6-158:60" data-file-name="app/admin/errors/page.tsx">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4" data-unique-id="c18c642d-04d2-4fe7-b2a6-77b096114e2e" data-loc="160:8-160:62" data-file-name="app/admin/errors/page.tsx">
          <div className="relative flex-grow" data-unique-id="bf3be4a7-dfe3-466c-85aa-45a9cfb53e9e" data-loc="161:10-161:46" data-file-name="app/admin/errors/page.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="2134e02d-dd88-45bc-8c4c-d9b6a65c74aa" data-loc="162:12-162:98" data-file-name="app/admin/errors/page.tsx">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search errors..." value={filter.search || ''} onChange={e => setFilter({
            ...filter,
            search: e.target.value
          })} data-unique-id="f2a11c2d-ce0c-453d-a469-62ac7959e722" data-loc="165:12-168:16" data-file-name="app/admin/errors/page.tsx" />
          </div>
          
          <div className="flex gap-2" data-unique-id="1a3bcf53-920b-481a-849d-2440d4b57eb1" data-loc="171:10-171:38" data-file-name="app/admin/errors/page.tsx">
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.status || ''} onChange={e => setFilter({
            ...filter,
            status: e.target.value || undefined
          })} data-unique-id="b341a0f4-4f0c-4b49-9597-a8b17163d6de" data-loc="172:12-175:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="5a73e238-b4d8-4c3c-995f-30bed65f26c1" data-loc="176:14-176:31" data-file-name="app/admin/errors/page.tsx">All Statuses</option>
              <option value="new" data-unique-id="2454f4c5-cd9a-41fc-a72a-fb0b2d64046c" data-loc="177:14-177:34" data-file-name="app/admin/errors/page.tsx">New</option>
              <option value="investigating" data-unique-id="8a70759d-8585-46aa-a96d-5a9165b96c1b" data-loc="178:14-178:44" data-file-name="app/admin/errors/page.tsx">Investigating</option>
              <option value="resolved" data-unique-id="a9446076-4474-40f0-ad30-0f3b8cbc1dea" data-loc="179:14-179:39" data-file-name="app/admin/errors/page.tsx">Resolved</option>
              <option value="ignored" data-unique-id="197109a3-9cf1-4b08-b028-261eadfcdf5b" data-loc="180:14-180:38" data-file-name="app/admin/errors/page.tsx">Ignored</option>
            </select>
            
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.severity || ''} onChange={e => setFilter({
            ...filter,
            severity: e.target.value || undefined
          })} data-unique-id="c3a72171-7805-48ec-9aad-9c850e520f98" data-loc="183:12-186:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="52cf39b5-f46c-4401-9c71-28bbae76d49c" data-loc="187:14-187:31" data-file-name="app/admin/errors/page.tsx">All Severities</option>
              <option value="low" data-unique-id="8beb0a16-86e1-408e-a817-b9f35a30e143" data-loc="188:14-188:34" data-file-name="app/admin/errors/page.tsx">Low</option>
              <option value="medium" data-unique-id="aca5b0f0-d719-4d38-93e4-a3b308656afa" data-loc="189:14-189:37" data-file-name="app/admin/errors/page.tsx">Medium</option>
              <option value="high" data-unique-id="0dcd4f4b-a997-49ff-b9a3-250c1c0dd711" data-loc="190:14-190:35" data-file-name="app/admin/errors/page.tsx">High</option>
              <option value="critical" data-unique-id="d5f8a32b-2cfa-4751-85f0-41f22a739374" data-loc="191:14-191:39" data-file-name="app/admin/errors/page.tsx">Critical</option>
            </select>
            
            <button onClick={fetchErrors} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="71f61931-e735-4a75-acc5-e8a7aa23441c" data-loc="194:12-194:269" data-file-name="app/admin/errors/page.tsx">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Error List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="7c9b12be-37e1-43b6-9ed8-2165e1b26a8d" data-loc="201:8-201:71" data-file-name="app/admin/errors/page.tsx">
          {loading ? <div className="text-center py-12" data-unique-id="b0d91d2f-2c57-45a1-9f59-e3f9037fb93e" data-loc="202:21-202:56" data-file-name="app/admin/errors/page.tsx">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" data-unique-id="88cdd3d8-5b90-4b43-93e2-876911565d4e" data-loc="203:14-203:113" data-file-name="app/admin/errors/page.tsx"></div>
              <p className="mt-4 text-gray-600" data-unique-id="2322fb0b-c759-4f9a-a6b1-cd4a0bc44d8e" data-loc="204:14-204:48" data-file-name="app/admin/errors/page.tsx">Loading error logs...</p>
            </div> : filteredErrors.length > 0 ? <ul className="divide-y divide-gray-200" data-unique-id="a3e5e546-9a5b-4664-aaa4-d7d99f763676" data-loc="205:49-205:90" data-file-name="app/admin/errors/page.tsx">
              {filteredErrors.map(error => <li key={error.id} className="px-6 py-4 hover:bg-gray-50" data-unique-id="4bc7e1a2-5b44-4dbd-ae4e-7639aa0d68c6" data-loc="206:43-206:101" data-file-name="app/admin/errors/page.tsx">
                  <div className="flex items-center justify-between" data-unique-id="12a8cf76-e8d1-449c-a74f-90ef9f4f978a" data-loc="207:18-207:69" data-file-name="app/admin/errors/page.tsx">
                    <div className="flex-1 min-w-0" data-unique-id="f0883e83-9f3e-41aa-9104-b2937d8cd054" data-loc="208:20-208:52" data-file-name="app/admin/errors/page.tsx">
                      <div className="flex items-center" data-unique-id="3192c167-aaf7-45ee-839b-b20922ce4619" data-loc="209:22-209:57" data-file-name="app/admin/errors/page.tsx">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${error.severity === 'critical' ? 'text-red-500' : error.severity === 'high' ? 'text-orange-500' : error.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                        <p className="text-sm font-medium text-gray-900 truncate" data-unique-id="7ba9bae4-7db0-44b4-8a4e-98f8a65df925" data-loc="211:24-211:82" data-file-name="app/admin/errors/page.tsx">
                          {error.message}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center" data-unique-id="aae4bbf3-f158-48a2-bb86-3b64d1958594" data-loc="215:22-215:62" data-file-name="app/admin/errors/page.tsx">
                        <span className="text-xs text-gray-500 mr-2" data-unique-id="fd8a9189-d489-4a19-ad64-745c9996412b" data-loc="216:24-216:69" data-file-name="app/admin/errors/page.tsx">
                          {error.createdAt ? format(new Date(error.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown date'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(error.severity || 'medium')}`} data-unique-id="a51653a9-b5f3-4d37-936e-1dccadbfe296" data-loc="219:24-219:164" data-file-name="app/admin/errors/page.tsx">
                          {error.severity || 'medium'}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(error.status || 'new')}`} data-unique-id="cf1a93b2-10dc-4df2-8c54-654bc8610c94" data-loc="222:24-222:162" data-file-name="app/admin/errors/page.tsx">
                          {error.status || 'new'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2" data-unique-id="490f0ae8-c7f1-4778-9dec-58263b4414cd" data-loc="227:20-227:65" data-file-name="app/admin/errors/page.tsx">
                      <button onClick={() => toggleExpanded(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="bd20666f-9ed6-44f8-89bf-1e0cfe248a7f" data-loc="228:22-228:118" data-file-name="app/admin/errors/page.tsx">
                        {expandedErrors[error.id] ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                      </button>
                      <button onClick={() => viewErrorDetails(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="6ea0d478-febb-4d18-ab6f-bbf8e460f865" data-loc="231:22-231:120" data-file-name="app/admin/errors/page.tsx">
                        <Eye className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedErrors[error.id] && <div className="mt-3 pl-7 text-sm" data-unique-id="2a139733-204b-4e1c-b7e8-2b712f3c69ab" data-loc="238:47-238:82" data-file-name="app/admin/errors/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-unique-id="061871a7-2bfc-43b7-852d-97ff4eadc8ab" data-loc="239:22-239:77" data-file-name="app/admin/errors/page.tsx">
                        <div data-unique-id="a000018b-f36a-45cc-a53b-b3625f3953f5" data-loc="240:24-240:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="5ffdf53d-c6df-4543-92a6-536234e0f792" data-loc="241:26-241:55" data-file-name="app/admin/errors/page.tsx">Type: <span className="text-gray-700" data-unique-id="6d84314a-a439-475c-aaf1-ef9b917fd8c5" data-loc="241:61-241:93" data-file-name="app/admin/errors/page.tsx">{error.type || 'Unknown'}</span></p>
                          <p className="text-gray-500" data-unique-id="cb46801c-3460-447c-92b5-9d06d3308620" data-loc="242:26-242:55" data-file-name="app/admin/errors/page.tsx">URL: <span className="text-gray-700" data-unique-id="02972438-7c71-4c73-b236-e1d00ff727d7" data-loc="242:60-242:92" data-file-name="app/admin/errors/page.tsx">{error.url || 'N/A'}</span></p>
                          <p className="text-gray-500" data-unique-id="aea6ad7e-1352-4506-9f3a-e471898bd28a" data-loc="243:26-243:55" data-file-name="app/admin/errors/page.tsx">User: <span className="text-gray-700" data-unique-id="2b9f47a3-f773-418e-994a-7bee501ccac2" data-loc="243:61-243:93" data-file-name="app/admin/errors/page.tsx">{error.userId || 'Anonymous'}</span></p>
                          <p className="text-gray-500" data-unique-id="1dd0e8f3-f2f1-42be-89d4-6dcd2b5d0058" data-loc="244:26-244:55" data-file-name="app/admin/errors/page.tsx">Role: <span className="text-gray-700" data-unique-id="975ef0a3-eb45-4ca9-aa02-82d8150bd6ff" data-loc="244:61-244:93" data-file-name="app/admin/errors/page.tsx">{error.userRole || 'N/A'}</span></p>
                        </div>
                        <div data-unique-id="ac8b2c96-d213-4e5e-8e2d-03cf00ed10ff" data-loc="246:24-246:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="2c762569-1314-492e-8f07-c77cab6df819" data-loc="247:26-247:55" data-file-name="app/admin/errors/page.tsx">User Agent: <span className="text-gray-700 truncate block" data-unique-id="c6ff7c16-674b-488f-85db-d4ead26a01b0" data-loc="247:67-247:114" data-file-name="app/admin/errors/page.tsx">{error.userAgent || 'N/A'}</span></p>
                          {error.resolvedAt && <p className="text-gray-500" data-unique-id="fcfe2aa5-dc6e-4fe6-aa16-a1500ed1a204" data-loc="248:47-248:76" data-file-name="app/admin/errors/page.tsx">
                              Resolved: <span className="text-gray-700" data-unique-id="cb97a01f-4d71-497b-9b93-19205dace5ff" data-loc="249:40-249:72" data-file-name="app/admin/errors/page.tsx">
                                {format(new Date(error.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                              {error.resolvedBy && <span className="text-gray-700" data-unique-id="8ee7d18b-284d-400d-a629-405784e8c456" data-loc="252:51-252:83" data-file-name="app/admin/errors/page.tsx"> by {error.resolvedBy}</span>}
                            </p>}
                        </div>
                      </div>
                      
                      {/* Stack trace */}
                      {error.stack && <div className="mt-2" data-unique-id="2aba9acf-75be-4df0-9231-681a0c71eac4" data-loc="258:38-258:60" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500 mb-1" data-unique-id="8d0ce5ed-d873-48b3-935b-750ad8134449" data-loc="259:26-259:60" data-file-name="app/admin/errors/page.tsx">Stack Trace:</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="3e01d89a-806a-4861-bae6-7e12a720e04a" data-loc="260:26-260:100" data-file-name="app/admin/errors/page.tsx">
                            {error.stack}
                          </pre>
                        </div>}
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-2" data-unique-id="b8a9d8b5-2163-4f41-8bf2-867a5ddfb741" data-loc="266:22-266:59" data-file-name="app/admin/errors/page.tsx">
                        {error.status !== 'investigating' && <button onClick={() => updateErrorStatus(error.id, 'investigating')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200" data-unique-id="ac3792fb-e5e1-4046-b271-7b5ab904c427" data-loc="267:61-267:285" data-file-name="app/admin/errors/page.tsx">
                            <Clock className="h-3 w-3 mr-1" /> Investigating
                          </button>}
                        
                        {error.status !== 'resolved' && <button onClick={() => updateErrorStatus(error.id, 'resolved')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200" data-unique-id="2b3b9fcc-ab5a-4dbf-b7c6-c59321838804" data-loc="271:56-271:272" data-file-name="app/admin/errors/page.tsx">
                            <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                          </button>}
                        
                        {error.status !== 'ignored' && <button onClick={() => updateErrorStatus(error.id, 'ignored')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200" data-unique-id="f122e9c4-70b3-4503-8221-b52aaeb981fc" data-loc="275:55-275:267" data-file-name="app/admin/errors/page.tsx">
                            <XCircle className="h-3 w-3 mr-1" /> Ignore
                          </button>}
                      </div>
                    </div>}
                </li>)}
            </ul> : <div className="text-center py-12" data-unique-id="35bf60d9-fdd0-40b5-8c0f-f8152ff40303" data-loc="281:20-281:55" data-file-name="app/admin/errors/page.tsx">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100" data-unique-id="e920b405-87dd-49d4-afed-11eb3e4ce52b" data-loc="282:14-282:107" data-file-name="app/admin/errors/page.tsx">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900" data-unique-id="083923f0-b450-49cd-981b-a2380582b252" data-loc="285:14-285:69" data-file-name="app/admin/errors/page.tsx">No errors found</h3>
              <p className="mt-1 text-sm text-gray-500" data-unique-id="978ec130-f1ab-462a-96fd-2dd7c8c81fa3" data-loc="286:14-286:56" data-file-name="app/admin/errors/page.tsx">
                {filter.search || filter.status || filter.severity ? 'Try changing your search filters' : 'No errors have been logged yet'}
              </p>
            </div>}
        </div>
        
        {/* Error Detail Modal */}
        {selectedError && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="45528b60-9015-45aa-b9ff-4c35d3edc196" data-loc="293:26-293:118" data-file-name="app/admin/errors/page.tsx">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="806149e4-cc85-4d2e-8908-6f2fb3e32814" data-loc="294:12-294:99" data-file-name="app/admin/errors/page.tsx">
              <div className="flex justify-between items-center mb-4" data-unique-id="a4bc9bdf-17e6-446f-932c-64c5aa50dbc2" data-loc="295:14-295:70" data-file-name="app/admin/errors/page.tsx">
                <h3 className="text-lg font-medium text-gray-900" data-unique-id="1a795a4b-a9d7-40d2-bab6-f04f753f9ed4" data-loc="296:16-296:66" data-file-name="app/admin/errors/page.tsx">Error Details</h3>
                <button onClick={() => setSelectedError(null)} className="text-gray-400 hover:text-gray-500" data-unique-id="9142b7d9-7a35-48a0-876e-57f74cb8d528" data-loc="297:16-297:109" data-file-name="app/admin/errors/page.tsx">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4" data-unique-id="2c3b47da-cfe3-496d-b117-e09e9523dda6" data-loc="302:14-302:41" data-file-name="app/admin/errors/page.tsx">
                <div data-unique-id="70460c73-057e-465d-84b8-d262d5ff656d" data-loc="303:16-303:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="c210ee87-7bec-41b8-8362-ea202f84835b" data-loc="304:18-304:68" data-file-name="app/admin/errors/page.tsx">Message</h4>
                  <p className="mt-1 text-sm text-gray-900" data-unique-id="75f0d07c-d756-4501-a119-486a7de1845c" data-loc="305:18-305:60" data-file-name="app/admin/errors/page.tsx">{selectedError.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="c30f8b0c-bd76-469b-a18d-0ac7da3508ba" data-loc="308:16-308:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="d2928932-6b7b-468c-a475-689433895e7e" data-loc="309:18-309:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="ade3ee90-b1f9-49cd-a6bd-22cf14610249" data-loc="310:20-310:70" data-file-name="app/admin/errors/page.tsx">Type</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="4a3c6b70-7a74-4bef-91e3-e293e7ad11c1" data-loc="311:20-311:62" data-file-name="app/admin/errors/page.tsx">{selectedError.type || 'Unknown'}</p>
                  </div>
                  <div data-unique-id="0ed513a0-c467-4759-aaf5-04ed8f5a4e3c" data-loc="313:18-313:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="6c610222-7163-4014-9ea7-0d09526dabb1" data-loc="314:20-314:70" data-file-name="app/admin/errors/page.tsx">Severity</h4>
                    <p className="mt-1" data-unique-id="892e87ba-5721-44f7-a5cf-ea2c9fd445c0" data-loc="315:20-315:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedError.severity || 'medium')}`} data-unique-id="e5065885-a206-43ce-82c9-89f6b3ba75ef" data-loc="316:22-316:170" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.severity || 'medium'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="5ffcb69d-f139-45e0-8d6d-a90d3c3c74e5" data-loc="321:18-321:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="bf15a003-3267-46ba-8040-b43dff931a42" data-loc="322:20-322:70" data-file-name="app/admin/errors/page.tsx">Status</h4>
                    <p className="mt-1" data-unique-id="62d01f07-8d43-4a2d-87a4-44aacd92156b" data-loc="323:20-323:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedError.status || 'new')}`} data-unique-id="2efcc5f2-573e-421c-bcb7-3dc90e4939e5" data-loc="324:22-324:163" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.status || 'new'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="cd4a924e-68e7-44a7-ab16-eb8b87d6e17e" data-loc="329:18-329:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="f3c4501a-432f-47cc-b38d-445c0f4c0578" data-loc="330:20-330:70" data-file-name="app/admin/errors/page.tsx">Timestamp</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="6f704aef-ec13-417c-8d1f-488dd3c5012f" data-loc="331:20-331:62" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.createdAt ? format(new Date(selectedError.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div data-unique-id="de91814f-5e4f-4840-a5b6-f5310b4d849d" data-loc="337:16-337:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="68df0777-13f4-4636-a12c-84716dfa0cb3" data-loc="338:18-338:68" data-file-name="app/admin/errors/page.tsx">URL</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="0b1f4dab-86c0-4527-929a-b25a3a88c74f" data-loc="339:18-339:70" data-file-name="app/admin/errors/page.tsx">{selectedError.url || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="a8785bd1-5a67-483b-8e56-21ae32c65fbe" data-loc="342:16-342:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="a6e0d345-76d0-49b2-86ef-4c21bd531398" data-loc="343:18-343:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="2e2b847e-ff47-40e6-a468-164fc2e58993" data-loc="344:20-344:70" data-file-name="app/admin/errors/page.tsx">User ID</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="fbd1758e-807e-4802-8f9b-497e66a2f749" data-loc="345:20-345:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userId || 'Anonymous'}</p>
                  </div>
                  <div data-unique-id="d1093b1b-b333-48cb-bbed-c8abb4ef6826" data-loc="347:18-347:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="87a4ede6-91ad-41fa-962f-fb3e3bc8c2d5" data-loc="348:20-348:70" data-file-name="app/admin/errors/page.tsx">User Role</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="48cb56ba-c1a4-4c0d-b19c-c2ca30f968ee" data-loc="349:20-349:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userRole || 'N/A'}</p>
                  </div>
                </div>
                
                <div data-unique-id="6473f17c-f1a1-44e3-bb92-074290492ac2" data-loc="353:16-353:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="6166ba37-5179-4451-8f2d-454be43aaf5b" data-loc="354:18-354:68" data-file-name="app/admin/errors/page.tsx">User Agent</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="194bfa89-64da-4c11-bb9c-5b70d7d8704d" data-loc="355:18-355:70" data-file-name="app/admin/errors/page.tsx">{selectedError.userAgent || 'N/A'}</p>
                </div>
                
                {selectedError.resolvedAt && <div className="grid grid-cols-2 gap-4" data-unique-id="6669da1e-11c7-4036-83b9-e5bc461d9cf4" data-loc="358:45-358:85" data-file-name="app/admin/errors/page.tsx">
                    <div data-unique-id="383b2dee-7bbd-4c42-898c-a3566ffd9930" data-loc="359:20-359:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="4aaffcd1-2279-495d-8336-ed40b247219d" data-loc="360:22-360:72" data-file-name="app/admin/errors/page.tsx">Resolved At</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="561fa99e-9f34-4bc7-bdc0-3401182e7c50" data-loc="361:22-361:64" data-file-name="app/admin/errors/page.tsx">
                        {format(new Date(selectedError.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div data-unique-id="ca2af2b5-8918-4a2e-bdd1-e3fcc636940e" data-loc="365:20-365:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="2b310cca-1c2b-4643-a0d7-d8f9e8bc8a43" data-loc="366:22-366:72" data-file-name="app/admin/errors/page.tsx">Resolved By</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="cf00a85a-f3dc-442d-94a8-4909a92be0ad" data-loc="367:22-367:64" data-file-name="app/admin/errors/page.tsx">{selectedError.resolvedBy || 'N/A'}</p>
                    </div>
                  </div>}
                
                {selectedError.metadata && <div data-unique-id="7f709d44-e862-4f89-b37d-4de3eb0e7b93" data-loc="371:43-371:48" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="407f13f7-c276-42c1-a4b1-237d6560246c" data-loc="372:20-372:70" data-file-name="app/admin/errors/page.tsx">Metadata</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="3149d54c-ca70-43a5-b105-d50cd6d29ad2" data-loc="373:20-373:99" data-file-name="app/admin/errors/page.tsx">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>}
                
                {selectedError.stack && <div data-unique-id="4d6e66cf-a279-4f43-a2ec-82fe9d6e55e4" data-loc="378:40-378:45" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="8e7d942b-cd30-4701-baf5-fc5b48eae84e" data-loc="379:20-379:70" data-file-name="app/admin/errors/page.tsx">Stack Trace</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-60" data-unique-id="89c46c77-5279-4430-8ba1-b5eb186918ee" data-loc="380:20-380:99" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.stack}
                    </pre>
                  </div>}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3" data-unique-id="86ed8ca8-27db-4f16-8c26-465618faeb17" data-loc="386:14-386:63" data-file-name="app/admin/errors/page.tsx">
                <button onClick={() => setSelectedError(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="5adcc5f7-423b-4d45-b45d-5e38c0e202cd" data-loc="387:16-387:261" data-file-name="app/admin/errors/page.tsx">
                  Close
                </button>
                
                {selectedError.status !== 'resolved' && <button onClick={() => {
              updateErrorStatus(selectedError.id, 'resolved');
            }} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="ef481924-44c0-402f-9fc9-2f0dbf1b8d33" data-loc="391:56-393:220" data-file-name="app/admin/errors/page.tsx">
                    Mark as Resolved
                  </button>}
              </div>
            </div>
          </div>}
      </main>
    </div>;
}