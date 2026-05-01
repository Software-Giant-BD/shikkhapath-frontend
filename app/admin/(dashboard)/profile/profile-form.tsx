"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, User, Mail, Phone, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { updateProfileAction } from "@/lib/api/profile-actions";
import type { ProfileApiModel } from "@/lib/api/profile";

export function ProfileForm({ profile }: { profile: ProfileApiModel }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const result = await updateProfileAction(formData);

    setLoading(false);

    if (result.ok) {
      toast.success(result.message);
      // Clear password field
      const form = event.target as HTMLFormElement;
      form.querySelector<HTMLInputElement>('input[name="password"]')!.value = "";
    } else {
      toast.error(result.message);
      if (result.errors) {
        setErrors(result.errors);
      }
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="overflow-hidden border-none bg-linear-to-br from-[#204a63] via-[#2f6c81] to-[#1f5d73] text-white shadow-2xl transition-transform hover:scale-[1.02]">
          <CardContent className="relative flex flex-col items-center p-8 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 text-5xl font-bold shadow-2xl backdrop-blur-md ring-1 ring-white/30 transition-all hover:rotate-3">
              {profile.name.charAt(0).toUpperCase()}
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 ring-4 ring-[#2f6c81]" />
            </div>
            
            <h2 className="relative text-2xl font-bold tracking-tight">{profile.name}</h2>
            <p className="relative mt-1 font-medium text-sky-100/80">{profile.role_name}</p>
            
            <div className="relative mt-10 w-full space-y-3 text-left">
              <div className="group flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/15">
                <div className="rounded-lg bg-white/10 p-2 group-hover:bg-white/20">
                  <Mail className="h-5 w-5 text-sky-200" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200/60">Email Address</p>
                  <p className="truncate text-sm font-semibold">{profile.email}</p>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/15">
                <div className="rounded-lg bg-white/10 p-2 group-hover:bg-white/20">
                  <Phone className="h-5 w-5 text-sky-200" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200/60">Phone Number</p>
                  <p className="text-sm font-semibold">{profile.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-sm rounded-3xl overflow-hidden border">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-800">Account Settings</CardTitle>
            <CardDescription className="text-slate-500">Manage your identity and security preferences.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile.name}
                      placeholder="Enter your name"
                      required
                      className={`pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-xs transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 ${errors.name ? "border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs font-medium text-rose-500 ml-1">{errors.name[0]}</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profile.email}
                      placeholder="Enter your email"
                      required
                      className={`pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-xs transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 ${errors.email ? "border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-rose-500 ml-1">{errors.email[0]}</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">
                    Phone Number
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={profile.phone}
                      placeholder="Enter your phone number"
                      required
                      className={`pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-xs transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 ${errors.phone ? "border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-medium text-rose-500 ml-1">{errors.phone[0]}</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">
                    Change Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-xs transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 ${errors.password ? "border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 ml-1">Leave blank if you don't want to change</p>
                  {errors.password && (
                    <p className="text-xs font-medium text-rose-500 ml-1">{errors.password[0]}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-8 mt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="h-12 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
