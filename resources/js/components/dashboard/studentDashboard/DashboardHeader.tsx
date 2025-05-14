'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { router, usePage } from '@inertiajs/react';
import { Bell, LogOut, Search, Settings, User } from 'lucide-react';

export function DashboardHeader({ title }: { title?: string }) {
    const { url, auth } = usePage().props as any;

    const getPageTitle = () => {
        if (url === '/') return 'Overview';
        if (url === '/tests') return 'Test';
        if (url === '/results') return 'Result';
        return title || 'Overview';
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const navigateToProfile = () => {
        router.get(route('profile.edit'));
    };

    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b bg-white px-4 md:px-6">
            <h1 className="ml-8 text-xl font-semibold md:ml-0">{getPageTitle()}</h1>
            <div className="flex items-center gap-2 md:gap-4">
                <div className="relative hidden md:block">
                    <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input type="search" placeholder="Search" className="bg-muted w-full rounded-full pl-8 lg:w-[250px]" />
                </div>
                <div className="flex gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Settings className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
                                <img src="/1.jpg" alt="Avatar" width={32} height={32} className="rounded-full" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
