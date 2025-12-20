import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
const UserMenu = ({ userName }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (<div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button onClick={() => setOpen((prev) => !prev)} className="
          flex items-center gap-2 rounded-lg px-3 py-2
          hover:bg-neutral-200 dark:hover:bg-neutral-700
          transition
        ">
        <div className="
          flex h-8 w-8 items-center justify-center
          rounded-full bg-neutral-300 dark:bg-neutral-600
          text-neutral-800 dark:text-neutral-100
        ">
          <FiUser size={16}/>
        </div>

        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {userName}
        </span>
      </button>

      {/* Dropdown */}
      {open && (<div className="
            absolute right-0 mt-2 w-44
            rounded-lg border border-neutral-200 dark:border-neutral-700
            bg-white dark:bg-neutral-800
            shadow-lg
          ">
          <button className="
              flex w-full items-center gap-2
              px-4 py-2 text-sm
              text-neutral-700 dark:text-neutral-300
              hover:bg-neutral-100 dark:hover:bg-neutral-700
            ">
            <FiLogOut size={14}/>
            Logout
          </button>
        </div>)}
    </div>);
};
export default UserMenu;
