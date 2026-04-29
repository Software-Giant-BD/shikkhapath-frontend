"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Sun,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/lib/api/auth";

import { ProfileApiModel } from "@/lib/api/profile";

interface TopbarProps {
  onMenuClick: () => void;
  profile?: ProfileApiModel | null;
}

export function Topbar({ onMenuClick, profile }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)] relative">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-indigo-600 p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors"
        >
          <Menu size={24} />
        </button>

        <label className="relative w-full max-w-md hidden sm:flex items-center group cursor-text">
          <Search
            className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Icon */}
        <button className="sm:hidden text-slate-500 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
          <Search size={20} />
        </button>

        <button className="text-slate-500 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
          <Sun size={20} />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            className="text-slate-500 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-50 transition-colors relative"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-800">
                  Notifications
                </h3>
                <button className="text-xs text-indigo-600 font-medium hover:underline">
                  Mark all as read
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">
                        New User
                      </span>{" "}
                      registered successfully
                    </p>
                    <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5 ml-auto"></div>
                </div>

                <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Search size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">
                        System
                      </span>{" "}
                      scan completed
                    </p>
                    <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                  </div>
                </div>

                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Settings size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">
                        Password
                      </span>{" "}
                      changed successfully
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                <Link
                  href="/notifications"
                  className="block text-center w-full py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-1 sm:ml-4" ref={profileRef}>
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800 leading-none">
                {profile?.name || "Demo User"}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                {profile?.role_name || ""}
              </span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-50 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition-all shrink-0">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
              <div className="px-4 py-3 border-b border-slate-100 mb-1 sm:hidden">
                <p className="text-sm font-semibold text-slate-800">
                  {profile?.name || "Demo User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {profile?.email || "demo@example.com"}
                </p>
              </div>

              <Link
                href="/admin/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <User size={16} />
                Profile
              </Link>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => logoutUser()}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
