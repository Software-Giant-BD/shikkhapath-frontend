import Link from "next/link";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  currentPath?: string;
  subCategories?: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
  categoryHierarchy?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export function CategoryHeader({
  title,
  currentPath,
  subCategories = [],
  categoryHierarchy = [],
}: Props) {
  return (
    <div className="flex flex-col gap-6 mb-8 mt-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          হোম
        </Link>
        {categoryHierarchy.length > 0 && <ChevronRight className="h-3 w-3" />}
        {categoryHierarchy.map((category, index) => (
          <Fragment key={category.id}>
            <Link
              href={`/${categoryHierarchy
                .slice(0, index + 1)
                .map((c) => c.slug)
                .join("/")}`}
              className={`${
                index === categoryHierarchy.length - 1
                  ? "text-[#b38716]"
                  : "hover:text-slate-900"
              } transition-colors`}
            >
              {category.name}
            </Link>
            {index < categoryHierarchy.length - 1 && (
              <ChevronRight className="h-3 w-3" />
            )}
          </Fragment>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-black text-[#c00000] tracking-tight">
          {title}
        </h1>
        <div className="h-0.5 flex-1 bg-slate-100 mt-2" />
      </div>

      {subCategories.length > 0 && (
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-100 py-3 mt-[-10px]">
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={currentPath ? `/${currentPath}/${sub.slug}` : `/${sub.slug}`}
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
