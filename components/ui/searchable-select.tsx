"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: string | number;
  name: string;
  bn_name?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id.toString() === value.toString());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.bn_name && opt.bn_name.includes(searchTerm))
  );

  const getDisplayName = (opt: Option) => {
    if (opt.bn_name && opt.name) {
      return `${opt.name} - ${opt.bn_name}`;
    }
    return opt.bn_name || opt.name;
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
          disabled ? "cursor-not-allowed opacity-50 bg-slate-50" : "cursor-pointer hover:border-indigo-500",
          isOpen && "border-indigo-500 ring-2 ring-indigo-500/20"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-slate-400")}>
          {selectedOption ? getDisplayName(selectedOption) : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-[100] mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-100 bg-slate-50 py-1.5 pl-9 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
          <div className="max-h-[250px] overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id.toString());
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                    value.toString() === opt.id.toString()
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <span className="truncate">{getDisplayName(opt)}</span>
                  {value.toString() === opt.id.toString() && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-xs text-slate-400">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
