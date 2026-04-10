import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
}

const listStories = [
  {
    image: "https://picsum.photos/seed/cs4/400/300",
    title: "কন্যা সন্তানের বাবা হলেন মুস্তাফিজুর রহমান",
    excerpt: "আইপিএল খেলতে ভারতে যাওয়ার কথা ছিল ফিজের। কিন্তু পারিবারিক কারণে তিনি ছুটি নিয়েছেন...",
    time: "০৯ এপ্রিল ২০২৬",
  },
  {
    image: "https://picsum.photos/seed/cs5/400/300",
    title: "মেট্রোরেলে ঈদ যাত্রার প্রথম দিনেই উপচে পড়া ভিড়",
    excerpt: "পরিবার নিয়ে স্বস্তিতে বাড়ি যেতে মানুষ মেট্রোরেলের অপেক্ষায় দাঁড়িয়ে আছেন।",
    time: "০৮ এপ্রিল ২০২৬",
  },
  {
    image: "https://picsum.photos/seed/cs6/400/300",
    title: "মিথিলা ‘পাবলিক’ থেকে আন্তর্জাতিক মঞ্চে: জাতীয় পুরস্কার পাওয়ার লক্ষ্য",
    excerpt: "দক্ষিণ আফ্রিকায় আগামী ২০ জুন মুক্তি পাবে নতুন সিনেমা। সেখানে একটি বিশেষ চরিত্রে দেখা যাবে তাকে।",
    time: "০৮ এপ্রিল ২০২৬",
  },
  {
    image: "https://picsum.photos/seed/cs7/400/300",
    title: "মুক্তিযুদ্ধের সিনেমা ‘অপারেশন জ্যাকপট’ এর গানে কণ্ঠ দিল অরিজিৎ",
    excerpt: "মহান মুক্তিযুদ্ধের ঐতিহাসিক অভিযান অপারেশন জ্যাকপট নিয়ে নির্মিত সিনেমায় গান গাইলেন অরিজিৎ সিং।",
    time: "০৭ এপ্রিল ২০২৬",
  },
];

export function CategoryListGrid({ title }: Props) {
  return (
    <div className="flex flex-col gap-6 mt-12 mb-8">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5 pt-1">
          <h3 className="text-xl font-black tracking-tight text-slate-900">{title}</h3>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listStories.map((story, i) => (
          <article key={i} className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-[#e3f2fd] p-4 transition-all hover:shadow-lg">
             <Link href="/news/sample-slug" className="flex flex-col h-full gap-4">
               <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm">
                  <Image fill src={story.image} alt="" className="object-cover transition-transform duration-500 group-hover:scale-105" />
               </div>
               <div className="flex flex-1 flex-col gap-2">
                 <h4 className="text-[15px] font-bold leading-snug line-clamp-2 text-slate-900 group-hover:text-[#c00000] transition-colors">{story.title}</h4>
                 <p className="text-[12px] leading-relaxed text-slate-600 line-clamp-3 mb-2">{story.excerpt}</p>
                 <p className="mt-auto text-[10px] font-bold text-slate-400 uppercase">{story.time}</p>
               </div>
             </Link>
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
         <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-10 py-3.5 text-sm font-black text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-[#c00000] hover:text-[#c00000]">
            আরও বিনোদন <ChevronRight className="h-4 w-4" />
         </button>
      </div>
    </div>
  );
}
