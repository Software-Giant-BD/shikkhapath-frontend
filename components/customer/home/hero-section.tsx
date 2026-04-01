import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="ase-hero relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8 lg:pt-32">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-[#163a4f] via-[#163a4f]/50 to-transparent opacity-90"></div>
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
      

        {/* Title */}
        <h1 className="ase-fade-up mt-8 max-w-4xl text-center leading-[1.1] font-bold tracking-tight text-white select-none transition-all [animation-delay:150ms]">
          <span className="block text-lg font-medium tracking-wide text-slate-300 sm:text-xl lg:text-2xl mb-2">
            Welcome to
          </span>
          <span className="block text-4xl sm:text-6xl lg:text-7xl xl:text-8xl">
            American Structural
            <span className="block sm:inline sm:ml-4 bg-linear-to-r from-sky-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent animate-gradient-x">
              Engineering
            </span>
          </span>
        </h1>

        {/* Description */}
        <p className="ase-fade-up mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl lg:text-2xl [animation-delay:300ms]">
          We’re consultants, engineers, problem solvers and trusted advisors,
          improving the quality of life for the communities we serve.
        </p>

        {/* CTAs */}
        <div className="ase-fade-up mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row [animation-delay:450ms]">
          <Link
            href="/services"
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:scale-105 active:scale-95 sm:w-auto"
          >
            <span className="absolute inset-0 bg-linear-to-r from-sky-100 to-white opacity-0 transition-opacity group-hover:opacity-100"></span>
            <span className="relative flex items-center gap-2">
              Explore Our Services
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            href="/portfolios"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/50 active:scale-95 sm:w-auto"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}

