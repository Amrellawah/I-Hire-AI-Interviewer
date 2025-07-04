import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import ClientUserProfileSync from "./components/ClientUserProfileSync";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "I-Hire",
  icons: {
    icon: "/logo.png",
  },
  description: "I-Hire - AI-Powered Hiring Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Toaster/>
        <ClientUserProfileSync />
        {children}</body>
    </html>
    </ClerkProvider>
  );
}

