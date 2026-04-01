import { ArrowRight } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function FinalCtaSection() {
  return (
    <section id="careers" className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <CtaCard
            title="Become a Client"
            description="We are committed to maintain highest standard of quality work. Tell us about your project. We can build the project together."
            actionLabel="Contact Us"
            href="#contact"
          />
          <CtaCard
            title="Join Our Team"
            description="Work with passionate people who are experts in their field. We love what we do and how we serve the community."
            actionLabel="Join the Team"
            href="#contact"
          />
        </div>
      </div>
    </section>
  )
}

function CtaCard({
  title,
  description,
  actionLabel,
  href,
}: {
  title: string
  description: string
  actionLabel: string
  href: string
}) {
  return (
    <article className="ase-panel p-6 sm:p-7">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-slate-700">{description}</p>
      <a
        href={href}
        className="mt-5 inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#1f556a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#174a5d]"
      >
        {actionLabel}
        <ArrowRight className="size-4" />
      </a>
    </article>
  )
}

export function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#163a4f] py-12 text-slate-200">
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-size-[26px_26px]" />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">American Structural Engineering</p>
            <p className="text-sm text-slate-300">Consulting, inspection, and infrastructure delivery support.</p>
          </div>
          <Link
            href="/contact-us"
            className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#163a4f] transition-all hover:bg-slate-100 shadow-lg hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
        </div>
        <Separator className="my-6 bg-white/15" />
        <p className="text-sm text-slate-400">© 2026 ASE. Reimagined with a modern, accessible front-end architecture.</p>
      </div>
    </footer>
  )
}
