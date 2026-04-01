"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";


export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#4a8398] bg-[#386e7f]/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-90"
          >
            <Image
              src="/shikkhapath-logo.png"
              alt="Shikkhapath News Portal"
              width={780}
              height={130}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          {/* Desktop Navigation */}
         

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-100 transition-colors hover:bg-white/10 hover:text-amber-300 focus:outline-none md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-main-menu"
          >
            <span className="sr-only">Toggle main menu</span>
            {isOpen ? (
              <X className="h-7 w-7" aria-hidden="true" />
            ) : (
              <Menu className="h-7 w-7" aria-hidden="true" />
            )}
          </button>
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
            className="relative h-full w-full overflow-y-auto pb-10 shadow-2xl"
            style={{
              background:
                "linear-gradient(to bottom, #214f63, #2b6a80 50%, #1e4f62)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.28) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Menu header with logo and close button */}
            <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
              <Link
                href="/"
                className="inline-flex items-center transition-opacity hover:opacity-90"
              >
                <Image
                  src="/shikkhapath-logo.png"
                  alt="Shikkhapath News Portal"
                  width={780}
                  height={130}
                  className="h-8 w-auto"
                />
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-100 transition-colors hover:bg-white/10 hover:text-amber-300 focus:outline-none"
                aria-label="Close main menu"
              >
                <X className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="relative flex flex-col px-6 pt-8">
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-cyan-100/75">
                Navigation
              </p>

              
            </nav>

            <div className="relative mt-8 border-t border-white/15 mx-6 pt-6">
              <Link
                href="/contact-us"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-200"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
