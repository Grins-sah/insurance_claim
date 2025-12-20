import React from "react";
// Requesting component usage: I will use SplitText for the main title.
import SplitText from './SplitText';
const featureData = [
    {
        icon: "👆", // Pointer/Click
        title: "Easy Claim Filing",
        desc: "Submit claims with documents in a few simple steps. The guided process ensures all details are captured correctly the first time.",
    },
    {
        icon: "📡", // Satellite/Real-Time
        title: "Real-Time Status Tracking",
        desc: "Know exactly where your claim stands at every stage. Get instant notifications upon every status change.",
    },
    {
        icon: "🧠", // Brain/Smart
        title: "Automated Validation",
        desc: "Instant checks for policy coverage, required documents, and fraud detection using advanced AI.",
    },
];
const handleAnimationComplete = () => {
    //
};
const FeatureSection = () => {
    return (
    // Theme-aware section background (Using gray-950 for deeper contrast in dark mode)
    <section className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Animated Heading: SplitText */}
                <SplitText text="Why Choose SmartClaim?" 
    // Theme-aware text styling
    className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-16" delay={100} duration={0.6} ease="power3.out" splitType="words" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} threshold={0.1} onLetterAnimationComplete={handleAnimationComplete}/>

                {/* Features Grid: More loaded and refined styling */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {featureData.map((item, index) => (<div key={index} className="p-6 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl
                                bg-gray-100 border border-gray-200 
                                dark:bg-gray-800 dark:border-gray-700 hover:dark:shadow-cyan-900/50
                            ">
                            <div className="flex items-center space-x-4 mb-4">
                                {/* Icon Container (Vibrant contrast) */}
                                <span className="text-3xl p-3 rounded-xl bg-indigo-100 dark:bg-gray-700 transition-colors duration-500">
                                    {item.icon}
                                </span>
                            </div>

                            {/* Title (Themed to Cyan for contrast) */}
                            <h4 className="text-xl font-bold mb-3 text-indigo-600 dark:text-cyan-400 transition-colors duration-500">
                                {item.title}
                            </h4>
                            
                            {/* Description */}
                            <p className="mt-3 text-gray-600 dark:text-gray-300">
                                {item.desc}
                            </p>
                        </div>))}
                </div>
            </div>
        </section>);
};
export default FeatureSection;
