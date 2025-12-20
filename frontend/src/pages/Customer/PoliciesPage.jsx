import React from "react";
import { FiPlus, FiSearch, FiShield, FiMoreVertical, FiCalendar, FiDollarSign } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";
// --- Mock Data ---
const policyData = [
    {
        id: "POL-8821",
        type: "Health Insurance",
        provider: "SafeGuard Life",
        premium: "$120/mo",
        renewalDate: "Jan 15, 2026",
        coverageLimit: "$500,000",
        status: "Active"
    },
    {
        id: "POL-4922",
        type: "Vehicle Insurance",
        provider: "AutoSecure Elite",
        premium: "$214/mo",
        renewalDate: "Dec 30, 2025",
        coverageLimit: "$150,000",
        status: "Expiring Soon"
    },
    {
        id: "POL-1033",
        type: "Home Insurance",
        provider: "Brick & Mortar",
        premium: "$85/mo",
        renewalDate: "Mar 10, 2026",
        coverageLimit: "$350,000",
        status: "Active"
    },
    {
        id: "POL-3456",
        type: "Travel Insurance",
        provider: "GlobeTrotter",
        premium: "$35/mo",
        renewalDate: "Oct 25, 2025",
        coverageLimit: "$50,000",
        status: "Lapsed"
    },
];
// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const styles = {
        "Active": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        "Expiring Soon": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        "Lapsed": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (<span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
      {status}
    </span>);
};
// --- Main Policies Component ---
const PoliciesPage = () => {
    return (<DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100">My Policies</h1>
            <p className="text-gray-500 dark:text-neutral-400 mt-1">Manage and track your insurance coverage details.</p>
          </div>
          {/* Action Button */}
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-600/20">
            <FiPlus /> Get New Quote
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Search by policy ID or provider..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-neutral-200"/>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select className="bg-gray-50 dark:bg-neutral-800 border-none rounded-lg text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 dark:text-neutral-300 w-full">
              <option>All Policies</option>
              <option>Health Insurance</option>
              <option>Vehicle Insurance</option>
              <option>Home Insurance</option>
            </select>
          </div>
        </div>

        {/* Policy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {policyData.map((policy) => (<div key={policy.id} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
              
              {/* Header and Action Menu */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 dark:bg-neutral-800 text-indigo-600 dark:text-cyan-400 rounded-xl">
                      <FiShield size={24}/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">{policy.type}</h3>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">{policy.provider}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200">
                  <FiMoreVertical size={20}/>
                </button>
              </div>

              {/* Policy Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-neutral-800 pb-2">
                  <span className="text-gray-500 dark:text-neutral-500 flex items-center gap-2">
                    <FiDollarSign size={16}/> Max Coverage
                  </span>
                  <span className="font-bold text-gray-900 dark:text-neutral-200">{policy.coverageLimit}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-neutral-800 pb-2">
                  <span className="text-gray-500 dark:text-neutral-500 flex items-center gap-2">
                    <FiCalendar size={16}/> Renewal Date
                  </span>
                  <span className="font-medium text-gray-900 dark:text-neutral-200">{policy.renewalDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-neutral-500">Monthly Premium</span>
                  <span className="font-bold text-indigo-600 dark:text-cyan-400">{policy.premium}</span>
                </div>
              </div>

              {/* Footer Actions and Status */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
                <StatusBadge status={policy.status}/>
                <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  View Policy Document
                </button>
              </div>
            </div>))}
        </div>
      </div>
    </DashboardLayout>);
};
export default PoliciesPage;
