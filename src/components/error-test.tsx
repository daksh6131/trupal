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
  return <div className="p-4 bg-gray-100 rounded-md" data-unique-id="eab8589c-d3dc-48af-ac4e-8057e3da841d" data-loc="17:9-17:53" data-file-name="components/error-test.tsx">
      <p className="text-gray-800" data-unique-id="51a6a4a3-7c57-4fbb-8846-4347ca2af112" data-loc="18:6-18:35" data-file-name="components/error-test.tsx">Component rendered successfully!</p>
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
  return <div className="bg-white shadow rounded-lg p-6" data-unique-id="fe0ff078-095d-4e7a-a414-d25ea38d4cd1" data-loc="69:9-69:57" data-file-name="components/error-test.tsx">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center" data-unique-id="950e0199-f4d6-4a2e-a0ea-42461030859c" data-loc="70:6-70:79" data-file-name="components/error-test.tsx">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
        Test Error Logger
      </h2>
      
      <div className="space-y-6" data-unique-id="b31f9b26-b6d9-40a1-9bb2-0b7f10f3951f" data-loc="75:6-75:33" data-file-name="components/error-test.tsx">
        <div className="space-y-4" data-unique-id="daab58bc-d4c6-4318-a367-2aaf7f621e49" data-loc="76:8-76:35" data-file-name="components/error-test.tsx">
          <div data-unique-id="e0704e81-967b-42b6-9e1a-02674030ab61" data-loc="77:10-77:15" data-file-name="components/error-test.tsx">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700" data-unique-id="1984391c-a806-4073-a554-a3451d0006e8" data-loc="78:12-78:89" data-file-name="components/error-test.tsx">
              Error Message
            </label>
            <input type="text" id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={message} onChange={e => setMessage(e.target.value)} data-unique-id="e68f0076-80b5-434e-a09c-cbcb31fcbac0" data-loc="81:12-81:261" data-file-name="components/error-test.tsx" />
          </div>
          
          <div data-unique-id="74f6c85d-a77c-40d1-9ac4-6a92f3232e22" data-loc="84:10-84:15" data-file-name="components/error-test.tsx">
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700" data-unique-id="c5827239-dae9-4cda-afe8-caa15c5175ae" data-loc="85:12-85:90" data-file-name="components/error-test.tsx">
              Severity
            </label>
            <select id="severity" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={severity} onChange={e => setSeverity(e.target.value as any)} data-unique-id="b1df4f02-645e-4c80-9748-25913c17767a" data-loc="88:12-88:264" data-file-name="components/error-test.tsx">
              <option value="low" data-unique-id="7848872e-17e6-4339-9500-22fe6be55865" data-loc="89:14-89:34" data-file-name="components/error-test.tsx">Low</option>
              <option value="medium" data-unique-id="b5b71660-eb34-441a-8ca5-42049694e165" data-loc="90:14-90:37" data-file-name="components/error-test.tsx">Medium</option>
              <option value="high" data-unique-id="99f76f97-db3e-44a8-81f3-33afefc34c6c" data-loc="91:14-91:35" data-file-name="components/error-test.tsx">High</option>
              <option value="critical" data-unique-id="3636f64f-0e29-4a76-aa6d-86ba005e125c" data-loc="92:14-92:39" data-file-name="components/error-test.tsx">Critical</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2" data-unique-id="31664bce-da4c-4843-8e9a-4cd415a2974b" data-loc="96:10-96:59" data-file-name="components/error-test.tsx">
            <button onClick={triggerError} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" data-unique-id="5a9ac832-e476-45da-a965-a8829eb81f58" data-loc="97:12-97:309" data-file-name="components/error-test.tsx">
              {loading ? 'Logging...' : 'Log Test Error'}
            </button>
            
            <button onClick={triggerRuntimeError} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="ce215a1f-a528-45e2-9ff2-fe863355223b" data-loc="101:12-101:274" data-file-name="components/error-test.tsx">
              Trigger Runtime Error
            </button>
            
            <button onClick={() => {
            triggerPromiseError().catch(() => {});
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" data-unique-id="7c6ed2cc-f86c-4610-8a16-3b212152ca55" data-loc="105:12-107:246" data-file-name="components/error-test.tsx">
              Trigger Promise Error
            </button>
          </div>
          
          {result.message && <div className={`mt-2 p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="91a96483-a0fd-4c91-9d43-d9d4182c3cbf" data-loc="112:29-112:141" data-file-name="components/error-test.tsx">
              <div className="flex" data-unique-id="d04360dc-2193-4ec3-b5c5-46fd141a57d0" data-loc="113:14-113:36" data-file-name="components/error-test.tsx">
                <div className="flex-shrink-0" data-unique-id="d5812acf-bb4c-4bc1-ac80-3f80e63c8674" data-loc="114:16-114:47" data-file-name="components/error-test.tsx">
                  <AlertCircle className={`h-5 w-5 ${result.success ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-3" data-unique-id="7d2d40c4-ef8a-409d-86a6-732044d55209" data-loc="117:16-117:38" data-file-name="components/error-test.tsx">
                  <p className="text-sm font-medium" data-unique-id="ab7efcf8-602b-44f2-889a-883d38f18569" data-loc="118:18-118:53" data-file-name="components/error-test.tsx">{result.message}</p>
                </div>
              </div>
            </div>}
        </div>
        
        {/* Error Boundary Test Section */}
        <div className="border-t pt-6" data-unique-id="f24bd493-82af-4141-90ba-414702349910" data-loc="125:8-125:39" data-file-name="components/error-test.tsx">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center" data-unique-id="10e136ea-32f9-419a-8001-f0e586f5cfee" data-loc="126:10-126:83" data-file-name="components/error-test.tsx">
            <Bug className="h-5 w-5 mr-2 text-purple-500" />
            Test Error Boundary
          </h3>
          
          <div className="space-y-4" data-unique-id="ae0a6518-2e75-42b6-b8ff-7025cdd36cbc" data-loc="131:10-131:37" data-file-name="components/error-test.tsx">
            <p className="text-sm text-gray-600" data-unique-id="5a29ea26-1d6b-473f-b755-a6aaad5d726b" data-loc="132:12-132:49" data-file-name="components/error-test.tsx">
              This section demonstrates the Error Boundary component. When you click the button below, 
              it will render a component that throws an error, which will be caught by the Error Boundary.
            </p>
            
            <div className="flex items-center space-x-4" data-unique-id="d2207ee5-f572-4e39-b7f0-005b4a064906" data-loc="137:12-137:57" data-file-name="components/error-test.tsx">
              <button onClick={() => setShouldThrow(!shouldThrow)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="84d891a2-41ab-4d5f-83ff-ceabe31bda1c" data-loc="138:14-138:300" data-file-name="components/error-test.tsx">
                {shouldThrow ? 'Fix Component' : 'Break Component'}
              </button>
              
              <span className="text-sm text-gray-500" data-unique-id="d2f33aaa-4d1b-4eff-88ec-4d0eefccdeb4" data-loc="142:14-142:54" data-file-name="components/error-test.tsx">
                Current state: {shouldThrow ? 'Will throw error' : 'Working correctly'}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4" data-unique-id="67c6bcc7-da69-470b-9b19-c1a5e6a240e7" data-loc="147:12-147:67" data-file-name="components/error-test.tsx">
              <ErrorBoundary>
                <BuggyCounter shouldThrow={shouldThrow} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>;
}