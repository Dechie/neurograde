import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    FileText,
    LayoutList, // Added relevant icons
    LifeBuoy,
    Menu,
    Settings,
    UserPlus,
    UserX,
    Users,
    X,
} from 'lucide-react'; // Import necessary icons
import { route } from 'ziggy-js';

// Updated MENU_ITEMS based on admin routes
const MENU_ITEMS = [
    // You might want a main admin dashboard home route, but if not,
    // the first item could be a key list page, e.g., Student List
    { path: route('admin.students.index'), label: 'Student List', icon: Users },
    { path: route('admin.teachers.index'), label: 'Teacher List', icon: LayoutList }, // Using LayoutList for a list view
    { path: route('admin.teachers.create'), label: 'Register Teacher', icon: UserPlus }, // Using UserPlus for adding a user
    { path: route('admin.classes.create'), label: 'Create Class', icon: BookOpen }, // Using BookOpen for creating something educational
    // Include Unassigned Students if it's a distinct page in the sidebar
    { path: route('admin.students.unassigned'), label: 'Unassigned Students', icon: UserX }, // Using UserX for unassigned users
    // Add a general Admin Dashboard Home if you have one, e.g.:
    // { path: route('admin.dashboard.home'), label: 'Admin Home', icon: Home },
];

const FOOTER_ITEMS = [
    { path: '/help', label: 'Help & Center', icon: LifeBuoy }, // Assuming '/help' is a valid route
    { path: '/settings', label: 'Settings', icon: Settings }, // Assuming '/settings' is a valid route
];

// Renamed the component to AdminSidebar
export function Sidebar() {
    const { url } = usePage();
    const { isCollapsed, isMobile, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebar();

    const isActive = (path: string) => {
        const current = new URL(path, window.location.origin).pathname;
        const currentUrlPath = new URL(url, window.location.origin).pathname;
        // --- FIX: Check for exact pathname match ---
        return currentUrlPath === current;
        // --- End FIX ---
    };

    return (
        <>
            {/* Mobile Button (Menu / Close) */}
            {isMobile && (
                <div className={`fixed z-50 md:hidden ${isMobileOpen ? 'top-2 left-52' : 'top-2 left-2'}`}>
                    <Button variant="outline" size="icon" onClick={toggleMobile}>
                        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className={`flex flex-col border-r bg-white transition-all duration-300 ease-in-out ${isMobile ? 'fixed top-0 left-0 z-40 h-full w-full' : 'sticky top-0'} ${
                    isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : isCollapsed ? 'w-16' : 'w-64'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
                            <FileText className="h-4 w-4" /> {/* Adjust icon if needed */}
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

                {/* Navigation (Admin Menu Items) */}
                <TooltipProvider>
                    <nav className="flex-1 space-y-1 overflow-y-auto p-2">
                        {MENU_ITEMS.map((item) => (
                            <Tooltip key={item.path} delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.path}
                                        onClick={() => isMobile && closeMobile()}
                                        className={`flex items-center gap-3 rounded px-3 py-2 ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'} ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
                                    </Link>
                                </TooltipTrigger>
                                {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
                            </Tooltip>
                        ))}
                    </nav>

                    {/* Footer items at bottom */}
                    <div className="mt-auto space-y-1 p-2">
                        {FOOTER_ITEMS.map((item) => (
                            <Tooltip key={item.path} delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.path}
                                        onClick={() => isMobile && closeMobile()}
                                        className={`flex items-center gap-3 rounded px-3 py-2 ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'} ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
                                    </Link>
                                </TooltipTrigger>
                                {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </aside>
        </>
    );
}
