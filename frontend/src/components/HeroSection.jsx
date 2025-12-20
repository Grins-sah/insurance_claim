import React from "react";
import ShinyText from './ShinyText';
import SplitText from './SplitText';
const handleSplitTextAnimation = () => {
    // 
};
const HeroSection = () => {
    return (
    // Theme-aware section background with subtle visual interest
    <section className="relative pt-32 pb-24 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-500">
            
            {/* Subtle background pattern for depth */}
            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
                <div className="w-full h-full bg-repeat [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#374151_1px,transparent_1px)]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                
                {/* 1. Primary Animated Headline: ShinyText (Largest size) */}
                <div className="text-5xl md:text-7xl font-extrabold leading-tight">
                    <ShinyText text="Smart Insurance Claim Automation Platform" 
    // Styling for the ShinyText component
    className="text-gray-900 dark:text-white transition-colors duration-500" disabled={false} speed={3}/>
                </div>
                
                {/* 2. Secondary Tagline: SplitText (Smaller, but animated) */}
                <span className="block mt-4 text-xl md:text-2xl font-semibold transition-colors duration-500">
                    <SplitText text="Zero Paperwork. Instant Approval Checks." 
    // Styling for the SplitText component (Cyan for Gemini contrast)
    className="text-indigo-600 dark:text-cyan-400" delay={300} // Add delay so it appears after the ShinyText starts
     duration={0.6} ease="power3.out" splitType="words" from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }} threshold={0.1} onLetterAnimationComplete={handleSplitTextAnimation}/>
                </span>

                {/* Refined Paragraph */}
                <p className="mt-8 text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
                    File insurance claims faster, track status transparently, and eliminate
                    manual complexity for health and vehicle insurance.
                </p>

                {/* Cleaned-up Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/50 dark:shadow-cyan-500/30 transition duration-300 transform hover:-translate-y-0.5">
                        Get Started Today
                    </button>
                    <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold transition duration-300 hover:shadow-md">
                        Contact Sales
                    </button>
                </div>
            </div>
        </section>);
};
export default HeroSection;
