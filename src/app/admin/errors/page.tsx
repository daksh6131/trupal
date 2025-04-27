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
  return <div className="min-h-screen bg-gray-50" data-unique-id="5d4968fa-c6a4-4847-be1b-36c86ae1539f" data-loc="142:9-142:50" data-file-name="app/admin/errors/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="8c5ba818-41e1-43a9-9f71-699f5354223b" data-loc="144:6-144:42" data-file-name="app/admin/errors/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="bf164e93-c280-49ea-93de-58b43559137d" data-loc="145:8-145:61" data-file-name="app/admin/errors/page.tsx">
          <div className="flex items-center" data-unique-id="c1533efa-fe24-4844-96aa-7dc49b61bfac" data-loc="146:10-146:45" data-file-name="app/admin/errors/page.tsx">
            <button onClick={() => router.push("/admin")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="8e012be3-0e73-4754-a6b7-8748ebd09d42" data-loc="147:12-147:110" data-file-name="app/admin/errors/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="fa48fab9-e101-47ce-9ccb-be10e3e90740" data-loc="150:12-150:60" data-file-name="app/admin/errors/page.tsx">
              Error Logs
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="7aafddbc-46f3-48eb-a80d-8934ec085d61" data-loc="158:6-158:60" data-file-name="app/admin/errors/page.tsx">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4" data-unique-id="d05a451c-4674-4a1b-95d3-33c4fcbd834b" data-loc="160:8-160:62" data-file-name="app/admin/errors/page.tsx">
          <div className="relative flex-grow" data-unique-id="feae6aef-33a4-4825-8f0c-b86622fb3768" data-loc="161:10-161:46" data-file-name="app/admin/errors/page.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="b5d9e536-9d8f-4d0a-b541-c87bb2ffd6d1" data-loc="162:12-162:98" data-file-name="app/admin/errors/page.tsx">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search errors..." value={filter.search || ''} onChange={e => setFilter({
            ...filter,
            search: e.target.value
          })} data-unique-id="82b92ff6-d805-4780-9dd3-3acee29ae1d8" data-loc="165:12-168:16" data-file-name="app/admin/errors/page.tsx" />
          </div>
          
          <div className="flex gap-2" data-unique-id="0f526ddc-26cf-4057-bf09-da1eac38f43b" data-loc="171:10-171:38" data-file-name="app/admin/errors/page.tsx">
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.status || ''} onChange={e => setFilter({
            ...filter,
            status: e.target.value || undefined
          })} data-unique-id="e06a263a-b600-4f70-829a-4ecdcdbf7c8c" data-loc="172:12-175:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="040bef25-c4f0-435d-b47e-58e4e6d70f73" data-loc="176:14-176:31" data-file-name="app/admin/errors/page.tsx">All Statuses</option>
              <option value="new" data-unique-id="c1cb8eff-1011-423e-b833-9431b343c8aa" data-loc="177:14-177:34" data-file-name="app/admin/errors/page.tsx">New</option>
              <option value="investigating" data-unique-id="816a544b-99e5-4883-875d-ccee24800cbb" data-loc="178:14-178:44" data-file-name="app/admin/errors/page.tsx">Investigating</option>
              <option value="resolved" data-unique-id="a0054565-4ab8-42fd-b79c-40c85e5eaa43" data-loc="179:14-179:39" data-file-name="app/admin/errors/page.tsx">Resolved</option>
              <option value="ignored" data-unique-id="381c6298-94e4-45be-817d-79e1843cf0df" data-loc="180:14-180:38" data-file-name="app/admin/errors/page.tsx">Ignored</option>
            </select>
            
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={filter.severity || ''} onChange={e => setFilter({
            ...filter,
            severity: e.target.value || undefined
          })} data-unique-id="a82e1b47-6361-4975-b90f-f83008c80e57" data-loc="183:12-186:14" data-file-name="app/admin/errors/page.tsx">
              <option value="" data-unique-id="97b8695f-cfac-403f-b767-f2941c93bd96" data-loc="187:14-187:31" data-file-name="app/admin/errors/page.tsx">All Severities</option>
              <option value="low" data-unique-id="09b65d56-5386-4474-90a5-dd517bfec460" data-loc="188:14-188:34" data-file-name="app/admin/errors/page.tsx">Low</option>
              <option value="medium" data-unique-id="e9577565-f3c8-42d4-a0ce-5fe6cb62efab" data-loc="189:14-189:37" data-file-name="app/admin/errors/page.tsx">Medium</option>
              <option value="high" data-unique-id="dcab9b6b-f1a4-46f9-a662-dcc5bc67aa1a" data-loc="190:14-190:35" data-file-name="app/admin/errors/page.tsx">High</option>
              <option value="critical" data-unique-id="442da9c6-8f93-4ad8-8d15-15cd34028806" data-loc="191:14-191:39" data-file-name="app/admin/errors/page.tsx">Critical</option>
            </select>
            
            <button onClick={fetchErrors} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="70fe1fa7-74fe-4f5f-bd03-4843827b01f8" data-loc="194:12-194:269" data-file-name="app/admin/errors/page.tsx">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Error List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="f577d24f-a981-4cb2-a7ff-c2f6cdafeb81" data-loc="201:8-201:71" data-file-name="app/admin/errors/page.tsx">
          {loading ? <div className="text-center py-12" data-unique-id="62141ab0-e5cd-4e51-ac03-d574e6605092" data-loc="202:21-202:56" data-file-name="app/admin/errors/page.tsx">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" data-unique-id="c304e9f6-dbcc-469e-83af-9ed226186f2a" data-loc="203:14-203:113" data-file-name="app/admin/errors/page.tsx"></div>
              <p className="mt-4 text-gray-600" data-unique-id="1e0e7ca7-d7ab-4ebd-bdba-d7a978da4b20" data-loc="204:14-204:48" data-file-name="app/admin/errors/page.tsx">Loading error logs...</p>
            </div> : filteredErrors.length > 0 ? <ul className="divide-y divide-gray-200" data-unique-id="3f73bb9c-60d0-43f0-9cad-10c8e6d89bac" data-loc="205:49-205:90" data-file-name="app/admin/errors/page.tsx">
              {filteredErrors.map(error => <li key={error.id} className="px-6 py-4 hover:bg-gray-50" data-unique-id="f8af6d46-efc2-4922-8526-a5ac322f36ac" data-loc="206:43-206:101" data-file-name="app/admin/errors/page.tsx">
                  <div className="flex items-center justify-between" data-unique-id="98bf6b3b-e224-4de5-b804-a8b384120a34" data-loc="207:18-207:69" data-file-name="app/admin/errors/page.tsx">
                    <div className="flex-1 min-w-0" data-unique-id="995a0042-c7f2-4d61-9be8-e4d1c9125ae2" data-loc="208:20-208:52" data-file-name="app/admin/errors/page.tsx">
                      <div className="flex items-center" data-unique-id="9b1a5f85-ebc8-4576-b8b7-1bdcd21f366f" data-loc="209:22-209:57" data-file-name="app/admin/errors/page.tsx">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${error.severity === 'critical' ? 'text-red-500' : error.severity === 'high' ? 'text-orange-500' : error.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                        <p className="text-sm font-medium text-gray-900 truncate" data-unique-id="36803195-8019-405f-84db-f8dc3e74db25" data-loc="211:24-211:82" data-file-name="app/admin/errors/page.tsx">
                          {error.message}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center" data-unique-id="b70553d3-f1e2-48a5-817a-f15300e7db2a" data-loc="215:22-215:62" data-file-name="app/admin/errors/page.tsx">
                        <span className="text-xs text-gray-500 mr-2" data-unique-id="0222a060-4fa0-426c-83c5-485a218ee688" data-loc="216:24-216:69" data-file-name="app/admin/errors/page.tsx">
                          {error.createdAt ? format(new Date(error.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown date'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(error.severity || 'medium')}`} data-unique-id="c6fc2254-8b2d-4205-bc51-67e69d002b6f" data-loc="219:24-219:164" data-file-name="app/admin/errors/page.tsx">
                          {error.severity || 'medium'}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(error.status || 'new')}`} data-unique-id="04af5a0f-868f-49fa-b082-9a129637fd67" data-loc="222:24-222:162" data-file-name="app/admin/errors/page.tsx">
                          {error.status || 'new'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2" data-unique-id="18482456-4b58-48e0-aeb7-d43d01fa8319" data-loc="227:20-227:65" data-file-name="app/admin/errors/page.tsx">
                      <button onClick={() => toggleExpanded(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="b0acecd9-1348-4e0a-adfe-16382c1ed607" data-loc="228:22-228:118" data-file-name="app/admin/errors/page.tsx">
                        {expandedErrors[error.id] ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                      </button>
                      <button onClick={() => viewErrorDetails(error.id)} className="p-1 rounded-full hover:bg-gray-200" data-unique-id="4407b9c5-aecf-4919-9e59-d6397f96335a" data-loc="231:22-231:120" data-file-name="app/admin/errors/page.tsx">
                        <Eye className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedErrors[error.id] && <div className="mt-3 pl-7 text-sm" data-unique-id="4c912d4d-2c66-4793-a5e5-2be26b005a7e" data-loc="238:47-238:82" data-file-name="app/admin/errors/page.tsx">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-unique-id="b29b2b9d-a748-4014-b24d-1daa0262b461" data-loc="239:22-239:77" data-file-name="app/admin/errors/page.tsx">
                        <div data-unique-id="e797ce7f-86f0-43a2-beb8-07943a26e014" data-loc="240:24-240:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="c7856c09-57a3-493c-93a9-017f67ddd58b" data-loc="241:26-241:55" data-file-name="app/admin/errors/page.tsx">Type: <span className="text-gray-700" data-unique-id="205943ef-407a-482d-bd03-66daca153d12" data-loc="241:61-241:93" data-file-name="app/admin/errors/page.tsx">{error.type || 'Unknown'}</span></p>
                          <p className="text-gray-500" data-unique-id="9e1504cc-7936-4d2c-99b7-2a943285102d" data-loc="242:26-242:55" data-file-name="app/admin/errors/page.tsx">URL: <span className="text-gray-700" data-unique-id="b621b18c-f2a6-4e88-97b0-e4d30e594c6c" data-loc="242:60-242:92" data-file-name="app/admin/errors/page.tsx">{error.url || 'N/A'}</span></p>
                          <p className="text-gray-500" data-unique-id="e74c85ee-13ee-494c-a465-745eeb6afe4c" data-loc="243:26-243:55" data-file-name="app/admin/errors/page.tsx">User: <span className="text-gray-700" data-unique-id="2879910f-0884-4c3f-8552-502a9461c078" data-loc="243:61-243:93" data-file-name="app/admin/errors/page.tsx">{error.userId || 'Anonymous'}</span></p>
                          <p className="text-gray-500" data-unique-id="3a72525d-beb5-4b92-ba45-86ec223dadba" data-loc="244:26-244:55" data-file-name="app/admin/errors/page.tsx">Role: <span className="text-gray-700" data-unique-id="2205e1b1-4310-4f0e-b4aa-064d8bcf3a0c" data-loc="244:61-244:93" data-file-name="app/admin/errors/page.tsx">{error.userRole || 'N/A'}</span></p>
                        </div>
                        <div data-unique-id="ff6f86e5-0fe4-46f4-84b3-aea14998f959" data-loc="246:24-246:29" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500" data-unique-id="e82f2932-c5c1-4fcf-a772-56cdb8e86bc1" data-loc="247:26-247:55" data-file-name="app/admin/errors/page.tsx">User Agent: <span className="text-gray-700 truncate block" data-unique-id="972adcc5-530f-4419-8e90-c8a2c8b292ed" data-loc="247:67-247:114" data-file-name="app/admin/errors/page.tsx">{error.userAgent || 'N/A'}</span></p>
                          {error.resolvedAt && <p className="text-gray-500" data-unique-id="15e6a396-3d6d-41e7-9314-6f124e08e259" data-loc="248:47-248:76" data-file-name="app/admin/errors/page.tsx">
                              Resolved: <span className="text-gray-700" data-unique-id="ddb15f7f-95d5-40d5-8c89-5809bbedb5e7" data-loc="249:40-249:72" data-file-name="app/admin/errors/page.tsx">
                                {format(new Date(error.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                              {error.resolvedBy && <span className="text-gray-700" data-unique-id="59686ab7-5a38-47b2-9344-b1469bec669e" data-loc="252:51-252:83" data-file-name="app/admin/errors/page.tsx"> by {error.resolvedBy}</span>}
                            </p>}
                        </div>
                      </div>
                      
                      {/* Stack trace */}
                      {error.stack && <div className="mt-2" data-unique-id="9d736afe-b6f5-4e7e-8894-6aa0299c659e" data-loc="258:38-258:60" data-file-name="app/admin/errors/page.tsx">
                          <p className="text-gray-500 mb-1" data-unique-id="7ec50ad7-9c4f-4fac-938c-ae00f9c645cb" data-loc="259:26-259:60" data-file-name="app/admin/errors/page.tsx">Stack Trace:</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="6ea7ed89-aa67-4f9b-9ea7-10337a599515" data-loc="260:26-260:100" data-file-name="app/admin/errors/page.tsx">
                            {error.stack}
                          </pre>
                        </div>}
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-2" data-unique-id="adcb0841-f5be-4be9-a5ef-ca84aae49a62" data-loc="266:22-266:59" data-file-name="app/admin/errors/page.tsx">
                        {error.status !== 'investigating' && <button onClick={() => updateErrorStatus(error.id, 'investigating')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200" data-unique-id="a7865706-7822-49a6-b29c-860b5fe20fa9" data-loc="267:61-267:285" data-file-name="app/admin/errors/page.tsx">
                            <Clock className="h-3 w-3 mr-1" /> Investigating
                          </button>}
                        
                        {error.status !== 'resolved' && <button onClick={() => updateErrorStatus(error.id, 'resolved')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200" data-unique-id="2a4bb8ac-b76b-4685-9926-e841ffd1e9a1" data-loc="271:56-271:272" data-file-name="app/admin/errors/page.tsx">
                            <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                          </button>}
                        
                        {error.status !== 'ignored' && <button onClick={() => updateErrorStatus(error.id, 'ignored')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200" data-unique-id="94d92962-832a-4b8a-b60c-cd4e1a897d49" data-loc="275:55-275:267" data-file-name="app/admin/errors/page.tsx">
                            <XCircle className="h-3 w-3 mr-1" /> Ignore
                          </button>}
                      </div>
                    </div>}
                </li>)}
            </ul> : <div className="text-center py-12" data-unique-id="72b6a8ad-673c-48db-8965-3c7a5070219e" data-loc="281:20-281:55" data-file-name="app/admin/errors/page.tsx">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100" data-unique-id="4dbbf707-1d38-4fa8-9a3f-e39e80118512" data-loc="282:14-282:107" data-file-name="app/admin/errors/page.tsx">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900" data-unique-id="db8ab4b8-d666-4574-80c7-a19e7a37e232" data-loc="285:14-285:69" data-file-name="app/admin/errors/page.tsx">No errors found</h3>
              <p className="mt-1 text-sm text-gray-500" data-unique-id="6851e89a-88aa-4520-880d-c05e34064d1f" data-loc="286:14-286:56" data-file-name="app/admin/errors/page.tsx">
                {filter.search || filter.status || filter.severity ? 'Try changing your search filters' : 'No errors have been logged yet'}
              </p>
            </div>}
        </div>
        
        {/* Error Detail Modal */}
        {selectedError && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="746e4ff7-479d-4c7c-b1d5-de6da437b0b9" data-loc="293:26-293:118" data-file-name="app/admin/errors/page.tsx">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="e6782b0f-8358-40d3-b7cd-da9c828fd83a" data-loc="294:12-294:99" data-file-name="app/admin/errors/page.tsx">
              <div className="flex justify-between items-center mb-4" data-unique-id="48d05572-363d-4e5f-9573-785e1242f93c" data-loc="295:14-295:70" data-file-name="app/admin/errors/page.tsx">
                <h3 className="text-lg font-medium text-gray-900" data-unique-id="0de00fe9-dfa7-46a8-a22d-594764fba813" data-loc="296:16-296:66" data-file-name="app/admin/errors/page.tsx">Error Details</h3>
                <button onClick={() => setSelectedError(null)} className="text-gray-400 hover:text-gray-500" data-unique-id="53ecf199-3b61-4fa5-9526-6cc533115d3e" data-loc="297:16-297:109" data-file-name="app/admin/errors/page.tsx">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4" data-unique-id="d59a9c48-8852-459a-8d18-ba955952b555" data-loc="302:14-302:41" data-file-name="app/admin/errors/page.tsx">
                <div data-unique-id="a9efc64d-7295-4354-8728-4e6af75f212f" data-loc="303:16-303:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="b1d44120-f25d-4f1f-9192-794e63abcf6c" data-loc="304:18-304:68" data-file-name="app/admin/errors/page.tsx">Message</h4>
                  <p className="mt-1 text-sm text-gray-900" data-unique-id="8c1a3650-6471-467c-89b5-51895779151f" data-loc="305:18-305:60" data-file-name="app/admin/errors/page.tsx">{selectedError.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="dff29026-0833-4657-8281-f910929e0971" data-loc="308:16-308:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="925a6c2f-3b2a-43a0-aa20-4a2b2a01ecb6" data-loc="309:18-309:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="69afd9e6-a758-4e03-96c5-b1dd455499c6" data-loc="310:20-310:70" data-file-name="app/admin/errors/page.tsx">Type</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="69650358-d0a3-4c45-9d66-78f225756bea" data-loc="311:20-311:62" data-file-name="app/admin/errors/page.tsx">{selectedError.type || 'Unknown'}</p>
                  </div>
                  <div data-unique-id="01de72ee-0a32-4868-9a35-f1cb16cf85fd" data-loc="313:18-313:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="685a2d9b-bd22-451d-b704-29756470806a" data-loc="314:20-314:70" data-file-name="app/admin/errors/page.tsx">Severity</h4>
                    <p className="mt-1" data-unique-id="1116e0be-0b51-4e75-9948-31df6aeb6c6a" data-loc="315:20-315:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedError.severity || 'medium')}`} data-unique-id="c839cee5-77a3-47cc-b344-bfac47677f04" data-loc="316:22-316:170" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.severity || 'medium'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="2f1b315a-7578-4486-bc2a-0cff7d1075c4" data-loc="321:18-321:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="2122b9a5-5be7-4694-83b3-53fea9b2cfc8" data-loc="322:20-322:70" data-file-name="app/admin/errors/page.tsx">Status</h4>
                    <p className="mt-1" data-unique-id="ddd2db1b-5d29-4177-84ce-b07356964881" data-loc="323:20-323:40" data-file-name="app/admin/errors/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedError.status || 'new')}`} data-unique-id="ff9da078-bd01-4f06-b32e-546fb10b45de" data-loc="324:22-324:163" data-file-name="app/admin/errors/page.tsx">
                        {selectedError.status || 'new'}
                      </span>
                    </p>
                  </div>
                  <div data-unique-id="9c802845-f70d-4b26-93be-bd3dc96aa4bc" data-loc="329:18-329:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="00662da0-6bca-4c92-8dc4-42496f183780" data-loc="330:20-330:70" data-file-name="app/admin/errors/page.tsx">Timestamp</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="407d00c3-d942-4d04-afda-fbaf0d8cdb80" data-loc="331:20-331:62" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.createdAt ? format(new Date(selectedError.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div data-unique-id="43ff598b-c929-4cd3-9282-f6e2dad1043a" data-loc="337:16-337:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="212a6171-496f-4e8f-8175-fbb74c3d4569" data-loc="338:18-338:68" data-file-name="app/admin/errors/page.tsx">URL</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="02db0e81-433d-4161-9c2e-766b9c23d7a6" data-loc="339:18-339:70" data-file-name="app/admin/errors/page.tsx">{selectedError.url || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-unique-id="9a619bab-31fe-4b3e-8265-79de9b7e9d17" data-loc="342:16-342:56" data-file-name="app/admin/errors/page.tsx">
                  <div data-unique-id="dc6d5309-ffb7-4b09-af3b-18861cf014d9" data-loc="343:18-343:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="b54b03d7-2dbc-4dcb-a56c-902baff29fa3" data-loc="344:20-344:70" data-file-name="app/admin/errors/page.tsx">User ID</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="6d3a75e7-8ed7-48b9-82ea-a3c48c17a9f8" data-loc="345:20-345:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userId || 'Anonymous'}</p>
                  </div>
                  <div data-unique-id="fefe2178-afe1-4d07-8d1d-63432343098d" data-loc="347:18-347:23" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="4cb43883-3e8c-4099-ac77-439b6f2827c7" data-loc="348:20-348:70" data-file-name="app/admin/errors/page.tsx">User Role</h4>
                    <p className="mt-1 text-sm text-gray-900" data-unique-id="3daedb0e-a6c6-48b3-8f1f-09f0e393eaa8" data-loc="349:20-349:62" data-file-name="app/admin/errors/page.tsx">{selectedError.userRole || 'N/A'}</p>
                  </div>
                </div>
                
                <div data-unique-id="c49e36fc-4bc0-4d2e-801e-3023476ba083" data-loc="353:16-353:21" data-file-name="app/admin/errors/page.tsx">
                  <h4 className="text-sm font-medium text-gray-500" data-unique-id="dae4a1b5-9e81-4cae-9973-6b5d9fce038d" data-loc="354:18-354:68" data-file-name="app/admin/errors/page.tsx">User Agent</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all" data-unique-id="84095d1f-6dc2-440c-8494-4af795901725" data-loc="355:18-355:70" data-file-name="app/admin/errors/page.tsx">{selectedError.userAgent || 'N/A'}</p>
                </div>
                
                {selectedError.resolvedAt && <div className="grid grid-cols-2 gap-4" data-unique-id="d9646504-2b7c-452f-bfd3-4df1859d07e9" data-loc="358:45-358:85" data-file-name="app/admin/errors/page.tsx">
                    <div data-unique-id="cd7ef47c-8b91-4948-9bfe-5c3a1f11f47d" data-loc="359:20-359:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="6fcaf86a-dc7b-47de-8e4c-342ef266e35d" data-loc="360:22-360:72" data-file-name="app/admin/errors/page.tsx">Resolved At</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="57b0da8d-b286-499d-bdc1-6a9df2f8345d" data-loc="361:22-361:64" data-file-name="app/admin/errors/page.tsx">
                        {format(new Date(selectedError.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div data-unique-id="9927f589-849f-4a99-9123-67a2bf2b8a90" data-loc="365:20-365:25" data-file-name="app/admin/errors/page.tsx">
                      <h4 className="text-sm font-medium text-gray-500" data-unique-id="7ab2a41c-9a42-4369-98ac-52de80823503" data-loc="366:22-366:72" data-file-name="app/admin/errors/page.tsx">Resolved By</h4>
                      <p className="mt-1 text-sm text-gray-900" data-unique-id="883e3ef6-f092-474e-ae91-45cbf506f05a" data-loc="367:22-367:64" data-file-name="app/admin/errors/page.tsx">{selectedError.resolvedBy || 'N/A'}</p>
                    </div>
                  </div>}
                
                {selectedError.metadata && <div data-unique-id="2ed43037-cf43-4cbd-b0e3-43eeb3033929" data-loc="371:43-371:48" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="253d3ddf-4236-4af9-adb5-1b19236876af" data-loc="372:20-372:70" data-file-name="app/admin/errors/page.tsx">Metadata</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40" data-unique-id="b26c2013-a5c2-4d3d-a01f-b3c922dd3ddc" data-loc="373:20-373:99" data-file-name="app/admin/errors/page.tsx">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>}
                
                {selectedError.stack && <div data-unique-id="1a858cb7-5f9e-4dd7-baca-5c87943c77d1" data-loc="378:40-378:45" data-file-name="app/admin/errors/page.tsx">
                    <h4 className="text-sm font-medium text-gray-500" data-unique-id="b83bba26-edf2-4c60-afa5-1bb56980e206" data-loc="379:20-379:70" data-file-name="app/admin/errors/page.tsx">Stack Trace</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-60" data-unique-id="2c1f9dfa-65f2-4b38-86df-e799fb6441a3" data-loc="380:20-380:99" data-file-name="app/admin/errors/page.tsx">
                      {selectedError.stack}
                    </pre>
                  </div>}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3" data-unique-id="2b35448b-f8a5-4764-9286-839ff4ee1284" data-loc="386:14-386:63" data-file-name="app/admin/errors/page.tsx">
                <button onClick={() => setSelectedError(null)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="aa916608-8e37-41e2-a9b6-82cecb6b8c98" data-loc="387:16-387:261" data-file-name="app/admin/errors/page.tsx">
                  Close
                </button>
                
                {selectedError.status !== 'resolved' && <button onClick={() => {
              updateErrorStatus(selectedError.id, 'resolved');
            }} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="d7b811a6-488f-48ea-ade0-635c97ce1b32" data-loc="391:56-393:220" data-file-name="app/admin/errors/page.tsx">
                    Mark as Resolved
                  </button>}
              </div>
            </div>
          </div>}
      </main>
    </div>;
}