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
  return <div className="p-4 bg-gray-100 rounded-md" data-unique-id="ea7213fe-7312-4695-8e4b-e05b09f53e1e" data-loc="17:9-17:53" data-file-name="components/error-test.tsx">
      <p className="text-gray-800" data-unique-id="c62dfbe4-6dd1-4c61-b873-cc51f17df688" data-loc="18:6-18:35" data-file-name="components/error-test.tsx">Component rendered successfully!</p>
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
  return <div className="bg-white shadow rounded-lg p-6" data-unique-id="a8c907b6-0fb4-4b04-8e19-03ab861a6db8" data-loc="69:9-69:57" data-file-name="components/error-test.tsx">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center" data-unique-id="44cb25de-c598-46f2-96d9-1f31dfd01f8f" data-loc="70:6-70:79" data-file-name="components/error-test.tsx">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
        Test Error Logger
      </h2>
      
      <div className="space-y-6" data-unique-id="2baa1889-0fb7-426b-9a69-c2024db2a282" data-loc="75:6-75:33" data-file-name="components/error-test.tsx">
        <div className="space-y-4" data-unique-id="92603aae-f11c-4b9a-84ab-3157c679045f" data-loc="76:8-76:35" data-file-name="components/error-test.tsx">
          <div data-unique-id="e3bb4951-2ef7-4def-b10e-1a68ba30f859" data-loc="77:10-77:15" data-file-name="components/error-test.tsx">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700" data-unique-id="07fcb487-bfb7-4ee7-bc4b-75aa4b54105f" data-loc="78:12-78:89" data-file-name="components/error-test.tsx">
              Error Message
            </label>
            <input type="text" id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={message} onChange={e => setMessage(e.target.value)} data-unique-id="ad9806a7-2989-4f74-8ad9-dddc72731b08" data-loc="81:12-81:261" data-file-name="components/error-test.tsx" />
          </div>
          
          <div data-unique-id="76ad2bbc-59b7-45e7-ad8b-7deb23aa7431" data-loc="84:10-84:15" data-file-name="components/error-test.tsx">
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700" data-unique-id="1486454f-1b1a-4830-af8b-6c8c2cf31d44" data-loc="85:12-85:90" data-file-name="components/error-test.tsx">
              Severity
            </label>
            <select id="severity" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={severity} onChange={e => setSeverity(e.target.value as any)} data-unique-id="d4a7d6ef-421b-4d8f-9a7b-b93d17b619ff" data-loc="88:12-88:264" data-file-name="components/error-test.tsx">
              <option value="low" data-unique-id="18a36b85-0267-4799-9950-bec43a9b7c7a" data-loc="89:14-89:34" data-file-name="components/error-test.tsx">Low</option>
              <option value="medium" data-unique-id="81f7334d-93cc-417d-bc10-5a8ef5469217" data-loc="90:14-90:37" data-file-name="components/error-test.tsx">Medium</option>
              <option value="high" data-unique-id="a2e2dc8e-7551-4597-8d51-5161b520c704" data-loc="91:14-91:35" data-file-name="components/error-test.tsx">High</option>
              <option value="critical" data-unique-id="5aae74fd-1aca-4048-bf4d-7afa0c1efbe2" data-loc="92:14-92:39" data-file-name="components/error-test.tsx">Critical</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2" data-unique-id="040a32d1-95e6-41b1-9abb-8e498d913f71" data-loc="96:10-96:59" data-file-name="components/error-test.tsx">
            <button onClick={triggerError} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" data-unique-id="53187d87-0cc4-43de-9873-8793f3faf895" data-loc="97:12-97:309" data-file-name="components/error-test.tsx">
              {loading ? 'Logging...' : 'Log Test Error'}
            </button>
            
            <button onClick={triggerRuntimeError} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="92206d0c-66b2-4362-936c-d92902da32a6" data-loc="101:12-101:274" data-file-name="components/error-test.tsx">
              Trigger Runtime Error
            </button>
            
            <button onClick={() => {
            triggerPromiseError().catch(() => {});
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" data-unique-id="44215f8a-4bb7-4475-b903-71f5a83636c4" data-loc="105:12-107:246" data-file-name="components/error-test.tsx">
              Trigger Promise Error
            </button>
          </div>
          
          {result.message && <div className={`mt-2 p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="80152535-df41-421a-acb0-92e1b2027fba" data-loc="112:29-112:141" data-file-name="components/error-test.tsx">
              <div className="flex" data-unique-id="3c6759d7-131d-4f23-aa09-ee78b6ae0d86" data-loc="113:14-113:36" data-file-name="components/error-test.tsx">
                <div className="flex-shrink-0" data-unique-id="95119ebf-ba15-463e-9939-ad45622c6901" data-loc="114:16-114:47" data-file-name="components/error-test.tsx">
                  <AlertCircle className={`h-5 w-5 ${result.success ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-3" data-unique-id="cd4e9145-b735-479d-bf13-eadb7913dbdb" data-loc="117:16-117:38" data-file-name="components/error-test.tsx">
                  <p className="text-sm font-medium" data-unique-id="b507b6a6-18a3-4d01-a274-7addb9413b9d" data-loc="118:18-118:53" data-file-name="components/error-test.tsx">{result.message}</p>
                </div>
              </div>
            </div>}
        </div>
        
        {/* Error Boundary Test Section */}
        <div className="border-t pt-6" data-unique-id="7ddbf030-acc2-4ca3-af9a-469efccdba4a" data-loc="125:8-125:39" data-file-name="components/error-test.tsx">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center" data-unique-id="95d20df2-f595-43ae-a7fa-be974e0e8c3d" data-loc="126:10-126:83" data-file-name="components/error-test.tsx">
            <Bug className="h-5 w-5 mr-2 text-purple-500" />
            Test Error Boundary
          </h3>
          
          <div className="space-y-4" data-unique-id="15c48c7d-3280-4750-9b49-7491239eda97" data-loc="131:10-131:37" data-file-name="components/error-test.tsx">
            <p className="text-sm text-gray-600" data-unique-id="2ffb821b-9ddd-45a7-9d94-b3a0ad709f44" data-loc="132:12-132:49" data-file-name="components/error-test.tsx">
              This section demonstrates the Error Boundary component. When you click the button below, 
              it will render a component that throws an error, which will be caught by the Error Boundary.
            </p>
            
            <div className="flex items-center space-x-4" data-unique-id="23277359-9a89-4474-a200-f579ef9de369" data-loc="137:12-137:57" data-file-name="components/error-test.tsx">
              <button onClick={() => setShouldThrow(!shouldThrow)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="32f172d3-d93a-4b7b-bf19-04a3436bf75f" data-loc="138:14-138:300" data-file-name="components/error-test.tsx">
                {shouldThrow ? 'Fix Component' : 'Break Component'}
              </button>
              
              <span className="text-sm text-gray-500" data-unique-id="a1034254-6b80-46a9-b7da-909906c521a6" data-loc="142:14-142:54" data-file-name="components/error-test.tsx">
                Current state: {shouldThrow ? 'Will throw error' : 'Working correctly'}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4" data-unique-id="66a8c917-5e65-491f-9d0c-52a0aa22d958" data-loc="147:12-147:67" data-file-name="components/error-test.tsx">
              <ErrorBoundary>
                <BuggyCounter shouldThrow={shouldThrow} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>;
}