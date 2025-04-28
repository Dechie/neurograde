import { Button } from "@/components/ui/button";
import { Link } from '@inertiajs/react';

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-6 bg-white flex items-center justify-between fixed top-0 left-0 w-full  shadow-md z-50">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-bold text-[#primary]">
          SmartGrade
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-md font-medium !text-foreground hover:!text-secondary"
          >
            Home
          </Link>
          <a
            href="#courses"
            className="text-md font-medium !text-foreground hover:!text-secondary"
          >
            Features
          </a>
          <a
            href="#learning-journey"
            className="text-md font-medium !text-foreground hover:!text-secondary"
          >
            How it works
          </a>
          <a
            href="#contact"
            className="text-md font-medium !text-foreground hover:!text-secondary"
          >
            Contact Us
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href={route("login")}
          className="text-md font-medium !text-foreground hover:!text-secondary"
        >
          Sign in
        </Link>
        <Link href={route("register")}>
          <Button className="!bg-primary hover:!bg-secondary text-primary-foreground">
            Sign up
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
