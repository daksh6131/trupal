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
  return <div className="min-h-screen bg-gray-50" data-unique-id="cfc43ff7-db7c-4f0f-9f4a-5f47deb8f719" data-loc="142:9-142:50" data-file-name="app/admin/errors/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="3d6b180a-8b84-4f3d-8102-6025aa6a49e2" data-loc="144:6-144:42" data-file-name="app/admin/errors/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="0747a859-599a-4955-b075-87f7a3eab587" data-loc="145:8-145:61" data-file-name="app/admin/errors/page.tsx">
          <div className="flex items-center" data-unique-id="5a5ef78a-2239-48c0-9cf1-3cd983bed3c1" data-loc="146:10-146:45" data-file-name="app/admin/errors/page.tsx">
            <button onClick={() => router.push("/admin")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="ac4c83e2-4aa4-4c94-a96c-9cf2e657a90e" data-loc="147:12-147:110" data-file-name="app/admin/errors/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="4c7cbc74-2290-487b-acf5-a20e1107358b" data-loc="150:12-150:60" data-file-name="app/admin/errors/page.tsx">
              Error Logs
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="11d6672f-4ccc-4a68-b58a-db52e60bc408" data-loc="158:6-158:60" data-file-name="app/admin/errors/page.tsx">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4" data-unique-id="1109cb45-3b75-4443-b729-d7204e657ddf" data-loc="160:8-160:62" data-file-name="app/admin/errors/page.tsx">
          <div className="relative flex-grow" data-unique-id="75c7e5ac-99ee-47e6-9fe0-168a532745f1" data-loc="161:10-161:46" data-file-name="app/admin/errors/page.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="32064bd2-10dd-4001-87ca-46931d242ea0" data-loc="162:12-162:98" data-file-name="app/admin/errors/page.tsx">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search errors..." value={filter.search || ''} onChange={e => setFilter({
            ...filter,
            search: e.target.value
          })} data-unique-id="5038fb8a-a71a-489d-97f9-c0c8004ee4d4" data-loc="165:12-168:16" data-file-name="app/admin/errors/page.tsx" />
          </div>
          
          <div className="flex gap-2" data-unique-id="a8614911-ffac-42ca-8755-17c3029d076b" data-loc="171:10-171:38" data-file-name="app/admin/errors/page.tsx">
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.status || ''} onChange={e => setFilter({
            ...filter,
            status: e.target.value || undefined
          })} data-unique-id="231dbe94-3f41-48c6-9d99-960663307927" data-loc="172:12-175:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="4a98d37b-cfd4-4908-b486-6aaab1725508" data-loc="176:14-176:31" data-file-name="app/admin/errors/page.tsx">All Statuses</option>
              <option value="new" data-unique-id="e3f0088c-6101-4433-82cf-50149d28d66c" data-loc="177:14-177:34" data-file-name="app/admin/errors/page.tsx">New</option>
              <option value="investigating" data-unique-id="85b9b8d2-66aa-46b3-a886-de0212213d71" data-loc="178:14-178:44" data-file-name="app/admin/errors/page.tsx">Investigating</option>
              <option value="resolved" data-unique-id="29a6aec1-cf5c-41da-b2b1-c2565961536d" data-loc="179:14-179:39" data-file-name="app/admin/errors/page.tsx">Resolved</option>
              <option value="ignored" data-unique-id="69252fc2-c4bf-4030-84a7-d70fa0b7834e" data-loc="180:14-180:38" data-file-name="app/admin/errors/page.tsx">Ignored</option>
            </select>
            
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.severity || ''} onChange={e => setFilter({
            ...filter,
            severity: e.target.value || undefined
          })} data-unique-id="c4a1ea6d-5bc0-4457-87da-d983dd5e76c2" data-loc="183:12-186:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="2875f4f7-0275-4d99-b39d-9ad06e2e6c11" data-loc="187:14-187:31" data-file-name="app/admin/errors/page.tsx">All Severities</option>
              <option value="low" data-unique-id="7b4d0fb6-13b2-4b5f-804d-b7726e1e5c81" data-loc="188:14-188:34" data-file-name="app/admin/errors/page.tsx">Low</option>
              <option value="medium" data-unique-id="41a54c23-a627-4f03-8066-a7d968cd4e69" data-loc="189:14-189:37" data-file-name="app/admin/errors/page.tsx">Medium</option>
              <option value="high" data-unique-id="042fe4e8-d170-4fe5-bc99-f23cff617d1d" data-loc="190:14-190:35" data-file-name="app/admin/errors/page.tsx">High</option>
              <option value="critical" data-unique-id="d4c86a0d-af41-44f9-b640-162baea068bc" data-loc="191:14-191:39" data-file-name="app/admin/errors/page.tsx">Critical</option>
            </select>
            
            <button onClick={fetchErrors} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="46d309e3-e29e-43c8-acbe-200bca76ab0a" data-loc="194:12-194:269" data-file-name="app/admin/errors/page.tsx">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Error List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="bf89c3e1-f76e-44e0-b328-aa6d613b9e52" data-loc="201:8-201:71" data-file-name="app/admin/errors/page.tsx">
          {loading ? <div className="text-center py-12" data-unique-id="42cbc8b6-6343-4beb-8950-41cc2b3dabb5" data-loc="202:21-202:56" data-file-name="app/admin/errors/page.tsx">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" data-unique-id="4e5f17da-8b2b-4e8c-b966-1c5ae60d28e2" data-loc="203:14-203:113" data-file-name="app/admin/errors/page.tsx"></div>
              <p className="mt-4 text-gray-600" data-unique-id="8ceae3ac-fa4d-4f29-951d-fc8002daafdc" data-loc="204:14-204:48" data-file-name="app/admin/errors/page.tsx">Loading error logs...</p>
            </div> : filteredErrors.length > 0 ? <ul className="divide-y divide-gray-200" data-unique-id="793a36a7-6bfa-4b7d-93c4-e0fc213004c6" data-loc="205:49-205:90" data-file-name="app/admin/errors/page.tsx">
              {filteredErrors.map(error => <li key={error.id} className="px-6 py-4 hover:bg-gray-50" data-unique-id="5c924645-3349-4405-82cb-4d7cd223a266" data-loc="206:43-206:101" data-file-name="app/admin/errors/page.tsx">
                  <div className="flex items-center justify-between" data-unique-id="1ead3b72-5dd4-4dd4-a28e-0c0f6b3741e0" data-loc="207:18-207:69" data-file-name="app/admin/errors/page.tsx">
                    <div className="flex-1 min-w-0" data-unique-id="0f666dd2-ea89-4b8a-aa88-24625c9a8514" data-loc="208:20-208:52" data-file-name="app/admin/errors/page.tsx">
                      <div className="flex items-center" data-unique-id="4df9ad8c-9a92-4998-9602-864b0674240c" data-loc="209:22-209:57" data-file-name="app/admin/errors/page.tsx">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${error.severity === 'critical' ? 'text-red-500' : error.severity === 'high' ? 'text-orange-500' : error.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                        <p className="text-sm font-medium text-gray-900 truncate" data-unique-id="3e9a5505-768f-4b14-8240-fa636a4b8f0e" data-loc="211:24-211:82" data-file-name="app/admin/errors/page.tsx">
                          {error.message}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center" data-unique-id="bbb0cda0-4a08-4181-a629-391850f809e0" data-loc="215:22-215:62" data-file-name="app/admin/errors/page.tsx">
                        <span className="text-xs text-gray-500 mr-2" data-unique-id="85c05604-5969-43af-b60e-e94cdd0e2c7f" data-loc="216:24-216:69" data-file-name="app/admin/errors/page.tsx">
                          {error.createdAt ? format(new Date(error.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown date'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(error.severity || 'medium')}`} data-unique-id="124299ba-f15d-4b76-b74d-ed6aebf6eac5" data-loc="219:24-219:164" data-file-name="app/admin/errors/page.tsx">
                          {error.severity || 'medium'}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(error.status || 'new')}`} data-unique-id="709087d0-38f4-44d6-9380-44703d771f5f" data-loc="222:24-222:162" data-file-name="app/admin/errors/page.tsx">
                          {error.status || 'new'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2" data-unique-id="144a4d17-161f-41b7-a5f8-03d8cf40fe1c" data-loc="227:20-227:65" data-file-name="app/admin/errors/page.tsx">
                      <button onClick={() => toggleExpanded(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="9aadcb2a-14cf-45a5-b54c-fd474c2dd17c" data-loc="228:22-228:118" data-file-name="app/admin/errors/page.tsx">
                        {expandedErrors[error.id] ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                      </button>
                      <button onClick={() => viewErrorDetails(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="45544894-9b65-4150-a105-6c8b34489070" data-loc="231:22-231:120" data-file-name="app/admin/errors/page.tsx">
                        <Eye className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedErrors[error.id] && <div className="mt-3 pl-7 text-sm" data-unique-id="ff89c2a1-cbcd-4808-9e8b-70ccdcc17b9e" data-loc="238:47-238:82" data-file-name="app/admin/errors/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-unique-id="24cd14d5-b7d6-4321-bf5b-7c159d522669" data-loc="239:22-239:77" data-file-name="app/admin/errors/page.tsx">
                        <div data-unique-id="50206449-6453-4589-955e-f066fdc824d1" data-loc="240:24-240:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="3518be98-93d8-407a-8123-c63b0bcf2b62" data-loc="241:26-241:55" data-file-name="app/admin/errors/page.tsx">Type: <span className="text-gray-700" data-unique-id="94bf017d-468e-48c0-b4cd-1ad3d8d5fb0f" data-loc="241:61-241:93" data-file-name="app/admin/errors/page.tsx">{error.type || 'Unknown'}</span></p>
                          <p className="text-gray-500" data-unique-id="ba45dcdc-3291-415e-8f2a-cc3399b510c8" data-loc="242:26-242:55" data-file-name="app/admin/errors/page.tsx">URL: <span className="text-gray-700" data-unique-id="940e77de-2dc4-4ccf-b749-f5d86f9107bb" data-loc="242:60-242:92" data-file-name="app/admin/errors/page.tsx">{error.url || 'N/A'}</span></p>
                          <p className="text-gray-500" data-unique-id="ecc244de-6dd4-4a19-a2b6-28ee3dd4ef5f" data-loc="243:26-243:55" data-file-name="app/admin/errors/page.tsx">User: <span className="text-gray-700" data-unique-id="75cf0b9c-9f6c-49be-939d-39d8b8442764" data-loc="243:61-243:93" data-file-name="app/admin/errors/page.tsx">{error.userId || 'Anonymous'}</span></p>
                          <p className="text-gray-500" data-unique-id="4a5b6b89-4185-49f5-b44d-c5cbcf224e4e" data-loc="244:26-244:55" data-file-name="app/admin/errors/page.tsx">Role: <span className="text-gray-700" data-unique-id="36f7e40e-ff98-41ca-9f27-5ad9fabdfb0b" data-loc="244:61-244:93" data-file-name="app/admin/errors/page.tsx">{error.userRole || 'N/A'}</span></p>
                        </div>
                        <div data-unique-id="7e082413-b8db-4b7c-9a35-db1f1157012c" data-loc="246:24-246:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="483eddc5-7380-415d-af83-062e8b86d635" data-loc="247:26-247:55" data-file-name="app/admin/errors/page.tsx">User Agent: <span className="text-gray-700 truncate block" data-unique-id="305e0a4d-2d13-4082-b3e6-21a405766a2a" data-loc="247:67-247:114" data-file-name="app/admin/errors/page.tsx">{error.userAgent || 'N/A'}</span></p>
                          {error.resolvedAt && <p className="text-gray-500" data-unique-id="f9d9b7f5-0f89-4283-95ca-84bf47fb7322" data-loc="248:47-248:76" data-file-name="app/admin/errors/page.tsx">
                              Resolved: <span className="text-gray-700" data-unique-id="9bec360f-878f-4533-92a8-3db771b65bda" data-loc="249:40-249:72" data-file-name="app/admin/errors/page.tsx">
                                {format(new Date(error.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                              {error.resolvedBy && <span className="text-gray-700" data-unique-id="e45a2aea-00ce-4ea6-bc54-ce694c988ef8" data-loc="252:51-252:83" data-file-name="app/admin/errors/page.tsx"> by {error.resolvedBy}</span>}
                            </p>}
                        </div>
                      </div>
                      
                      {/* Stack trace */}
                      {error.stack && <div className="mt-2" data-unique-id="b356c342-8099-4cdc-96ff-80f007b90138" data-loc="258:38-258:60" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500 mb-1" data-unique-id="75f90307-bfb8-424e-8cdf-744e4ee27f80" data-loc="259:26-259:60" data-file-name="app/admin/errors/page.tsx">Stack Trace:</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="e8867a71-fc1e-472e-a6ec-af088a88ded0" data-loc="260:26-260:100" data-file-name="app/admin/errors/page.tsx">
                            {error.stack}
                          </pre>
                        </div>}
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-2" data-unique-id="2376422c-4cc1-4d7c-b556-e5fe7f8e13f3" data-loc="266:22-266:59" data-file-name="app/admin/errors/page.tsx">
                        {error.status !== 'investigating' && <button onClick={() => updateErrorStatus(error.id, 'investigating')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200" data-unique-id="1d3da516-2689-4e42-9c14-7b871aa4fcde" data-loc="267:61-267:285" data-file-name="app/admin/errors/page.tsx">
                            <Clock className="h-3 w-3 mr-1" /> Investigating
                          </button>}
                        
                        {error.status !== 'resolved' && <button onClick={() => updateErrorStatus(error.id, 'resolved')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200" data-unique-id="e75d33e7-ec7b-4763-bc09-b9ada635fc71" data-loc="271:56-271:272" data-file-name="app/admin/errors/page.tsx">
                            <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                          </button>}
                        
                        {error.status !== 'ignored' && <button onClick={() => updateErrorStatus(error.id, 'ignored')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200" data-unique-id="0a75cf56-198d-4e09-89a8-3fa1cdf75634" data-loc="275:55-275:267" data-file-name="app/admin/errors/page.tsx">
                            <XCircle className="h-3 w-3 mr-1" /> Ignore
                          </button>}
                      </div>
                    </div>}
                </li>)}
            </ul> : <div className="text-center py-12" data-unique-id="d3983012-1c08-4138-96bb-4491b9e9d005" data-loc="281:20-281:55" data-file-name="app/admin/errors/page.tsx">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100" data-unique-id="442004dd-3bd3-4384-9cef-9b53e339ad1c" data-loc="282:14-282:107" data-file-name="app/admin/errors/page.tsx">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900" data-unique-id="130c7a91-529f-46df-98a8-f69bd059378c" data-loc="285:14-285:69" data-file-name="app/admin/errors/page.tsx">No errors found</h3>
              <p className="mt-1 text-sm text-gray-500" data-unique-id="f8969fe1-329a-4707-8102-5097e4cc8ead" data-loc="286:14-286:56" data-file-name="app/admin/errors/page.tsx">
                {filter.search || filter.status || filter.severity ? 'Try changing your search filters' : 'No errors have been logged yet'}
              </p>
            </div>}
        </div>
        
        {/* Error Detail Modal */}
        {selectedError && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="c4d681f4-10ff-415d-bc35-bb44485e083e" data-loc="293:26-293:118" data-file-name="app/admin/errors/page.tsx">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="0af6c004-7f4d-4310-a580-1aaeba5e45ba" data-loc="294:12-294:99" data-file-name="app/admin/errors/page.tsx">
              <div className="flex justify-between items-center mb-4" data-unique-id="e7e7ae19-a7fb-4a41-a728-6ef759d9b9f4" data-loc="295:14-295:70" data-file-name="app/admin/errors/page.tsx">
                <h3 className="text-lg font-medium text-gray-900" data-unique-id="b3891efe-34c0-4590-a9d2-457ea928ba12" data-loc="296:16-296:66" data-file-name="app/admin/errors/page.tsx">Error Details</h3>
                <button onClick={() => setSelectedError(null)} className="text-gray-400 hover:text-gray-500" data-unique-id="9cf2cad7-6cc7-4a3d-8784-2c281337d50d" data-loc="297:16-297:109" data-file-name="app/admin/errors/page.tsx">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4" data-unique-id="37218ec5-783d-4b4d-bb69-543e3d148a1c" data-loc="302:14-302:41" data-file-name="app/admin/errors/page.tsx">
                <div data-unique-id="d8741aa7-84d3-4e8f-a3a2-8403c4caea71" data-loc="303:16-303:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="fa7cd8a1-2424-4c87-a30d-f90c42236eaf" data-loc="304:18-304:68" data-file-name="app/admin/errors/page.tsx">Message</h4>
                  <p className="mt-1 text-sm text-gray-900" data-unique-id="1517127a-1af2-4e1a-bf91-ad16989a7b99" data-loc="305:18-305:60" data-file-name="app/admin/errors/page.tsx">{selectedError.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="6ec6edcb-5819-432d-9e4a-676a06eeee1f" data-loc="308:16-308:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="40dd4a2e-e838-483f-8d4c-9302fd27c19e" data-loc="309:18-309:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="3738cc59-4348-48de-9bdf-c1169d4bb068" data-loc="310:20-310:70" data-file-name="app/admin/errors/page.tsx">Type</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="d5d4ddb3-df5c-40f5-8479-8f7fa9ec1f75" data-loc="311:20-311:62" data-file-name="app/admin/errors/page.tsx">{selectedError.type || 'Unknown'}</p>
                  </div>
                  <div data-unique-id="13e26951-76e4-4e16-838f-014e7a04b2f2" data-loc="313:18-313:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="2e9c00f8-8b47-4d11-9e40-cd26ba9cb9b8" data-loc="314:20-314:70" data-file-name="app/admin/errors/page.tsx">Severity</h4>
                    <p className="mt-1" data-unique-id="46ac77aa-1b17-4ee5-ab8f-249b9a9c0e5a" data-loc="315:20-315:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedError.severity || 'medium')}`} data-unique-id="ec76dcac-c82c-4bcd-a3a6-f241d621f2f3" data-loc="316:22-316:170" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.severity || 'medium'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="07c253e4-34ed-4edf-94f4-85cf9e8c0a66" data-loc="321:18-321:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="693b7c26-3c8f-4d5f-95ec-a7284630b60f" data-loc="322:20-322:70" data-file-name="app/admin/errors/page.tsx">Status</h4>
                    <p className="mt-1" data-unique-id="dc68cf4a-c939-4e15-8340-ada07a445264" data-loc="323:20-323:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedError.status || 'new')}`} data-unique-id="1e0a2411-d596-48f7-a85e-37c73d8e2e8e" data-loc="324:22-324:163" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.status || 'new'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="9796df02-8834-49cf-877e-412747d9d18b" data-loc="329:18-329:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="2108c723-927b-4054-a3cd-96c5bb2295fa" data-loc="330:20-330:70" data-file-name="app/admin/errors/page.tsx">Timestamp</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="6e2a6dbc-bab2-4c43-b9ea-d40994285508" data-loc="331:20-331:62" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.createdAt ? format(new Date(selectedError.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div data-unique-id="bb002663-804f-468b-b9be-9ea758b8dd3f" data-loc="337:16-337:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="bc4bbf41-24b8-4b54-b995-94560597495e" data-loc="338:18-338:68" data-file-name="app/admin/errors/page.tsx">URL</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="ec4315d6-a8db-46eb-abc2-c1e2d292fcbf" data-loc="339:18-339:70" data-file-name="app/admin/errors/page.tsx">{selectedError.url || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="eebc179e-1b11-4f5e-872f-9cc149f90d78" data-loc="342:16-342:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="7d5d865e-ad76-4a68-b802-2b532770f1f7" data-loc="343:18-343:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="4c29bfa5-fc4f-4fe1-a48e-a1e022f272c0" data-loc="344:20-344:70" data-file-name="app/admin/errors/page.tsx">User ID</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="2f80b009-a68e-4324-9521-1a706719daae" data-loc="345:20-345:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userId || 'Anonymous'}</p>
                  </div>
                  <div data-unique-id="d302b770-dd6f-4122-b65e-ec225a9aeae0" data-loc="347:18-347:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="cf2548b8-f422-4244-9b2a-9b6d573d7cd8" data-loc="348:20-348:70" data-file-name="app/admin/errors/page.tsx">User Role</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="773addf3-09fd-4cfc-a7bf-01321e11301a" data-loc="349:20-349:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userRole || 'N/A'}</p>
                  </div>
                </div>
                
                <div data-unique-id="8561e94f-f871-48a3-b21b-21be08cce7f7" data-loc="353:16-353:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="b8f42576-53c0-4717-b05a-140eeaf64c98" data-loc="354:18-354:68" data-file-name="app/admin/errors/page.tsx">User Agent</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="8fcf831c-2763-455f-9610-1a4c7d2c6485" data-loc="355:18-355:70" data-file-name="app/admin/errors/page.tsx">{selectedError.userAgent || 'N/A'}</p>
                </div>
                
                {selectedError.resolvedAt && <div className="grid grid-cols-2 gap-4" data-unique-id="99ab300a-9bb1-42d6-b922-48e556a05f95" data-loc="358:45-358:85" data-file-name="app/admin/errors/page.tsx">
                    <div data-unique-id="52ed16ed-ce97-49f4-968f-ca28f5e9124d" data-loc="359:20-359:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="53efa2fe-c6a8-469b-bf63-c454c32c574e" data-loc="360:22-360:72" data-file-name="app/admin/errors/page.tsx">Resolved At</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="b3f98036-9dfe-474c-87bd-42da2fb3510d" data-loc="361:22-361:64" data-file-name="app/admin/errors/page.tsx">
                        {format(new Date(selectedError.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div data-unique-id="7d99e9b7-8a51-4466-8794-eed2bc9f4ece" data-loc="365:20-365:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="987700b4-2163-4afb-b1d7-f21c1bbeb282" data-loc="366:22-366:72" data-file-name="app/admin/errors/page.tsx">Resolved By</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="9a7ed01b-ced5-43dd-bb19-ec1dbac555e2" data-loc="367:22-367:64" data-file-name="app/admin/errors/page.tsx">{selectedError.resolvedBy || 'N/A'}</p>
                    </div>
                  </div>}
                
                {selectedError.metadata && <div data-unique-id="d7052992-927f-4c5e-8811-ab1ddeed4dbe" data-loc="371:43-371:48" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="1f98b455-cf14-45af-9926-fc1c24a4f817" data-loc="372:20-372:70" data-file-name="app/admin/errors/page.tsx">Metadata</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="feaefa31-d397-4743-a086-55878fb5da56" data-loc="373:20-373:99" data-file-name="app/admin/errors/page.tsx">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>}
                
                {selectedError.stack && <div data-unique-id="4bf1c9bc-54df-4000-a950-e9f39e328e61" data-loc="378:40-378:45" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="de678957-edeb-4cc4-a226-497423f576cc" data-loc="379:20-379:70" data-file-name="app/admin/errors/page.tsx">Stack Trace</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-60" data-unique-id="f9cfbd2f-73e8-4241-87d6-0f30b508f135" data-loc="380:20-380:99" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.stack}
                    </pre>
                  </div>}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3" data-unique-id="dfba3734-5143-4856-9eb7-c7fbb27ac30f" data-loc="386:14-386:63" data-file-name="app/admin/errors/page.tsx">
                <button onClick={() => setSelectedError(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="0d661804-760f-4a23-a0f2-d94b522303eb" data-loc="387:16-387:261" data-file-name="app/admin/errors/page.tsx">
                  Close
                </button>
                
                {selectedError.status !== 'resolved' && <button onClick={() => {
              updateErrorStatus(selectedError.id, 'resolved');
            }} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="a76ae20d-31b6-4bb7-bbd5-69c8b281a30e" data-loc="391:56-393:220" data-file-name="app/admin/errors/page.tsx">
                    Mark as Resolved
                  </button>}
              </div>
            </div>
          </div>}
      </main>
    </div>;
}