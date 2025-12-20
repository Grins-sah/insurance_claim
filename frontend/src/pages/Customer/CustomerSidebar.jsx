import { Link, useLocation } from "react-router-dom"; // 👈 Import Link and useLocation
import ThemeToggle from "@/components/ui/theme-toggle";
import { FiGrid, FiFileText, FiPlusCircle, FiBell, FiUser, FiSettings, } from "react-icons/fi";
const navItems = [
    // ADD A PATH PROPERTY to link to your routes
    { name: "Dashboard", icon: FiGrid, path: "/customer/dashboard" },
    { name: "Policies", icon: FiFileText, path: "/customer/policies" },
    { name: "Claims", icon: FiFileText, path: "/customer/claims" },
    { name: "Create Claim", icon: FiPlusCircle, path: "/customer/create-claim" },
    { name: "Notifications", icon: FiBell, path: "/customer/notifications" },
    { name: "Profile", icon: FiUser, path: "/customer/profile" },
    { name: "Settings", icon: FiSettings, path: "/customer/settings" },
];
const CustomerSidebar = () => {
    const location = useLocation(); // 👈 Get the current URL path
    return (<aside className="hidden md:flex flex-col w-64 min-h-screen bg-neutral-900 text-neutral-100 border-r border-neutral-800">
      {/* ... (Branding section remains the same) ... */}
        <div className="px-6 py-5 border-b border-neutral-800">

        <h1 className="text-lg font-semibold tracking-wide">

          SmartClaim

        </h1>

        <p className="text-xs text-neutral-400 mt-1">

          Customer Portal

        </p>

      </div>
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path; // 👈 Check if current path matches item path
            return (<Link key={item.name} to={item.path} // 👈 Use Link to navigate without refreshing the page
             className={`
                w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                ${isActive
                    ? "bg-indigo-700 text-white font-semibold" // Active style
                    : "text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800" // Inactive style
                }
              `}>
              <Icon className="text-lg"/>
              <span>{item.name}</span>
            </Link>);
        })}
      </nav>

      {/* ... (Footer actions remains the same) ... */}
       <div className="px-4 py-4 border-t border-neutral-800 flex items-center justify-between">
        <span className="text-xs text-neutral-400">
          Theme
        </span>
        {/* Working theme toggle (your component) */}
        <ThemeToggle />
      </div>
    </aside>);
};
export default CustomerSidebar;
