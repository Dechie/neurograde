import { Upload, BrainCircuit, Edit3, BarChart2, LockKeyhole, MessageSquareText } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="w-full py-8 bg-white" id="features">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="text-secondary font-medium uppercase tracking-wide mb-2">FEATURES</h2>
          <h3 className="text-4xl font-bold text-[#primary]">What You Can Do?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-xl font-bold text-[#primary] mb-2">Dual Submission</h4>
            <p className="text-muted-foreground">Submit code via live editor or upload files—flexible and easy.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <BrainCircuit className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-xl font-bold text-[#primary] mb-2">AI Code Evaluation</h4>
            <p className="text-muted-foreground">Get instant, intelligent feedback powered by machine learning.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <Edit3 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-xl font-bold text-[#primary] mb-2">Manual Grading</h4>
            <p className="text-muted-foreground">Teachers can manually adjust scores with editable grading.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <BarChart2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-xl font-bold text-[#primary] mb-2">Analytics & Reports</h4>
            <p className="text-muted-foreground">Track learning progress and download detailed reports easily.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <LockKeyhole className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-xl font-bold text-[#primary] mb-2">Role-Based Access</h4>
            <p className="text-muted-foreground">Secure logins for students, teachers, and administrators.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquareText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-xl font-bold text-[#primary] mb-2">Personalized Feedback</h4>
            <p className="text-muted-foreground">Clear and actionable advice tailored to every submission.</p>
          </div>
        </div>
      </div>
    </section>
  );
}