import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar';
import Home from '@/pages/dashboard/studentDashboard/Home';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ChevronLeft, ChevronRight, FileText, LayoutList, LifeBuoy, Menu, Settings, UserPlus, UserX, Users, X , HomeIcon} from 'lucide-react';
import { route } from 'ziggy-js';

const MENU_ITEMS = [
    { path: route('admin.home'), label: 'Home', icon: HomeIcon },
    { path: route('admin.students.index'), label: 'Student List', icon: Users },
    { path: route('admin.teachers.index'), label: 'Teacher List', icon: LayoutList },
    { path: route('admin.teachers.create'), label: 'Register Teacher', icon: UserPlus },
    { path: route('admin.classes.create'), label: 'Create Class', icon: BookOpen },
    { path: route('admin.students.unassigned'), label: 'Unassigned Students', icon: UserX },
];

const FOOTER_ITEMS = [
    { path: '/help', label: 'Help & Center', icon: LifeBuoy },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const { url } = usePage();
    const { isCollapsed, isMobile, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebar();

    const isActive = (path: string) => {
        const current = new URL(path, window.location.origin).pathname;
        const currentUrlPath = new URL(url, window.location.origin).pathname;
        return currentUrlPath === current;
    };

    return (
        <>
            {isMobile && (
                <div className={`fixed z-50 md:hidden ${isMobileOpen ? 'top-2 left-52' : 'top-2 left-2'}`}>
                    <Button variant="outline" size="icon" onClick={toggleMobile}>
                        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            )}

            <aside
                className={`flex flex-col border-r bg-white transition-all duration-300 ease-in-out ${isMobile ? 'fixed top-0 left-0 z-40 h-full w-full' : 'sticky top-0 h-screen'} ${
                    isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : isCollapsed ? 'w-16' : 'w-64'
                }`}
            >
                <div className="flex items-center justify-between border-b p-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
                            <FileText className="h-4 w-4" />
                        </div>
                        {/* Admin specific title */}
                        {(!isCollapsed || isMobile) && <span className="text-lg font-semibold">SmartGrade (Admin)</span>}
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
                                                className={`flex items-center gap-3 rounded px-3 py-2 ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-secondary hover:text-primary-foreground'} ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
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

                </TooltipProvider>
            </aside>
        </>
    );
}
