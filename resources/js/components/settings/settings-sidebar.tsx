"use client"

import type React from "react"

import { Link } from "@inertiajs/react"
import { User, KeyRound, Palette, ChevronLeft, ChevronRight, Menu, X, Settings } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type SettingsNavItem = {
  title: string
  href: string
  icon: React.ElementType
}

const settingsNavItems: SettingsNavItem[] = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Password",
    href: "/settings/password",
    icon: KeyRound,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: Palette,
  },
]

export function SettingsSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    // Save preference to localStorage
    localStorage.setItem("settingsSidebarCollapsed", String(!isCollapsed))
  }

  // Toggle mobile sidebar
  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Close mobile sidebar
  const closeMobile = () => {
    setIsMobileOpen(false)
  }

  useEffect(() => {
    // Check for saved preference
    const savedCollapsed = localStorage.getItem("settingsSidebarCollapsed")
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === "true")
    }

    // Check if we're on mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }

    // Initial check
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Get current path for active state
  const currentPath = typeof window !== "undefined" ? window.location.pathname : ""

  return (
    <>
      {/* Mobile Button (Menu / Close) */}
      {isMobile && (
        <div className={`fixed z-50 md:hidden ${isMobileOpen ? "top-2 left-52" : "top-2 left-2"}`}>
          <Button variant="outline" size="icon" onClick={toggleMobile}>
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}
      {/* Settings Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out border rounded-lg bg-white
                  ${isMobile ? "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]" : "sticky top-4 h-[calc(100vh-8rem)]"}
                  ${isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : isCollapsed ? "w-16" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
              <Settings className="h-4 w-4" />
            </div>
            {(!isCollapsed || isMobile) && <span className="text-lg font-semibold">Settings</span>}
          </div>
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleCollapse}>
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <TooltipProvider>
          <nav className="flex flex-col space-y-1 p-2">
            {settingsNavItems.map((item) => (
              <Tooltip key={item.href} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={() => isMobile && closeMobile()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded text-sm",
                      currentPath === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground",
                      isCollapsed && !isMobile ? "justify-center" : "w-full",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {(!isCollapsed || isMobile) && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && !isMobile && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>
      </aside>
    </>
  )
}