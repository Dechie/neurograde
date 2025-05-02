import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard/studentDashboard/DashboardHeader"
import { Sidebar } from "@/components/dashboard/studentDashboard/Sidebar"

export function StudentDashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="dashboard-content flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
          <DashboardHeader title={title} />
          <main className="flex-1 p-6 overflow-auto w-full max-w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
