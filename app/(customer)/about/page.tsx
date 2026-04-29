import { Metadata } from "next"
import { 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  BookOpen, 
  HeartHandshake, 
  Users, 
  Rocket,
  CheckCircle2
} from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Shikkhapath",
  description: "Learn more about Shikkhapath - a modern, reliable, and information-driven digital news platform focused on education, admissions, jobs, and important national updates.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-12">
      {/* Header Section */}
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            About <span className="text-[#c79a1d]">Shikkhapath</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Shikkhapath is a modern, reliable, and information-driven digital news platform focused on education, admissions, jobs, and important national updates.
          </p>
          <p className="mt-4 text-slate-600">
            Our goal goes beyond just publishing news—we aim to build a comprehensive information platform that directly supports the everyday needs of our readers. In today's fast-paced digital era, delivering accurate information quickly is a major challenge. Shikkhapath embraces this challenge with a commitment to providing reliable, objective, and timely news.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mx-auto mt-16 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Mission */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Our Mission</h2>
            <ul className="space-y-4">
              {[
                "Provide accurate and up-to-date information on education, admissions, and jobs",
                "Build a trusted platform for students and job seekers",
                "Deliver important national news in a simple and accessible way",
                "Contribute to building an informed and capable generation through information",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 text-slate-600">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className="rounded-3xl bg-slate-900 p-8 shadow-lg">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-400">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white">Our Vision</h2>
            <div className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-lg font-medium italic text-slate-300">
                "Accurate information leads to better decisions."
              </p>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Shikkhapath aims to be a platform where information is accessible, reliable, and useful for everyone. Students, parents, and general readers can find all essential information in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="mx-auto mt-16 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Our Values & Principles</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Accuracy & Integrity",
              desc: "We verify information carefully before publishing to ensure authenticity.",
              icon: ShieldCheck,
            },
            {
              title: "Neutrality",
              desc: "We do not support any পক্ষ—we stand for truth and facts.",
              icon: BookOpen,
            },
            {
              title: "Speed with Responsibility",
              desc: "We deliver news quickly without compromising quality.",
              icon: Rocket,
            },
            {
              title: "Reader-Centric Approach",
              desc: "All our content is created based on the needs and interests of our audience.",
              icon: Users,
            },
          ].map((value, idx) => (
            <div key={idx} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 text-center transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-700">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-bold text-slate-900">{value.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Services & Unique Features */}
      <section className="mx-auto mt-20 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-900">Our Content Services</h2>
            <p className="mb-8 text-slate-600">At Shikkhapath, you will regularly find:</p>
            <div className="space-y-4">
              {[
                "Latest education news",
                "Admission and result updates",
                "Job and career information",
                "Important national and breaking news",
                "Informative articles and guidelines"
              ].map((service, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <span className="font-bold">{idx + 1}</span>
                  </div>
                  <span className="font-medium text-slate-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-900">Unique Features & Services</h2>
            <p className="mb-8 text-slate-600">What makes Shikkhapath different is our practical and user-focused features:</p>
            
            <div className="space-y-6">
              <div className="rounded-3xl bg-red-50 p-6 ring-1 ring-red-100">
                <h3 className="mb-3 font-bold text-red-900">🚨 Emergency Service Directory</h3>
                <p className="mb-4 text-sm text-red-700">In urgent situations, users can easily access contact numbers for:</p>
                <div className="flex flex-wrap gap-2">
                  {["Police Stations", "Fire Service", "Doctors & Medical", "Blood Donors", "Ambulances"].map((tag, idx) => (
                    <span key={idx} className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="rounded-3xl bg-blue-50 p-6 ring-1 ring-blue-100">
                <h3 className="mb-3 font-bold text-blue-900">🎓 Education & Admission Support</h3>
                <ul className="list-inside list-disc text-sm text-blue-800 space-y-1">
                  <li>Admission eligibility checker</li>
                  <li>University admission exam schedules</li>
                  <li>Important admission guidelines and updates</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-emerald-50 p-6 ring-1 ring-emerald-100">
                <h3 className="mb-3 font-bold text-emerald-900">🧮 Smart Tools & Resources</h3>
                <ul className="list-inside list-disc text-sm text-emerald-800 space-y-1">
                  <li>GPA Calculator</li>
                  <li>Helpful guides and informative articles</li>
                  <li>Supportive content for students and job seekers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment & Readers */}
      <section className="mx-auto mt-20 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#c79a1d] p-8 text-white sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-3xl font-bold">Our Commitment</h2>
              <ul className="space-y-4">
                {[
                  "Providing reliable and rumor-free information",
                  "Maintaining the highest standards of journalistic ethics",
                  "Earning and retaining the trust of our readers",
                  "Establishing ourselves as a responsible and credible news platform"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-white/90">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-3xl font-bold">Our Readers</h2>
              <p className="mb-4 text-lg font-medium text-white">Our readers are our greatest strength.</p>
              <p className="text-white/90 leading-relaxed">
                Shikkhapath is built for students, parents, job seekers, and conscious citizens. Your trust, feedback, and engagement inspire us to move forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="mx-auto mt-16 max-w-screen-xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">🚀 Our Future Goals</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            We are continuously working to expand and improve Shikkhapath. By integrating new technologies, modern presentation styles, and more effective features, our goal is to become a complete digital information platform.
          </p>
        </div>
      </section>
    </main>
  )
}
