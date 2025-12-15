import React from "react";
// ShinyText import removed (Was not used in this component)

const stepData = [
    {
        icon: "🗝️",
        title: "Login & Policy Verification",
        description: "Secure access and instant policy eligibility check for quick processing.",
    },
    {
        icon: "📝",
        title: "Submit Detailed Claim Form",
        description: "Provide necessary incident details through our guided, easy-to-use form interface.",
    },
    {
        icon: "📎",
        title: "Upload Required Documents",
        description: "Seamlessly attach photos, medical reports, and identity proofs via drag-and-drop.",
    },
    {
        icon: "⏱️",
        title: "Track Approval Status Live",
        description: "Monitor your claim's progress 24/7 with real-time updates and notification alerts.",
    },
];

const HowItWorks = () => {
    return (
        // FIX: Reverted to theme-aware background classes (bg-white and dark:bg-gray-950)
        // Also adjusted text colors to be theme-aware or use default inheritance.
        <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Heading uses base gray-900 and dark:text-white */}
                <h3 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
                    The Simplified Claim Process
                </h3>

                {/* Sub-text uses base gray-600 and dark:text-gray-400 */}
                <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-16">
                    From submission to approval, we make complexity simple.
                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stepData.map((step, index) => (
                        <div
                            key={index}
                            // Restored theme-aware card colors
                            className="p-6 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl
                                bg-gray-100 border border-gray-200 
                                dark:bg-gray-800 dark:border-gray-700 hover:dark:shadow-cyan-900/50
                            "
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="text-3xl p-3 rounded-full bg-indigo-100 dark:bg-gray-700 transition-colors duration-500">
                                    {step.icon}
                                </span>
                                <div className="font-extrabold text-4xl text-indigo-600 dark:text-cyan-400">
                                    {index + 1}
                                </div>
                            </div>
                            
                            {/* Title text restored to theme-aware */}
                            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {step.title}
                            </h4>

                            {/* Description text restored to theme-aware */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;