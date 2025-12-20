import React, { useContext, useEffect, useState } from "react";

import { FiChevronRight, FiCheckCircle, FiUpload, FiFileText, FiMapPin, FiCalendar } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";
import axios from "axios";
import { ContextAPI } from "@/Context";

// --- Types ---
type WizardStep = 1 | 2 | 3 | 4;
type UploadedFile = {
  url: string;
  publicId: string;
};

type VehiclePhotos = {
  front?: UploadedFile;
  rear?: UploadedFile;
  leftSide?: UploadedFile;
  rightSide?: UploadedFile;
  numberPlate?: UploadedFile;
  chassisNumber?: UploadedFile;
  odometer?: UploadedFile;
};



// --- Sub-Components for Steps ---

// --- STEP 1: Policy and Incident Details ---
const Step1PolicyDetails: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const [type, setType] = useState("Vehicle Insurance");
  const [inciType, setInciType] = useState("Accident / Damage Claim");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const onSave = () => {
    const detail = {
      type: type,
      inciType: inciType,
      date: date,
      location: location,
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
    }
  }, [])
  console.log(type);
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
        {type == "Vehicle Insurance" && (
          <select onChange={(e) => setInciType(e.target.value)} value={inciType} id="incidentType" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-neutral-200">
            <option>Accident / Damage Claim</option>
            <option>Theft Claim</option>
            <option>Third-Party Claim</option>
            <option>Fire / Natural Calamity</option>
            <option>Windshield / Minor Damage</option>
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
const Step2Photos: React.FC<{
  nextStep: () => void;
  prevStep: () => void;
}> = ({ nextStep, prevStep }) => {

  const {user} = useContext(ContextAPI);
  const uploadFile = async (file: File, field: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);
    //console.log(formData )
    const res = await axios.post("http://localhost:3000/api/upload/vehicle-photo", formData,{
      headers:{
        "Authorization":user.token
      }
    });
    //console.log(res.data)
    if (!res) {
      throw new Error("Upload failed");
    }

    return res.data; // { url, publicId }
  };
  const [vehiclePhotos, setVehiclePhotos] = useState<VehiclePhotos>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileChange =
    (key: keyof VehiclePhotos) =>
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          setUploading(key);
          //console.log(file)
          const uploaded = await uploadFile(file, key);
          console.log(uploaded?.url)
          console.log(uploaded?._id)
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
  console.log(uploadedFiles);
  const allUploaded = [
    "front",
    "rear",
    "leftSide",
    "rightSide",
    "numberPlate",
    "chassisNumber",
    "odometer",
  ].every((k) => vehiclePhotos[k as keyof VehiclePhotos]);

  const onSave = () => {

    // before stroing it in sessionStorage scan through AI
    // grins add api end points here

    // to access the img cloudinary link console.log(vehiclePhotos.front?.url)
    sessionStorage.setItem(
      "step2-info",
      JSON.stringify({ vehiclePhotos })
    );
    nextStep();
  };

  useEffect(() => {
    const raw = sessionStorage.getItem("step2-info");
    if (!raw) return;

    const detail = JSON.parse(raw);
    if (detail?.vehiclePhotos) {
      setVehiclePhotos(detail.vehiclePhotos);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">
        2. Upload Vehicle Photos
      </h3>

      <div className="border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-neutral-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[
            ["front", "Front View"],
            ["rear", "Rear View"],
            ["leftSide", "Left Side"],
            ["rightSide", "Right Side"],
            ["numberPlate", "Number Plate"],
            ["chassisNumber", "Chassis Number"],
            ["odometer", "Odometer"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex flex-col gap-1 text-left text-sm text-gray-600 dark:text-neutral-400"
            >
              {label}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(key as keyof VehiclePhotos)}
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

              // FIX 2: Add '_blank' to ensure it opens in a new tab
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
          Next: AI Scan & Documentation <FiChevronRight />
        </button>
      </div>
    </div>
  );
};


// step 3

type accidentDocument = {
  rc: UploadedFile,
  insurancePolicy: UploadedFile
  drivingLicense: UploadedFile,
  repairEstimate?: UploadedFile,
  fir?: UploadedFile;
}
type theftDocuments = {
  rc: UploadedFile,
  insurancePolicy: UploadedFile
  fir: UploadedFile;
  allVehicleKeys: UploadedFile;           // mandatory (photo)
  nonTraceableCertificate?: UploadedFile; // later stage
  bankDetails: UploadedFile;              // mandatory
}
type thirdPartyDocuments = {
  rc: UploadedFile,
  insurancePolicy: UploadedFile
  drivingLicense: UploadedFile;   // mandatory
  fir: UploadedFile;              // mandatory
  courtNotice?: UploadedFile;     // optional / later
}

type calamityDocuments = {
  rc: UploadedFile,
  insurancePolicy: UploadedFile
  firOrFireReport: UploadedFile;  // mandatory
  repairEstimate: UploadedFile;   // mandatory
}
type minorDamageDocuments = {
  rc: UploadedFile,
  insurancePolicy: UploadedFile
  damageCloseUp: UploadedFile;    // mandatory
}

const Step3Documentation: React.FC<{
  nextStep: () => void;
  prevStep: () => void;
}> = ({ nextStep, prevStep }) => {
  const [type, setType] = useState("");
  const [inciType, setInciType] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem('step1-info');
    if (raw) {
      const parsed = JSON.parse(raw);
      setType(parsed.type); // means Vehicle insurance 
      setInciType(parsed.inciType); // its types like theft,accident etc.
    }
  }, [])

   
  if (type == "Vehicle Insurance") {
    const render = () => {
      switch (inciType) {

        case "Accident / Damage Claim":
          return

        case "Theft Claim":
          return

        case "Third-Party Claim":
          return

        case "Fire / Natural Calamity":
          return

        case "Windshield / Minor Damage":
          return
      }
    }
  }
  const uploadFile = async (file: File, field: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);
    //console.log(formData )
    const res = await axios.post("http://localhost:3000/api/upload/vehicle-photo", formData);
    //console.log(res.data)
    if (!res) {
      throw new Error("Upload failed");
    }

    return res.data; // { url, publicId }
  };

  const [vehiclePhotos, setVehiclePhotos] = useState<VehiclePhotos>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileChange =
    (key: keyof VehiclePhotos) =>
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          setUploading(key);
          //console.log(file)
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
  console.log(uploadedFiles);
  const allUploaded = [
    "front",
    "rear",
    "leftSide",
    "rightSide",
    "numberPlate",
    "chassisNumber",
    "odometer",
  ].every((k) => vehiclePhotos[k as keyof VehiclePhotos]);

  const onSave = () => {


    sessionStorage.setItem(
      "step2-info",
      JSON.stringify({ vehiclePhotos })
    );
    nextStep();
  };

  useEffect(() => {
    const raw = sessionStorage.getItem("step2-info");
    if (!raw) return;

    const detail = JSON.parse(raw);
    if (detail?.vehiclePhotos) {
      setVehiclePhotos(detail.vehiclePhotos);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">
        2. Upload Vehicle Photos
      </h3>

      <div className="border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-neutral-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[
            ["front", "Front View"],
            ["rear", "Rear View"],
            ["leftSide", "Left Side"],
            ["rightSide", "Right Side"],
            ["numberPlate", "Number Plate"],
            ["chassisNumber", "Chassis Number"],
            ["odometer", "Odometer"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex flex-col gap-1 text-left text-sm text-gray-600 dark:text-neutral-400"
            >
              {label}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(key as keyof VehiclePhotos)}
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

              // FIX 2: Add '_blank' to ensure it opens in a new tab
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
          Next: AI Scan & Documentation <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

// --- STEP 4: Review and Submission ---
const Step4Review: React.FC<{ prevStep: () => void }> = ({ prevStep }) => {
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
        return <Step2Photos nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3Documentation nextStep={nextStep} prevStep={prevStep} />;

      case 4:
        return <Step4Review prevStep={prevStep} />;
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