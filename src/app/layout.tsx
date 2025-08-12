import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";

import BottomNavigation from "@/components/navigation/BottomNavigation";
import Providers from "@/components/providers";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Class Payment Tracker",
  description: "Track and manage your class payments efficiently",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Class Payment Tracker",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning translate="no">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body
        className={cn(
          montserrat.variable,
          geistMono.variable,
          "relative antialiased"
        )}
      >
        <Providers>
          {/* Main content with bottom padding for navigation */}
          <main className="pb-20">{children}</main>

          {/* Bottom Navigation - always visible */}
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
