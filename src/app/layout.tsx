import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientNavigation from "@/components/ClientNavigation";
import { Toaster } from "@/components/ui/sonner";
import ClientWrapper from "@/components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PosiTrack - Your Digital Wellness Journal",
  description: "Track your positivity, emotions, and personal growth with PosiTrack - a beautiful, minimal wellness journaling app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ClientWrapper>
              <ClientNavigation />
              <div className="pt-16">
                {children}
              </div>
              <Toaster />
            </ClientWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
