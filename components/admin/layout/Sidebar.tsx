"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserCircle,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  subItems?: { title: string; href: string }[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuConfig: MenuSection[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { title: "Members", icon: UserCircle, href: "/admin/members/list" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-2xl md:shadow-[2px_0_8px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-16 flex items-center justify-between px-6 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-indigo-600"
          >
            <div className="text-indigo-600">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 22L12 2l8 20" />
                <path d="M22 22H2" />
              </svg>
            </div>
            Shikkhapath
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-slate-500 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-200">
          {menuConfig.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const hasSubItems = !!item.subItems;
                  const isExpanded = !!expandedMenus[item.title];
                  const isActive =
                    item.href === pathname ||
                    (hasSubItems &&
                      item.subItems?.some((sub) => sub.href === pathname));
                  const Icon = item.icon;

                  return (
                    <li key={itemIdx} className="flex flex-col">
                      {hasSubItems ? (
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-colors w-full text-left
                            ${isActive || isExpanded ? "text-indigo-600 bg-indigo-50/50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} />
                            {item.title}
                          </div>
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors
                            ${isActive ? "text-indigo-600 bg-indigo-50/50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                          `}
                        >
                          <Icon size={18} />
                          {item.title}
                        </Link>
                      )}

                      {/* SubMenu Items */}
                      {hasSubItems && isExpanded && (
                        <ul className="mt-1 space-y-1 pl-4 pb-1">
                          {item.subItems?.map((sub, subIdx) => {
                            const isSubActive = sub.href === pathname;
                            return (
                              <li key={subIdx}>
                                <Link
                                  href={sub.href}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
                                    ${isSubActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                                  `}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${isSubActive ? "bg-indigo-600" : "bg-slate-300"}`}
                                  ></span>
                                  {sub.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
