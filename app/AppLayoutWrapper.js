"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./dashboard/_components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex min-h-screen w-full bg-[#FBF1EE]">
      {!isHomePage && (
        <div className="flex-shrink-0">
          <AppSidebar />
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {!isHomePage && (
          <header className="lg:hidden p-4 border-b border-[#e4d3d5] bg-white flex items-center justify-between">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-4 ml-auto">
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
        )}

        <main
          className="flex-1 overflow-y-auto transition-all duration-300"
          style={{
            backgroundColor: "#FBF1EE",
            padding: "1rem",
            marginLeft: "0",
          }}
        >
          <div className="mx-auto p-4 md:p-6 lg:p-8 w-full max-w-[1800px]">
            {!isHomePage && <WelcomeContainer />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
