import React, { useState } from "react";

import { FiChevronRight, FiCheckCircle, FiUpload, FiFileText, FiMapPin, FiCalendar } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

// --- Types ---
type WizardStep = 1 | 2 | 3;

// --- Sub-Components for Steps ---

// --- STEP 1: Policy and Incident Details ---
const Step1PolicyDetails: React.FC<{ nextStep: () => void }> = ({ nextStep }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">1. Select Policy and Incident Type</h3>
    
    {/* Policy Selection */}
    <div>
      <label htmlFor="policy" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
        Select Applicable Policy
      </label>
      <select id="policy" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-neutral-200">
        <option>Vehicle Insurance (POL-4922) - Active</option>
        <option>Health Insurance (POL-8821) - Active</option>
        <option>Home Insurance (POL-1033) - Active</option>
      </select>
    </div>

    {/* Incident Type */}
    <div>
      <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
        Type of Incident
      </label>
      <select id="incidentType" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-neutral-200">
        <option>Accident/Collision</option>
        <option>Theft</option>
        <option>Fire Damage</option>
        <option>Illness/Injury</option>
      </select>
    </div>

    {/* Date and Location */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                <FiCalendar className="inline mr-1 text-gray-500 dark:text-neutral-400" size={14} /> Incident Date
            </label>
            <input type="date" id="incidentDate" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-neutral-200" />
        </div>
        <div>
            <label htmlFor="incidentLocation" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                <FiMapPin className="inline mr-1 text-gray-500 dark:text-neutral-400" size={14} /> Location (City/State)
            </label>
            <input type="text" id="incidentLocation" placeholder="e.g., San Jose, CA" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-neutral-200" />
        </div>
    </div>
    

    <div className="flex justify-end pt-4">
      <button 
        onClick={nextStep} 
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md"
      >
        Next: Documentation <FiChevronRight />
      </button>
    </div>
  </div>
);

// --- STEP 2: Documentation and Evidence ---
const Step2Documentation: React.FC<{ nextStep: () => void, prevStep: () => void }> = ({ nextStep, prevStep }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">2. Upload Supporting Documents</h3>
    
    <div className="border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-neutral-800/50">
      <FiUpload size={30} className="mx-auto text-indigo-500 mb-3" />
      <p className="text-gray-700 dark:text-neutral-300 font-medium">Drag and drop files here</p>
      <p className="text-sm text-gray-500 dark:text-neutral-500 mt-1">Images, PDFs, or Scans (Max 10MB per file)</p>
      <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
        Browse Files
      </button>
    </div>

    {/* File List Placeholder */}
    <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300">Files Uploaded (2)</h4>
        <ul className="text-sm space-y-1">
            <li className="flex items-center justify-between p-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg">
                <span className="text-gray-900 dark:text-neutral-200"><FiFileText className="inline mr-2" />Accident_Report_1.pdf</span>
                <span className="text-xs text-green-600 dark:text-green-400">Uploaded</span>
            </li>
            <li className="flex items-center justify-between p-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg">
                <span className="text-gray-900 dark:text-neutral-200"><FiFileText className="inline mr-2" />Photo_Damage_3.jpg</span>
                <span className="text-xs text-green-600 dark:text-green-400">Uploaded</span>
            </li>
        </ul>
    </div>

    <div className="flex justify-between pt-4">
      <button 
        onClick={prevStep} 
        className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 px-4 py-2.5 rounded-xl transition"
      >
        <FiChevronRight className="transform rotate-180" /> Back
      </button>
      <button 
        onClick={nextStep} 
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md"
      >
        Next: Review & Submit <FiChevronRight />
      </button>
    </div>
  </div>
);

// --- STEP 3: Review and Submission ---
const Step3Review: React.FC<{ prevStep: () => void }> = ({ prevStep }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        // In a real app: send data to backend, handle response, then set success state
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-16 px-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl">
                <FiCheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-2">Claim Submitted Successfully!</h3>
                <p className="text-gray-600 dark:text-neutral-400">Your claim (ID: CLM-00502) has been received and is now **Under Review**.</p>
                <p className="text-gray-600 dark:text-neutral-400 mt-1">You will receive an email confirmation shortly.</p>
                <button 
                    onClick={() => window.location.href = '/claims'} // Redirect to Claims History
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md"
                >
                    View Claim Status
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">3. Review and Submit</h3>

            {/* Review Card */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
                <h4 className="text-lg font-bold text-indigo-600 dark:text-cyan-400 border-b border-gray-100 dark:border-neutral-800 pb-2">Summary Details</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-500 dark:text-neutral-400">Policy:</span>
                    <span className="font-medium text-gray-900 dark:text-neutral-200">Vehicle Insurance (POL-4922)</span>
                    
                    <span className="text-gray-500 dark:text-neutral-400">Incident Type:</span>
                    <span className="font-medium text-gray-900 dark:text-neutral-200">Accident/Collision</span>
                    
                    <span className="text-gray-500 dark:text-neutral-400">Date:</span>
                    <span className="font-medium text-gray-900 dark:text-neutral-200">October 29, 2025</span>
                    
                    <span className="text-gray-500 dark:text-neutral-400">Documents Attached:</span>
                    <span className="font-medium text-gray-900 dark:text-neutral-200">2 files (Report, Photo)</span>
                </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="flex items-start pt-2">
                <input 
                    type="checkbox" 
                    id="declaration" 
                    className="mt-1 h-4 w-4 text-indigo-600 dark:bg-neutral-700 border-gray-300 rounded focus:ring-indigo-500" 
                    required 
                />
                <label htmlFor="declaration" className="ml-3 text-sm text-gray-700 dark:text-neutral-300">
                    I certify that the information provided above is true and accurate to the best of my knowledge.
                </label>
            </div>


            <div className="flex justify-between pt-4">
                <button 
                    onClick={prevStep} 
                    className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 px-4 py-2.5 rounded-xl transition"
                >
                    <FiChevronRight className="transform rotate-180" /> Back
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md"
                >
                    <FiCheckCircle /> Confirm & Submit Claim
                </button>
            </div>
        </div>
    );
};


// --- Main Component ---
const CreateClaimPage = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(3, (prev + 1) as WizardStep));
  const prevStep = () => setCurrentStep((prev) => Math.max(1, (prev - 1) as WizardStep));
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PolicyDetails nextStep={nextStep} />;
      case 2:
        return <Step2Documentation nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3Review prevStep={prevStep} />;
      default:
        return <Step1PolicyDetails nextStep={nextStep} />;
    }
  };

  const getStepClasses = (step: number) => {
    const isActive = currentStep === step;
    const isComplete = currentStep > step;
    
    return {
        // Dot Style
        dot: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${isComplete ? 'bg-indigo-600 text-white' : isActive ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300'}`,
        // Text Style
        text: `text-sm font-medium transition-colors duration-300 mt-2 ${isActive || isComplete ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-neutral-400'}`,
        // Connector Line
        line: `flex-1 h-1 bg-gray-200 dark:bg-neutral-700 transition-colors duration-300 ${isComplete ? 'bg-indigo-600 dark:bg-indigo-600' : ''}`
    };
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100">File a New Claim</h1>
            <p className="text-gray-500 dark:text-neutral-400 mt-1">Submit your incident details and documentation in three easy steps.</p>
          </div>
        </div>

        {/* --- Wizard Progress Bar --- */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between w-full">
                
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                    <div className={getStepClasses(1).dot}>
                        {currentStep > 1 ? <FiCheckCircle size={16} /> : '1'}
                    </div>
                    <span className={getStepClasses(1).text}>Incident Details</span>
                </div>

                <div className={getStepClasses(1).line} />
                
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                    <div className={getStepClasses(2).dot}>
                        {currentStep > 2 ? <FiCheckCircle size={16} /> : '2'}
                    </div>
                    <span className={getStepClasses(2).text}>Documentation</span>
                </div>

                <div className={getStepClasses(2).line} />

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                    <div className={getStepClasses(3).dot}>3</div>
                    <span className={getStepClasses(3).text}>Review & Submit</span>
                </div>

            </div>
        </div>
        {/* --- End Wizard Progress Bar --- */}

        {/* --- Wizard Content Area --- */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm min-h-[400px]">
            {renderStep()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateClaimPage;