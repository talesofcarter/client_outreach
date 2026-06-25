import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "./providers";

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "Client Outreach Tool",
  description: "Client Outreach & Progress Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
