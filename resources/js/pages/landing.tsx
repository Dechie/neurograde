import About from '@/components/landing/About';
import ContactUs from '@/components/landing/ContactUs';
import FeaturesSection from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import LearningJourney from '@/components/landing/LearningJourney';
import Testimonials from '@/components/landing/Testimonial';
import Tracking from '@/components/landing/Tracking';

export default function LandingPage() {
    return (
        <>
            <Header />
            <HeroSection/>
            <FeaturesSection/>
            <About/>
            <LearningJourney/>
            <Tracking/>
            <Testimonials/>
            <ContactUs/>
            <Footer/>
        </>
    );
}
