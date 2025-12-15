import React from "react";

import { 
  FiActivity, 
  FiDollarSign, 
  FiFileText, 
  FiAlertCircle, 
  FiArrowUpRight, 
  FiClock, 
  FiCheckCircle 
} from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

// --- Types (Necessary for TypeScript) ---
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

interface Claim {
  id: string;
  policyType: string;
  date: string;
  amount: string;
  status: "Approved" | "Processing" | "Pending Action";
}

// --- Mock Data ---
const recentClaims: Claim[] = [
  { id: "CLM-2024-001", policyType: "Vehicle Insurance", date: "Oct 24, 2025", amount: "$1,200", status: "Processing" },
  { id: "CLM-2024-002", policyType: "Health Insurance", date: "Oct 20, 2025", amount: "$450", status: "Approved" },
  { id: "CLM-2024-003", policyType: "Home Insurance", date: "Oct 15, 2025", amount: "$3,000", status: "Pending Action" },
];

// --- Sub-Components (Styled for the theme) ---

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-indigo-50 dark:bg-neutral-800 rounded-lg text-indigo-600 dark:text-indigo-400">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>
          {trend} <FiArrowUpRight className="ml-1" />
        </span>
      )}
    </div>
    <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mt-1">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Pending Action": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };
  
  const badgeStyle = styles[status] || "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border border-transparent ${badgeStyle}`}>
      {status}
    </span>
  );
};


// --- Main Component ---

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-2">
            Here is a summary of your policies and recent claim activity.
          </p>
        </header>

        {/* STATS GRID (Replaces {/* StatCards... */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Policies" 
            value="4" 
            icon={FiFileText} 
            trend="+1 New" 
            trendUp={true} 
          />
          <StatCard 
            title="Total Claims" 
            value="12" 
            icon={FiActivity} 
          />
          <StatCard 
            title="Pending Actions" 
            value="1" 
            icon={FiAlertCircle} 
            trend="Action Req" 
            trendUp={false} 
          />
          <StatCard 
            title="Total Coverage" 
            value="$1.2M" 
            icon={FiDollarSign} 
          />
        </section>

        {/* RECENT ACTIVITY & QUICK ACTIONS SPLIT (Replaces {/* Recent Claims, etc... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Claims Table */}
          <section className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Recent Claims</h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-neutral-800/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Claim ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Policy</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                  {recentClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-neutral-200">{claim.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-400">{claim.policyType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-400">{claim.date}</td>
                      <td className="px-6 py-4 text-sm"><StatusBadge status={claim.status} /></td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-neutral-200 text-right">{claim.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Action Center */}
          <section className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Need to file a claim?</h3>
              <p className="text-indigo-100 text-sm mb-6">Our AI-assisted wizard helps you file usually in under 5 minutes.</p>
              <button className="w-full bg-white text-indigo-600 py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-50 transition shadow-sm">
                Start New Claim
              </button>
            </div>

            {/* Upcoming Payments */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-4">Upcoming Payment</h3>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-neutral-100 font-medium">Vehicle Policy #4922</p>
                  <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">Due: Oct 30, 2025</p>
                  <div className="mt-3 flex items-center justify-between w-full gap-8">
                    <span className="text-lg font-bold text-gray-900 dark:text-neutral-100">$214.00</span>
                    <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Pay Now</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
              <FiCheckCircle className="text-green-500 text-xl" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">KYC Verified</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Your identity is confirmed.</p>
              </div>
            </div>

          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;