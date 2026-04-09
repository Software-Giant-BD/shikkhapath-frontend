import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, User, MessageCircle } from "lucide-react";
import { SocialShare } from "./social-share";

const mockNews = {
  title: "ঢাকা লিগে এবারও থাকছে না বিদেশি ক্রিকেটার, নজড় থাকবে দেশি প্রতিভার দিকে",
  category: "ক্রিকেট",
  author: "ডিজিটাল ডেস্ক",
  publishedAt: "১০ এপ্রিল ২০২৬, ১১:৩০ PM",
  featuredImage: "https://picsum.photos/seed/n1/1200/800",
  imageCaption: "সিসিবিসি কাপে ঢাকা প্রিমিয়ার লিগের প্রস্তুতি ম্যাচ চলাকালীন একটি মুহূর্ত।",
  content: `
    <p>জাতীয় দলের বাইরে থাকা ক্রিকেটারদের জন্য বছরের অন্যতম বড় উৎসব ঢাকা প্রিমিয়ার লিগ (ডিপিএল)। তবে গত বছরগুলোর ধারাবাহিকতায় এবারও লিগে কোনো বিদেশি ক্রিকেটার থাকছেন না বলে নীতিগত সিদ্ধান্ত নিয়েছে বিসিবি। ক্লাবগুলোর সঙ্গে আলোচনা সাপেক্ষে এই সিদ্ধান্ত নেওয়া হয়েছে বলে জানা গেছে।</p>
    
    <p>গত বৃহস্পতিবার মিরপুরে সিসিডিএম-এর সভায় অধিকাংশ ক্লাব প্রতিনিধি এই প্রস্তাবে সায় দিয়েছেন। মূলত ডলার সংকট ও দেশি ক্রিকেটারদের আরও বেশি সুযোগ তৈরির জন্য এই পদক্ষেপ নেওয়া হয়েছে। এর আগে ডিপিএলে জিম্বাবুয়ে, শ্রীলঙ্কা ও ভারতীয় ক্রিকেটারদের নিয়মিত দেখা মিলত।</p>
    
    <div class="ad-placeholder py-8">
       <div class="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center shadow-inner">
          <p class="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Advertisement</p>
          <div class="bg-slate-200 h-24 rounded-lg animate-pulse mb-2"></div>
          <p class="text-xs font-bold text-slate-500">আপনার বিজ্ঞাপন এখানে দিন</p>
       </div>
    </div>

    <p>বিসিবি সূত্রে জানা গেছে, আগামী মাস থেকেই লিগ মাঠে গড়াবে। দলবদল সম্পন্ন করতে ক্লাবগুলোকে নির্দেশ দেওয়া হয়েছে। তবে এবারের আসরে সুপার লিগ থাকবে কি না, তা নিয়ে এখনো চূড়ান্ত আলোচনা হয়নি। সিলেট ও ঢাকায় ডিপিএলের নিয়মিত ভেন্যুগুলোতে খেলা আয়োজনের পরিকল্পনা করা হচ্ছে।</p>
    
    <p>দেশি ক্রিকেটারদের পারিশ্রমিক ও অন্যান্য সুযোগ-সুবিধা নিয়ে ক্রিকেটার্স ওয়েলফেয়ার অ্যাসোসিয়েশন (কোয়াব) কিছু প্রস্তাবনা দিয়েছে যা বোর্ড গুরুত্বের সাথে বিবেচনা করছে। এবারের লিগে নজড় থাকবে অনুর্ধ্ব-১৯ থেকে উঠে আসা বেশ কয়েকজন তরুণ প্রতিভার দিকে যারা ঘরোয়া ক্রিকেটে নিজেদের প্রমাণ করতে মুখিয়ে আছেন।</p>
  `,
  relatedLinks: [
    "প্রিমিয়ার লিগ মাঠে থাকতে আইসিসি'র অনুমোদন",
    "স্কুল ক্রিকেটকে খুব বড় করে দেখা উচিত: পাপন",
    "মাঠে গড়াচ্ছে স্কুল ক্রিকেটের আসর",
    "নিউজিল্যান্ড সিরিজের সময়সূচিতে পরিবর্তন",
  ],
};

export function NewsArticleContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Ad */}
      <div className="w-full overflow-hidden rounded-xl border border-slate-100 shadow-sm">
        <div className="relative h-24 w-full bg-slate-50 flex items-center justify-center p-2">
           <Image
             src="https://picsum.photos/seed/topad/1200/200"
             alt="Top Ad"
             fill
             className="object-cover opacity-80"
           />
           <span className="absolute top-2 right-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Sponsored Banner</span>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
        <Link href="/" className="hover:text-slate-900 transition-colors">হোম</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/news/cricket" className="text-[#b38716] hover:text-[#b38716]/80 transition-colors">{mockNews.category}</Link>
      </nav>

      {/* Main Headline */}
      <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-3xl lg:text-4xl">
        {mockNews.title}
      </h1>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4">
        <div className="flex flex-wrap items-center gap-4 text-[13px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full ring-1 ring-slate-100">
            <User className="h-4 w-4 text-[#b38716]" />
            <span>{mockNews.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>{mockNews.publishedAt}</span>
          </div>
        </div>
        <SocialShare />
      </div>

      {/* Featured Image */}
      <figure className="group flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
          <Image
            src={mockNews.featuredImage}
            alt={mockNews.title}
            width={1200}
            height={800}
            className="aspect-video w-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
          />
        </div>
        <figcaption className="flex items-center gap-2 px-1 text-sm font-medium text-slate-500 leading-relaxed border-l-4 border-[#c79a1d] pl-4">
          <MessageCircle className="h-4 w-4 shrink-0" />
          {mockNews.imageCaption}
        </figcaption>
      </figure>

      {/* Article Content */}
      <div 
        className="prose prose-slate max-w-none prose-p:text-[17px] prose-p:leading-relaxed prose-p:text-slate-700 prose-strong:text-slate-900"
        dangerouslySetInnerHTML={{ __html: mockNews.content }}
      />

      {/* Related Section */}
      <div className="mt-8 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
        <h3 className="mb-4 text-xl font-black text-slate-900 underline decoration-[#c79a1d] decoration-4 underline-offset-8">
          {mockNews.category} এর আরও খবর
        </h3>
        <ul className="grid gap-3">
          {mockNews.relatedLinks.map((link, i) => (
            <li key={i} className="group flex items-center gap-3">
              <ChevronRight className="h-4 w-4 shrink-0 text-[#b38716] group-hover:translate-x-1 transition-transform" />
              <Link href="/news" className="text-[15px] font-bold text-slate-700 group-hover:text-[#b38716] transition-colors line-clamp-1">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
