import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./dashboard/_components/AppSidebar";
import { UserButton } from "@clerk/nextjs";
import Head from "next/head";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

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
      <html lang="en">
        <Head>
          <title>I-Hire Dashboard</title>
          <meta name="description" content="AI-powered interview platform" />
        </Head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster />
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#FBF1EE]">
              {/* Sidebar */}
              <div className="flex-shrink-0">
                <AppSidebar />
              </div>
              
              {/* Main Content Area */}
              <div className="flex flex-col flex-1 min-w-0">
                
                {/* Top Navigation (for mobile) */}
                <header className="lg:hidden p-4 border-b border-[#e4d3d5] bg-white flex items-center justify-between">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="flex items-center gap-4 ml-auto">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </header>
                
                {/* Content */}
                <main 
                  className="flex-1 overflow-y-auto transition-all duration-300" 
                  style={{ 
                    backgroundColor: '#FBF1EE',
                    padding: '1rem',
                    marginLeft: '0' 
                  }}
                >
                  <div className="mx-auto p-4 md:p-6 lg:p-8 w-full max-w-[1800px]">
                    <WelcomeContainer />
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
