import { FinalCtaSection, SiteFooter } from "@/components/customer/common/footer-sections"
import { HeroSection } from "@/components/customer/home/hero-section"
import { SiteHeader } from "@/components/customer/common/site-header"

export default function Home() {
  return (
    <div className="ase-page">
      <SiteHeader />
      <main>
        <HeroSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
