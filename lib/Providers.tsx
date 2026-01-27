"use client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        {children}
        <Toaster/>
      </ThemeProvider>
    </>
  );
}

export default Providers;
