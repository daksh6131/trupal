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
  return <div className="p-4 bg-gray-100 rounded-md" data-unique-id="6e2fd364-9d57-4f81-aad3-0fd86e75d93c" data-loc="17:9-17:53" data-file-name="components/error-test.tsx">
      <p className="text-gray-800" data-unique-id="338603b5-2b19-4ca9-8cb5-5e8367d3fc3c" data-loc="18:6-18:35" data-file-name="components/error-test.tsx">Component rendered successfully!</p>
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
  return <div className="bg-white shadow rounded-lg p-6" data-unique-id="1c7b51cc-9247-4891-8efa-2c2dc7db3e49" data-loc="69:9-69:57" data-file-name="components/error-test.tsx">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center" data-unique-id="1e1e19e7-51a1-4217-a919-c337998ba03b" data-loc="70:6-70:79" data-file-name="components/error-test.tsx">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
        Test Error Logger
      </h2>
      
      <div className="space-y-6" data-unique-id="4a935b94-1bbc-41eb-8090-aa1b75658027" data-loc="75:6-75:33" data-file-name="components/error-test.tsx">
        <div className="space-y-4" data-unique-id="cd3420a1-be43-4764-becf-7fec079dd0d1" data-loc="76:8-76:35" data-file-name="components/error-test.tsx">
          <div data-unique-id="069ffcb5-55a0-4de2-9699-ee1bc008f572" data-loc="77:10-77:15" data-file-name="components/error-test.tsx">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700" data-unique-id="4562d653-aeec-44df-bc65-a85969cfcac7" data-loc="78:12-78:89" data-file-name="components/error-test.tsx">
              Error Message
            </label>
            <input type="text" id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={message} onChange={e => setMessage(e.target.value)} data-unique-id="f0cf0160-a909-4a9c-bcf8-225ebaecba66" data-loc="81:12-81:261" data-file-name="components/error-test.tsx" />
          </div>
          
          <div data-unique-id="bbaa770f-8cfa-4ae4-b6ae-53c57d59529a" data-loc="84:10-84:15" data-file-name="components/error-test.tsx">
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700" data-unique-id="7d5bdbde-4c47-4165-91e5-ffb9a17eb9d2" data-loc="85:12-85:90" data-file-name="components/error-test.tsx">
              Severity
            </label>
            <select id="severity" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={severity} onChange={e => setSeverity(e.target.value as any)} data-unique-id="f02e05db-10c7-4108-8578-9117e87bc739" data-loc="88:12-88:264" data-file-name="components/error-test.tsx">
              <option value="low" data-unique-id="6eaf0049-c87d-4608-933a-c29e0078af1c" data-loc="89:14-89:34" data-file-name="components/error-test.tsx">Low</option>
              <option value="medium" data-unique-id="34eb7e77-2ace-4a75-a447-0bbaf60256c7" data-loc="90:14-90:37" data-file-name="components/error-test.tsx">Medium</option>
              <option value="high" data-unique-id="d9b19a47-b370-48ef-8c19-477f59236360" data-loc="91:14-91:35" data-file-name="components/error-test.tsx">High</option>
              <option value="critical" data-unique-id="6fc8a28b-9764-43bd-9206-cfdea8af77a2" data-loc="92:14-92:39" data-file-name="components/error-test.tsx">Critical</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2" data-unique-id="f795cb7e-2fe6-41a4-9b13-541465c8a7f5" data-loc="96:10-96:59" data-file-name="components/error-test.tsx">
            <button onClick={triggerError} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" data-unique-id="fd30aaa1-be50-45aa-b6d5-8b44e68e8d42" data-loc="97:12-97:309" data-file-name="components/error-test.tsx">
              {loading ? 'Logging...' : 'Log Test Error'}
            </button>
            
            <button onClick={triggerRuntimeError} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="6f4799bd-4ad8-4947-8f60-50d0a133328f" data-loc="101:12-101:274" data-file-name="components/error-test.tsx">
              Trigger Runtime Error
            </button>
            
            <button onClick={() => {
            triggerPromiseError().catch(() => {});
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" data-unique-id="9a477244-033b-4d86-9aab-165fb4e094de" data-loc="105:12-107:246" data-file-name="components/error-test.tsx">
              Trigger Promise Error
            </button>
          </div>
          
          {result.message && <div className={`mt-2 p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="3e4ae2c8-a260-426d-ae0e-38912a1ecc85" data-loc="112:29-112:141" data-file-name="components/error-test.tsx">
              <div className="flex" data-unique-id="9fb28e2a-dcdf-4c7b-b563-11310070009a" data-loc="113:14-113:36" data-file-name="components/error-test.tsx">
                <div className="flex-shrink-0" data-unique-id="32ccdd29-f241-45b8-a92d-85ec8116dfcd" data-loc="114:16-114:47" data-file-name="components/error-test.tsx">
                  <AlertCircle className={`h-5 w-5 ${result.success ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-3" data-unique-id="be022e14-2b51-4284-909a-cc6125b4f2db" data-loc="117:16-117:38" data-file-name="components/error-test.tsx">
                  <p className="text-sm font-medium" data-unique-id="cabe6ee3-1c16-4dfe-b0c0-c9dfa893f77a" data-loc="118:18-118:53" data-file-name="components/error-test.tsx">{result.message}</p>
                </div>
              </div>
            </div>}
        </div>
        
        {/* Error Boundary Test Section */}
        <div className="border-t pt-6" data-unique-id="79d9c310-10bf-4d42-af08-2fb5f6850e54" data-loc="125:8-125:39" data-file-name="components/error-test.tsx">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center" data-unique-id="c4805808-44bd-4e31-bc02-ec43183ccbba" data-loc="126:10-126:83" data-file-name="components/error-test.tsx">
            <Bug className="h-5 w-5 mr-2 text-purple-500" />
            Test Error Boundary
          </h3>
          
          <div className="space-y-4" data-unique-id="b81a0f2d-68ec-4b63-b4a6-bb37fda9c61d" data-loc="131:10-131:37" data-file-name="components/error-test.tsx">
            <p className="text-sm text-gray-600" data-unique-id="d85d1246-157a-479c-b6fb-b487e9ba56d3" data-loc="132:12-132:49" data-file-name="components/error-test.tsx">
              This section demonstrates the Error Boundary component. When you click the button below, 
              it will render a component that throws an error, which will be caught by the Error Boundary.
            </p>
            
            <div className="flex items-center space-x-4" data-unique-id="5d931f2e-2783-44bb-a648-f8c5fcff2585" data-loc="137:12-137:57" data-file-name="components/error-test.tsx">
              <button onClick={() => setShouldThrow(!shouldThrow)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="c6042308-e64f-4b4f-9afc-e75fd2a2954d" data-loc="138:14-138:300" data-file-name="components/error-test.tsx">
                {shouldThrow ? 'Fix Component' : 'Break Component'}
              </button>
              
              <span className="text-sm text-gray-500" data-unique-id="af07998b-a528-416f-99d4-b2bea2c5b093" data-loc="142:14-142:54" data-file-name="components/error-test.tsx">
                Current state: {shouldThrow ? 'Will throw error' : 'Working correctly'}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4" data-unique-id="413c95a6-4e39-4f03-9748-4dd9dba90cd8" data-loc="147:12-147:67" data-file-name="components/error-test.tsx">
              <ErrorBoundary>
                <BuggyCounter shouldThrow={shouldThrow} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>;
}