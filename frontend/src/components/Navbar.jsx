import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ui/theme-toggle";
const Navbar = () => {
    const navigate = useNavigate();
    return (<nav className="w-full fixed top-0 z-50
      bg-[#f9fafb] dark:bg-[#0f1115]
      border-b border-black/5 dark:border-white/10
      backdrop-blur">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          SmartClaim
        </h1>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/signin")} className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
            Login
          </button>

          <button onClick={() => navigate("/signup")} className="bg-indigo-600 hover:bg-indigo-500 transition
            text-white px-4 py-2 rounded-lg text-sm">
            Register
          </button>

          {/* ✅ MAGIC UI TOGGLE — FIXED */}
           <ThemeToggle />
          
        </div>

      </div>
    </nav>);
};
export default Navbar;
