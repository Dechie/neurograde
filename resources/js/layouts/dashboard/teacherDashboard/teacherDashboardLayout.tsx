import type { ReactNode } from "react"
import { DashboardHeader } from "@/components/dashboard/studentDashboard/DashboardHeader"
import { Sidebar } from "@/components/dashboard/teacherDashboard/TeacherSidebar";
import { Toaster } from "@/components/ui/toaster";

export function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="h-full sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="sticky top-0 z-10 w-full flex-shrink-0">
          <DashboardHeader title={title} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="absolute inset-0 p-6">
            {children}
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  )
}