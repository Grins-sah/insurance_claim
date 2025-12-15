import React from "react";
import CustomerSidebar from "./CustomerSidebar";
import Navbar from "./Navbar";


interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-500">
      {/* Fixed Sidebar */}
      <CustomerSidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;