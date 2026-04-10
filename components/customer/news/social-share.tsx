import { Facebook, Twitter, Link2, MessageCircle, Send } from "lucide-react";

export function SocialShare() {
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
          className={`${btn.color} flex h-8 w-8 items-center justify-center rounded text-white transition-opacity hover:opacity-90`}
          title={`Share on ${btn.name}`}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
