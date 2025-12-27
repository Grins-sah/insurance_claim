import React, { useState } from 'react';

const TestEndpointsPage = () => {
    const [file, setFile] = useState(null);
    const [objectId, setObjectId] = useState('');
    const [imageIdsInput, setImageIdsInput] = useState('');
    const [policyId, setPolicyId] = useState('POLICY-123');
    const [userDesc, setUserDesc] = useState('Accident occurred on highway');
    const [query, setQuery] = useState('Is this bill valid?');
    const [medicalBillIds, setMedicalBillIds] = useState('');
    const [prescriptionIds, setPrescriptionIds] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState({});

    const backendUrl = 'http://localhost:8080'; 

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploadStatus('Uploading...');

        try {
            const response = await fetch(`${backendUrl}/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setImageIdsInput(prev => prev ? `${prev}, ${data.fileId}` : data.fileId);
                setObjectId(data.fileId);
                setUploadStatus(`Upload successful! Object ID: ${data.fileId}`);
            } else {
                setUploadStatus(`Upload failed: ${data.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('An error occurred during upload.');
        }
    };

    const callEndpoint = async (endpoint, method = 'POST', body = null, key) => {
        if (!objectId) {
            alert('Please upload a file first to get an Object ID.');
            return;
        }

        setLoading(prev => ({ ...prev, [key]: true }));
        setResults(prev => ({ ...prev, [key]: null }));

        try {
            const url = `${backendUrl}${endpoint.replace(':object_id', objectId)}`;
            
            // Get token from sessionStorage
            const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
            const token = userInfo?.token;

            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = token; // Assuming backend expects just the token or "Bearer " + token. 
                // Let's check middleware.ts to be sure.
            }

            const options = {
                method,
                headers,
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);
            const data = await response.json();
            setResults(prev => ({ ...prev, [key]: data }));
        } catch (error) {
            console.error(`Error calling ${key}:`, error);
            setResults(prev => ({ ...prev, [key]: { error: error.message } }));
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Endpoint Tester</h1>

            <div className="mb-8 p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">1. Upload File</h2>
                <div className="flex gap-4 items-center">
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-600 file:text-white
                            hover:file:bg-blue-700
                        "
                    />
                    <button 
                        onClick={handleUpload} 
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium"
                    >
                        Upload
                    </button>
                </div>
                {uploadStatus && <p className="mt-2 text-yellow-400">{uploadStatus}</p>}
                {objectId && (
                    <div className="mt-2">
                        <span className="text-gray-400">Current Object ID: </span>
                        <code className="bg-gray-700 px-2 py-1 rounded">{objectId}</code>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vehicle Endpoints */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Vehicle Endpoints</h3>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => callEndpoint('/api/vehicle/detect', 'POST', { object_id: objectId }, 'vehicleDetect')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            disabled={loading.vehicleDetect}
                        >
                            {loading.vehicleDetect ? 'Running...' : 'Detect Vehicle'}
                        </button>
                        <button 
                            onClick={() => callEndpoint('/api/vehicle/orientation', 'POST', { object_id: objectId }, 'vehicleOrientation')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            disabled={loading.vehicleOrientation}
                        >
                            {loading.vehicleOrientation ? 'Running...' : 'Detect Orientation'}
                        </button>
                        <button 
                            onClick={() => callEndpoint('/api/vehicle/anomaly', 'POST', { object_id: objectId }, 'vehicleAnomaly')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            disabled={loading.vehicleAnomaly}
                        >
                            {loading.vehicleAnomaly ? 'Running...' : 'Detect Anomaly'}
                        </button>
                    </div>
                </div>

                {/* Health Endpoints */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-green-400">Health Endpoints</h3>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => callEndpoint('/api/health/medical-bill', 'POST', { object_id: objectId }, 'medicalBill')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                            disabled={loading.medicalBill}
                        >
                            {loading.medicalBill ? 'Running...' : 'Process Medical Bill'}
                        </button>
                        <button 
                            onClick={() => callEndpoint('/api/health/prescription', 'POST', { object_id: objectId }, 'prescription')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                            disabled={loading.prescription}
                        >
                            {loading.prescription ? 'Running...' : 'Process Prescription'}
                        </button>
                    </div>
                </div>

                {/* RAG Endpoints */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-purple-400">RAG Endpoints</h3>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => callEndpoint(`/api/rag/process/${objectId}`, 'POST', null, 'ragProcess')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                            disabled={loading.ragProcess}
                        >
                            {loading.ragProcess ? 'Running...' : 'Process for RAG'}
                        </button>
                    </div>
                </div>

                {/* Complex Workflows */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4 text-orange-400">Complex Workflows</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">Image/Object IDs (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="Image IDs" 
                                className="bg-gray-700 p-2 rounded text-sm w-full"
                                value={imageIdsInput}
                                onChange={(e) => setImageIdsInput(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Policy ID</label>
                            <input 
                                type="text" 
                                placeholder="Policy ID" 
                                className="bg-gray-700 p-2 rounded text-sm w-full"
                                value={policyId}
                                onChange={(e) => setPolicyId(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">User Description</label>
                            <input 
                                type="text" 
                                placeholder="User Description" 
                                className="bg-gray-700 p-2 rounded text-sm w-full"
                                value={userDesc}
                                onChange={(e) => setUserDesc(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Query (Health)</label>
                            <input 
                                type="text" 
                                placeholder="Query" 
                                className="bg-gray-700 p-2 rounded text-sm w-full"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Medical Bill IDs (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="Medical Bill IDs" 
                                className="bg-gray-700 p-2 rounded text-sm w-full"
                                value={medicalBillIds}
                                onChange={(e) => setMedicalBillIds(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Prescription IDs (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="Prescription IDs" 
                                className="bg-gray-700 p-2 rounded text-sm w-full"
                                value={prescriptionIds}
                                onChange={(e) => setPrescriptionIds(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button 
                            onClick={() => {
                                const imageIds = imageIdsInput.split(',').map(id => id.trim()).filter(id => id);
                                callEndpoint('/api/vehicle/claim-workflow', 'POST', { 
                                    image_ids: imageIds.length > 0 ? imageIds : [objectId], 
                                    policy_id: policyId, 
                                    user_description: userDesc 
                                }, 'claimWorkflow');
                            }}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm"
                            disabled={loading.claimWorkflow}
                        >
                            {loading.claimWorkflow ? 'Running...' : 'Test Claim Workflow'}
                        </button>
                        <button 
                            onClick={() => {
                                const objectIds = imageIdsInput.split(',').map(id => id.trim()).filter(id => id);
                                const medIds = medicalBillIds.split(',').map(id => id.trim()).filter(id => id);
                                const presIds = prescriptionIds.split(',').map(id => id.trim()).filter(id => id);
                                
                                callEndpoint('/api/health/validate-claim', 'POST', { 
                                    object_ids: objectIds.length > 0 ? objectIds : [objectId], 
                                    query: query,
                                    medical_bill_ids: medIds.length > 0 ? medIds : [],
                                    prescription_ids: presIds.length > 0 ? presIds : []
                                }, 'validateClaim');
                            }}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm"
                            disabled={loading.validateClaim}
                        >
                            {loading.validateClaim ? 'Running...' : 'Test Health Validation'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Results</h2>
                <div className="grid grid-cols-1 gap-6">
                    {Object.entries(results).map(([key, result]) => (
                        result && (
                            <div key={key} className="p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-auto">
                                <h4 className="font-bold text-lg mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                <pre className="text-xs text-green-300 whitespace-pre-wrap">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestEndpointsPage;
