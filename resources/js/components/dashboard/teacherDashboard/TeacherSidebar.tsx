import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar'; // Assuming you have a useSidebar hook
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    FileText, // Example icon for Tests/Exams
    GraduationCap, // Example icon for Submissions/Grading
    LifeBuoy,
    Menu,
    Settings,
    X,
} from 'lucide-react'; // Import necessary icons
import { route } from 'ziggy-js';

// Define menu items specific to the teacher dashboard
const TEACHER_MENU_ITEMS = [
    // Assuming 'teacher.dashboard.home' is the route for the teacher's main dashboard landing page
    //{ path: route('teacher.home'), label: 'Dashboard Home', icon: Home },
    // Add links for teacher-specific pages (ensure these routes are defined)
    { path: route('teacher.tests.create'), label: 'Create Exam', icon: BookOpen },
    { path: route('teacher.show-grading'), label: 'View Grades', icon: GraduationCap },
    { path: route('teacher.show-submissions'), label: 'View Submissions', icon: GraduationCap },
    // Add other teacher-specific links as needed
];

// Define footer items (can be shared or specific)
const FOOTER_ITEMS = [
    // Assuming '/help' is a static or separate route
    { path: '/help', label: 'Help & Center', icon: LifeBuoy },
    // Assuming '/settings' is a route accessible to authenticated users
    { path: '/settings', label: 'Settings', icon: Settings },
];

// Export the component with a descriptive name
export function Sidebar() {
    const { url } = usePage();
    const { isCollapsed, isMobile, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebar(); // Use your existing sidebar hook

    // Function to check if a link is active
    const isActive = (path: string) => {
        // Use URL object for robust path comparison
        const current = new URL(path, window.location.origin).pathname;
        const currentUrlPath = new URL(url, window.location.origin).pathname;
        // Check if the current URL path starts with the link path
        // This handles cases where the current URL is a child route of the link path
        return currentUrlPath.startsWith(current) && currentUrlPath.length >= current.length;
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
                // Applying the same structural and styling classes as the student sidebar
                className={`flex flex-col border-r bg-white transition-all duration-300 ease-in-out ${isMobile ? 'fixed top-0 left-0 z-40 h-full w-full' : 'sticky top-0'} ${
                    isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : isCollapsed ? 'w-16' : 'w-64'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
                            <FileText className="h-4 w-4" /> {/* Adjust icon if needed */}
                        </div>
                        {/* Teacher specific title */}
                        {(!isCollapsed || isMobile) && <span className="text-lg font-semibold">SmartGrade (Teacher)</span>}
                    </div>
                    {!isMobile && (
                        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    )}
                </div>

                {/* Navigation (Teacher Menu Items) */}
                <TooltipProvider>
                    <nav className="flex-1 space-y-1 overflow-y-auto p-2">
                        {TEACHER_MENU_ITEMS.map((item) => (
                            <Tooltip key={item.path} delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.path}
                                        onClick={() => isMobile && closeMobile()}
                                        // Applying the same link styling classes
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
                                        // Applying the same link styling classes
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
