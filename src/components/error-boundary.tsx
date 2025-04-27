"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logErrorWithContext } from "@/lib/error-logger";
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error logging system
    this.setState({
      errorInfo
    });

    // Log to our error tracking system
    logErrorWithContext({
      message: error.message,
      stack: error.stack,
      type: error.name,
      metadata: {
        componentStack: errorInfo.componentStack
      }
    }).catch(loggingError => {
      console.error("Failed to log error:", loggingError);
    });
  }
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };
  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, use our default fallback UI
      return <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-100" data-unique-id="775aabef-5bf3-4e33-9892-ce2c3f27db07" data-loc="64:13-64:133" data-file-name="components/error-boundary.tsx">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4" data-unique-id="35776827-0cc8-4aac-a762-344764abf944" data-loc="65:10-65:99" data-file-name="components/error-boundary.tsx">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2" data-unique-id="fb5de77b-916d-4f7b-8591-7a9bddf1baa9" data-loc="68:10-68:67" data-file-name="components/error-boundary.tsx">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md" data-unique-id="b63758f0-b123-43f7-bc7a-cda1b320203c" data-loc="69:10-69:65" data-file-name="components/error-boundary.tsx">
            We encountered an error while rendering this page. Our team has been notified.
          </p>
          <button onClick={this.resetErrorBoundary} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="0e6622db-d5fa-4384-a073-59af93e38bb0" data-loc="72:10-72:276" data-file-name="components/error-boundary.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
          {process.env.NODE_ENV !== "production" && this.state.error && <div className="mt-6 p-4 bg-gray-800 text-white rounded-md overflow-auto max-w-full" data-unique-id="8cf398e0-5ddf-4cff-ac99-1153ce781bae" data-loc="75:72-75:157" data-file-name="components/error-boundary.tsx">
              <p className="font-mono text-sm mb-2" data-unique-id="3feaab9a-6239-4023-9d17-d977c5b6a306" data-loc="76:14-76:52" data-file-name="components/error-boundary.tsx">{this.state.error.toString()}</p>
              {this.state.errorInfo && <details className="mt-2" data-unique-id="61cea4dd-1bb0-4b19-a312-56c7d5e21659" data-loc="77:39-77:65" data-file-name="components/error-boundary.tsx">
                  <summary className="cursor-pointer text-sm text-gray-300" data-unique-id="89e9095d-ba26-4c1c-8ddb-0a03f3b8a051" data-loc="78:18-78:76" data-file-name="components/error-boundary.tsx">Component Stack</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap" data-unique-id="ead21732-806f-486c-bf62-ae634445016b" data-loc="79:18-79:82" data-file-name="components/error-boundary.tsx">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>}
            </div>}
        </div>;
    }
    return this.props.children;
  }
}

// Higher-order component for functional components
export function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, fallback?: ReactNode): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>;
  };
}