import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import menuData from "./Data.json";
import { cn } from "@/lib/utils";
import logo2 from "../../../assets/logo.svg";
import logo1 from "../../../assets/ettaralogo.jpg";

const MenuItem = ({ item, isActive, Icon }) => (
  <motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  className="relative"
>

    <Link
      to={item.path}
      className={cn(
        "group relative flex items-center gap-4 px-4 py-3 rounded-xl",
        "transition-all duration-300",
        "hover:bg-primary/5",
        "overflow-hidden",
        isActive && "bg-primary/10 text-primary"
      )}
    >
      {/* Simple shine effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "bg-gradient-to-r from-transparent via-primary/10 to-transparent",
          "translate-x-[-100%] group-hover:translate-x-[100%]",
          "transition-transform duration-1000 ease-out"
        )}
      />

      {/* Rotating icon container */}
      <div
        className={cn(
          "relative",
          "p-2 rounded-lg",
          "transition-all duration-500",
          "bg-primary/5",
          "group-hover:rotate-[360deg]",
          "group-hover:scale-110",
          isActive && "bg-primary/10"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "h-5 w-5",
              "transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground",
              "group-hover:text-primary"
            )}
          />
        )}
      </div>

      {/* Text */}
      <span
        className={cn(
          "font-medium text-md text-bold",
          "transition-colors duration-300",
          isActive ? "text-primary" : "text-muted-foreground",
          "group-hover:text-primary"
        )}
      >
        {item.title}
      </span>

      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </Link>
  </motion.div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    // if (!role) {
    //   navigate("/");
    //   return;
    // }
    setUserRole(role);
    setMenuItems(menuData[role] || []);
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("formState");
    navigate("/");
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
       className="sticky h-screen w-64 min-w-64 bg-background/50 backdrop-blur-lg border-r border-primary/10 p-4 flex flex-col overflow-y-auto"
       style={{position: 'sticky'}}
    >
      {/* Logo section with hover effect */}
      <motion.div
        className="flex items-center space-x-2 mb-8 p-2 rounded-lg transition-all duration-300 hover:bg-primary/5"
        whileHover={{ scale: 1.02 }}
        onClick={() => navigate("/")}
      >
        <img src={logo1} alt="logo" className="h-20 w-auto rounded-lg" />
        <h1>X</h1>
        <img src={logo2} alt="logo" className="h-20 w-auto rounded-lg" />
      </motion.div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = Icons[item.icon];
            const isActive = location.pathname === item.path;

            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MenuItem item={item} isActive={isActive} Icon={Icon} />
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="border-t border-primary/10">
        <div className="px-4 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/5">
          <ThemeToggle
          checked={darkMode}
          onClick={() => setDarkMode((prev) => !prev)}
        />
          </div>
          <span className="font-medium text-sm text-muted-foreground">Theme</span>
          <div className="ml-auto">
            
          </div>
        </div>
      </div>

      {/* Logout button with hover effect */}
      <div className="border-t border-primary/10 ml-2 ">
        <button
          onClick={handleLogout}
          className="group relative flex items-center space-x-2 px-4 py-2 w-full rounded-lg text-red-500 overflow-hidden"
        >
          <div className="absolute inset-0 rounded-lg transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-tl from-red-500/10 via-red-500/5 to-transparent animate-gradient-sweep" />
          <div className="relative z-10 p-1 rounded-md transition-all duration-300 group-hover:bg-red-500/10 group-hover:shadow-lg group-hover:shadow-red-500/20">
            <Icons.LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="relative z-10 font-medium transition-transform duration-300 group-hover:translate-x-1">
            Logout
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
