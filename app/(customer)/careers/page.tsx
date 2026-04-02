import { SiteHeader } from "@/components/customer/common/site-header"
import { SiteFooter } from "@/components/customer/common/footer-sections"
import { CareerApplicationForm } from "@/components/customer/careers/career-application-form"
import { 
  HeartHandshake, 
  GraduationCap, 
  PlaneTakeoff, 
  PiggyBank, 
  TrendingUp
} from "lucide-react"

export const metadata = {
  title: "Careers | Shikkhapath",
  description:
    "Explore career opportunities at Shikkhapath, highlighting our commitment to employee growth, benefits, and a supportive work environment.",
};


const benefits = [
  { icon: HeartHandshake, title: "Health & Wellness", desc: "Group Health, Dental and Vision Coverage, plus Employee Assistance Program." },
  { icon: PlaneTakeoff, title: "Paid Time Off", desc: "Paid Holidays and Vacation including generous Sick Days allocation." },
  { icon: GraduationCap, title: "Professional Growth", desc: "Professional Development Assistance and Annual Evaluation with Raise." },
  { icon: PiggyBank, title: "Financial Security", desc: "Competitive 401K Match and Paid Bonus at the end of the Year." },
  { icon: TrendingUp, title: "Project Support", desc: "Paid Project Expenses including Paid Traveling, Hotel, and Meals." }
]
export default function CareersPage() {
  return (
    <div className="ase-page flex flex-col">
      <SiteHeader />
      
      <main className="grow pb-24">
        {/* Banner Section */}
        <div className="ase-hero">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-sky-400"></span>
              JOIN OUR TEAM
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Careers at Shikkhapath
            </h1>
            <p className="mt-8 max-w-3xl mx-auto text-lg leading-8 text-slate-200">
              Outstanding Company. Cool Projects. Great People. <br/>
              We invite you to join the Shikkhapath family and grow with us while implementing sustainable solutions for public and private sector clients.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Why Choose Shikkhapath?</h2>
            <p className="text-lg text-slate-600">
              We offer excellent compensation packages and performance-based career advancement opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="ase-panel p-8 transition-transform group hover:-translate-y-1">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1f0f5] text-[#255f76] transition-all group-hover:scale-110 group-hover:bg-[#cce6f0]">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

     
        {/* Apply Now Form Section */}
        <div id="apply" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="ase-panel relative overflow-hidden p-8 md:p-12">
            <div className="absolute top-0 right-0 w-full h-2 bg-linear-to-r from-[#386e7f] to-sky-400"></div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Submit Your Application</h2>
              <p className="text-slate-600">
                Shikkhapath is committed to providing equal opportunities to all employees and applicants. Fill out the form below to apply.
              </p>
            </div>

            <CareerApplicationForm />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
