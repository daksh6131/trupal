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
      return <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-100" data-unique-id="693de49d-a53a-486c-931d-e9af372f24da" data-loc="64:13-64:133" data-file-name="components/error-boundary.tsx">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4" data-unique-id="d7679542-468b-4f73-bd79-cfce0df4cf6c" data-loc="65:10-65:99" data-file-name="components/error-boundary.tsx">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2" data-unique-id="913b6889-01ad-4ca2-b482-c9b6cec0c7d2" data-loc="68:10-68:67" data-file-name="components/error-boundary.tsx">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md" data-unique-id="72a5f48c-e65f-4efc-a5da-7fd09de5a45b" data-loc="69:10-69:65" data-file-name="components/error-boundary.tsx">
            We encountered an error while rendering this page. Our team has been notified.
          </p>
          <button onClick={this.resetErrorBoundary} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="f95d5f24-63c6-44be-a45e-c1c01e22584a" data-loc="72:10-72:276" data-file-name="components/error-boundary.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
          {process.env.NODE_ENV !== "production" && this.state.error && <div className="mt-6 p-4 bg-gray-800 text-white rounded-md overflow-auto max-w-full" data-unique-id="d402c29b-1ba1-4333-a72d-8b4c879bb3d1" data-loc="75:72-75:157" data-file-name="components/error-boundary.tsx">
              <p className="font-mono text-sm mb-2" data-unique-id="b60fa0ae-98f7-419a-a52f-1ccbb0cbcc92" data-loc="76:14-76:52" data-file-name="components/error-boundary.tsx">{this.state.error.toString()}</p>
              {this.state.errorInfo && <details className="mt-2" data-unique-id="8575d4c4-e966-4153-a62b-bc4adf3444c8" data-loc="77:39-77:65" data-file-name="components/error-boundary.tsx">
                  <summary className="cursor-pointer text-sm text-gray-300" data-unique-id="bbc7b244-f499-458a-b2df-f5a593587715" data-loc="78:18-78:76" data-file-name="components/error-boundary.tsx">Component Stack</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap" data-unique-id="088fda44-3370-480e-bb61-2f0f47077390" data-loc="79:18-79:82" data-file-name="components/error-boundary.tsx">
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