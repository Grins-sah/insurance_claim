import React from "react";
import { FiPlus, FiSearch, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiFileText } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";
// --- Mock Data ---
const claimsData = [
    {
        id: "CLM-00501",
        policyId: "POL-4922",
        type: "Car Accident Damage",
        submissionDate: "Oct 15, 2025",
        lastUpdate: "Oct 28, 2025",
        requestedAmount: "$1,200",
        status: "Under Review"
    },
    {
        id: "CLM-00499",
        policyId: "POL-8821",
        type: "Hospitalization Stay",
        submissionDate: "Sep 01, 2025",
        lastUpdate: "Oct 25, 2025",
        requestedAmount: "$4,500",
        status: "Approved"
    },
    {
        id: "CLM-00500",
        policyId: "POL-1033",
        type: "Pipe Burst Leak",
        submissionDate: "Oct 20, 2025",
        lastUpdate: "Oct 24, 2025",
        requestedAmount: "$800",
        status: "Pending Documents"
    },
    {
        id: "CLM-00498",
        policyId: "POL-3456",
        type: "Flight Cancellation",
        submissionDate: "Aug 10, 2025",
        lastUpdate: "Aug 15, 2025",
        requestedAmount: "$350",
        status: "Rejected"
    },
];
// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const styles = {
        "Under Review": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "Approved": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        "Rejected": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        "Pending Documents": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        "Awaiting Payment": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    };
    const Icon = status === "Approved" ? FiCheckCircle :
        status === "Rejected" ? FiXCircle :
            FiClock;
    return (<span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${styles[status]}`}>
      <Icon size={12}/>
      {status}
    </span>);
};
// --- Main Claims Component ---
const ClaimsPage = () => {
    return (<DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100">Claims History</h1>
            <p className="text-gray-500 dark:text-neutral-400 mt-1">Track the status and details of your submitted claims.</p>
          </div>
          {/* Action Button */}
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-600/20">
            <FiPlus /> File New Claim
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Search by Claim ID or Type..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-neutral-200"/>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select className="bg-gray-50 dark:bg-neutral-800 border-none rounded-lg text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 dark:text-neutral-300 w-full">
              <option>All Statuses</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Pending Documents</option>
            </select>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 dark:bg-neutral-800/50 border-b border-gray-200 dark:border-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Claim ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Claim Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Last Update</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-right">Requested Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4"></th> {/* Action column */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                {claimsData.map((claim) => (<tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-neutral-200">{claim.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-400">
                        {claim.type} 
                        <span className="text-xs block text-gray-400 dark:text-neutral-500">Policy: {claim.policyId}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-400 flex items-center gap-1">
                        <FiCalendar size={14} className="text-gray-400"/>
                        {claim.submissionDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-400">{claim.lastUpdate}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600 dark:text-cyan-400 text-right">{claim.requestedAmount}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={claim.status}/>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                        <button className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm">
                            View
                        </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State Example (Optional, but good practice) */}
        {claimsData.length === 0 && (<div className="mt-10 text-center py-10 border border-dashed border-gray-300 dark:border-neutral-700 rounded-xl">
                <FiFileText size={30} className="mx-auto text-gray-400 dark:text-neutral-600 mb-3"/>
                <p className="text-lg font-medium text-gray-700 dark:text-neutral-300">No Claims Submitted Yet</p>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mt-2">Ready to get started? File your first claim now.</p>
                <button className="mt-4 flex items-center mx-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition">
                    <FiPlus /> File New Claim
                </button>
            </div>)}
      </div>
    </DashboardLayout>);
};
export default ClaimsPage;
