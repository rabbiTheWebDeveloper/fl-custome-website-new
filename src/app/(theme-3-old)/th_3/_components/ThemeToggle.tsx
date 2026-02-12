"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border 
                 bg-white text-gray-800 border-gray-300
                 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-colors duration-200"
      aria-label="Toggle Theme"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
      <span className="text-sm font-medium">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}
