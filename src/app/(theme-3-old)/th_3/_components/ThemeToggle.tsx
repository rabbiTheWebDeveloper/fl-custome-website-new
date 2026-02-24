"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Use a timeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-1 h-7 px-2 rounded-full border bg-white text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Moon size={14} className="shrink-0" />
      ) : (
        <Sun size={14} className="shrink-0" />
      )}
      <span className="text-[10px] font-semibold">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  )
}
