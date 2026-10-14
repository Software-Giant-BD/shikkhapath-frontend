"use client";

import { useState, useEffect } from "react";
import {
  Rss,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  Globe,
  Radio,
  FileCode2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";

export function SyndicationGuideCard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("google-news");
  const [siteOrigin, setSiteOrigin] = useState("https://shikkhapath.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteOrigin(window.location.origin);
    }
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("লিঙ্কটি কপি করা হয়েছে!");
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const feeds = [
    {
      key: "rss-main",
      label: "মূল আরএসএস ফিড (Main RSS Feed)",
      url: `${siteOrigin}/rss.xml`,
      badge: "RSS 2.0",
      description: "সর্বশেষ ৫০টি প্রকাশিত সংবাদের লাইভ ফিড (Google News, Feedly, Social Bots)",
    },
    {
      key: "news-sitemap",
      label: "গুগল নিউজ সাইটম্যাপ (Google News Sitemap)",
      url: `${siteOrigin}/news_sitemap.xml`,
      badge: "XML News",
      description: "গুগল নিউজের জন্য গত ৪৮ ঘণ্টার সংবাদ সাইটম্যাপ (Search Console-এর জন্য)",
    },
    {
      key: "master-sitemap",
      label: "মাস্টার সাইটম্যাপ (Master Sitemap Index)",
      url: `${siteOrigin}/sitemap.xml`,
      badge: "Sitemap Index",
      description: "পুরো ওয়েবসাইটের সমস্ত ক্যাটাগরি, টপিক ও খবরের সম্পূর্ণ সাইটম্যাপ",
    },
  ];

  return (
    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-200/50">
            <Rss className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              RSS Feed ও কন্টেন্ট সিন্ডিকেশন গাইড
            </CardTitle>
            <CardDescription>
              গুগল নিউজ, ফেসবুক অটো-পোস্টিং ও বিভিন্ন ফিড রিডারে সংবাদ প্রচারের লাইভ লিংক ও নির্দেশিকা।
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {/* Live Feeds List */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            আপনার ওয়েবসাইটের সক্রিয় ফিড ও সাইটম্যাপ লিঙ্কসমূহ:
          </p>

          <div className="space-y-2.5">
            {feeds.map((feed) => (
              <div
                key={feed.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-all"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {feed.label}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {feed.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono select-all truncate">
                    <Radio className="h-3.5 w-3.5 text-emerald-500 shrink-0 animate-pulse" />
                    <span className="truncate">{feed.url}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{feed.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium gap-1.5 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    onClick={() => copyToClipboard(feed.url, feed.key)}
                  >
                    {copiedKey === feed.key ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>কপি লিংক</span>
                      </>
                    )}
                  </Button>
                  <a
                    href={feed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    title="নতুন ট্যাবে প্রিভিউ দেখুন"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            💡 <strong>ক্যাটাগরি ভিত্তিক ফিড:</strong> নির্দিষ্ট ক্যাটাগরির জন্য{" "}
            <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono">
              {siteOrigin}/rss/[category_slug].xml
            </code>{" "}
            ব্যবহার করতে পারেন (যেমন: <code>/rss/national.xml</code> বা <code>/rss/education-medium.xml</code>)।
          </p>
        </div>

        {/* Step-by-Step Practical Guides */}
        <div className="border-t pt-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            কীভাবে ও কেন ব্যবহার করবেন (ধাপে ধাপে নির্দেশিকা):
          </p>

          <div className="space-y-2">
            {/* Guide 1: Google News */}
            <div className="border rounded-lg overflow-hidden border-slate-200/80 bg-white">
              <button
                type="button"
                onClick={() => toggleSection("google-news")}
                className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-sm text-slate-800 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-600 text-xs font-bold">
                    ১
                  </span>
                  <span>Google Publisher Center (গুগল নিউজ অ্যাপে সাইট যুক্ত করা)</span>
                </div>
                {openSection === "google-news" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {openSection === "google-news" && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-600 space-y-2.5 leading-relaxed">
                  <div className="p-2.5 rounded bg-blue-50/70 border border-blue-100 text-blue-900">
                    <strong>কেন করবেন?</strong> গুগল নিউজ অ্যাপে কোটি কোটি পাঠকদের কাছে আপনার পোর্টাল রিকমেন্ডেশনে পৌঁছাবে এবং সংবাদ প্রকাশের সাথে সাথেই ইনডেক্স হবে।
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>
                      প্রথমে{" "}
                      <a
                        href="https://publishercenter.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5"
                      >
                        Google Publisher Center <ExternalLink className="h-3 w-3" />
                      </a>
                      -এ যান এবং আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।
                    </li>
                    <li>
                      <strong>Add Publication</strong>-এ ক্লিক করে আপনার পোর্টালের নাম (Shikkhapath) ও লিংক দিন।
                    </li>
                    <li>
                      <strong>Content Settings</strong> ট্যাবে গিয়ে <strong>New Section &gt; Feed</strong> নির্বাচন করুন।
                    </li>
                    <li>
                      সেকশন নাম দিন (যেমন: <em>সর্বশেষ খবর</em>) এবং Feed URL বক্সে উপরের কপি করা লিঙ্কটি (<code>{siteOrigin}/rss.xml</code>) পেস্ট করুন।
                    </li>
                    <li>
                      নিচে <strong>Save</strong> বাটনে ক্লিক করে সাবমিট করুন। গুগল সাধারণত কয়েক দিনের মধ্যে সাইটটি অনুমোদন দিয়ে গুগল নিউজে লাইভ করে দেবে।
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Guide 2: Social Auto-Post */}
            <div className="border rounded-lg overflow-hidden border-slate-200/80 bg-white">
              <button
                type="button"
                onClick={() => toggleSection("social-auto")}
                className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-sm text-slate-800 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                    ২
                  </span>
                  <span>সোশ্যাল মিডিয়ায় স্বয়ংক্রিয় পোস্ট (Facebook / Telegram Auto-Poster)</span>
                </div>
                {openSection === "social-auto" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {openSection === "social-auto" && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-600 space-y-2.5 leading-relaxed">
                  <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                    <strong>কেন করবেন?</strong> পোর্টালে নতুন সংবাদ পাবলিশ হওয়ার কয়েক মিনিটের মধ্যেই তা নিজে থেকেই ফেসবুক পেজে বা টেলিগ্রাম চ্যানেলে ছবি ও লিঙ্কসহ পোস্ট হয়ে যাবে। কাউকে ম্যানুয়ালি পোস্ট করতে হবে না।
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>
                      <a
                        href="https://zapier.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5"
                      >
                        Zapier <ExternalLink className="h-3 w-3" />
                      </a>
                      ,{" "}
                      <a
                        href="https://ifttt.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5"
                      >
                        IFTTT <ExternalLink className="h-3 w-3" />
                      </a>{" "}
                      বা{" "}
                      <a
                        href="https://publer.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5"
                      >
                        Publer <ExternalLink className="h-3 w-3" />
                      </a>
                      -এ একটি ফ্রি অ্যাকাউন্ট খুলুন।
                    </li>
                    <li>
                      ট্রিগার (Trigger) হিসেবে <strong>RSS Feed (New Item in Feed)</strong> সিলেক্ট করুন।
                    </li>
                    <li>
                      Feed URL বক্সে আপনার <code>{siteOrigin}/rss.xml</code> লিঙ্কটি দিয়ে দিন।
                    </li>
                    <li>
                      অ্যাকশন (Action) হিসেবে আপনার <strong>Facebook Page &gt; Create Post</strong> বা Telegram Channel কানেক্ট করুন।
                    </li>
                    <li>
                      ক্যাপশন হিসেবে <code>Title</code> এবং লিংক হিসেবে <code>Link</code> সিলেক্ট করে সেভ করুন।
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Guide 3: Search Console */}
            <div className="border rounded-lg overflow-hidden border-slate-200/80 bg-white">
              <button
                type="button"
                onClick={() => toggleSection("search-console")}
                className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-sm text-slate-800 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-xs font-bold">
                    ৩
                  </span>
                  <span>Google Search Console (দ্রুত ইনডেক্সিংয়ের জন্য)</span>
                </div>
                {openSection === "search-console" ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {openSection === "search-console" && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-600 space-y-2.5 leading-relaxed">
                  <p>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      Google Search Console <ExternalLink className="h-3 w-3" />
                    </a>
                    -এ লগইন করে <strong>Sitemaps</strong> মেনুতে যান। সেখানে নিচের দুটি সাইটম্যাপ ইনপুট দিয়ে Submit করুন:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-700">
                    <li>sitemap.xml</li>
                    <li>news_sitemap.xml</li>
                  </ul>
                  <p className="text-[11px] text-slate-500">
                    এর ফলে গুগল বট আপনার সংবাদগুলো প্রকাশের কয়েক মিনিটের মধ্যে ক্রল ও ইনডেক্স করতে শুরু করবে।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
