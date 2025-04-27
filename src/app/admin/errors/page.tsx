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
  return <div className="min-h-screen bg-gray-50" data-unique-id="81f45a7a-1e13-4d0b-94d7-27677bb957f0" data-loc="142:9-142:50" data-file-name="app/admin/errors/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="0cfa33ac-ead0-4854-acb5-a96ab1e9bb5f" data-loc="144:6-144:42" data-file-name="app/admin/errors/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="a1818e9d-0afd-4793-9ae3-f5640fab93bb" data-loc="145:8-145:61" data-file-name="app/admin/errors/page.tsx">
          <div className="flex items-center" data-unique-id="75ab1ccf-4c49-41c0-a8b0-bdba6977dfa6" data-loc="146:10-146:45" data-file-name="app/admin/errors/page.tsx">
            <button onClick={() => router.push("/admin")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="719329af-c9d1-4eda-8984-c3db040a4d77" data-loc="147:12-147:110" data-file-name="app/admin/errors/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="8f4c05b3-24a9-4de8-99e7-06165319d5f2" data-loc="150:12-150:60" data-file-name="app/admin/errors/page.tsx">
              Error Logs
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="7cde442b-d6b2-4960-86bc-933457223049" data-loc="158:6-158:60" data-file-name="app/admin/errors/page.tsx">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4" data-unique-id="afacfff3-f2cb-45f3-8d2c-12950dc045c0" data-loc="160:8-160:62" data-file-name="app/admin/errors/page.tsx">
          <div className="relative flex-grow" data-unique-id="f3370300-9e56-47e8-b3b9-062decdcbb83" data-loc="161:10-161:46" data-file-name="app/admin/errors/page.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="573ec2c1-675b-4b2d-9793-c95920f7ca0b" data-loc="162:12-162:98" data-file-name="app/admin/errors/page.tsx">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search errors..." value={filter.search || ''} onChange={e => setFilter({
            ...filter,
            search: e.target.value
          })} data-unique-id="a833894a-2543-4678-b31c-5c99e1843bd0" data-loc="165:12-168:16" data-file-name="app/admin/errors/page.tsx" />
          </div>
          
          <div className="flex gap-2" data-unique-id="7d62494b-c81e-4145-9948-9216e2dad72e" data-loc="171:10-171:38" data-file-name="app/admin/errors/page.tsx">
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.status || ''} onChange={e => setFilter({
            ...filter,
            status: e.target.value || undefined
          })} data-unique-id="1e5b4cc8-03d0-40ec-91c5-daae186a4862" data-loc="172:12-175:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="09de977b-40f4-4a6f-9fa5-23fed6f879ca" data-loc="176:14-176:31" data-file-name="app/admin/errors/page.tsx">All Statuses</option>
              <option value="new" data-unique-id="f35e4283-0428-44dd-996d-ce232e722a0c" data-loc="177:14-177:34" data-file-name="app/admin/errors/page.tsx">New</option>
              <option value="investigating" data-unique-id="c903a927-9563-468f-8862-1149cdb645ba" data-loc="178:14-178:44" data-file-name="app/admin/errors/page.tsx">Investigating</option>
              <option value="resolved" data-unique-id="fa77d099-d4fb-4f3a-9087-589037dc08e1" data-loc="179:14-179:39" data-file-name="app/admin/errors/page.tsx">Resolved</option>
              <option value="ignored" data-unique-id="5d93b6f1-616d-4b7a-8445-b78b9e6c24af" data-loc="180:14-180:38" data-file-name="app/admin/errors/page.tsx">Ignored</option>
            </select>
            
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.severity || ''} onChange={e => setFilter({
            ...filter,
            severity: e.target.value || undefined
          })} data-unique-id="db940352-ccad-4381-bde8-b86e64510647" data-loc="183:12-186:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="1f799d5d-b677-4f34-ac9a-9c05c9de2171" data-loc="187:14-187:31" data-file-name="app/admin/errors/page.tsx">All Severities</option>
              <option value="low" data-unique-id="9057984a-b115-41e9-b1b9-04ace06c586e" data-loc="188:14-188:34" data-file-name="app/admin/errors/page.tsx">Low</option>
              <option value="medium" data-unique-id="d4677703-14d6-447c-8aaf-6969e126a194" data-loc="189:14-189:37" data-file-name="app/admin/errors/page.tsx">Medium</option>
              <option value="high" data-unique-id="951407ed-16a7-4929-b528-a9045de778ee" data-loc="190:14-190:35" data-file-name="app/admin/errors/page.tsx">High</option>
              <option value="critical" data-unique-id="e136b6b0-1bc1-4ddc-a958-6d1fb5225237" data-loc="191:14-191:39" data-file-name="app/admin/errors/page.tsx">Critical</option>
            </select>
            
            <button onClick={fetchErrors} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="c9ca4148-e19f-4587-b54f-103eae2104aa" data-loc="194:12-194:269" data-file-name="app/admin/errors/page.tsx">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Error List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="96b31fdd-d1cc-40c9-88c8-d07558bf089a" data-loc="201:8-201:71" data-file-name="app/admin/errors/page.tsx">
          {loading ? <div className="text-center py-12" data-unique-id="f2bb94b6-b80d-4744-87d4-7ebc7de34e88" data-loc="202:21-202:56" data-file-name="app/admin/errors/page.tsx">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" data-unique-id="deed2807-2a0d-4b71-8f16-a289d13c22f4" data-loc="203:14-203:113" data-file-name="app/admin/errors/page.tsx"></div>
              <p className="mt-4 text-gray-600" data-unique-id="fce3fc01-1afc-40bb-ad09-2bd83cd336d6" data-loc="204:14-204:48" data-file-name="app/admin/errors/page.tsx">Loading error logs...</p>
            </div> : filteredErrors.length > 0 ? <ul className="divide-y divide-gray-200" data-unique-id="3e204a4b-2d53-45c6-9143-4044b0e0504a" data-loc="205:49-205:90" data-file-name="app/admin/errors/page.tsx">
              {filteredErrors.map(error => <li key={error.id} className="px-6 py-4 hover:bg-gray-50" data-unique-id="da55f0ea-f987-4211-8361-4212c9d08b10" data-loc="206:43-206:101" data-file-name="app/admin/errors/page.tsx">
                  <div className="flex items-center justify-between" data-unique-id="527b89b7-2d59-4a8d-81f9-be411b204dc4" data-loc="207:18-207:69" data-file-name="app/admin/errors/page.tsx">
                    <div className="flex-1 min-w-0" data-unique-id="dc93c9b0-cbcc-406e-9b14-f49a13aedc17" data-loc="208:20-208:52" data-file-name="app/admin/errors/page.tsx">
                      <div className="flex items-center" data-unique-id="bf2a7431-0d50-4ea9-b85f-9e78c69edb58" data-loc="209:22-209:57" data-file-name="app/admin/errors/page.tsx">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${error.severity === 'critical' ? 'text-red-500' : error.severity === 'high' ? 'text-orange-500' : error.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                        <p className="text-sm font-medium text-gray-900 truncate" data-unique-id="cf41b9ee-2e3f-4d4f-8eeb-87c4d562cc80" data-loc="211:24-211:82" data-file-name="app/admin/errors/page.tsx">
                          {error.message}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center" data-unique-id="d515cabe-cc9b-4342-8859-90e22e0771fa" data-loc="215:22-215:62" data-file-name="app/admin/errors/page.tsx">
                        <span className="text-xs text-gray-500 mr-2" data-unique-id="99bb1e6f-fd85-425e-997a-f921e61cf566" data-loc="216:24-216:69" data-file-name="app/admin/errors/page.tsx">
                          {error.createdAt ? format(new Date(error.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown date'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(error.severity || 'medium')}`} data-unique-id="7d1a96a9-c4b9-489c-a8e6-d8f1b2c89318" data-loc="219:24-219:164" data-file-name="app/admin/errors/page.tsx">
                          {error.severity || 'medium'}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(error.status || 'new')}`} data-unique-id="94af7ebc-d787-464a-adcf-55e4326a49e3" data-loc="222:24-222:162" data-file-name="app/admin/errors/page.tsx">
                          {error.status || 'new'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2" data-unique-id="cedd0be4-a469-415d-945d-ef9b9ea54213" data-loc="227:20-227:65" data-file-name="app/admin/errors/page.tsx">
                      <button onClick={() => toggleExpanded(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="4b297fba-80c8-4143-93a8-eb73e3ad7079" data-loc="228:22-228:118" data-file-name="app/admin/errors/page.tsx">
                        {expandedErrors[error.id] ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                      </button>
                      <button onClick={() => viewErrorDetails(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="981ee3cf-9a8e-4267-a879-8b124adff880" data-loc="231:22-231:120" data-file-name="app/admin/errors/page.tsx">
                        <Eye className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedErrors[error.id] && <div className="mt-3 pl-7 text-sm" data-unique-id="10bd03ab-9348-4d32-a37b-c3805de9872d" data-loc="238:47-238:82" data-file-name="app/admin/errors/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-unique-id="7b02a02f-e809-4834-b1d7-f3b9147d3661" data-loc="239:22-239:77" data-file-name="app/admin/errors/page.tsx">
                        <div data-unique-id="cd687de6-3a60-4290-be35-a5fd6f5d649b" data-loc="240:24-240:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="3e42a31b-2df9-4ac0-80c4-8507f71710b2" data-loc="241:26-241:55" data-file-name="app/admin/errors/page.tsx">Type: <span className="text-gray-700" data-unique-id="57007101-cb8b-4d31-865b-dc8cf31bac72" data-loc="241:61-241:93" data-file-name="app/admin/errors/page.tsx">{error.type || 'Unknown'}</span></p>
                          <p className="text-gray-500" data-unique-id="6a02704d-84fd-40fd-be42-67677fd9e9f6" data-loc="242:26-242:55" data-file-name="app/admin/errors/page.tsx">URL: <span className="text-gray-700" data-unique-id="c475a3bc-8d3c-4a04-a6dd-73f684d0650c" data-loc="242:60-242:92" data-file-name="app/admin/errors/page.tsx">{error.url || 'N/A'}</span></p>
                          <p className="text-gray-500" data-unique-id="b16aad99-5bf0-41b8-b0f3-1382da3e4253" data-loc="243:26-243:55" data-file-name="app/admin/errors/page.tsx">User: <span className="text-gray-700" data-unique-id="eb8a5961-6bca-4b6e-a11d-da7128c54330" data-loc="243:61-243:93" data-file-name="app/admin/errors/page.tsx">{error.userId || 'Anonymous'}</span></p>
                          <p className="text-gray-500" data-unique-id="3d437b27-250f-4bd7-b670-6ce73281f59d" data-loc="244:26-244:55" data-file-name="app/admin/errors/page.tsx">Role: <span className="text-gray-700" data-unique-id="f62284a9-069f-4766-bfe8-4ec9c760ee1d" data-loc="244:61-244:93" data-file-name="app/admin/errors/page.tsx">{error.userRole || 'N/A'}</span></p>
                        </div>
                        <div data-unique-id="525d6fa9-9e34-487c-98e7-212984a33a12" data-loc="246:24-246:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="00e3d3d3-f0cc-45f2-952c-2bfb49e978af" data-loc="247:26-247:55" data-file-name="app/admin/errors/page.tsx">User Agent: <span className="text-gray-700 truncate block" data-unique-id="c6376450-987f-4943-830a-5b0463ad5660" data-loc="247:67-247:114" data-file-name="app/admin/errors/page.tsx">{error.userAgent || 'N/A'}</span></p>
                          {error.resolvedAt && <p className="text-gray-500" data-unique-id="60952439-e727-4a66-86d4-55584d356940" data-loc="248:47-248:76" data-file-name="app/admin/errors/page.tsx">
                              Resolved: <span className="text-gray-700" data-unique-id="7e341038-4661-43ee-a68f-7672f49a3f24" data-loc="249:40-249:72" data-file-name="app/admin/errors/page.tsx">
                                {format(new Date(error.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                              {error.resolvedBy && <span className="text-gray-700" data-unique-id="bfa78303-97de-429f-bdca-eb6119169854" data-loc="252:51-252:83" data-file-name="app/admin/errors/page.tsx"> by {error.resolvedBy}</span>}
                            </p>}
                        </div>
                      </div>
                      
                      {/* Stack trace */}
                      {error.stack && <div className="mt-2" data-unique-id="b266ecbd-5565-4df9-b920-82af2afcb852" data-loc="258:38-258:60" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500 mb-1" data-unique-id="7d1f3af1-a305-4f6c-b8ad-3fc9be5b314d" data-loc="259:26-259:60" data-file-name="app/admin/errors/page.tsx">Stack Trace:</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="b884df1a-4bb8-4322-a2be-57dedfa758ae" data-loc="260:26-260:100" data-file-name="app/admin/errors/page.tsx">
                            {error.stack}
                          </pre>
                        </div>}
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-2" data-unique-id="decc2cae-baa9-4d88-a366-463011c7d226" data-loc="266:22-266:59" data-file-name="app/admin/errors/page.tsx">
                        {error.status !== 'investigating' && <button onClick={() => updateErrorStatus(error.id, 'investigating')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200" data-unique-id="52fb2a60-a312-40aa-808f-e1185fc490e2" data-loc="267:61-267:285" data-file-name="app/admin/errors/page.tsx">
                            <Clock className="h-3 w-3 mr-1" /> Investigating
                          </button>}
                        
                        {error.status !== 'resolved' && <button onClick={() => updateErrorStatus(error.id, 'resolved')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200" data-unique-id="b1c7bea1-7f11-4c55-9224-2b83b0699693" data-loc="271:56-271:272" data-file-name="app/admin/errors/page.tsx">
                            <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                          </button>}
                        
                        {error.status !== 'ignored' && <button onClick={() => updateErrorStatus(error.id, 'ignored')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200" data-unique-id="daf0aded-155d-4960-99f8-c609ee82f11f" data-loc="275:55-275:267" data-file-name="app/admin/errors/page.tsx">
                            <XCircle className="h-3 w-3 mr-1" /> Ignore
                          </button>}
                      </div>
                    </div>}
                </li>)}
            </ul> : <div className="text-center py-12" data-unique-id="03049c52-1ccb-406c-bc81-85df85a8f4b4" data-loc="281:20-281:55" data-file-name="app/admin/errors/page.tsx">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100" data-unique-id="81d8ed36-910c-4747-9f87-5dbdffaf171a" data-loc="282:14-282:107" data-file-name="app/admin/errors/page.tsx">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900" data-unique-id="7d77fe1c-70cb-4bd9-b870-b5c6f5b0a392" data-loc="285:14-285:69" data-file-name="app/admin/errors/page.tsx">No errors found</h3>
              <p className="mt-1 text-sm text-gray-500" data-unique-id="2daebf23-a79f-49be-8a7c-3d0408107065" data-loc="286:14-286:56" data-file-name="app/admin/errors/page.tsx">
                {filter.search || filter.status || filter.severity ? 'Try changing your search filters' : 'No errors have been logged yet'}
              </p>
            </div>}
        </div>
        
        {/* Error Detail Modal */}
        {selectedError && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="9fd813f2-c5d6-429b-aa47-5f56f1d77bf9" data-loc="293:26-293:118" data-file-name="app/admin/errors/page.tsx">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="4eb452e2-e4d6-416c-bfad-5f901ccb833a" data-loc="294:12-294:99" data-file-name="app/admin/errors/page.tsx">
              <div className="flex justify-between items-center mb-4" data-unique-id="b6320c73-fd4d-400c-8b34-5228c4a81b45" data-loc="295:14-295:70" data-file-name="app/admin/errors/page.tsx">
                <h3 className="text-lg font-medium text-gray-900" data-unique-id="2b4237a6-6910-492e-a0b2-f2b3296195d0" data-loc="296:16-296:66" data-file-name="app/admin/errors/page.tsx">Error Details</h3>
                <button onClick={() => setSelectedError(null)} className="text-gray-400 hover:text-gray-500" data-unique-id="cf29412b-0622-4e29-9731-1604d82428f3" data-loc="297:16-297:109" data-file-name="app/admin/errors/page.tsx">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4" data-unique-id="f5b35b15-1fde-4652-ac49-b322a1af0f0f" data-loc="302:14-302:41" data-file-name="app/admin/errors/page.tsx">
                <div data-unique-id="75b9706e-5664-4c8c-9305-4c02377d7123" data-loc="303:16-303:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="cf13a8ad-fde5-4021-bde2-bf20448980d9" data-loc="304:18-304:68" data-file-name="app/admin/errors/page.tsx">Message</h4>
                  <p className="mt-1 text-sm text-gray-900" data-unique-id="0261c1a2-8532-460c-9598-5f7ba100d6ac" data-loc="305:18-305:60" data-file-name="app/admin/errors/page.tsx">{selectedError.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="2eaa340e-f68e-4402-9072-8ce3244a85d2" data-loc="308:16-308:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="185d211d-d084-4bb5-becb-ebd2e77f5384" data-loc="309:18-309:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="152803b4-4ccd-4fcc-ad7a-6470505581e2" data-loc="310:20-310:70" data-file-name="app/admin/errors/page.tsx">Type</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="eafa2bd3-046a-49d3-a170-79bd91fefbb5" data-loc="311:20-311:62" data-file-name="app/admin/errors/page.tsx">{selectedError.type || 'Unknown'}</p>
                  </div>
                  <div data-unique-id="5a15832e-7e87-481a-8d5d-1af1b1a81753" data-loc="313:18-313:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="93ffa77e-dce7-481d-9365-1b75f474259d" data-loc="314:20-314:70" data-file-name="app/admin/errors/page.tsx">Severity</h4>
                    <p className="mt-1" data-unique-id="2642f1e2-4520-47f7-8405-823676046b83" data-loc="315:20-315:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedError.severity || 'medium')}`} data-unique-id="0ea23514-341d-41dd-b350-35fe34827886" data-loc="316:22-316:170" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.severity || 'medium'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="11404d77-2127-44f8-a7f8-3072f7c0bcf5" data-loc="321:18-321:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="c887e956-f14d-4ff7-a019-855462b5567f" data-loc="322:20-322:70" data-file-name="app/admin/errors/page.tsx">Status</h4>
                    <p className="mt-1" data-unique-id="3e6d213c-3be5-4c8f-a56e-4c709beb9cad" data-loc="323:20-323:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedError.status || 'new')}`} data-unique-id="11c97e1e-91ca-4929-9bec-62011ad34c3d" data-loc="324:22-324:163" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.status || 'new'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="796a3434-2586-4ae6-bab5-dad906b997d3" data-loc="329:18-329:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="24ce6fa0-5c89-484e-bc1a-1ee2029e1e30" data-loc="330:20-330:70" data-file-name="app/admin/errors/page.tsx">Timestamp</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="8c4dc26a-3b0d-49ca-a418-473d4a742dbc" data-loc="331:20-331:62" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.createdAt ? format(new Date(selectedError.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div data-unique-id="21a154bc-4bc4-424e-9747-c43b1419944f" data-loc="337:16-337:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="065c0001-bc84-47d8-be14-f081d96fe455" data-loc="338:18-338:68" data-file-name="app/admin/errors/page.tsx">URL</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="f8fcd95c-4971-4d16-9db1-c260ed5c8136" data-loc="339:18-339:70" data-file-name="app/admin/errors/page.tsx">{selectedError.url || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="fbb7b367-3303-41f3-ace5-e07cf2f0dd5b" data-loc="342:16-342:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="7b88d7a0-30f2-423e-85d6-8c13921ce569" data-loc="343:18-343:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="fe760671-1b55-488a-8318-284faefbb338" data-loc="344:20-344:70" data-file-name="app/admin/errors/page.tsx">User ID</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="6664c3e3-be7c-45b5-b30a-48540e2d0dc5" data-loc="345:20-345:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userId || 'Anonymous'}</p>
                  </div>
                  <div data-unique-id="cb95e193-aa16-4b69-8fe1-6c78050c9814" data-loc="347:18-347:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="7c8d0922-4040-46f3-b963-da0440c9dc84" data-loc="348:20-348:70" data-file-name="app/admin/errors/page.tsx">User Role</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="2dbe29e4-9a3c-4eef-8012-895b3a59b09a" data-loc="349:20-349:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userRole || 'N/A'}</p>
                  </div>
                </div>
                
                <div data-unique-id="49eebd01-3ef3-4d8a-a721-ce9b76df7527" data-loc="353:16-353:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="bfee1810-7dcc-4b42-8b67-55c513b8904f" data-loc="354:18-354:68" data-file-name="app/admin/errors/page.tsx">User Agent</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="df5d6a1b-13d1-4583-8d6a-7db0b5dddf9b" data-loc="355:18-355:70" data-file-name="app/admin/errors/page.tsx">{selectedError.userAgent || 'N/A'}</p>
                </div>
                
                {selectedError.resolvedAt && <div className="grid grid-cols-2 gap-4" data-unique-id="0894bf78-0978-4f41-a377-852195aa4809" data-loc="358:45-358:85" data-file-name="app/admin/errors/page.tsx">
                    <div data-unique-id="0d17395b-699b-4d69-a032-ece5d0612af5" data-loc="359:20-359:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="0f99101b-2b8a-4637-ab1b-7fd4466dd692" data-loc="360:22-360:72" data-file-name="app/admin/errors/page.tsx">Resolved At</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="4b391961-14e0-4fa0-8f85-e1925e24b752" data-loc="361:22-361:64" data-file-name="app/admin/errors/page.tsx">
                        {format(new Date(selectedError.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div data-unique-id="07b4da02-7493-4094-b08e-40dfb2c57cd2" data-loc="365:20-365:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="d809d1b1-0ecb-45dc-8520-2b4a62615a20" data-loc="366:22-366:72" data-file-name="app/admin/errors/page.tsx">Resolved By</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="3d303d78-6313-49a5-81ed-f0d39cb51ac3" data-loc="367:22-367:64" data-file-name="app/admin/errors/page.tsx">{selectedError.resolvedBy || 'N/A'}</p>
                    </div>
                  </div>}
                
                {selectedError.metadata && <div data-unique-id="7bf85452-d76a-4c70-9394-70b29ab3552d" data-loc="371:43-371:48" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="bdce1a2d-5905-48ee-9d8b-9ade031b6930" data-loc="372:20-372:70" data-file-name="app/admin/errors/page.tsx">Metadata</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="2a88485e-150d-4263-99f9-6edc57550558" data-loc="373:20-373:99" data-file-name="app/admin/errors/page.tsx">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>}
                
                {selectedError.stack && <div data-unique-id="bbb728a4-7f14-4a10-9bfe-ed9506875a52" data-loc="378:40-378:45" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="59318da8-27bc-4f82-98b5-e1e4cdd3050b" data-loc="379:20-379:70" data-file-name="app/admin/errors/page.tsx">Stack Trace</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-60" data-unique-id="eaa34805-2aca-4a69-86af-baff309f6f49" data-loc="380:20-380:99" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.stack}
                    </pre>
                  </div>}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3" data-unique-id="213c5a09-8998-4777-bdc1-ccac251c6cf0" data-loc="386:14-386:63" data-file-name="app/admin/errors/page.tsx">
                <button onClick={() => setSelectedError(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="1adb2c77-b514-4a11-8103-11d56bf5ef9d" data-loc="387:16-387:261" data-file-name="app/admin/errors/page.tsx">
                  Close
                </button>
                
                {selectedError.status !== 'resolved' && <button onClick={() => {
              updateErrorStatus(selectedError.id, 'resolved');
            }} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="5ce4e266-bd2d-44a6-bb50-83651e12681f" data-loc="391:56-393:220" data-file-name="app/admin/errors/page.tsx">
                    Mark as Resolved
                  </button>}
              </div>
            </div>
          </div>}
      </main>
    </div>;
}