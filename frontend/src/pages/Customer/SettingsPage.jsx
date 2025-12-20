import React, { useState } from "react";
import { FiSettings, FiMail, FiBell, FiLock, FiCreditCard, FiTrash2, FiChevronRight } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";
// --- Sub-Components ---
// --- General Settings Panel ---
const GeneralSettings = () => (<div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 border-b border-gray-100 dark:border-neutral-800 pb-3 mb-4">
            General Preferences
        </h3>
        
        {/* Default Landing Page Setting */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <div>
                <p className="font-medium text-gray-900 dark:text-neutral-200">Default Landing Page</p>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Select the page you see after logging in.</p>
            </div>
            <select className="bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm px-3 py-1.5 focus:ring-indigo-500">
                <option>Dashboard</option>
                <option>Claims History</option>
                <option>Policies</option>
            </select>
        </div>

        {/* Time Zone Setting */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <div>
                <p className="font-medium text-gray-900 dark:text-neutral-200">Time Zone</p>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Current Time Zone: Asia/Kolkata (IST)</p>
            </div>
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Update
            </button>
        </div>

    </div>);
// --- Security Settings Panel ---
const SecuritySettings = () => (<div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 border-b border-gray-100 dark:border-neutral-800 pb-3 mb-4">
            Account Security
        </h3>

        {/* Password Reset */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-3">
                <FiLock size={20} className="text-indigo-600 dark:text-indigo-400"/>
                <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">Change Password</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Last changed: 3 months ago</p>
                </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Reset
            </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
                <FiLock size={20} className="text-green-600 dark:text-green-400"/>
                <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-300">2FA is **Enabled** for all logins.</p>
                </div>
            </div>
            <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
                Manage
            </button>
        </div>
    </div>);
// --- Notifications Settings Panel ---
const NotificationsSettings = () => (<div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 border-b border-gray-100 dark:border-neutral-800 pb-3 mb-4">
            Notification Preferences
        </h3>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-3">
                <FiMail size={20} className="text-blue-600 dark:text-blue-400"/>
                <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">Email Updates</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Receive status changes and important alerts via email.</p>
                </div>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 dark:bg-neutral-700 rounded focus:ring-indigo-500"/>
        </div>

        {/* In-App Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-3">
                <FiBell size={20} className="text-orange-600 dark:text-orange-400"/>
                <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">In-App Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Get pop-up alerts inside the customer portal.</p>
                </div>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 dark:bg-neutral-700 rounded focus:ring-indigo-500"/>
        </div>
        
        {/* Promotional Offers */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-3">
                <FiCreditCard size={20} className="text-gray-600 dark:text-neutral-400"/>
                <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">Promotional Emails</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Receive updates on new policies and special offers.</p>
                </div>
            </div>
            <input type="checkbox" className="h-5 w-5 text-indigo-600 dark:bg-neutral-700 rounded focus:ring-indigo-500"/>
        </div>
    </div>);
// --- Main Settings Component ---
const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("general");
    const renderContent = () => {
        switch (activeTab) {
            case "general":
                return <GeneralSettings />;
            case "security":
                return <SecuritySettings />;
            case "notifications":
                return <NotificationsSettings />;
            default:
                return <GeneralSettings />;
        }
    };
    const tabItemClasses = (tab) => `flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors duration-200 
     ${activeTab === tab
        ? 'bg-indigo-50 dark:bg-neutral-800 text-indigo-700 dark:text-indigo-400 font-semibold'
        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'}`;
    const TabIcon = ({ tab }) => {
        switch (tab) {
            case 'general': return <FiSettings size={20}/>;
            case 'security': return <FiLock size={20}/>;
            case 'notifications': return <FiBell size={20}/>;
            default: return <FiSettings size={20}/>;
        }
    };
    return (<DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100">Settings</h1>
            <p className="text-gray-500 dark:text-neutral-400 mt-1">Manage your account preferences, security, and notification settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column: Navigation/Tabs */}
            <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-3 shadow-sm h-min">
                <nav className="space-y-1">
                    <button className={tabItemClasses('general')} onClick={() => setActiveTab('general')}>
                        <TabIcon tab="general"/> <span>General</span> <FiChevronRight size={16} className="ml-auto opacity-70"/>
                    </button>
                    <button className={tabItemClasses('security')} onClick={() => setActiveTab('security')}>
                        <TabIcon tab="security"/> <span>Security</span> <FiChevronRight size={16} className="ml-auto opacity-70"/>
                    </button>
                    <button className={tabItemClasses('notifications')} onClick={() => setActiveTab('notifications')}>
                        <TabIcon tab="notifications"/> <span>Notifications</span> <FiChevronRight size={16} className="ml-auto opacity-70"/>
                    </button>
                    
                    {/* Danger Zone Separator */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-neutral-800">
                        <button className="flex items-center gap-3 p-4 rounded-lg w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200 text-sm font-medium">
                            <FiTrash2 size={20}/> Delete Account
                        </button>
                    </div>
                </nav>
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
                {renderContent()}
            </div>
        </div>
      </div>
    </DashboardLayout>);
};
export default SettingsPage;
