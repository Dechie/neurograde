import type { ReactNode } from "react"
import { DashboardHeader } from "@/components/dashboard/studentDashboard/DashboardHeader"
import { Sidebar } from "@/components/dashboard/adminDashboard/AdminSidebar";

export function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <div className="dashboard-content flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
        <DashboardHeader title={title} />
        <main className="flex-1 p-6 overflow-auto w-full max-w-full">{children}</main>
      </div>
    </div>
  )
}
