import Image from "next/image";
import Link from "next/link";
import { getCustomerAdvertisements } from "@/lib/api/advertisements";

interface Props {
  label: string
  className?: string
  heightClass?: string
  category?: string
  placement?: string
}

export async function AdBanner({ label, className = "my-4", heightClass = "h-16", category, placement }: Props) {
  let ad = null;
  
  if (category && placement) {
    try {
      const { items } = await getCustomerAdvertisements({ category, placement });
      ad = items[0];
    } catch (e) {
      // ignore
    }
  }

  if (ad && ad.image) {
    const content = (
      <div className={`relative w-full ${heightClass}`}>
        <Image src={ad.image} alt={ad.name} fill className="object-cover rounded" />
      </div>
    );

    return (
      <div className={`${className}`}>
        {ad.redirect_url ? (
          <Link href={ad.redirect_url} target="_blank" rel="noopener noreferrer" className="block w-full">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  }

  return (
    <div className={`${className} ${heightClass} flex items-center justify-center overflow-hidden rounded bg-[#e8e8e8]`}>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  )
}
