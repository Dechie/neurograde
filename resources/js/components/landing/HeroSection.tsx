import { Button } from "@/components/ui/button";
import { Heart, PersonStanding } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="px-4 md:px-6 py-6 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-red-400 italic font-medium">
            Your Automated Code Review System
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#323a92] leading-tight">
            Smarter Coding. Instant Feedback.
          </h1>
          <p className="text-gray-600 max-w-md">
            AI-powered platform designed to automate code reviews, provide human-readable feedback, and deliver performance insights — helping students and teachers achieve excellence effortlessly.
          </p>
          <Button className="!bg-[#323a92] hover:!bg-[#5463FF]">
            Get Started
          </Button>
        </div>
        <div className="relative">
          <div className="relative z-10">
            <img
              src="/heroo.png"
              alt="Student coding on laptop"
              width={500}
              height={500}
              className="mx-auto"
            />
          </div>
          <div className="absolute top-10 right-15 bg-white p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg">
                <div className="text-blue-500 font-bold flex items-center justify-center">
                  <PersonStanding /> Active Users
                </div>
                <div className="text-xs text-center">Improving Code Daily</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-20 -left-29 bg-white p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <div className="bg-pink-100 p-2 rounded-full">
                <div className="text-pink-500"><Heart /></div>
              </div>
              <div>
                <div className="text-sm font-medium">Auto-Grading Progress</div>
                <div className="h-2 w-24 bg-blue-100 rounded-full">
                  <div className="h-2 w-16 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-32 -left-10 bg-white p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <div className="text-green-500">🚀</div>
              </div>
              <div>
                <div className="text-xs text-green-500">Milestones Unlocked</div>
                <div className="text-xs">Achievements in Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
