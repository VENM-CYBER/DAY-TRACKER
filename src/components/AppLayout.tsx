import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 md:hidden">
            <SidebarTrigger />
            <span className="ml-3 font-semibold text-sm">StudentLife AI</span>
          </header>
          <main className="flex-1 overflow-auto tracker-scrollbar">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
