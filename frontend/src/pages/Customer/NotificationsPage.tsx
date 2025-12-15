import React, { useState } from "react";

import { 
  FiBell, 
  FiFileText, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiMail,
  FiClock,
  FiX
} from "react-icons/fi";
import DashboardLayout from "./DashboardLayout";

// --- Types ---
type NotificationType = "Claim Status" | "Action Required" | "Policy Update" | "System";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

// --- Mock Data ---
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "Action Required",
    title: "Document Missing for CLM-00500",
    message: "Your claim for Pipe Burst Leak requires the final repair invoice. Please upload it immediately.",
    timestamp: "2 hours ago",
    isRead: false,
    link: "/claims/CLM-00500",
  },
  {
    id: 2,
    type: "Claim Status",
    title: "Claim CLM-00499 Approved",
    message: "Great news! Your hospitalization claim has been fully approved and payment is scheduled.",
    timestamp: "1 day ago",
    isRead: false,
    link: "/claims/CLM-00499",
  },
  {
    id: 3,
    type: "Policy Update",
    title: "Vehicle Policy Renewal Reminder",
    message: "Your Vehicle Policy (POL-4922) is due for renewal on December 30th. Pay now to avoid lapse.",
    timestamp: "3 days ago",
    isRead: true,
    link: "/policies/POL-4922",
  },
  {
    id: 4,
    type: "System",
    title: "Maintenance Scheduled",
    message: "Scheduled system maintenance on Nov 1st from 2 AM to 4 AM UTC. Limited service access expected.",
    timestamp: "1 week ago",
    isRead: true,
  },
  {
    id: 5,
    type: "Claim Status",
    title: "Claim CLM-00501 Status Change",
    message: "Your Car Accident claim has moved to the 'Final Review' stage.",
    timestamp: "1 week ago",
    isRead: true,
  },
];

// --- Sub-Components ---

const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
  let Icon = FiBell;
  let iconClasses = "text-indigo-600 dark:text-indigo-400";
  let backgroundClasses = notification.isRead 
    ? "bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800"
    : "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/20";
  
  if (notification.type === "Action Required") {
    Icon = FiAlertCircle;
    iconClasses = "text-red-600 dark:text-red-400";
  } else if (notification.type === "Claim Status") {
    Icon = notification.title.includes("Approved") ? FiCheckCircle : FiFileText;
    iconClasses = notification.title.includes("Approved") ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400";
  } else if (notification.type === "Policy Update") {
    Icon = FiFileText;
    iconClasses = "text-orange-600 dark:text-orange-400";
  }
  
  return (
    <a 
      href={notification.link || '#'} 
      className={`flex items-start p-4 rounded-xl border border-gray-200 dark:border-neutral-800 transition-all duration-200 ${backgroundClasses} ${notification.link ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`p-3 rounded-full mr-4 ${iconClasses} ${notification.isRead ? 'bg-gray-100 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'}`}>
        <Icon size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
            <h3 className={`text-sm font-semibold ${notification.isRead ? 'text-gray-900 dark:text-neutral-200' : 'text-gray-900 dark:text-neutral-50'}`}>
                {notification.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-neutral-500 whitespace-nowrap ml-4 flex items-center gap-1">
                <FiClock size={12} /> {notification.timestamp}
            </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{notification.message}</p>
      </div>

      <button className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200">
          <FiX size={16} />
      </button>
    </a>
  );
};


// --- Main Notifications Component ---
const NotificationsPage = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredNotifications = mockNotifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'action') return notif.type === 'Action Required';
    return false;
  });

  const tabClasses = (tabName: string) => 
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
     ${filter === tabName 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
     }`;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100">Notifications</h1>
            <p className="text-gray-500 dark:text-neutral-400 mt-1">Important updates and actions requiring your attention.</p>
          </div>
          {/* Action Button */}
          <button className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-2.5 rounded-xl font-medium transition">
            <FiMail /> Mark all as Read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 mb-8 flex gap-3">
          <button className={tabClasses('all')} onClick={() => setFilter('all')}>
            All ({mockNotifications.length})
          </button>
          <button className={tabClasses('unread')} onClick={() => setFilter('unread')}>
            Unread ({mockNotifications.filter(n => !n.isRead).length})
          </button>
          <button className={tabClasses('action')} onClick={() => setFilter('action')}>
            Actions Required ({mockNotifications.filter(n => n.type === 'Action Required').length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <NotificationCard key={notif.id} notification={notif} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-neutral-500">
                <FiBell size={30} className="mx-auto mb-3" />
                <p className="text-lg font-medium">No Notifications Here</p>
                <p className="text-sm">You are all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;