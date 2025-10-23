"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loader />;
  }

  return <ThemeProvider attribute="class" defaultTheme="light">{children}</ThemeProvider>;
}
