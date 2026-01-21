"use client";
import { ThemeProvider } from "@/components/providers/theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
}

export default Providers;
