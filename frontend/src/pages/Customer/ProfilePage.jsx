import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit, FiCheckCircle, FiSave } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";
// --- Mock Data ---
const mockUserProfile = {
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 123-4567",
    addressLine1: "123 SmartClaim Avenue",
    city: "San Jose",
    state: "CA",
    zip: "95101",
    securityStatus: "Verified, 2FA Enabled",
};
const DetailItem = ({ icon: Icon, label, value, isEditable = false, onEdit }) => (<div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
            <Icon size={20} className="text-indigo-600 dark:text-indigo-400"/>
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">{label}</p>
                <p className="text-base font-medium text-gray-900 dark:text-neutral-200">{value}</p>
            </div>
        </div>
        {isEditable && (<button onClick={onEdit} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition">
                <FiEdit size={14}/> Edit
            </button>)}
    </div>);
// --- Main Profile Component ---
const ProfilePage = () => {
    const [profile, setProfile] = useState(mockUserProfile);
    const [isEditing, setIsEditing] = useState(false);
    // State to hold pending changes during edit
    const [editData, setEditData] = useState(mockUserProfile);
    const handleSave = () => {
        // In a real app: send editData to backend
        setProfile(editData);
        setIsEditing(false);
        // Display a success notification here
    };
    return (<DashboardLayout>
            <div className="p-4 md:p-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100">My Profile</h1>
                        <p className="text-gray-500 dark:text-neutral-400 mt-1">Review and update your personal and contact information.</p>
                    </div>
                    
                    {/* Save/Edit Button */}
                    {isEditing ? (<button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-md">
                            <FiSave /> Save Changes
                        </button>) : (<button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-md">
                            <FiEdit /> Edit Profile
                        </button>)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Column 1: Personal Details & Security */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Personal & Contact Info Card */}
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-3">
                                Account Information
                            </h2>
                            
                            <div className="space-y-4">
                                {/* Name (Non-editable for simplicity) */}
                                <DetailItem icon={FiUser} label="Full Name" value={`${profile.firstName} ${profile.lastName}`}/>
                                
                                {/* Email (Editable) */}
                                {isEditing ? (<div className="py-3 border-b border-gray-100 dark:border-neutral-800">
                                        <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Email Address</label>
                                        <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-neutral-200"/>
                                    </div>) : (<DetailItem icon={FiMail} label="Email Address" value={profile.email}/>)}

                                {/* Phone (Editable) */}
                                {isEditing ? (<div className="py-3 border-b border-gray-100 dark:border-neutral-800">
                                        <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Phone Number</label>
                                        <input type="text" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-900 dark:text-neutral-200"/>
                                    </div>) : (<DetailItem icon={FiPhone} label="Phone Number" value={profile.phone}/>)}
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-3">
                                Billing Address
                            </h2>
                            <div className="space-y-4">
                                <DetailItem icon={FiMapPin} label="Street Address" value={profile.addressLine1} isEditable={!isEditing} onEdit={() => setIsEditing(true)}/>
                                <DetailItem icon={FiMapPin} label="City, State, ZIP" value={`${profile.city}, ${profile.state} ${profile.zip}`}/>
                                
                                {/* A simple action for editing the address */}
                                {!isEditing && (<div className="pt-2">
                                        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                            Manage Stored Addresses
                                        </button>
                                    </div>)}
                            </div>
                        </div>

                    </div>

                    {/* Column 2: Security Status */}
                    <div className="lg:col-span-1 space-y-8">
                        
                        {/* Security Panel */}
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-3">
                                Security Status
                            </h2>
                            <div className="flex items-center gap-4 py-2">
                                <FiLock size={24} className="text-green-600 dark:text-green-400"/>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-neutral-200">Account Secure</p>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">{profile.securityStatus}</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                                <button className="w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium text-sm py-2 rounded-lg border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-neutral-800/50 transition">
                                    Change Password
                                </button>
                                <button className="w-full text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm mt-2">
                                    Manage Two-Factor Authentication
                                </button>
                            </div>
                        </div>

                        {/* Verification Status */}
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
                            <FiCheckCircle size={24} className="text-green-600 dark:text-green-400"/>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">KYC Verified</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">Your identity and documentation are confirmed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>);
};
export default ProfilePage;
