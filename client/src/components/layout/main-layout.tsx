import { SiteHeader } from "./site-header";
import { Sidebar } from "./sidebar";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

// Placeholder Footer component - needs further implementation to meet user story requirements
const Footer = () => (
  <footer className="py-6 md:py-0 border-t">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
      <p className="text-sm text-muted-foreground text-center md:text-left">
        &copy; {new Date().getFullYear()} UniMart. All rights reserved.
      </p>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Cookies</a>
        <a href="#" className="hover:underline">Contact</a>
      </div>
    </div>
  </footer>
);


export function MainLayout({ children, showSidebar = false }: MainLayoutProps) {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(location === "/");
  }, [location]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex flex-1">
        {showSidebar && !isMobile && (
          <Sidebar className="w-64 hidden md:block" />
        )}

        <main className={`flex-1 ${isHome ? "" : "py-6 md:py-8 lg:py-10"}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}