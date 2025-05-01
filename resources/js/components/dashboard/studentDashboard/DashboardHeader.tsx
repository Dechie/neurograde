// components/layout/DashboardHeader.tsx
import { Bell, Search, Settings } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePage } from "@inertiajs/react"

export function DashboardHeader({ title }: { title?: string }) {
  const { url } = usePage()

  const getPageTitle = () => {
    if (url === "/") return "Overview"
    if (url === "/tests") return "Test"
    if (url === "/results") return "Result"
    return title || "Overview"
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 w-full">
      <h1 className="text-xl font-semibold ml-8 md:ml-0">{getPageTitle()}</h1>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search" className="w-full rounded-full bg-muted pl-8 lg:w-[250px]" />
        </div>
        <div className="flex gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
            <img src="/1.jpg" alt="Avatar" width={32} height={32} className="rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  )
}
