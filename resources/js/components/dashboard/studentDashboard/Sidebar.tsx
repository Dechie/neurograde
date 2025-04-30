import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart2,
    ChevronLeft,
    ChevronRight,
    FileText,
    HelpCircle,
    Home,
    Menu,
    Settings,
    User,
    X,
    ClipboardList,
    ListChecks,
    LineChart,
    LifeBuoy
  } from 'lucide-react';
  import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export function AppSidebar() {
    const { url } = usePage();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const isActive = (path: string) => url === path;

    useEffect(() => {
        const sidebarWidth = isCollapsed ? '64px' : '256px';

        if (isMobile) {
            document.documentElement.style.setProperty('--sidebar-width', '0px');
            document.documentElement.setAttribute('data-sidebar-mobile', 'true');
            document.documentElement.setAttribute('data-sidebar-mobile-open', isMobileOpen.toString());
        } else {
            document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
            document.documentElement.setAttribute('data-sidebar-mobile', 'false');
            document.documentElement.setAttribute('data-sidebar-collapsed', isCollapsed.toString());
        }
    }, [isCollapsed, isMobile, isMobileOpen]);

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileOpen]);

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/tests', icon: ClipboardList, label: 'Tests' },
        { path: '/results', icon: ListChecks, label: 'Results' },
      ];
      
      const footerItems = [
        { path: '/help', icon: LifeBuoy, label: 'Help & Center' },
        { path: '/settings', icon: Settings, label: 'Settings' },
      ];
      

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <div className={`fixed z-50 md:hidden ${isMobileOpen ? 'top-2 left-50' : 'top-2 left-0'}`}>
                    <Button variant="outline" size="icon" onClick={toggleMobileMenu} className="bg-background border-border h-10 w-10 shadow-md">
                        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className={`border-border h-screen border-r bg-white transition-all duration-300 ease-in-out ${isMobile ? 'fixed top-0 left-0 z-40' : 'sticky top-0 left-0'} ${isMobile ? (isMobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full') : isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}
            >
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
                            <FileText className="h-4 w-4" />
                        </div>
                        {(!isCollapsed || isMobile) && <span className="text-lg font-semibold">SmartGrade</span>}
                    </div>
                    {!isMobile && (
                        <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    )}
                </div>

                {/* Menu Items */}
                <TooltipProvider>
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Tooltip key={item.path} delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.path}
                                            onClick={() => isMobile && setIsMobileOpen(false)}
                                            className={`flex w-full items-center gap-3 rounded px-3 py-2 ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'} ${isCollapsed && !isMobile ? 'justify-center' : ''} `}
                                        >
                                            <item.icon className="h-5 w-5 flex-shrink-0" />
                                            {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
                                        </Link>
                                    </TooltipTrigger>
                                    {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
                                </Tooltip>
                            ))}
                        </div>
                    </div>

                    {/* Footer Items */}
                    <div className="mt-auto w-full p-2">
                        <div className="space-y-1">
                            {footerItems.map((item) => (
                                <Tooltip key={item.path} delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.path}
                                            onClick={() => isMobile && setIsMobileOpen(false)}
                                            className={`flex items-center gap-3 rounded px-3 py-2 ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'} ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
                                        >
                                            <item.icon className="h-5 w-5 flex-shrink-0" />
                                            {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
                                        </Link>
                                    </TooltipTrigger>
                                    {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </TooltipProvider>
            </aside>
        </>
    );
}
