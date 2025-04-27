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
  return <div className="p-4 bg-gray-100 rounded-md" data-unique-id="59b1e2b1-a3ee-49c9-9352-aa27a380d8cc" data-loc="17:9-17:53" data-file-name="components/error-test.tsx">
      <p className="text-gray-800" data-unique-id="e0799061-cc0d-492f-b5d8-1352a390706a" data-loc="18:6-18:35" data-file-name="components/error-test.tsx">Component rendered successfully!</p>
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
  return <div className="bg-white shadow rounded-lg p-6" data-unique-id="b0218d55-23db-41f2-8095-4933e8b4b28b" data-loc="69:9-69:57" data-file-name="components/error-test.tsx">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center" data-unique-id="86e48086-3bd2-4fd2-bf9d-1dd71f5a50f3" data-loc="70:6-70:79" data-file-name="components/error-test.tsx">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
        Test Error Logger
      </h2>
      
      <div className="space-y-6" data-unique-id="62d4cea2-6c57-4fed-b63e-12033d0d9502" data-loc="75:6-75:33" data-file-name="components/error-test.tsx">
        <div className="space-y-4" data-unique-id="596d1548-a065-48e6-a174-acdcc90dc179" data-loc="76:8-76:35" data-file-name="components/error-test.tsx">
          <div data-unique-id="9e8edc8b-07b0-49ca-90d3-dc62329e6000" data-loc="77:10-77:15" data-file-name="components/error-test.tsx">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700" data-unique-id="ddb7c900-fcef-42d4-8220-1319fb141912" data-loc="78:12-78:89" data-file-name="components/error-test.tsx">
              Error Message
            </label>
            <input type="text" id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={message} onChange={e => setMessage(e.target.value)} data-unique-id="6953af86-3d96-4112-982e-bcce86f084d0" data-loc="81:12-81:261" data-file-name="components/error-test.tsx" />
          </div>
          
          <div data-unique-id="aac602d8-f5e0-4217-83ae-8b0c4a18b8e5" data-loc="84:10-84:15" data-file-name="components/error-test.tsx">
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700" data-unique-id="192c5949-e110-4f7d-9d64-49c9928b0a0a" data-loc="85:12-85:90" data-file-name="components/error-test.tsx">
              Severity
            </label>
            <select id="severity" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={severity} onChange={e => setSeverity(e.target.value as any)} data-unique-id="3395d776-cdc6-4884-8de1-5d0ac7ea24a6" data-loc="88:12-88:264" data-file-name="components/error-test.tsx">
              <option value="low" data-unique-id="8c439c53-c345-4cce-8847-c8e1490f6b46" data-loc="89:14-89:34" data-file-name="components/error-test.tsx">Low</option>
              <option value="medium" data-unique-id="4a76c37f-2d25-48ef-ae46-85700e5aebc9" data-loc="90:14-90:37" data-file-name="components/error-test.tsx">Medium</option>
              <option value="high" data-unique-id="e34c610c-e31c-4b71-9af2-ab093066a9be" data-loc="91:14-91:35" data-file-name="components/error-test.tsx">High</option>
              <option value="critical" data-unique-id="21729ade-d26c-4e56-ac5f-bafa0e093329" data-loc="92:14-92:39" data-file-name="components/error-test.tsx">Critical</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2" data-unique-id="2af51be9-4090-47b0-9e7e-3928ed9f68a1" data-loc="96:10-96:59" data-file-name="components/error-test.tsx">
            <button onClick={triggerError} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" data-unique-id="4b561d42-be03-4ef1-a665-75c460f3b414" data-loc="97:12-97:309" data-file-name="components/error-test.tsx">
              {loading ? 'Logging...' : 'Log Test Error'}
            </button>
            
            <button onClick={triggerRuntimeError} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="ec9880b3-58fc-41a5-aa08-ca3b6cade073" data-loc="101:12-101:274" data-file-name="components/error-test.tsx">
              Trigger Runtime Error
            </button>
            
            <button onClick={() => {
            triggerPromiseError().catch(() => {});
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" data-unique-id="f210f150-5333-4fd0-903c-142dc0331d88" data-loc="105:12-107:246" data-file-name="components/error-test.tsx">
              Trigger Promise Error
            </button>
          </div>
          
          {result.message && <div className={`mt-2 p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="45ab8631-3891-4332-862c-11ea070d57b3" data-loc="112:29-112:141" data-file-name="components/error-test.tsx">
              <div className="flex" data-unique-id="4a8c2aa6-ebf1-41be-861e-19239b75599f" data-loc="113:14-113:36" data-file-name="components/error-test.tsx">
                <div className="flex-shrink-0" data-unique-id="e2f9d8a4-90a9-41a7-8cf4-d2813f95114f" data-loc="114:16-114:47" data-file-name="components/error-test.tsx">
                  <AlertCircle className={`h-5 w-5 ${result.success ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-3" data-unique-id="778d3215-31aa-4710-b745-1858ee2e99dd" data-loc="117:16-117:38" data-file-name="components/error-test.tsx">
                  <p className="text-sm font-medium" data-unique-id="25be1328-19b5-439a-8a48-fc04f6d03016" data-loc="118:18-118:53" data-file-name="components/error-test.tsx">{result.message}</p>
                </div>
              </div>
            </div>}
        </div>
        
        {/* Error Boundary Test Section */}
        <div className="border-t pt-6" data-unique-id="73d90025-5513-4a7d-84c1-bc8f9d682d2d" data-loc="125:8-125:39" data-file-name="components/error-test.tsx">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center" data-unique-id="6a7b3629-114a-43ee-bff0-66735b97b5a0" data-loc="126:10-126:83" data-file-name="components/error-test.tsx">
            <Bug className="h-5 w-5 mr-2 text-purple-500" />
            Test Error Boundary
          </h3>
          
          <div className="space-y-4" data-unique-id="1d54416c-b812-42c5-bf0d-adb0bf6e7925" data-loc="131:10-131:37" data-file-name="components/error-test.tsx">
            <p className="text-sm text-gray-600" data-unique-id="b3c510df-b0f1-47f8-a9e4-8db69d20147c" data-loc="132:12-132:49" data-file-name="components/error-test.tsx">
              This section demonstrates the Error Boundary component. When you click the button below, 
              it will render a component that throws an error, which will be caught by the Error Boundary.
            </p>
            
            <div className="flex items-center space-x-4" data-unique-id="64068ff6-ef4c-419e-840d-46a9ee0d232e" data-loc="137:12-137:57" data-file-name="components/error-test.tsx">
              <button onClick={() => setShouldThrow(!shouldThrow)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="ab962f03-9ffc-41e7-a56b-8408695ccb23" data-loc="138:14-138:300" data-file-name="components/error-test.tsx">
                {shouldThrow ? 'Fix Component' : 'Break Component'}
              </button>
              
              <span className="text-sm text-gray-500" data-unique-id="4920cfb7-6830-469f-bbfc-258eca673467" data-loc="142:14-142:54" data-file-name="components/error-test.tsx">
                Current state: {shouldThrow ? 'Will throw error' : 'Working correctly'}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4" data-unique-id="28605700-ff4d-46ff-8dc6-a504b59cf6eb" data-loc="147:12-147:67" data-file-name="components/error-test.tsx">
              <ErrorBoundary>
                <BuggyCounter shouldThrow={shouldThrow} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>;
}