"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search, 
  ArrowLeft, 
  RefreshCw,
  AlertCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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
    return (
      error.message?.toLowerCase().includes(searchTerm) ||
      error.type?.toLowerCase().includes(searchTerm) ||
      error.url?.toLowerCase().includes(searchTerm) ||
      error.userId?.toLowerCase().includes(searchTerm)
    );
  });

  // Update error status
  const updateErrorStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/errors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          resolvedBy: 'admin', // In a real app, get the actual admin email
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setErrors(errors.map(error => 
          error.id === id ? { ...error, status: status as "new" | "investigating" | "resolved" | "ignored" } : error
        ));
        
        if (selectedError?.id === id) {
          setSelectedError({ ...selectedError, status: status as "new" | "investigating" | "resolved" | "ignored" });
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
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'ignored': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.push("/admin")}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Error Logs
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search errors..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
            </select>
            
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter.severity || ''}
              onChange={(e) => setFilter({ ...filter, severity: e.target.value || undefined })}
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            
            <button
              onClick={fetchErrors}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
        
        {/* Error List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading error logs...</p>
            </div>
          ) : filteredErrors.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredErrors.map((error) => (
                <li key={error.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${
                          error.severity === 'critical' ? 'text-red-500' :
                          error.severity === 'high' ? 'text-orange-500' :
                          error.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {error.message}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          {error.createdAt ? format(new Date(error.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Unknown date'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(error.severity || 'medium')}`}>
                          {error.severity || 'medium'}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(error.status || 'new')}`}>
                          {error.status || 'new'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleExpanded(error.id)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        {expandedErrors[error.id] ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={() => viewErrorDetails(error.id)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Eye className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedErrors[error.id] && (
                    <div className="mt-3 pl-7 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-500">Type: <span className="text-gray-700">{error.type || 'Unknown'}</span></p>
                          <p className="text-gray-500">URL: <span className="text-gray-700">{error.url || 'N/A'}</span></p>
                          <p className="text-gray-500">User: <span className="text-gray-700">{error.userId || 'Anonymous'}</span></p>
                          <p className="text-gray-500">Role: <span className="text-gray-700">{error.userRole || 'N/A'}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-500">User Agent: <span className="text-gray-700 truncate block">{error.userAgent || 'N/A'}</span></p>
                          {error.resolvedAt && (
                            <p className="text-gray-500">
                              Resolved: <span className="text-gray-700">
                                {format(new Date(error.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                              {error.resolvedBy && <span className="text-gray-700"> by {error.resolvedBy}</span>}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Stack trace */}
                      {error.stack && (
                        <div className="mt-2">
                          <p className="text-gray-500 mb-1">Stack Trace:</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-2">
                        {error.status !== 'investigating' && (
                          <button
                            onClick={() => updateErrorStatus(error.id, 'investigating')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200"
                          >
                            <Clock className="h-3 w-3 mr-1" /> Investigating
                          </button>
                        )}
                        
                        {error.status !== 'resolved' && (
                          <button
                            onClick={() => updateErrorStatus(error.id, 'resolved')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                          </button>
                        )}
                        
                        {error.status !== 'ignored' && (
                          <button
                            onClick={() => updateErrorStatus(error.id, 'ignored')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Ignore
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No errors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter.search || filter.status || filter.severity ? 
                  'Try changing your search filters' : 
                  'No errors have been logged yet'}
              </p>
            </div>
          )}
        </div>
        
        {/* Error Detail Modal */}
        {selectedError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Error Details</h3>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Message</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedError.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Type</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedError.type || 'Unknown'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Severity</h4>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedError.severity || 'medium')}`}>
                        {selectedError.severity || 'medium'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedError.status || 'new')}`}>
                        {selectedError.status || 'new'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Timestamp</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedError.createdAt ? 
                        format(new Date(selectedError.createdAt), 'MMM d, yyyy HH:mm:ss') : 
                        'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">URL</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedError.url || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">User ID</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedError.userId || 'Anonymous'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">User Role</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedError.userRole || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">User Agent</h4>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedError.userAgent || 'N/A'}</p>
                </div>
                
                {selectedError.resolvedAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Resolved At</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {format(new Date(selectedError.resolvedAt), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Resolved By</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedError.resolvedBy || 'N/A'}</p>
                    </div>
                  </div>
                )}
                
                {selectedError.metadata && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Metadata</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>
                )}
                
                {selectedError.stack && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Stack Trace</h4>
                    <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-60">
                      {selectedError.stack}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedError(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                
                {selectedError.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      updateErrorStatus(selectedError.id, 'resolved');
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
