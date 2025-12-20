import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
const LandingPage = () => {
    return (<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Theme provider / animated background wrapper can be added here */}
          

            <Navbar />
            <HeroSection />
            <FeatureSection />
            <HowItWorks />
            <CTASection />
            <Footer />
        </div>);
};
export default LandingPage;
