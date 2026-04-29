import { Metadata } from "next";
import { MapPin, Mail, Send, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Shikkhapath",
  description: "Get in touch with Shikkhapath. Reach out to us for any queries, news submissions, or support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            যোগাযোগ করুন
          </h1>
          <p className="mt-4 text-slate-500">
            যেকোনো প্রশ্ন, মতামত বা সংবাদের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Contact Info & Map */}
          <div className="flex flex-col gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">যোগাযোগের ঠিকানা</h2>
            </div>

            <div className="space-y-6">
              {/* Office */}
              <div>
                <h3 className="mb-2 font-bold text-slate-900">অফিস:</h3>
                <p className="text-slate-600 leading-relaxed">
                  Empire Talukder Dream<br />
                  22–23 Station Road,<br />
                  Tejgaon, Dhaka–1212
                </p>
              </div>

              {/* Phone */}
              <div>
                <h3 className="mb-2 font-bold text-slate-900">ফোন:</h3>
                <p className="text-slate-600 font-medium">01704-052374</p>
              </div>

              {/* Emails */}
              <div>
                <h3 className="mb-2 font-bold text-slate-900">ইমেইল:</h3>
                <ul className="space-y-1 text-slate-600">
                  <li><a href="mailto:admin@shikkhapath.com" className="hover:text-amber-600">admin@shikkhapath.com</a></li>
                  <li><a href="mailto:support@shikkhapath.com" className="hover:text-amber-600">support@shikkhapath.com</a></li>
                  <li><a href="mailto:contact@shikkhapath.com" className="hover:text-amber-600">contact@shikkhapath.com</a></li>
                  <li><a href="mailto:editor@shikkhapath.com" className="hover:text-amber-600">editor@shikkhapath.com</a></li>
                  <li><a href="mailto:news@shikkhapath.com" className="hover:text-amber-600">news@shikkhapath.com</a></li>
                </ul>
              </div>
            </div>

            {/* Map */}
            <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.849176510344!2d90.3939005!3d23.7578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b98082d6aa9f%3A0xa86930b2baa338cf!2sEmpire%20Talukdar%20Dreams!5e0!3m2!1sen!2sbd!4v1714421160350!5m2!1sen!2sbd" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Shikkhapath Office Location"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex flex-col gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">বার্তা পাঠান</h2>
            </div>

            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">আপনার নাম</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">ইমেইল</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="example@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-slate-700">বিষয়</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="বার্তার বিষয়"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700">বার্তা</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="আপনার বার্তা এখানে লিখুন..."
                ></textarea>
              </div>

              <button 
                type="button" 
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c79a1d] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#b38716] active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                বার্তা পাঠান
              </button>
            </form>

            <div className="mt-auto border-t border-slate-100 pt-6">
              <p className="mb-4 text-center text-sm font-semibold text-slate-500">আমাদের সাথে যুক্ত থাকুন</p>
              <div className="flex justify-center gap-4">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-[#1877F2] hover:text-white">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-[#E4405F] hover:text-white">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-[#1DA1F2] hover:text-white">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-[#0A66C2] hover:text-white">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
