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
      return <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            We encountered an error while rendering this page. Our team has been notified.
          </p>
          <button onClick={this.resetErrorBoundary} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
          {process.env.NODE_ENV !== "production" && this.state.error && <div className="mt-6 p-4 bg-gray-800 text-white rounded-md overflow-auto max-w-full">
              <p className="font-mono text-sm mb-2">{this.state.error.toString()}</p>
              {this.state.errorInfo && <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-300">Component Stack</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">
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