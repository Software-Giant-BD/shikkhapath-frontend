"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe, Menu, Moon, Search, X } from "lucide-react";

const navLinks = [
  { label: "সর্বশেষ", href: "/category/latest" },
  { label: "শিক্ষাঙ্গন", href: "/category/education", hasDropdown: true },
  { label: "উচ্চশিক্ষা", href: "/category/higher-education", hasDropdown: true },
  { label: "শিক্ষা প্রশাসন", href: "/category/administration", hasDropdown: true },
  { label: "ভর্তি পরীক্ষা", href: "/category/admission", hasDropdown: true },
  { label: "কর্মসংস্থান", href: "/category/career", hasDropdown: true },
  { label: "বিনোদন", href: "/category/entertainment" },
  { label: "খেলাধুলা", href: "/category/sports" },
  { label: "অর্থনীতি", href: "/category/economy" },
  { label: "জাতীয়", href: "/category/national", hasDropdown: true },
  { label: "আরও", href: "/category/national", hasDropdown: true },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    // Format: বুধবার, ১০ এপ্রিল ২০২৬
    const formattedDate = date.toLocaleDateString('bn-BD', options).replace(/,/g, '');
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Implement Hysteresis (Buffer) to stop jitter
      if (currentScrollY > 120) {
        setIsCompact(true);
      } else if (currentScrollY < 60) {
        setIsCompact(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-md ring-1 ring-slate-200/5 transition-all">
        {/* Top Branding Row */}
        <div
          className={`hidden overflow-hidden border-b border-[#e0b22f]/20 transition-all duration-300 md:block ${
            isCompact ? "max-h-0 opacity-0 transform -translate-y-2" : "max-h-24 opacity-100 transform translate-y-0"
          }`}
        >
          <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-4 lg:px-6">
            <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-90">
              <Image
                src="/logo.png"
                alt="Shikkhapath"
                width={780}
                height={130}
                priority
                className="h-[56px] w-auto drop-shadow-sm"
              />
            </Link>

            <div className="flex items-center gap-8 text-sm text-slate-700">
              <span className="font-semibold text-slate-500">{currentDate || "লোড হচ্ছে..."}</span>
              <div className="flex items-center gap-4 bg-slate-50 rounded-full px-5 py-2 ring-1 ring-slate-100">
                <button type="button" className="text-slate-600 hover:text-[#b38716] transition-colors" aria-label="Search">
                  <Search className="h-5 w-5" />
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <button type="button" className="text-slate-600 hover:text-[#b38716] transition-colors" aria-label="Toggle theme">
                  <Moon className="h-5 w-5" />
                </button>
                <button type="button" className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-700 hover:text-[#b38716] transition-colors">
                  <Globe className="h-4 w-4" /> Eng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header Row */}
        <div className="border-b border-[#e0b22f]/30 md:hidden bg-white">
          <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-3.5">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-xl bg-slate-50 p-2 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all active:scale-95"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.png" alt="Shikkhapath" width={780} height={130} priority className="h-9 w-auto" />
            </Link>

            <button type="button" className="p-2 text-slate-700"><Search className="h-5 w-5" /></button>
          </div>
        </div>

        {/* Navigation Bar Row */}
        <div className="hidden border-b border-[#e0b22f]/20 bg-white md:block">
          <div className="mx-auto flex w-full max-w-screen-2xl items-center relative px-4 lg:px-6">
            
            {/* Sticky Logo - Absolute Positioned to prevent layout jump */}
            <div className={`absolute left-4 lg:left-6 transition-all duration-300 flex items-center ${isCompact ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5 pointer-events-none"}`}>
              <Link href="/" className="inline-flex shrink-0 items-center">
                <Image src="/logo.png" alt="Logo" width={780} height={130} className="h-8 w-auto" />
              </Link>
            </div>

            {/* Nav Menu */}
            <nav className={`flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto no-scrollbar transition-all duration-300 ${isCompact ? "pl-[140px]" : "pl-0"}`}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative inline-flex shrink-0 items-center gap-1 px-4 py-3.5 text-[16px] font-semibold transition-all duration-300 ${
                      isActive ? "text-[#b38716]" : "text-slate-900 hover:text-[#b38716]"
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#b38716] rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-100 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative h-full w-[85%] max-w-sm bg-white shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between border-b px-5 py-5 bg-white sticky top-0">
              <Link href="/" onClick={() => setIsOpen(false)}><Image src="/logo.png" alt="Logo" width={780} height={130} className="h-9 w-auto" /></Link>
              <button onClick={() => setIsOpen(false)} className="rounded-full bg-slate-100 p-2"><X className="h-6 w-6" /></button>
            </div>
            <nav className="p-6 space-y-2">
              <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation Menu</p>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center justify-between rounded-xl px-5 py-4 text-[17px] font-semibold transition-all ${pathname === link.href ? "bg-[#fff6dd] text-[#b38716]" : "hover:bg-slate-50"}`}>
                  <span>{link.label}</span>
                  {link.hasDropdown && <ChevronDown className="h-4 w-4 opacity-30" />}
                </Link>
              ))}
            </nav>
            <div className="px-6 mt-10">
              <Link href="/contact-us" onClick={() => setIsOpen(false)} className="flex items-center justify-center rounded-2xl bg-[#c79a1d] py-4.5 text-white font-bold shadow-lg shadow-[#c79a1d]/20 transition-all hover:bg-[#b38716]">যোগাযোগ করুন</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
