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
      return <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-100" data-unique-id="569e5443-b869-4330-8bf5-debad7e3e94b" data-loc="64:13-64:133" data-file-name="components/error-boundary.tsx">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4" data-unique-id="88381846-c41e-4cb3-a33b-e6a671cff43a" data-loc="65:10-65:99" data-file-name="components/error-boundary.tsx">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2" data-unique-id="93dde633-397f-4485-8f6d-921803a24fd6" data-loc="68:10-68:67" data-file-name="components/error-boundary.tsx">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md" data-unique-id="6234c40b-4086-4508-b67a-302cbc2f8bf4" data-loc="69:10-69:65" data-file-name="components/error-boundary.tsx">
            We encountered an error while rendering this page. Our team has been notified.
          </p>
          <button onClick={this.resetErrorBoundary} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="e292282c-db93-4c83-a125-2c82aba10ea0" data-loc="72:10-72:276" data-file-name="components/error-boundary.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
          {process.env.NODE_ENV !== "production" && this.state.error && <div className="mt-6 p-4 bg-gray-800 text-white rounded-md overflow-auto max-w-full" data-unique-id="7d9dbb25-40aa-44cd-bcfd-f5ac44c3811f" data-loc="75:72-75:157" data-file-name="components/error-boundary.tsx">
              <p className="font-mono text-sm mb-2" data-unique-id="6dc1ee43-a939-453e-b243-caa577ac584b" data-loc="76:14-76:52" data-file-name="components/error-boundary.tsx">{this.state.error.toString()}</p>
              {this.state.errorInfo && <details className="mt-2" data-unique-id="f88bda72-c3e0-460e-b134-73cbd2452abe" data-loc="77:39-77:65" data-file-name="components/error-boundary.tsx">
                  <summary className="cursor-pointer text-sm text-gray-300" data-unique-id="86e2f167-5838-473d-8310-f43ac2aabe9e" data-loc="78:18-78:76" data-file-name="components/error-boundary.tsx">Component Stack</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap" data-unique-id="df8039cc-6c20-4bd7-b67a-e9a7c4457af7" data-loc="79:18-79:82" data-file-name="components/error-boundary.tsx">
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