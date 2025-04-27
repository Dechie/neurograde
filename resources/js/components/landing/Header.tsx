import { Button } from "@/components/ui/button";
import {Link} from '@inertiajs/react';

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-bold !text-[#323a92]">
          SmartGrade
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-md font-medium !text-gray-600 hover:!text-[#5463FF]"
          >
            Home
          </Link>
          <a
            href="#courses"
            className="text-md font-medium !text-gray-600 hover:!text-[#5463FF]"
          >
            Features
          </a>
          <a
           href="#learning-journey"
            className="text-md font-medium !text-gray-600 hover:!text-[#5463FF]"
          >
            How it works
          </a>
          <a
            href="#contact"
            className="text-md font-medium !text-gray-600 hover:!text-[#5463FF]"
          >
            Contact Us
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/signin"
          className="text-md font-medium !text-gray-600 hover:!text-[#5463FF]"
        >
          Sign in
        </Link>
        <Link href="/signup">
          <Button className="!bg-[#323a92] hover:!bg-[#5463FF] text-white">
            Sign up
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;