import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

export function useSidebar() {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const sidebarWidth = isCollapsed ? '64px' : '256px'

    document.documentElement.style.setProperty('--sidebar-width', isMobile ? '0px' : sidebarWidth)
    document.documentElement.setAttribute('data-sidebar-mobile', isMobile.toString())
    document.documentElement.setAttribute('data-sidebar-mobile-open', isMobileOpen.toString())
    document.documentElement.setAttribute('data-sidebar-collapsed', isCollapsed.toString())

    document.body.style.overflow = isMobile && isMobileOpen ? 'hidden' : 'auto'
  }, [isCollapsed, isMobile, isMobileOpen])

  return {
    isCollapsed,
    isMobile,
    isMobileOpen,
    toggleCollapse: () => setIsCollapsed(prev => !prev),
    toggleMobile: () => setIsMobileOpen(prev => !prev),
    closeMobile: () => setIsMobileOpen(false),
  }
}
