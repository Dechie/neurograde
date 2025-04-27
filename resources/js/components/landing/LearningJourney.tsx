const LearningJourney = () => {
    return (
      <section id="learning-journey" className="px-4 md:px-6 py-6 md:py-20 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
          <h2 className="text-[#4361ee] font-medium uppercase tracking-wide mb-2">HOW IT WORKS</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a78] leading-tight">
              Your Code Learning
              <br />
              Journey with Us
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="text-lg w-10 h-10 rounded-full bg-[#1e2a78] text-white flex items-center justify-center font-bold">
                    1.
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1e2a78] mb-2">
                    Create Your Account
                  </h3>
                  <p className="text-gray-600">
                    Sign up to access the automated code review platform designed for your learning journey.
                  </p>
                </div>
              </div>
  
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="text-lg w-10 h-10 rounded-full bg-[#1e2a78] text-white flex items-center justify-center font-bold">
                    2.
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1e2a78] mb-2">
                    Submit Your Code
                  </h3>
                  <p className="text-gray-600">
                    Upload your coding solutions via editor or file upload — easy and efficient.
                  </p>
                </div>
              </div>
  
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="text-lg w-10 h-10 rounded-full bg-[#1e2a78] text-white flex items-center justify-center font-bold">
                    3.
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1e2a78] mb-2">
                    Get Instant AI Feedback
                  </h3>
                  <p className="text-gray-600">
                    Receive detailed, human-readable feedback on your code — instantly and automatically.
                  </p>
                </div>
              </div>
  
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="text-lg w-10 h-10 rounded-full bg-[#1e2a78] text-white flex items-center justify-center font-bold">
                    4.
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1e2a78] mb-2">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-600">
                    Analyze your learning growth, unlock milestones, and build your success story in coding.
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <div className="relative">
            <div className="flex justify-center">
              <img
                src="/section2.jpg"
                alt="Coding Journey Illustration"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default LearningJourney;
  