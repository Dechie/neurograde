import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Eyerus Bekele",
      location: "Addis Ababa, Ethiopia",
      image: "/1.jpg",
      quote:
        "Before, waiting for manual code reviews took days. Now with instant feedback, I can improve my coding skills immediately. It's a game-changer for learning!",
    },
    {
      id: 2,
      name: "Hiwot Alemayehu" ,
      location: "Adama, Ethiopia",
      image: "/2.jpg",
      quote:
        "The platform's auto-grading helped me understand my mistakes faster. No more confusion after exams — I get clear and detailed feedback for every submission.",
    },
    {
      id: 3,
      name: "Temesgen Fikru",
      location: "Bahir Dar, Ethiopia",
      image: "/3.jpg",
      quote:
        "Tracking my coding progress has motivated me to learn more. I love seeing my improvements over time and unlocking achievements after each milestone.",
    },
    {
      id: 4,
      name: "Etsub Getachew",
      location: "Hawassa, Ethiopia",
      image: "/4.jpg",
      quote:
        "It used to be stressful worrying about code plagiarism checks. Now the system handles everything fairly, ensuring everyone gets credit for their work.",
    },
    {
      id: 5,
      name: "Ewnet Mebratu",
      location: "Dire Dawa, Ethiopia",
      image: "/5.jpg",
      quote:
        "The AI-based evaluation is simply brilliant. It saves instructors' time and gives students more chances to learn and grow without delays.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  const getCircularIndex = (index: number) => {
    if (index < 0) return testimonials.length + index;
    if (index >= testimonials.length) return index - testimonials.length;
    return index;
  };

  return (
    <section className="container mx-auto px-4 md:px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a78] leading-tight">
            See What Students Say
            <br />
            About Smarter Learning
          </h2>
          <div className="p-6 border-l-4 border-[#4361ee] bg-blue-50 rounded-r-lg">
            <p className="text-gray-600 italic mb-6">
              "{currentTestimonial.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={currentTestimonial.image || "/placeholder.svg"}
                  alt={currentTestimonial.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#1e2a78]">
                  {currentTestimonial.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {currentTestimonial.location}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-[#1e2a78] text-[#1e2a78] hover:bg-[#1e2a78] hover:text-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="rounded-full !bg-[#1e2a78] hover:!bg-[#4361ee] text-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="w-64 h-64 bg-[#323a92] rounded-full mx-auto relative">
            <div className="w-16 h-16 bg-white rounded-full absolute top-4 right-0 overflow-hidden">
              <img
                src={testimonials[getCircularIndex(currentIndex + 1)].image || "/placeholder.svg"}
                alt="Student"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 bg-white rounded-full absolute top-1/4 -right-8 overflow-hidden">
              <img
                src={testimonials[getCircularIndex(currentIndex + 2)].image || "/placeholder.svg"}
                alt="Student"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 bg-white rounded-full absolute bottom-4 right-4 overflow-hidden">
              <img
                src={testimonials[getCircularIndex(currentIndex + 3)].image || "/placeholder.svg"}
                alt="Student"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 bg-white rounded-full absolute bottom-0 left-1/4 overflow-hidden">
              <img
                src={testimonials[getCircularIndex(currentIndex + 4)].image || "/placeholder.svg"}
                alt="Student"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 bg-white rounded-full absolute top-1/3 -left-8 overflow-hidden">
              <img
                src={testimonials[getCircularIndex(currentIndex - 1)].image || "/placeholder.svg"}
                alt="Student"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-24 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-lg border-2 border-white">
              <img
                src={currentTestimonial.image || "/placeholder.svg"}
                alt={currentTestimonial.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
