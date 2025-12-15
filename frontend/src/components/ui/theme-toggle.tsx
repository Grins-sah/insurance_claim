import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        relative w-14 h-8 rounded-full
        bg-gray-200 dark:bg-[#1f2937]
        flex items-center
        transition-colors duration-300
        focus:outline-none
      "
    >
      {/* Toggle Circle */}
      <span
        className={`
          absolute left-1 top-1 w-6 h-6 rounded-full
          bg-white dark:bg-[#0f1115]
          shadow-md
          transform transition-transform duration-300
          ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
        `}
      />

      {/* Icons */}
      <span className="absolute left-1.5 text-yellow-500">
        <Sun size={14} />
      </span>

      <span className="absolute right-1.5 text-indigo-400">
        <Moon size={14} />
      </span>
    </button>
  );
};

export default ThemeToggle;
