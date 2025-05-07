import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white px-4 py-4 shadow-md md:px-6">
            <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-[#primary]">
                    SmartGrade
                </Link>
                <nav className="hidden space-x-6 md:flex">
                    <Link href="/" className="text-md !text-foreground hover:!text-secondary font-medium">
                        Home
                    </Link>
                    <a href="#courses" className="text-md !text-foreground hover:!text-secondary font-medium">
                        Features
                    </a>
                    <a href="#learning-journey" className="text-md !text-foreground hover:!text-secondary font-medium">
                        How it works
                    </a>
                    <a href="#contact" className="text-md !text-foreground hover:!text-secondary font-medium">
                        Contact Us
                    </a>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <Link href={route('login')} className="text-md !text-foreground hover:!text-secondary font-medium">
                    Sign in
                </Link>
                <Link href={route('student-register')}>
                    <Button className="!bg-primary hover:!bg-secondary text-primary-foreground">Sign up</Button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
