import React from "react";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title?: string;
  breadcrumbs: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export function PageHeader({ title, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 w-full mb-6 relative">
      <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
            {crumb.href ? (
              <a href={crumb.href} className="hover:text-indigo-600 cursor-pointer transition-colors">
                {crumb.label}
              </a>
            ) : (
              <span className="text-slate-800 font-semibold">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {(title || action) ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
          {title ? <h1 className="text-2xl font-bold text-slate-800">{title}</h1> : <div />}
          {action ? (
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              {action}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
