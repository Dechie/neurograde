import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Copyright, Mail, Phone } from "lucide-react";
import { Link } from '@inertiajs/react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold !text-primary-foreground">
              SmartGrade
            </Link>
            <p className="!text-muted-foreground text-sm">Ethiopia, Addis Ababa Science and Technology University</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="!text-muted-foreground hover:text-primary-foreground">
                  Submit Your Code
                </Link>
              </li>
              <li>
                <Link href="/" className="!text-muted-foreground hover:text-primary-foreground">
                  View Feedback
                </Link>
              </li>
              <li>
                <Link href="/" className="!text-muted-foreground hover:text-primary-foreground">
                  Track Progress
                </Link>
              </li>
              <li>
                <Link href="/" className="!text-muted-foreground hover:text-primary-foreground">
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
                className="rounded-r-none bg-gradient-to-br from-background to-muted border-none !text-foreground placeholder:!text-muted-foreground"
              />
              <Button className="rounded-l-none !bg-secondary hover:!bg-secondary !text-secondary-foreground">
                <ChevronRight className="h-5 w-5 !text-secondary-foreground" />
              </Button>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="" />
                <span className="!text-muted-foreground">Call: +251-90-10-20-30</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="" />
                <span className="!text-muted-foreground">support@codereviewai.et</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-muted-foreground mt-6 pt-4 flex flex-col md:flex-row justify-center items-center text-sm">
          <div className="text-center text-muted-foreground flex items-center justify-center">
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