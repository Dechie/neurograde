import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export type LoginForm = {
    email?: string;
    name?: string;
    password: string;
    remember: boolean;
};

export interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}
export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     avatar?: string;
//     email_verified_at: string | null;
//     created_at: string;
//     updated_at: string;
//     [key: string]: unknown; // This allows for additional properties...
// }
// export interface PageProps {
//     auth?: {
//         user?: {
//             id: number;
//             name: string;
//             email: string;
//         };
//     };
//     [key: string]: any;
// }
// types/index.d.ts
export interface TestsProps {
    tests: Array<{
        id: number;
        title: string;
        dueDate: string;
        status: string;
    }>;
}
interface Department {
  id: number;
  name: string;
}
export interface User {
    id: number;
    // You can remove 'name' here if you definitively decide against the backend accessor
    // name?: string; // Or keep it if you might add the accessor later

    first_name: string; // Ensure this is defined
    last_name: string;  // Ensure this is defined

    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    // Add other properties you expect on the User object, like avatar, roles, student relation
    avatar?: string; // Example if user has an avatar field
    roles?: { name: string }[]; // Example if roles are loaded
    student?: any; // Example if student relation is loaded
}

// Ensure PageProps structure matches what your backend is passing
export interface PageProps {
    auth: {
        user: User | null; // 'user' can be null if the user is not authenticated
    };
    // Add other props like 'departments' if your pages receive them
    departments?: { id: number; name: string }[];
    [key: string]: any; // Catch-all for other potential props
}

// Add other relevant types as needed
export interface BreadcrumbItem {
    title: string;
    href: string;
}