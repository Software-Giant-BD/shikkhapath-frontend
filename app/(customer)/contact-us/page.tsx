import { MapPin, Phone, Mail, Building2 } from "lucide-react"
import { SiteHeader } from "@/components/customer/common/site-header"
import { SiteFooter } from "@/components/customer/common/footer-sections"
import { ContactForm } from "@/components/customer/contact-us/contact-form"

export const metadata = {
  title: "Contact Us | Shikkhapath",
  description:
    "Get in touch with Shikkhapath. Reach out to our team in New York or New Jersey to discuss your project requirements.",
};


export default function ContactUsPage() {
  return (
    <div className="ase-page flex flex-col">
      <SiteHeader />
      
      <main className="grow pb-24">
        {/* Banner */}
        <div className="ase-hero">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-amber-300"></span>
              REACH US
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s work together
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate-200">
              Partner with Shikkhapath. Reach out to our team in New York or New Jersey to discuss your project requirements.
            </p>
          </div>
        </div>

        {/* Contact Information & Form Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Contact Information Cards with Maps */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="ase-panel p-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">New York Office</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Headquarters</p>
                  </div>
                </div>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  60 Dutch Hill Road, Suite #2A<br />
                  Orangeburg, NY 10962
                </p>
                <div className="mt-4 pt-4 border-t border-slate-50/50 flex flex-col gap-3">
                  <a href="tel:9175466652" className="flex items-center gap-3 text-slate-700 hover:text-[#386e7f] transition-colors group">
                    <Phone className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">+1 917 546 6652</span>
                  </a>
                  <a href="mailto:info@shikkhapath.com" className="flex items-center gap-3 text-slate-700 hover:text-[#386e7f] transition-colors group">
                    <Mail className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="font-medium">info@shikkhapath.com</span>
                  </a>
                </div>
                
                {/* NY Map */}
                <div className="mt-8 rounded-2xl overflow-hidden shadow-inner border border-slate-100 h-48 bg-slate-100/50 relative">
                  <iframe 
                    src="https://maps.google.com/maps?q=60+Dutch+Hill+Road,+Orangeburg,+NY+10962&z=13&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="New York Office Map"
                  />
                </div>
              </div>

              <div className="ase-panel p-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 shadow-inner">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">New Jersey Office</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Regional Branch</p>
                  </div>
                </div>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  120 Sylvan Ave., Ste. #109<br />
                  Englewood Cliffs, NJ 07632
                </p>
                <div className="mt-4 pt-4 border-t border-slate-50/50 flex flex-col gap-3">
                  <a href="tel:9175466652" className="flex items-center gap-3 text-slate-700 hover:text-[#386e7f] transition-colors group">
                    <Phone className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">+1 917 546 6652</span>
                  </a>
                  <a href="mailto:info@shikkhapath.com" className="flex items-center gap-3 text-slate-700 hover:text-[#386e7f] transition-colors group">
                    <Mail className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="font-medium">info@shikkhapath.com</span>
                  </a>
                </div>

                {/* NJ Map */}
                <div className="mt-8 rounded-2xl overflow-hidden shadow-inner border border-slate-100 h-48 bg-slate-100/50 relative">
                  <iframe 
                    src="https://maps.google.com/maps?q=120+Sylvan+Ave,+Englewood+Cliffs,+NJ+07632&z=13&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="New Jersey Office Map"
                  />
                </div>
              </div>
              
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
