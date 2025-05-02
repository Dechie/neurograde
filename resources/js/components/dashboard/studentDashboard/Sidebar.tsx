import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import {
  BookOpen,
  ClipboardList,
  FileText, Home,
  LifeBuoy,
  ListChecks,
  Settings,
  User
} from "lucide-react";
// In Results.tsx and Tests/Index.tsx

const STUDENT_MENU = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/tests', label: 'Tests', icon: ClipboardList },
  { path: '/results', label: 'Results', icon: ListChecks },
];

const TEACHER_MENU = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/create-test', label: 'Create Test', icon: FileText },
  { path: '/submissions', label: 'Submissions', icon: ClipboardList },
];

const COMMON_FOOTER = [
  { path: '/help', label: 'Help & Center', icon: LifeBuoy },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <SidebarProvider>
      <SidebarComponent>
        <SidebarHeader>
          <div className="p-2">
            <h2 className="text-xl font-bold">Student Portal</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={route('dashboard')}>
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={route('student.results')}>
                  <FileText className="h-5 w-5" />
                  <span>Results</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={route('student.tests')}>
                  <BookOpen className="h-5 w-5" />
                  <span>Tests</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={route('profile.edit')}>
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </SidebarComponent>
    </SidebarProvider>
  )
}