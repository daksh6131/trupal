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
  return <div className="min-h-screen bg-gray-50" data-unique-id="0d791fcf-df89-4118-9ba7-2802c9a63bbf" data-loc="142:9-142:50" data-file-name="app/admin/errors/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="96544028-aef4-4fa1-9621-547b01f23707" data-loc="144:6-144:42" data-file-name="app/admin/errors/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="10cf38c3-afc0-4368-80b7-ab45956a0d1d" data-loc="145:8-145:61" data-file-name="app/admin/errors/page.tsx">
          <div className="flex items-center" data-unique-id="854a2c44-ff51-4e37-b106-ba844cb57701" data-loc="146:10-146:45" data-file-name="app/admin/errors/page.tsx">
            <button onClick={() => router.push("/admin")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="e2e5b866-0184-41e8-b8f1-28edbf42b714" data-loc="147:12-147:110" data-file-name="app/admin/errors/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="5aa57506-c004-42d8-ab51-bde34c3f317a" data-loc="150:12-150:60" data-file-name="app/admin/errors/page.tsx">
              Error Logs
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="f171121b-2e05-4079-b579-bd95bc7cb07e" data-loc="158:6-158:60" data-file-name="app/admin/errors/page.tsx">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4" data-unique-id="667a53a1-8180-4d04-beb2-f5a553e1a122" data-loc="160:8-160:62" data-file-name="app/admin/errors/page.tsx">
          <div className="relative flex-grow" data-unique-id="30b812a3-6429-43d3-ab23-8c69dd678e46" data-loc="161:10-161:46" data-file-name="app/admin/errors/page.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="e5cdf31e-8508-4669-a4aa-4bf1a4dd7b60" data-loc="162:12-162:98" data-file-name="app/admin/errors/page.tsx">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search errors..." value={filter.search || ''} onChange={e => setFilter({
            ...filter,
            search: e.target.value
          })} data-unique-id="8fad9da0-3f7f-4ed3-a33f-e0ebb53c16f5" data-loc="165:12-168:16" data-file-name="app/admin/errors/page.tsx" />
          </div>
          
          <div className="flex gap-2" data-unique-id="988b227a-6b2e-4272-92df-bbb6a752f19e" data-loc="171:10-171:38" data-file-name="app/admin/errors/page.tsx">
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.status || ''} onChange={e => setFilter({
            ...filter,
            status: e.target.value || undefined
          })} data-unique-id="f6d678de-ae8f-4f7e-8571-25706d455a80" data-loc="172:12-175:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="0714f2f1-f9d4-450d-9ae6-4cc4c48ab17e" data-loc="176:14-176:31" data-file-name="app/admin/errors/page.tsx">All Statuses</option>
              <option value="new" data-unique-id="8769864f-f647-45fe-8330-34df4933487e" data-loc="177:14-177:34" data-file-name="app/admin/errors/page.tsx">New</option>
              <option value="investigating" data-unique-id="9878720a-8899-4c4f-b08e-4c43f245c6e1" data-loc="178:14-178:44" data-file-name="app/admin/errors/page.tsx">Investigating</option>
              <option value="resolved" data-unique-id="c9ca14a2-c233-4da9-9a9c-650633468722" data-loc="179:14-179:39" data-file-name="app/admin/errors/page.tsx">Resolved</option>
              <option value="ignored" data-unique-id="f3dd2b72-51af-482b-ae96-389994b6e051" data-loc="180:14-180:38" data-file-name="app/admin/errors/page.tsx">Ignored</option>
            </select>
            
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.severity || ''} onChange={e => setFilter({
            ...filter,
            severity: e.target.value || undefined
          })} data-unique-id="fe476f98-23e3-4497-b2bc-7b104e503345" data-loc="183:12-186:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="1886f25a-860d-4a04-b134-dbe438382951" data-loc="187:14-187:31" data-file-name="app/admin/errors/page.tsx">All Severities</option>
              <option value="low" data-unique-id="f997dd7c-815f-4897-9bd0-7e7a9420c334" data-loc="188:14-188:34" data-file-name="app/admin/errors/page.tsx">Low</option>
              <option value="medium" data-unique-id="5d99d58b-992b-4da1-bd27-9b12082c33be" data-loc="189:14-189:37" data-file-name="app/admin/errors/page.tsx">Medium</option>
              <option value="high" data-unique-id="d525e805-17ad-4af5-8fa1-0aa4ec29dc0b" data-loc="190:14-190:35" data-file-name="app/admin/errors/page.tsx">High</option>
              <option value="critical" data-unique-id="663f0352-ce98-4e34-9dba-2f456bbff17c" data-loc="191:14-191:39" data-file-name="app/admin/errors/page.tsx">Critical</option>
            </select>
            
            <button onClick={fetchErrors} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="acb3ed01-0064-4208-a242-8b7c5a269b0e" data-loc="194:12-194:269" data-file-name="app/admin/errors/page.tsx">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Error List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="f828b6bb-7ad2-4eee-a8cc-2919248069a5" data-loc="201:8-201:71" data-file-name="app/admin/errors/page.tsx">
          {loading ? <div className="text-center py-12" data-unique-id="8e98debb-abcf-44f0-a38e-beadc54dc915" data-loc="202:21-202:56" data-file-name="app/admin/errors/page.tsx">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" data-unique-id="74fac7d8-5e7c-433a-9382-d66ce690fded" data-loc="203:14-203:113" data-file-name="app/admin/errors/page.tsx"></div>
              <p className="mt-4 text-gray-600" data-unique-id="084ff9c1-f331-4016-953e-ec5e6e140735" data-loc="204:14-204:48" data-file-name="app/admin/errors/page.tsx">Loading error logs...</p>
            </div> : filteredErrors.length > 0 ? <ul className="divide-y divide-gray-200" data-unique-id="3d740f86-6df8-40a6-928e-20470d12530a" data-loc="205:49-205:90" data-file-name="app/admin/errors/page.tsx">
              {filteredErrors.map(error => <li key={error.id} className="px-6 py-4 hover:bg-gray-50" data-unique-id="d608ae70-35f1-45e8-b959-cc4f2000cce1" data-loc="206:43-206:101" data-file-name="app/admin/errors/page.tsx">
                  <div className="flex items-center justify-between" data-unique-id="102d278f-b228-4318-afa3-0188fea6ad61" data-loc="207:18-207:69" data-file-name="app/admin/errors/page.tsx">
                    <div className="flex-1 min-w-0" data-unique-id="13a23af3-c1d4-4562-be1a-426c74b0f546" data-loc="208:20-208:52" data-file-name="app/admin/errors/page.tsx">
                      <div className="flex items-center" data-unique-id="f1115663-4f52-42b7-8cfe-705b5416d29a" data-loc="209:22-209:57" data-file-name="app/admin/errors/page.tsx">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${error.severity === 'critical' ? 'text-red-500' : error.severity === 'high' ? 'text-orange-500' : error.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                        <p className="text-sm font-medium text-gray-900 truncate" data-unique-id="9718b7fa-8025-4d6e-9a7c-1f7f1260c480" data-loc="211:24-211:82" data-file-name="app/admin/errors/page.tsx">
                          {error.message}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center" data-unique-id="51004156-5616-4598-af52-fadb19d28e02" data-loc="215:22-215:62" data-file-name="app/admin/errors/page.tsx">
                        <span className="text-xs text-gray-500 mr-2" data-unique-id="1315aeed-8fe0-4cc3-a7dc-60a330c532a7" data-loc="216:24-216:69" data-file-name="app/admin/errors/page.tsx">
                          {error.createdAt ? format(new Date(error.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown date'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(error.severity || 'medium')}`} data-unique-id="2dcaea6c-ab2b-46da-b261-4abc3b50bf8a" data-loc="219:24-219:164" data-file-name="app/admin/errors/page.tsx">
                          {error.severity || 'medium'}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(error.status || 'new')}`} data-unique-id="13d709b5-98bc-4fc6-bc35-c45a01ebff68" data-loc="222:24-222:162" data-file-name="app/admin/errors/page.tsx">
                          {error.status || 'new'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2" data-unique-id="46df2eea-3ea8-4067-a59b-9a8688bfb497" data-loc="227:20-227:65" data-file-name="app/admin/errors/page.tsx">
                      <button onClick={() => toggleExpanded(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="cee8085f-1075-4fcb-8df3-751ec019ae08" data-loc="228:22-228:118" data-file-name="app/admin/errors/page.tsx">
                        {expandedErrors[error.id] ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                      </button>
                      <button onClick={() => viewErrorDetails(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="2b09aabb-80ca-41b1-8572-bcc4474123b0" data-loc="231:22-231:120" data-file-name="app/admin/errors/page.tsx">
                        <Eye className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedErrors[error.id] && <div className="mt-3 pl-7 text-sm" data-unique-id="5aff1979-89ea-4f01-b7d9-a4b5121992b1" data-loc="238:47-238:82" data-file-name="app/admin/errors/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-unique-id="af85a9bb-11d1-4fa0-8a94-ab348e089988" data-loc="239:22-239:77" data-file-name="app/admin/errors/page.tsx">
                        <div data-unique-id="a41e5b92-37f1-48e9-a8b1-1def53aad989" data-loc="240:24-240:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="8f983791-b77d-4dbd-b956-a46feaf00fa2" data-loc="241:26-241:55" data-file-name="app/admin/errors/page.tsx">Type: <span className="text-gray-700" data-unique-id="b61f25bc-3201-4014-8a43-bb9b7ba688a0" data-loc="241:61-241:93" data-file-name="app/admin/errors/page.tsx">{error.type || 'Unknown'}</span></p>
                          <p className="text-gray-500" data-unique-id="2e51ff8a-5af0-4cc0-b972-66c7ecd5aef7" data-loc="242:26-242:55" data-file-name="app/admin/errors/page.tsx">URL: <span className="text-gray-700" data-unique-id="57b2819f-a5f7-4b2f-bda7-e25a89fa8d2f" data-loc="242:60-242:92" data-file-name="app/admin/errors/page.tsx">{error.url || 'N/A'}</span></p>
                          <p className="text-gray-500" data-unique-id="119c316c-c29a-44ad-9c03-5c59c552a394" data-loc="243:26-243:55" data-file-name="app/admin/errors/page.tsx">User: <span className="text-gray-700" data-unique-id="2174b113-48fb-4911-bf08-36d74f6ac092" data-loc="243:61-243:93" data-file-name="app/admin/errors/page.tsx">{error.userId || 'Anonymous'}</span></p>
                          <p className="text-gray-500" data-unique-id="ffe6a02e-e1fb-4daf-8ed7-64d44f185c7b" data-loc="244:26-244:55" data-file-name="app/admin/errors/page.tsx">Role: <span className="text-gray-700" data-unique-id="8a16d4af-b371-4f43-8517-a911d9ada9ac" data-loc="244:61-244:93" data-file-name="app/admin/errors/page.tsx">{error.userRole || 'N/A'}</span></p>
                        </div>
                        <div data-unique-id="36713583-0056-44cf-86cc-a97fe56ece95" data-loc="246:24-246:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="16c495d2-5794-458c-aede-d02a267b58a6" data-loc="247:26-247:55" data-file-name="app/admin/errors/page.tsx">User Agent: <span className="text-gray-700 truncate block" data-unique-id="83b05713-c9c2-43ed-8cf6-52ad31cbe5e0" data-loc="247:67-247:114" data-file-name="app/admin/errors/page.tsx">{error.userAgent || 'N/A'}</span></p>
                          {error.resolvedAt && <p className="text-gray-500" data-unique-id="12c37a2f-1c8b-4fe0-ae6d-a15e71792f73" data-loc="248:47-248:76" data-file-name="app/admin/errors/page.tsx">
                              Resolved: <span className="text-gray-700" data-unique-id="96aa1a8e-b734-4829-a6c8-a831ecd6be7b" data-loc="249:40-249:72" data-file-name="app/admin/errors/page.tsx">
                                {format(new Date(error.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                              {error.resolvedBy && <span className="text-gray-700" data-unique-id="5e180e2e-70a3-4113-9b8a-21fd35abd2a6" data-loc="252:51-252:83" data-file-name="app/admin/errors/page.tsx"> by {error.resolvedBy}</span>}
                            </p>}
                        </div>
                      </div>
                      
                      {/* Stack trace */}
                      {error.stack && <div className="mt-2" data-unique-id="dfbe7787-b10a-49e1-aa59-8f12237d5565" data-loc="258:38-258:60" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500 mb-1" data-unique-id="62ad1f89-b1d5-4861-92c2-388accf960e4" data-loc="259:26-259:60" data-file-name="app/admin/errors/page.tsx">Stack Trace:</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="8b4ec89d-6d13-4397-8203-6c443c6b23c1" data-loc="260:26-260:100" data-file-name="app/admin/errors/page.tsx">
                            {error.stack}
                          </pre>
                        </div>}
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-2" data-unique-id="ad0fccc0-6a42-434a-be63-f605bfa091b1" data-loc="266:22-266:59" data-file-name="app/admin/errors/page.tsx">
                        {error.status !== 'investigating' && <button onClick={() => updateErrorStatus(error.id, 'investigating')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200" data-unique-id="f2da05af-41cc-467d-8dd5-2f8d25868654" data-loc="267:61-267:285" data-file-name="app/admin/errors/page.tsx">
                            <Clock className="h-3 w-3 mr-1" /> Investigating
                          </button>}
                        
                        {error.status !== 'resolved' && <button onClick={() => updateErrorStatus(error.id, 'resolved')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200" data-unique-id="92568b76-4d89-4c8a-b1dd-c72287e2e9b4" data-loc="271:56-271:272" data-file-name="app/admin/errors/page.tsx">
                            <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                          </button>}
                        
                        {error.status !== 'ignored' && <button onClick={() => updateErrorStatus(error.id, 'ignored')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200" data-unique-id="19bb0ba0-d352-458d-8664-59b50ae065ee" data-loc="275:55-275:267" data-file-name="app/admin/errors/page.tsx">
                            <XCircle className="h-3 w-3 mr-1" /> Ignore
                          </button>}
                      </div>
                    </div>}
                </li>)}
            </ul> : <div className="text-center py-12" data-unique-id="2deaeae2-906a-4a31-8781-aa8c91f3499d" data-loc="281:20-281:55" data-file-name="app/admin/errors/page.tsx">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100" data-unique-id="1623ac78-310c-4d13-8099-166573764f74" data-loc="282:14-282:107" data-file-name="app/admin/errors/page.tsx">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900" data-unique-id="069f5758-7ad0-4b42-8739-19ef166673a2" data-loc="285:14-285:69" data-file-name="app/admin/errors/page.tsx">No errors found</h3>
              <p className="mt-1 text-sm text-gray-500" data-unique-id="27215a4a-f685-40e5-8579-7a71bfc1e767" data-loc="286:14-286:56" data-file-name="app/admin/errors/page.tsx">
                {filter.search || filter.status || filter.severity ? 'Try changing your search filters' : 'No errors have been logged yet'}
              </p>
            </div>}
        </div>
        
        {/* Error Detail Modal */}
        {selectedError && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="b2583df4-6cfc-46b0-8375-5834014ff37d" data-loc="293:26-293:118" data-file-name="app/admin/errors/page.tsx">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="5ce7b60f-fdd1-4e19-967b-09f698bc6e1c" data-loc="294:12-294:99" data-file-name="app/admin/errors/page.tsx">
              <div className="flex justify-between items-center mb-4" data-unique-id="055cfeb1-d1c2-43ca-890f-87495031f413" data-loc="295:14-295:70" data-file-name="app/admin/errors/page.tsx">
                <h3 className="text-lg font-medium text-gray-900" data-unique-id="674616aa-988a-4369-a8bb-89c4d3842357" data-loc="296:16-296:66" data-file-name="app/admin/errors/page.tsx">Error Details</h3>
                <button onClick={() => setSelectedError(null)} className="text-gray-400 hover:text-gray-500" data-unique-id="3ea9c88f-b8e4-4ac5-bc4f-711f6309768c" data-loc="297:16-297:109" data-file-name="app/admin/errors/page.tsx">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4" data-unique-id="0bc8ad50-8945-4fbb-9587-f44b68681cfd" data-loc="302:14-302:41" data-file-name="app/admin/errors/page.tsx">
                <div data-unique-id="ca01f8e7-afd7-43f7-b504-26be2f77d726" data-loc="303:16-303:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="b36debd5-bdb3-4583-8568-2eef73fb3f77" data-loc="304:18-304:68" data-file-name="app/admin/errors/page.tsx">Message</h4>
                  <p className="mt-1 text-sm text-gray-900" data-unique-id="b7cf00a5-f7fb-4228-96a0-bff8a12b18c9" data-loc="305:18-305:60" data-file-name="app/admin/errors/page.tsx">{selectedError.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="bdded9ad-197a-4bcc-b495-addb601cc861" data-loc="308:16-308:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="ab08296f-33e9-45dd-9c33-a7541eec8933" data-loc="309:18-309:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="f7be1c91-866b-442f-98e8-6ce94cb010a4" data-loc="310:20-310:70" data-file-name="app/admin/errors/page.tsx">Type</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="6550e008-44f6-48bc-a784-071c1dcef29c" data-loc="311:20-311:62" data-file-name="app/admin/errors/page.tsx">{selectedError.type || 'Unknown'}</p>
                  </div>
                  <div data-unique-id="8d51a141-db68-4a8b-8dbd-fda535abec06" data-loc="313:18-313:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="a6995856-a7ae-4a67-bf06-262478c053ec" data-loc="314:20-314:70" data-file-name="app/admin/errors/page.tsx">Severity</h4>
                    <p className="mt-1" data-unique-id="482b4f32-52cd-4ded-8d61-33e75c4b2dd9" data-loc="315:20-315:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedError.severity || 'medium')}`} data-unique-id="2abf206b-afea-4a18-b09f-701bab76fccf" data-loc="316:22-316:170" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.severity || 'medium'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="da096796-49ab-49c1-a592-c1ea2392e670" data-loc="321:18-321:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="cb7d7b27-26ac-4b1f-be83-feb5a13f65e3" data-loc="322:20-322:70" data-file-name="app/admin/errors/page.tsx">Status</h4>
                    <p className="mt-1" data-unique-id="704f0abe-3ea7-433d-b79a-c5f0c357ce7d" data-loc="323:20-323:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedError.status || 'new')}`} data-unique-id="4ad2fe20-c977-4498-9997-dbd0909b97f0" data-loc="324:22-324:163" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.status || 'new'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="5e680e18-be23-4a7f-b0eb-a8e92dcc6240" data-loc="329:18-329:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="60914bff-1c9f-49b0-b599-abb8e5f9ea30" data-loc="330:20-330:70" data-file-name="app/admin/errors/page.tsx">Timestamp</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="aaed49e6-6871-40c7-aefc-219248d7daf3" data-loc="331:20-331:62" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.createdAt ? format(new Date(selectedError.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div data-unique-id="eeba37fd-eb32-4a26-a604-da343ab3d9ca" data-loc="337:16-337:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="c45ec1d1-c67c-403e-9c34-d2ae3fd6fd38" data-loc="338:18-338:68" data-file-name="app/admin/errors/page.tsx">URL</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="8af42a87-71f1-4e9d-9336-bee1a4af5182" data-loc="339:18-339:70" data-file-name="app/admin/errors/page.tsx">{selectedError.url || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="688f7871-aac5-4007-8ca2-a1a99032f805" data-loc="342:16-342:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="8de3617b-ef5c-478e-b363-e071f87d7a04" data-loc="343:18-343:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="ef752499-5fe4-4c54-95dd-2c87d91b2dd2" data-loc="344:20-344:70" data-file-name="app/admin/errors/page.tsx">User ID</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="57c556e1-c740-4d59-90c7-8742e17692db" data-loc="345:20-345:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userId || 'Anonymous'}</p>
                  </div>
                  <div data-unique-id="7f64c86d-c99f-4f72-94f9-80dc36209f4c" data-loc="347:18-347:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="09b802cd-bcb5-44ab-bcd1-4b3164e10567" data-loc="348:20-348:70" data-file-name="app/admin/errors/page.tsx">User Role</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="4a9e8e56-ccf0-4195-9ba6-9abc667cda5f" data-loc="349:20-349:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userRole || 'N/A'}</p>
                  </div>
                </div>
                
                <div data-unique-id="f24b474d-8896-40da-87a0-60544495ca50" data-loc="353:16-353:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="9888d522-c72b-4705-b813-fba0de477a1e" data-loc="354:18-354:68" data-file-name="app/admin/errors/page.tsx">User Agent</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="ae96f7d9-1f9d-4534-8607-d08c17d56f70" data-loc="355:18-355:70" data-file-name="app/admin/errors/page.tsx">{selectedError.userAgent || 'N/A'}</p>
                </div>
                
                {selectedError.resolvedAt && <div className="grid grid-cols-2 gap-4" data-unique-id="965cbd52-3cc8-45a0-9c54-953bc3ff7693" data-loc="358:45-358:85" data-file-name="app/admin/errors/page.tsx">
                    <div data-unique-id="e2958d31-b607-4315-a78d-60a0bec02174" data-loc="359:20-359:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="2e794e53-0fab-4f37-88ac-31cea274c35a" data-loc="360:22-360:72" data-file-name="app/admin/errors/page.tsx">Resolved At</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="f1c0430f-6f4b-43f8-bf8c-ddae51367f92" data-loc="361:22-361:64" data-file-name="app/admin/errors/page.tsx">
                        {format(new Date(selectedError.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div data-unique-id="dca3f27c-e2c4-4c2b-8dcd-0e8cc2a3ac3d" data-loc="365:20-365:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="f07d14db-a54a-4865-93dc-086cd4b93326" data-loc="366:22-366:72" data-file-name="app/admin/errors/page.tsx">Resolved By</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="6001ee67-b406-4cfc-b1b9-74b38fa81342" data-loc="367:22-367:64" data-file-name="app/admin/errors/page.tsx">{selectedError.resolvedBy || 'N/A'}</p>
                    </div>
                  </div>}
                
                {selectedError.metadata && <div data-unique-id="0320bf55-9ab6-47f9-a2b9-c14fffe628ff" data-loc="371:43-371:48" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="18c07795-4186-4da3-aca3-6333cbb1bb30" data-loc="372:20-372:70" data-file-name="app/admin/errors/page.tsx">Metadata</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="ff9ee65d-caf8-405a-a802-7214ae816bcc" data-loc="373:20-373:99" data-file-name="app/admin/errors/page.tsx">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>}
                
                {selectedError.stack && <div data-unique-id="be7333ce-5d67-41ef-be91-3fde552cadf5" data-loc="378:40-378:45" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="c057cde7-86ea-4698-a0ce-597674eb9965" data-loc="379:20-379:70" data-file-name="app/admin/errors/page.tsx">Stack Trace</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-60" data-unique-id="bca4148c-f3a4-449e-8aff-58e9ffc1dd2d" data-loc="380:20-380:99" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.stack}
                    </pre>
                  </div>}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3" data-unique-id="f3990f58-1439-497e-a440-bd0d2c4d41bb" data-loc="386:14-386:63" data-file-name="app/admin/errors/page.tsx">
                <button onClick={() => setSelectedError(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="91e9175b-bb9e-4d7d-9360-bb93b9d322ac" data-loc="387:16-387:261" data-file-name="app/admin/errors/page.tsx">
                  Close
                </button>
                
                {selectedError.status !== 'resolved' && <button onClick={() => {
              updateErrorStatus(selectedError.id, 'resolved');
            }} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="e6cf3583-e7ab-4850-a4a7-4c8abba6afb8" data-loc="391:56-393:220" data-file-name="app/admin/errors/page.tsx">
                    Mark as Resolved
                  </button>}
              </div>
            </div>
          </div>}
      </main>
    </div>;
}