import { Link, usePage } from "@inertiajs/react";
import {
  FileText, Home, ClipboardList, ListChecks,
  LifeBuoy, Settings, Menu, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/use-sidebar";
import {route} from "ziggy-js"; 

const MENU_ITEMS = [
  { path: route('dashboard'), label: 'Home', icon: Home },
  { path: route('student.tests'), label: 'Tests', icon: ClipboardList },
  { path: route('student.results'), label: 'Results', icon: ListChecks },
];

const FOOTER_ITEMS = [
  { path: '/help', label: 'Help & Center', icon: LifeBuoy },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { url } = usePage();
  const {
    isCollapsed, isMobile, isMobileOpen,
    toggleCollapse, toggleMobile, closeMobile
  } = useSidebar();

  const isActive = (path: string) => {
    const current = new URL(path, window.location.origin).pathname;
    return url.startsWith(current);
  };

  return (
    <>
      {isMobile && (
        <div className={`fixed z-50 md:hidden ${isMobileOpen ? 'top-2 left-52' : 'top-2 left-2 '}`}>
          <Button variant="outline" size="icon" onClick={toggleMobile}>
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}

      <aside
        className={`transition-all duration-300 ease-in-out border-r bg-white flex flex-col
        ${isMobile ? 'fixed top-0 left-0 z-40 h-full w-full' : 'sticky top-0 h-screen'}
        ${isMobile
          ? isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          : isCollapsed
            ? 'w-16'
            : 'w-64'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
              <FileText className="h-4 w-4" />
            </div>
            {(!isCollapsed || isMobile) && <span className="text-lg font-semibold">SmartGrade</span>}
          </div>
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleCollapse}>
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        <TooltipProvider>
          <nav className="flex-1 p-2">
            <div className="flex h-full flex-col">
                            <div className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <Tooltip key={item.path} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.path}
                    onClick={() => isMobile && closeMobile()}
                    className={`flex items-center gap-3 px-3 py-2 rounded
                    ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'}
                    ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            ))}
            </div>
            </div>
          </nav>

          {/* Footer items at bottom */}
          {/* <div className="p-2 mt-auto space-y-1">
            {FOOTER_ITEMS.map((item) => (
              <Tooltip key={item.path} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.path}
                    onClick={() => isMobile && closeMobile()}
                    className={`flex items-center gap-3 px-3 py-2 rounded
                    ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'}
                    ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            ))}
          </div> */}
        </TooltipProvider>
      </aside>
    </>
  );
}
