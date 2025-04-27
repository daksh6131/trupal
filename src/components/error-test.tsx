"use client";

import { useState } from "react";
import { AlertTriangle, AlertCircle, Bug } from "lucide-react";
import { logErrorWithContext } from "@/lib/error-logger";
import { ErrorBoundary } from "./error-boundary";

// Component that will throw an error when the flag is true
function BuggyCounter({
  shouldThrow
}: {
  shouldThrow: boolean;
}) {
  if (shouldThrow) {
    throw new Error("Simulated error in component rendering");
  }
  return <div className="p-4 bg-gray-100 rounded-md">
      <p className="text-gray-800">Component rendered successfully!</p>
    </div>;
}
export default function ErrorTest() {
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [message, setMessage] = useState('Test error message');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [shouldThrow, setShouldThrow] = useState(false);
  const triggerError = async () => {
    setLoading(true);
    setResult({});
    try {
      // Create a test error
      const error = new Error(message);
      error.name = `Test${severity.charAt(0).toUpperCase() + severity.slice(1)}Error`;

      // Log the error
      await logErrorWithContext({
        ...error,
        severity
      });
      setResult({
        success: true,
        message: 'Error logged successfully'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to log error'
      });
    } finally {
      setLoading(false);
    }
  };
  const triggerRuntimeError = () => {
    // This will cause a runtime error
    const obj: any = null;
    obj.nonExistentMethod();
  };
  const triggerPromiseError = async () => {
    // This will cause an unhandled promise rejection
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Test unhandled promise rejection'));
      }, 100);
    });
  };
  return <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
        Test Error Logger
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Error Message
            </label>
            <input type="text" id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={message} onChange={e => setMessage(e.target.value)} />
          </div>
          
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
              Severity
            </label>
            <select id="severity" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={severity} onChange={e => setSeverity(e.target.value as any)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={triggerError} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {loading ? 'Logging...' : 'Log Test Error'}
            </button>
            
            <button onClick={triggerRuntimeError} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Trigger Runtime Error
            </button>
            
            <button onClick={() => {
            triggerPromiseError().catch(() => {});
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Trigger Promise Error
            </button>
          </div>
          
          {result.message && <div className={`mt-2 p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className={`h-5 w-5 ${result.success ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{result.message}</p>
                </div>
              </div>
            </div>}
        </div>
        
        {/* Error Boundary Test Section */}
        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Bug className="h-5 w-5 mr-2 text-purple-500" />
            Test Error Boundary
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This section demonstrates the Error Boundary component. When you click the button below, 
              it will render a component that throws an error, which will be caught by the Error Boundary.
            </p>
            
            <div className="flex items-center space-x-4">
              <button onClick={() => setShouldThrow(!shouldThrow)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                {shouldThrow ? 'Fix Component' : 'Break Component'}
              </button>
              
              <span className="text-sm text-gray-500">
                Current state: {shouldThrow ? 'Will throw error' : 'Working correctly'}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <ErrorBoundary>
                <BuggyCounter shouldThrow={shouldThrow} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>;
}