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
        className={`transition-all duration-300 ease-in-out border-r bg-white flex flex-col
        ${isMobile ? 'fixed top-0 left-0 z-40 h-full w-full' : 'sticky top-0'}
        ${isMobile
          ? isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          : isCollapsed
            ? 'w-16'
            : 'w-64'}`}
      >
        {/* Header */}
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

        {/* Navigation */}
        <TooltipProvider>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
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
          </nav>

          {/* Footer items at bottom */}
          <div className="p-2 mt-auto space-y-1">
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
          </div>
        </TooltipProvider>
      </aside>
    </>
  );
}

// import { Link, usePage } from "@inertiajs/react";
// import {
//   FileText, Home, ClipboardList, ListChecks,
//   LifeBuoy, Settings, Menu, X, ChevronLeft, ChevronRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
// } from "@/components/ui/tooltip";
// import { useSidebar } from "@/hooks/use-sidebar";

// export function Sidebar() {
//   const { url } = usePage();
//   const {
//     isCollapsed, isMobile, isMobileOpen,
//     toggleCollapse, toggleMobile, closeMobile
//   } = useSidebar();

//   const isActive = (path: string) => {
//     const current = new URL(path, window.location.origin).pathname;
//     return url.startsWith(current);
//   };

//   return (
//     <>
//       {/* Mobile Toggle */}
//       {isMobile && (
//         <div className={`fixed z-50 md:hidden ${isMobileOpen ? 'top-2 left-52' : 'top-2 left-2'}`}>
//           <Button variant="outline" size="icon" onClick={toggleMobile}>
//             {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </Button>
//         </div>
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`transition-all duration-300 ease-in-out border-r bg-white flex flex-col
//         ${isMobile ? 'fixed top-0 left-0 z-40 h-full w-full' : 'sticky top-0'}
//         ${isMobile
//           ? isMobileOpen
//             ? 'translate-x-0'
//             : '-translate-x-full'
//           : isCollapsed
//             ? 'w-16'
//             : 'w-64'}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <div className="flex items-center gap-2">
//             <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
//               <FileText className="h-4 w-4" />
//             </div>
//             {(!isCollapsed || isMobile) && <span className="text-lg font-semibold">SmartGrade</span>}
//           </div>
//           {!isMobile && (
//             <Button variant="ghost" size="icon" onClick={toggleCollapse}>
//               {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//             </Button>
//           )}
//         </div>

//         <TooltipProvider>
//           <nav className="flex-1 overflow-y-auto p-2 space-y-1">

//             {/* Home */}
//             <Tooltip delayDuration={300}>
//               <TooltipTrigger asChild>
//                 <Link
//                   href={route('dashboard')}
//                   onClick={() => isMobile && closeMobile()}
//                   className={`flex items-center gap-3 px-3 py-2 rounded ${
//                     isActive(route('dashboard')) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'
//                   } ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
//                 >
//                   <Home className="h-5 w-5" />
//                   {(!isCollapsed || isMobile) && <span className="text-sm">Home</span>}
//                 </Link>
//               </TooltipTrigger>
//               {isCollapsed && !isMobile && <TooltipContent side="right">Home</TooltipContent>}
//             </Tooltip>

//             {/* Tests */}
//             <Tooltip delayDuration={300}>
//               <TooltipTrigger asChild>
//                 <Link
//                   href={route('student.tests')}
//                   onClick={() => isMobile && closeMobile()}
//                   className={`flex items-center gap-3 px-3 py-2 rounded ${
//                     isActive(route('student.tests')) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'
//                   } ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
//                 >
//                   <ClipboardList className="h-5 w-5" />
//                   {(!isCollapsed || isMobile) && <span className="text-sm">Tests</span>}
//                 </Link>
//               </TooltipTrigger>
//               {isCollapsed && !isMobile && <TooltipContent side="right">Tests</TooltipContent>}
//             </Tooltip>

//             {/* Results */}
//             <Tooltip delayDuration={300}>
//               <TooltipTrigger asChild>
//                 <Link
//                   href={route('student.results')}
//                   onClick={() => isMobile && closeMobile()}
//                   className={`flex items-center gap-3 px-3 py-2 rounded ${
//                     isActive(route('student.results')) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'
//                   } ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
//                 >
//                   <ListChecks className="h-5 w-5" />
//                   {(!isCollapsed || isMobile) && <span className="text-sm">Results</span>}
//                 </Link>
//               </TooltipTrigger>
//               {isCollapsed && !isMobile && <TooltipContent side="right">Results</TooltipContent>}
//             </Tooltip>
//           </nav>

//           {/* Footer */}
//           <div className="p-2 mt-auto space-y-1">
//             <Tooltip delayDuration={300}>
//               <TooltipTrigger asChild>
//                 <Link
//                   href="/help"
//                   className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary hover:text-muted w-full"
//                 >
//                   <LifeBuoy className="h-5 w-5" />
//                   {(!isCollapsed || isMobile) && <span className="text-sm">Help & Center</span>}
//                 </Link>
//               </TooltipTrigger>
//               {isCollapsed && !isMobile && <TooltipContent side="right">Help</TooltipContent>}
//             </Tooltip>

//             <Tooltip delayDuration={300}>
//               <TooltipTrigger asChild>
//                 <Link
//                   href="/settings"
//                   className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary hover:text-muted w-full"
//                 >
//                   <Settings className="h-5 w-5" />
//                   {(!isCollapsed || isMobile) && <span className="text-sm">Settings</span>}
//                 </Link>
//               </TooltipTrigger>
//               {isCollapsed && !isMobile && <TooltipContent side="right">Settings</TooltipContent>}
//             </Tooltip>
//           </div>
//         </TooltipProvider>
//       </aside>
//     </>
//   );
// }

// import { Link, usePage } from "@inertiajs/react";
// import {
//   FileText, Home, ClipboardList, ListChecks,
//   LifeBuoy, Settings, Menu, X, ChevronLeft, ChevronRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
// } from "@/components/ui/tooltip";
// import { useSidebar } from "@/hooks/use-sidebar";

// const MENU_ITEMS = [
//   // student.results
//   { path: '/', label: 'Home', icon: Home },
//   { path: '/tests', label: 'Tests', icon: ClipboardList },
//   { path: 'student.results', label: 'Results', icon: ListChecks },
// ];

// const FOOTER_ITEMS = [
//   { path: '/help', label: 'Help & Center', icon: LifeBuoy },
//   { path: '/settings', label: 'Settings', icon: Settings },
// ];

// export function Sidebar() {
//   const { url } = usePage();
//   const {
//     isCollapsed, isMobile, isMobileOpen,
//     toggleCollapse, toggleMobile, closeMobile
//   } = useSidebar();

//   const isActive = (path: string) => url === path;

//   return (
//     <>
//       {/* Mobile Button (Menu / Close) */}
//       {isMobile && (
//         <div className={`fixed z-50 md:hidden ${isMobileOpen ? 'top-2 left-52' : 'top-2 left-2'}`}>
//           <Button variant="outline" size="icon" onClick={toggleMobile}>
//             {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </Button>
//         </div>
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`transition-all duration-300 ease-in-out border-r bg-white flex flex-col
//         ${isMobile ? 'fixed top-0 left-0 z-40 h-full w-full' : 'sticky top-0'}
//         ${isMobile
//           ? isMobileOpen
//             ? 'translate-x-0'
//             : '-translate-x-full'
//           : isCollapsed
//             ? 'w-16'
//             : 'w-64'}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <div className="flex items-center gap-2">
//             <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded">
//               <FileText className="h-4 w-4" />
//             </div>
//             {(!isCollapsed || isMobile) && <span className="text-lg font-semibold">SmartGrade</span>}
//           </div>
//           {!isMobile && (
//             <Button variant="ghost" size="icon" onClick={toggleCollapse}>
//               {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//             </Button>
//           )}
//         </div>

//         {/* Navigation */}
//         <TooltipProvider>
//           <nav className="flex-1 overflow-y-auto p-2 space-y-1">
//             {MENU_ITEMS.map((item) => (
//               <Tooltip key={item.path} delayDuration={300}>
//                 <TooltipTrigger asChild>
//                   <Link
//                     href={item.path}
//                     onClick={() => isMobile && closeMobile()}
//                     className={`flex items-center gap-3 px-3 py-2 rounded
//                     ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'}
//                     ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
//                   >
//                     <item.icon className="h-5 w-5" />
//                     {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
//                   </Link>
//                 </TooltipTrigger>
//                 {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
//               </Tooltip>
//             ))}
//           </nav>

//           {/* Footer items at bottom */}
//           <div className="p-2 mt-auto space-y-1">
//             {FOOTER_ITEMS.map((item) => (
//               <Tooltip key={item.path} delayDuration={300}>
//                 <TooltipTrigger asChild>
//                   <Link
//                     href={item.path}
//                     onClick={() => isMobile && closeMobile()}
//                     className={`flex items-center gap-3 px-3 py-2 rounded
//                     ${isActive(item.path) ? 'bg-primary text-muted' : 'hover:bg-primary hover:text-muted'}
//                     ${isCollapsed && !isMobile ? 'justify-center' : 'w-full'}`}
//                   >
//                     <item.icon className="h-5 w-5" />
//                     {(!isCollapsed || isMobile) && <span className="text-sm">{item.label}</span>}
//                   </Link>
//                 </TooltipTrigger>
//                 {isCollapsed && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
//               </Tooltip>
//             ))}
//           </div>
//         </TooltipProvider>
//       </aside>
//     </>
//   );
// }






// import {
//   Sidebar as SidebarComponent,
//   SidebarContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarRail
// } from "@/components/ui/sidebar";
// import { Link } from "@inertiajs/react";
// import {
//   BookOpen,
//   ClipboardList,
//   FileText, Home,
//   LifeBuoy,
//   ListChecks,
//   Settings,
//   User
// } from "lucide-react";
// // In Results.tsx and Tests/Index.tsx

// const STUDENT_MENU = [
//   { path: '/', label: 'Home', icon: Home },
//   { path: '/tests', label: 'Tests', icon: ClipboardList },
//   { path: '/results', label: 'Results', icon: ListChecks },
// ];

// const TEACHER_MENU = [
//   { path: '/', label: 'Dashboard', icon: Home },
//   { path: '/create-test', label: 'Create Test', icon: FileText },
//   { path: '/submissions', label: 'Submissions', icon: ClipboardList },
// ];

// const COMMON_FOOTER = [
//   { path: '/help', label: 'Help & Center', icon: LifeBuoy },
//   { path: '/settings', label: 'Settings', icon: Settings },
// ];

// export function Sidebar() {
//   return (
//     <SidebarProvider>
//       <SidebarComponent>
//         <SidebarHeader>
//           <div className="p-2">
//             <h2 className="text-xl font-bold">Student Portal</h2>
//           </div>
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton asChild>
//                 <Link href={route('dashboard')}>
//                   <Home className="h-5 w-5" />
//                   <span>Dashboard</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//             <SidebarMenuItem>
//               <SidebarMenuButton asChild>
//                 <Link href={route('student.results')}>
//                   <FileText className="h-5 w-5" />
//                   <span>Results</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//             <SidebarMenuItem>
//               <SidebarMenuButton asChild>
//                 <Link href={route('student.tests')}>
//                   <BookOpen className="h-5 w-5" />
//                   <span>Tests</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//             <SidebarMenuItem>
//               <SidebarMenuButton asChild>
//                 <Link href={route('profile.edit')}>
//                   <User className="h-5 w-5" />
//                   <span>Profile</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarContent>
//         <SidebarRail />
//       </SidebarComponent>
//     </SidebarProvider>
//   )
// }







