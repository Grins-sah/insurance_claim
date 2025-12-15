import React from "react";
import ShinyText from './ShinyText'; // Assuming this import path is correct

const CTASection = () => {
    return (
        // Theme-aware section background (Using dark-gray-950 for deep contrast)
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 text-center">
                
                {/* 1. Animated Headline: ShinyText */}
                <div className="text-3xl md:text-5xl font-extrabold leading-tight">
                    <ShinyText
                        text="Ready to simplify your insurance claims?"
                        // Styling the ShinyText component for high contrast
                        className="text-black dark:text-cyan-400"
                        disabled={false}
                        speed={3} 
                    />
                </div>
                
                {/* 2. Detailed Paragraph */}
                <p className="mt-6 text-xl text-cyan-400 font-bold dark:text-gray-300 max-w-4xl mx-auto transition-colors duration-500">
                    Join SmartClaim today and eliminate paperwork, reduce approval times, and gain
                    complete transparency over your health and vehicle claims process.
                </p>
                
                {/* 3. Call to Action Button (High Contrast) */}
                <div className="mt-12">
                    <button className="bg-white hover:bg-gray-100 text-indigo-600 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-white 
                        px-10 py-4 rounded-xl font-bold text-lg 
                        shadow-2xl shadow-indigo-700/50 dark:shadow-cyan-500/50 
                        transition duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                        Start Filing Claims in Minutes
                    </button>
                </div>
                
            </div>
        </section>
    );
};

export default CTASection;