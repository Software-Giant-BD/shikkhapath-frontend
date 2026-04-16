import Link from "next/link";

interface Props {
  title: string;
  subCategories?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

export function CategoryHeader({ title, subCategories = [] }: Props) {
  return (
    <div className="flex flex-col gap-6 mb-8 mt-4">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-black text-[#c00000] tracking-tight">{title}</h1>
        <div className="h-0.5 flex-1 bg-slate-100 mt-2" />
      </div>

      {subCategories.length > 0 && (
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-100 py-3 mt-[-10px]">
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${sub.slug}`}
              className="text-[13.5px] font-bold text-slate-500 hover:text-[#c00000] transition-colors"
            >
              {sub.title}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
