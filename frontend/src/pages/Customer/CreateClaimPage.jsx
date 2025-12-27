import React, { useContext, useEffect, useState } from "react";
import { FiChevronRight, FiCheckCircle, FiUpload, FiFileText, FiMapPin, FiCalendar } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";
import axios from "axios";
import { ContextAPI } from "@/Context";

// --- Sub-Components for Steps ---

// --- STEP 1: Policy and Incident Details ---
const Step1PolicyDetails = ({ nextStep }) => {
  const [type, setType] = useState("Vehicle Insurance");
  const [inciType, setInciType] = useState("Accident / Damage Claim");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [userQuery, setUserQuery] = useState("");

  const onSave = () => {
    const detail = {
      type: type,
      inciType: inciType,
      date: date,
      location: location,
      userQuery: userQuery,
    }
    sessionStorage.setItem('step1-info', JSON.stringify(detail));
    nextStep();
  }

  useEffect(() => {
    const detail = JSON.parse(sessionStorage.getItem('step1-info'));
    if (detail) {
      setType(detail.type);
      setInciType(detail.inciType);
      setDate(detail.date);
      setLocation(detail.location);
      if (detail.userQuery) setUserQuery(detail.userQuery);
    }
  }, [])

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">1. Select Policy and Incident Type</h3>

      {/* Policy Selection */}
      <div>
        <label htmlFor="policy" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Select Applicable Policy
        </label>
        <select onChange={(e) => setType(e.target.value)} value={type} id="policy" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-neutral-200">
          <option>Vehicle Insurance</option>
          <option>Health Insurance</option>
          <option>Home Insurance</option>
        </select>
      </div>

      {/* Incident Type */}
      <div>
        <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Type of Incident
        </label>
        {type == "Vehicle Insurance" ? (
          <select onChange={(e) => setInciType(e.target.value)} value={inciType} id="incidentType" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-neutral-200">
            <option>Accident / Damage Claim</option>
            <option>Theft Claim</option>
            <option>Third-Party Claim</option>
            <option>Fire / Natural Calamity</option>
            <option>Windshield / Minor Damage</option>
          </select>
        ) : (
           <select onChange={(e) => setInciType(e.target.value)} value={inciType} id="incidentType" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-neutral-200">
            <option>Medical Emergency</option>
            <option>Hospitalization</option>
            <option>Surgery</option>
            <option>Routine Checkup</option>
          </select>
        )}
      </div>

      {/* Date and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            <FiCalendar className="inline mr-1 text-gray-500 dark:text-neutral-400" size={14} /> Incident Date
          </label>
          <input onChange={(e) => setDate(e.target.value)} value={date} type="date" id="incidentDate" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-neutral-200" />
        </div>
        <div>
          <label htmlFor="incidentLocation" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            <FiMapPin className="inline mr-1 text-gray-500 dark:text-neutral-400" size={14} /> Location (City/State)
          </label>
          <input onChange={(e) => setLocation(e.target.value)} value={location} type="text" id="incidentLocation" placeholder="e.g., San Jose, CA" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-neutral-200" />
        </div>
      </div>

      {/* User Query */}
      <div>
        <label htmlFor="userQuery" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Describe the Incident / Claim
        </label>
        <textarea
          id="userQuery"
          rows="4"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Please describe what happened or the reason for the claim..."
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-neutral-200"
        ></textarea>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md"
        >
          Next: Photos Verification <FiChevronRight />
        </button>
      </div>
    </div>
  )
};

// --- STEP 2: Documentation and Evidence ---
const Step2Photos = ({ nextStep, prevStep }) => {
  const { user } = useContext(ContextAPI);
  const [vehiclePhotos, setVehiclePhotos] = useState({});
  const [uploading, setUploading] = useState(null);
  const [type, setType] = useState("Vehicle Insurance");
  const [userQuery, setUserQuery] = useState("");

  useEffect(() => {
    const step1 = JSON.parse(sessionStorage.getItem('step1-info'));
    if (step1) {
        setType(step1.type);
        setUserQuery(step1.userQuery);
    }
    
    const raw = sessionStorage.getItem("step2-info");
    if (raw) {
        const detail = JSON.parse(raw);
        if (detail?.vehiclePhotos) {
            setVehiclePhotos(detail.vehiclePhotos);
        }
    }
  }, []);

  const uploadFile = async (file, field) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await axios.post("http://localhost:8080/upload", formData, {
      headers: {
        "Authorization": user.token
      }
    });
    
    if (!res) {
      throw new Error("Upload failed");
    }

    return { ...res.data, object_id: res.data.fileId, url: URL.createObjectURL(file) }; 
  };

  const handleFileChange = (key) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(key);
      const uploaded = await uploadFile(file, key);
      console.log(uploaded?.object_id)
      setVehiclePhotos((prev) => ({
        ...prev,
        [key]: uploaded,
      }));
    } catch (err) {
      console.log(err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(null);
    }
  };

  const getFields = () => {
      if (type === "Health Insurance") {
          return [
              ["medicalBill", "Medical Bill"],
              ["prescription", "Prescription"]
          ];
      }
      return [
        ["front", "Front View"],
        ["rear", "Rear View"],
        ["leftSide", "Left Side"],
        ["rightSide", "Right Side"],
        ["numberPlate", "Number Plate"],
        ["chassisNumber", "Chassis Number"],
        ["odometer", "Odometer"],
      ];
  };

  const uploadedFiles = Object.entries(vehiclePhotos);
  const allUploaded = getFields().every(([k]) => vehiclePhotos[k]);

  const onSave = async () => {
    // before stroing it in sessionStorage scan through AI
    if (type === "Vehicle Insurance") {
        try {
            const imageIds = Object.values(vehiclePhotos).map(p => p.object_id);
            const response = await axios.post("http://localhost:8080/api/vehicle/claim-workflow", {
                image_ids: imageIds,
                policy_id: "POL-SAMPLE", 
                user_description: userQuery || "User uploaded vehicle photos for claim"
            }, {
                headers: { "Authorization": user.token }
            });

            sessionStorage.setItem(
                "step2-info",
                JSON.stringify({ vehiclePhotos, analysis: response.data })
            );
            nextStep();
        } catch (error) {
            console.error("AI Analysis failed", error);
            alert("AI Analysis failed, but proceeding.");
            sessionStorage.setItem(
                "step2-info",
                JSON.stringify({ vehiclePhotos })
            );
            nextStep();
        }
    } else {
        // For Health, we just save and proceed. Validation happens in Step 3.
        sessionStorage.setItem(
            "step2-info",
            JSON.stringify({ vehiclePhotos })
        );
        nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">
        2. {type === "Health Insurance" ? "Upload Medical Documents" : "Upload Vehicle Photos"}
      </h3>

      <div className="border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-neutral-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {getFields().map(([key, label]) => (
            <label
              key={key}
              className="flex flex-col gap-1 text-left text-sm text-gray-600 dark:text-neutral-400"
            >
              {label}
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange(key)}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-indigo-50 file:text-indigo-600
                           hover:file:bg-indigo-100"
              />
              {uploading === key && (
                <span className="text-xs text-indigo-500">
                  Uploading...
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300">
          Files Uploaded ({uploadedFiles.length})
        </h4>

        <ul className="text-sm space-y-1">
          {uploadedFiles.map(([key, file]) => (
            <li
              onClick={() => window.open(file.url, "_blank")}
              key={key}
              className="cursor-pointer flex items-center justify-between p-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg"
            >
              <span className="text-gray-900 dark:text-neutral-200">
                <FiFileText className="inline mr-2" />
                {key}
              </span>
              <span className="text-xs text-green-600 dark:text-green-400">
                Uploaded
              </span>
            </li>
          ))}
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
          onClick={onSave}
          disabled={!allUploaded}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md disabled:opacity-50"
        >
          Next: {type === "Health Insurance" ? "Additional Docs" : "AI Scan & Documentation"} <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

// --- STEP 3: Documentation ---
const Step3Documentation = ({ nextStep, prevStep }) => {
  const { user } = useContext(ContextAPI);
  const [type, setType] = useState("");
  const [inciType, setInciType] = useState("");
  const [vehiclePhotos, setVehiclePhotos] = useState({});
  const [uploading, setUploading] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [step2Photos, setStep2Photos] = useState({});

  useEffect(() => {
    const step1 = JSON.parse(sessionStorage.getItem('step1-info'));
    if (step1) {
      setType(step1.type); 
      setInciType(step1.inciType);
      setUserQuery(step1.userQuery);
    }
    const step2 = JSON.parse(sessionStorage.getItem('step2-info'));
    if (step2 && step2.vehiclePhotos) {
        setStep2Photos(step2.vehiclePhotos);
    }
  }, [])

  const uploadFile = async (file, field) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await axios.post("http://localhost:8080/upload", formData, {
      headers: {
        "Authorization": user.token
      }
    });
    if (!res) {
      throw new Error("Upload failed");
    }
    return { ...res.data, object_id: res.data.fileId, url: URL.createObjectURL(file) };
  };

  const handleFileChange = (key) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(key);
      const uploaded = await uploadFile(file, key);
      console.log(uploaded?.url)
      setVehiclePhotos((prev) => ({
        ...prev,
        [key]: uploaded,
      }));
    } catch (err) {
      console.log(err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(null);
    }
  };

  const uploadedFiles = Object.entries(vehiclePhotos);
  // Basic validation: at least one file uploaded
  const allUploaded = uploadedFiles.length > 0;

  const onSave = async () => {
    if (type === "Health Insurance") {
        try {
            // Combine Step 2 and Step 3 photos
            const medicalBillIds = step2Photos['medicalBill'] ? [step2Photos['medicalBill'].object_id] : [];
            const prescriptionIds = step2Photos['prescription'] ? [step2Photos['prescription'].object_id] : [];
            
            // Add Step 3 docs if any (e.g. report)
            const reportIds = vehiclePhotos['report'] ? [vehiclePhotos['report'].object_id] : [];
            
            const allIds = [
                ...medicalBillIds,
                ...prescriptionIds,
                ...reportIds
            ];
            
            const response = await axios.post("http://localhost:8080/api/health/validate-claim", {
                object_ids: allIds,
                query: userQuery || "Validate this health claim",
                medical_bill_ids: medicalBillIds,
                prescription_ids: prescriptionIds
            }, {
                headers: { "Authorization": user.token }
            });
             sessionStorage.setItem(
                "step3-info",
                JSON.stringify({ vehiclePhotos, analysis: response.data })
            );
        } catch (e) {
            console.error(e);
            alert("Health Claim Validation failed, but proceeding.");
             sessionStorage.setItem(
                "step3-info",
                JSON.stringify({ vehiclePhotos })
            );
        }
    } else {
        sessionStorage.setItem(
            "step3-info",
            JSON.stringify({ vehiclePhotos })
        );
    }
    nextStep();
  };

  useEffect(() => {
    const raw = sessionStorage.getItem("step3-info");
    if (!raw) return;

    const detail = JSON.parse(raw);
    if (detail?.vehiclePhotos) {
      setVehiclePhotos(detail.vehiclePhotos);
    }
  }, []);

  const getFields = () => {
      if (type === "Health Insurance") {
          return [
              ["report", "Diagnostic Report"],
              ["dischargeSummary", "Discharge Summary"]
          ];
      } else {
          return [
              ["dl", "Driving License"],
              ["rc", "RC Book"],
              ["fir", "FIR Copy (if applicable)"]
          ];
      }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">
        3. Additional Documentation
      </h3>

      <div className="border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-neutral-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {getFields().map(([key, label]) => (
            <label
              key={key}
              className="flex flex-col gap-1 text-left text-sm text-gray-600 dark:text-neutral-400"
            >
              {label}
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange(key)}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-indigo-50 file:text-indigo-600
                           hover:file:bg-indigo-100"
              />
              {uploading === key && (
                <span className="text-xs text-indigo-500">
                  Uploading...
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300">
          Files Uploaded ({uploadedFiles.length})
        </h4>

        <ul className="text-sm space-y-1">
          {uploadedFiles.map(([key, file]) => (
            <li
              onClick={() => window.open(file.url, "_blank")}
              key={key}
              className="cursor-pointer flex items-center justify-between p-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg"
            >
              <span className="text-gray-900 dark:text-neutral-200">
                <FiFileText className="inline mr-2" />
                {key}
              </span>
              <span className="text-xs text-green-600 dark:text-green-400">
                Uploaded
              </span>
            </li>
          ))}
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
          onClick={onSave}
          disabled={!allUploaded}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md disabled:opacity-50"
        >
          Next: Review & Submit <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

// --- STEP 4: Review and Submission ---
const Step4Review = ({ prevStep }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
      const step2 = JSON.parse(sessionStorage.getItem('step2-info') || '{}');
      const step3 = JSON.parse(sessionStorage.getItem('step3-info') || '{}');
      if (step2.analysis) {
          setAnalysis(step2.analysis);
      } else if (step3.analysis) {
          setAnalysis(step3.analysis);
      }
  }, []);

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
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">4. Review and Submit</h3>

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

      {/* AI Analysis Report */}
      {analysis && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 space-y-4">
            <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 border-b border-indigo-200 dark:border-indigo-800 pb-2">AI Analysis Report</h4>
            {analysis.claim_report && (
                <div className="text-sm text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {analysis.claim_report}
                </div>
            )}
            {analysis.analysis && (
                 <div className="text-sm text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {typeof analysis.analysis === 'string' ? analysis.analysis : JSON.stringify(analysis.analysis, null, 2)}
                </div>
            )}
        </div>
      )}

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
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(4, (prev + 1)));
  const prevStep = () => setCurrentStep((prev) => Math.max(1, (prev - 1)));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PolicyDetails nextStep={nextStep} />;
      case 2:
        return <Step2Photos nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3Documentation nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4Review prevStep={prevStep} />;
      default:
        return <Step1PolicyDetails nextStep={nextStep} />;
    }
  };

  const getStepClasses = (step) => {
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
              <span className={getStepClasses(2).text}>Photos Verification</span>
            </div>

            <div className={getStepClasses(2).line} />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={getStepClasses(3).dot}>
                {currentStep > 3 ? <FiCheckCircle size={16} /> : '3'}
              </div>
              <span className={getStepClasses(3).text}>Documentation</span>
            </div>

            <div className={getStepClasses(3).line} />

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className={getStepClasses(4).dot}>4</div>
              <span className={getStepClasses(4).text}>Review & Submit</span>
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
