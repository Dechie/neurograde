import { Button } from "@/components/ui/button";

const Tracking = () => {
  return (
    <section className="px-4 md:px-6 py-16 bg-gradient-to-br from-background to-muted rounded-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img
            src="/section3.avif"
            alt="Progress Tracking Illustration"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#primary] leading-tight">
            Track Your Coding Progress
            <br />
            and Achieve Milestones
          </h2>
          <p className="text-muted-foreground max-w-md">
            Monitor your coding journey with instant feedback and analytics.
            Unlock achievements, visualize improvements, and grow your skills smarter and faster.
          </p>
          <Button className="!bg-primary hover:!bg-secondary text-primary-foreground">
            View Your Progress
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Tracking;