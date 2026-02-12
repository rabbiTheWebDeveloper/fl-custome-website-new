"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class"  defaultTheme="light"   // ✅ Default is light
      enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
