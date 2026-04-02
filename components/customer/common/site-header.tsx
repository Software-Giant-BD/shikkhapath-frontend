"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe, Menu, Moon, Search, X } from "lucide-react";

const navLinks = [
  { label: "সর্বশেষ", href: "/news?category=latest" },
  { label: "শিক্ষাঙ্গন", href: "/news?category=education", hasDropdown: true },
  { label: "উচ্চশিক্ষা", href: "/news?category=higher-education", hasDropdown: true },
  { label: "শিক্ষা প্রশাসন", href: "/news?category=administration", hasDropdown: true },
  { label: "ভর্তি পরীক্ষা", href: "/news?category=admission", hasDropdown: true },
  { label: "কর্মসংস্থান", href: "/news?category=career", hasDropdown: true },
  { label: "খেলাধুলা", href: "/news?category=sports" },
  { label: "অর্থনীতি", href: "/news?category=economy" },
  { label: "জাতীয়", href: "/news?category=national", hasDropdown: true },
  { label: "আরও", href: "/news", hasDropdown: true },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompactDesktopHeader, setIsCompactDesktopHeader] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    const onScroll = () => {
      setIsCompactDesktopHeader(window.scrollY > 72);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <div
          className={`hidden border-[#e0b22f] transition-all duration-200 md:block ${
            isCompactDesktopHeader ? "max-h-0 overflow-hidden border-b-0 opacity-0" : "max-h-28 border-b opacity-100"
          }`}
        >
          <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-3 py-2.5 sm:px-4 lg:px-5">
            <Link
              href="/"
              className="inline-flex items-center transition-opacity hover:opacity-90"
            >
              <Image
                src="/logo.png"
                alt="Shikkhapath News Portal"
                width={780}
                height={130}
                priority
                className="h-10 w-auto"
              />
            </Link>

            <div className="flex items-center gap-5 text-sm text-slate-700">
              <p>বুধবার, ১ এপ্রিল ২০২৬</p>
              <button
                type="button"
                className="inline-flex items-center justify-center text-slate-700 transition-colors hover:text-[#b38716]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center text-slate-700 transition-colors hover:text-[#b38716]"
                aria-label="Toggle theme"
              >
                <Moon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#d5a726] hover:text-[#b38716]"
              >
                <Globe className="h-4 w-4" /> Eng
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-[#e0b22f] md:hidden">
          <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-3 py-4 sm:px-4 lg:px-5">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#b38716] focus:outline-none md:hidden"
              aria-expanded={isOpen}
              aria-controls="mobile-main-menu"
            >
              <span className="sr-only">Toggle main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            <Link
              href="/"
              className="inline-flex items-center transition-opacity hover:opacity-90"
            >
              <Image
                src="/logo.png"
                alt="Shikkhapath News Portal"
                width={780}
                height={130}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>
        </div>

        <div className="hidden border-b border-[#e0b22f] md:block">
          <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-4 px-3 py-3 sm:px-4 lg:px-5">
            {isCompactDesktopHeader ? (
              <Link
                href="/"
                className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
              >
                <Image
                  src="/logo.png"
                  alt="Shikkhapath News Portal"
                  width={780}
                  height={130}
                  className="h-8 w-auto"
                />
              </Link>
            ) : null}

            <nav className="flex min-w-0 flex-1 items-center justify-between gap-1 overflow-x-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex shrink-0 items-center gap-1 px-2 py-1 text-[22px] leading-none font-semibold transition-colors ${
                      isActive ? "text-[#b38716]" : "text-slate-900 hover:text-[#b38716]"
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown ? <ChevronDown className="h-4 w-4" /> : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation — rendered outside <header> to escape its stacking context */}
      {isOpen && (
        <div
          id="mobile-main-menu"
          className="fixed inset-0 z-9999 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="relative h-full w-full overflow-y-auto bg-white pb-10 shadow-2xl"
          >
            {/* Menu header with logo and close button */}
            <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between border-b border-[#e0b22f] px-4 py-3 sm:px-6">
              <Link
                href="/"
                className="inline-flex items-center transition-opacity hover:opacity-90"
              >
                <Image
                  src="/logo.png"
                  alt="Shikkhapath News Portal"
                  width={780}
                  height={130}
                  className="h-9 w-auto"
                />
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#b38716] focus:outline-none"
                aria-label="Close main menu"
              >
                <X className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="relative flex flex-col px-6 pt-8">
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-500">
                Navigation
              </p>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive
                        ? "bg-[#fff6dd] text-[#b38716]"
                        : "text-slate-900 hover:bg-slate-50 hover:text-[#b38716]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {link.label}
                      {link.hasDropdown ? <ChevronDown className="h-4 w-4" /> : null}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="relative mx-6 mt-8 border-t border-slate-200 pt-6">
              <Link
                href="/contact-us"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center rounded-full bg-[#c79a1d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b38716]"
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
