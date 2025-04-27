import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Copyright, Mail, Phone } from "lucide-react";
import {Link} from '@inertiajs/react';


const Footer = () => {
  return (
    <footer className="bg-[#1e2a78] text-white py-8">
      <div className="px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold !text-white">
              SmartGrade
            </Link>
            <p className="!text-gray-400 text-sm">Ethiopia, Addis Ababa Science and Technology University</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-indigo-200">
              <li>
                <Link href="/" className="!text-gray-400 hover:text-white">
                  Submit Your Code
                </Link>
              </li>
              <li>
                <Link href="/" className="!text-gray-400 hover:text-white">
                  View Feedback
                </Link>
              </li>
              <li>
                <Link href="/" className="!text-gray-400 hover:text-white">
                  Track Progress
                </Link>
              </li>
              <li>
                <Link href="/" className="!text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Stay Updated</h4>
            <div className="flex mb-4">
              <Input
                placeholder="Email address"
                className="rounded-r-none bg-gradient-to-br from-blue-50 to-purple-50 border-none !text-black placeholder:!text-black"
              />
              <Button className="rounded-l-none !bg-[#4361ee] hover:!bg-blue-500">
                <ChevronRight className="h-5 w-5 !text-white" />
              </Button>
            </div>
            <div className="space-y-2 text-indigo-200">
              <div className="flex items-center gap-2">
                <Phone className="" />
                <span className="!text-gray-400">Call: +251-90-10-20-30</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="" />
                <span className="!text-gray-400">support@codereviewai.et</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-6 pt-4 flex flex-col md:flex-row justify-center items-center text-sm !text-indigo-300">
          <div className="text-center !text-gray-400 flex items-center justify-center">
            <span className="mr-2">
              <Copyright />
            </span>
            2025 Developed by AASTU Software Engineering Students
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
