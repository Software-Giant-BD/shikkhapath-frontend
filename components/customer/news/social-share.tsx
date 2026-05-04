"use client";

import { Facebook, Twitter, Link2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

export function SocialShare() {
  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = typeof document !== "undefined" ? document.title : "";

    let shareUrl = "";

    switch (platform) {
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "WhatsApp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`;
        break;
      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "Twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "Copy":
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(url);
          toast.success("লিঙ্ক কপি করা হয়েছে!");
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const shareButtons = [
    { icon: <Facebook className="h-4 w-4 fill-current" />, color: "bg-[#1877F2]", name: "Facebook" },
    { icon: <MessageCircle className="h-4 w-4 fill-current" />, color: "bg-[#25D366]", name: "WhatsApp" },
    { icon: <Send className="h-4 w-4 fill-current" />, color: "bg-[#0088CC]", name: "Telegram" },
    { icon: <Twitter className="h-4 w-4 fill-current" />, color: "bg-[#1DA1F2]", name: "Twitter" },
    { icon: <Link2 className="h-4 w-4" />, color: "bg-slate-500", name: "Copy" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shareButtons.map((btn, i) => (
        <button
          key={i}
          onClick={() => handleShare(btn.name)}
          className={`${btn.color} flex h-8 w-8 items-center justify-center rounded text-white transition-all hover:opacity-90 hover:scale-110 active:scale-95 cursor-pointer`}
          title={`Share on ${btn.name}`}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
