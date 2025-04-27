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
      return <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-100" data-unique-id="870fba5c-0bfe-4a72-85de-3b55937bafb7" data-loc="64:13-64:133" data-file-name="components/error-boundary.tsx">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4" data-unique-id="68a7d2cf-af7d-4eb6-a886-c7587c510878" data-loc="65:10-65:99" data-file-name="components/error-boundary.tsx">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2" data-unique-id="d2e44876-dfd1-4bc3-a084-176c8a52d19b" data-loc="68:10-68:67" data-file-name="components/error-boundary.tsx">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md" data-unique-id="2f6ef00c-a5fa-4616-8f9a-3c247065a2b3" data-loc="69:10-69:65" data-file-name="components/error-boundary.tsx">
            We encountered an error while rendering this page. Our team has been notified.
          </p>
          <button onClick={this.resetErrorBoundary} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" data-unique-id="305ee22f-822c-4379-b5aa-fed7ade56fff" data-loc="72:10-72:276" data-file-name="components/error-boundary.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
          {process.env.NODE_ENV !== "production" && this.state.error && <div className="mt-6 p-4 bg-gray-800 text-white rounded-md overflow-auto max-w-full" data-unique-id="ce990f24-7083-4b10-b058-7b62fe51de96" data-loc="75:72-75:157" data-file-name="components/error-boundary.tsx">
              <p className="font-mono text-sm mb-2" data-unique-id="62ceb982-c33e-4830-bce5-0e7d6d2e7a58" data-loc="76:14-76:52" data-file-name="components/error-boundary.tsx">{this.state.error.toString()}</p>
              {this.state.errorInfo && <details className="mt-2" data-unique-id="f6cffb5b-45ab-4623-8f86-d96b99bdcc81" data-loc="77:39-77:65" data-file-name="components/error-boundary.tsx">
                  <summary className="cursor-pointer text-sm text-gray-300" data-unique-id="92e95fa4-8fe1-4bf4-a96c-97cc9fdd313e" data-loc="78:18-78:76" data-file-name="components/error-boundary.tsx">Component Stack</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap" data-unique-id="320de24c-23dd-4530-8f29-b01673768a26" data-loc="79:18-79:82" data-file-name="components/error-boundary.tsx">
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