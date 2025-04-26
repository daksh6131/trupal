import React from "react";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";
import {
  AnalyticsTracker,
  DOMInspector,
  Branding,
} from "@/utils/creatr.scripts";
import { ErrorBoundary } from "@/components/error-boundary";
import SupabaseInitializer from "@/components/supabase-initializer";
import { AuthProvider } from "@/contexts/auth-context";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export const metadata: Metadata = {
  title: {
    default: "CardSales Pro",
    template: "%s | CardSales Pro",
  },
  description: "Internal tool for sales agents to recommend credit cards",
  applicationName: "CardSales Pro",
  keywords: ["credit card", "sales tool", "internal application", "eligibility"],
  authors: [{ name: "Sales Team" }],
  creator: "FinTech Solutions",
  publisher: "FinTech Solutions",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CardSales Pro",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-gray-50">
        <SupabaseInitializer />
        <AuthProvider>
          
            <ErrorBoundary>
              {children}
              </ErrorBoundary>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
