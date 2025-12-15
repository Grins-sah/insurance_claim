import React from "react";
import { FiSearch, FiMenu, FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle (Visible only on small screens) */}
        <button className="md:hidden p-2 text-gray-600 dark:text-neutral-400">
          <FiMenu size={20} />
        </button>
        
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search policies, claims..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg bg-gray-100 dark:bg-neutral-800 border-transparent focus:bg-white dark:focus:bg-neutral-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-neutral-800 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">Alex Rivera</p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Premium Member</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            AR
          </div>
          <FiChevronDown className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;