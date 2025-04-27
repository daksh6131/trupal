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
  return <div className="p-4 bg-gray-100 rounded-md" data-unique-id="e78ccdeb-0b05-434c-b026-68759f6dfdc7" data-loc="17:9-17:53" data-file-name="components/error-test.tsx">
      <p className="text-gray-800" data-unique-id="2b0d5ecd-8bd9-4171-a59e-a440c3df0eb7" data-loc="18:6-18:35" data-file-name="components/error-test.tsx">Component rendered successfully!</p>
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
  return <div className="bg-white shadow rounded-lg p-6" data-unique-id="03109b28-c1e7-492a-83bd-39863f04b047" data-loc="69:9-69:57" data-file-name="components/error-test.tsx">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center" data-unique-id="156df785-c350-4cee-97a2-42f92470abc5" data-loc="70:6-70:79" data-file-name="components/error-test.tsx">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
        Test Error Logger
      </h2>
      
      <div className="space-y-6" data-unique-id="64dc1404-ef12-4ece-ad05-2ab0a0828b94" data-loc="75:6-75:33" data-file-name="components/error-test.tsx">
        <div className="space-y-4" data-unique-id="cbf52601-f449-44ee-a4f5-9e90d43e8558" data-loc="76:8-76:35" data-file-name="components/error-test.tsx">
          <div data-unique-id="2a49bf11-5da8-4880-b8cf-d797475a6f1b" data-loc="77:10-77:15" data-file-name="components/error-test.tsx">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700" data-unique-id="5081237b-c5e9-40e1-aed1-d8ff70adcae1" data-loc="78:12-78:89" data-file-name="components/error-test.tsx">
              Error Message
            </label>
            <input type="text" id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={message} onChange={e => setMessage(e.target.value)} data-unique-id="ea6200f2-c310-41f4-bfb9-2f578327c1e6" data-loc="81:12-81:261" data-file-name="components/error-test.tsx" />
          </div>
          
          <div data-unique-id="628a6367-b72c-44a3-ae4e-316618017c78" data-loc="84:10-84:15" data-file-name="components/error-test.tsx">
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700" data-unique-id="05775c69-219c-4358-8aec-7d03f78c3f14" data-loc="85:12-85:90" data-file-name="components/error-test.tsx">
              Severity
            </label>
            <select id="severity" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={severity} onChange={e => setSeverity(e.target.value as any)} data-unique-id="1aeff049-c75c-4736-b980-3ff7de0cf592" data-loc="88:12-88:264" data-file-name="components/error-test.tsx">
              <option value="low" data-unique-id="39544275-632a-4455-8616-09811f1fccd9" data-loc="89:14-89:34" data-file-name="components/error-test.tsx">Low</option>
              <option value="medium" data-unique-id="22ff8486-6007-48d7-8a08-44a8d2acc9ad" data-loc="90:14-90:37" data-file-name="components/error-test.tsx">Medium</option>
              <option value="high" data-unique-id="bbd23ec8-80de-4fef-b1ab-8e67600d576d" data-loc="91:14-91:35" data-file-name="components/error-test.tsx">High</option>
              <option value="critical" data-unique-id="852b1c5d-f07d-4d43-aaec-fbc1b212044d" data-loc="92:14-92:39" data-file-name="components/error-test.tsx">Critical</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2" data-unique-id="36b4f5fa-ff04-454f-8ee4-b96d3ff5af5b" data-loc="96:10-96:59" data-file-name="components/error-test.tsx">
            <button onClick={triggerError} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" data-unique-id="d59bd041-e6fb-4e88-af24-ce13ce1c0957" data-loc="97:12-97:309" data-file-name="components/error-test.tsx">
              {loading ? 'Logging...' : 'Log Test Error'}
            </button>
            
            <button onClick={triggerRuntimeError} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="2b12d2c5-1cd4-410b-a8f6-8d9af4c30eb3" data-loc="101:12-101:274" data-file-name="components/error-test.tsx">
              Trigger Runtime Error
            </button>
            
            <button onClick={() => {
            triggerPromiseError().catch(() => {});
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" data-unique-id="0fad9d52-566c-4132-bad9-0b899917f98c" data-loc="105:12-107:246" data-file-name="components/error-test.tsx">
              Trigger Promise Error
            </button>
          </div>
          
          {result.message && <div className={`mt-2 p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="3c4c959e-960c-4f39-a0a0-3428b17b19b8" data-loc="112:29-112:141" data-file-name="components/error-test.tsx">
              <div className="flex" data-unique-id="9ebc8262-80ec-4eca-b530-60725920bde2" data-loc="113:14-113:36" data-file-name="components/error-test.tsx">
                <div className="flex-shrink-0" data-unique-id="21936d0f-6a99-412d-901f-727317406454" data-loc="114:16-114:47" data-file-name="components/error-test.tsx">
                  <AlertCircle className={`h-5 w-5 ${result.success ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-3" data-unique-id="1216878d-e19c-40da-a048-efeb1fb27cf5" data-loc="117:16-117:38" data-file-name="components/error-test.tsx">
                  <p className="text-sm font-medium" data-unique-id="d3c427a2-4a99-454c-a6c9-1c593f49a626" data-loc="118:18-118:53" data-file-name="components/error-test.tsx">{result.message}</p>
                </div>
              </div>
            </div>}
        </div>
        
        {/* Error Boundary Test Section */}
        <div className="border-t pt-6" data-unique-id="19544584-c0e3-4fcb-ba85-8560cb5b1311" data-loc="125:8-125:39" data-file-name="components/error-test.tsx">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center" data-unique-id="a1280c28-78d9-4212-a231-90c05d407617" data-loc="126:10-126:83" data-file-name="components/error-test.tsx">
            <Bug className="h-5 w-5 mr-2 text-purple-500" />
            Test Error Boundary
          </h3>
          
          <div className="space-y-4" data-unique-id="2b17d6af-f2d6-4ac2-9632-0bf8783855bc" data-loc="131:10-131:37" data-file-name="components/error-test.tsx">
            <p className="text-sm text-gray-600" data-unique-id="17051a03-d79d-4597-aa26-c00b4fec899a" data-loc="132:12-132:49" data-file-name="components/error-test.tsx">
              This section demonstrates the Error Boundary component. When you click the button below, 
              it will render a component that throws an error, which will be caught by the Error Boundary.
            </p>
            
            <div className="flex items-center space-x-4" data-unique-id="ccc095e1-da4f-43fc-ab46-18bc63aee065" data-loc="137:12-137:57" data-file-name="components/error-test.tsx">
              <button onClick={() => setShouldThrow(!shouldThrow)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="c0e5b98f-7093-4033-bef6-c26cc843373b" data-loc="138:14-138:300" data-file-name="components/error-test.tsx">
                {shouldThrow ? 'Fix Component' : 'Break Component'}
              </button>
              
              <span className="text-sm text-gray-500" data-unique-id="8c335e7c-5f42-4cfe-99a2-0a38a59ec1a5" data-loc="142:14-142:54" data-file-name="components/error-test.tsx">
                Current state: {shouldThrow ? 'Will throw error' : 'Working correctly'}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4" data-unique-id="04ae8896-c55d-4516-8eb5-86c9b8f983fd" data-loc="147:12-147:67" data-file-name="components/error-test.tsx">
              <ErrorBoundary>
                <BuggyCounter shouldThrow={shouldThrow} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>;
}