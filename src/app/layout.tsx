import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CivicOS - AI Election Companion",
  description: "Your personalized, AI-powered civic assistant.",
};

import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
