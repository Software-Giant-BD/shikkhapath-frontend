"use client";

import { useState } from "react";
import { Mail, MoveRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { forgotPassword } from "@/lib/api/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await forgotPassword(email);
      if (data?.error) {
        setError(data.error);
        return;
      }
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.message || "A network error occurred. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
        <p className="text-slate-400 text-sm mb-8">
          We have sent a password reset link to <span className="text-white font-medium">{email}</span>
        </p>
        <Link href="/admin/login">
          <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 h-12 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-300 ml-1">
          Email Address
        </Label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-12 pr-4 h-12 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 rounded-2xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 focus-visible:ring-2 transition-all duration-300"
            placeholder="name@example.com"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 px-1">
          We'll send you a link to reset your password.
        </p>
      </div>

      <div className="pt-2 space-y-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-2xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 group text-base disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
          {isLoading ? "Sending Link..." : "Send Reset Link"}
          {!isLoading && (
            <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          )}
        </Button>

        <Link href="/admin/login" className="block">
          <Button type="button" variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 h-12 rounded-xl text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Button>
        </Link>
      </div>
    </form>
  );
}
