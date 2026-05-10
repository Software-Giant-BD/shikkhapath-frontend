"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, MoveRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { resetPassword } from "@/lib/api/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or missing reset token. Please request a new link.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) return;

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (data?.error) {
        setError(data.error);
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
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
        <h3 className="text-xl font-semibold text-white mb-2">Password Reset Successful</h3>
        <p className="text-slate-400 text-sm mb-8">
          Your password has been successfully reset. Redirecting you to login...
        </p>
        <Link href="/admin/login">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-500 h-12 rounded-xl">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-300 ml-1">
          New Password
        </Label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!token || !email}
            className="w-full pl-12 pr-4 h-12 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 rounded-2xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 focus-visible:ring-2 transition-all duration-300"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation" className="text-slate-300 ml-1">
          Confirm New Password
        </Label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            disabled={!token || !email}
            className="w-full pl-12 pr-4 h-12 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 rounded-2xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 focus-visible:ring-2 transition-all duration-300"
            placeholder="••••••••"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !token || !email}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-2xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 group text-base disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
        {isLoading ? "Resetting Password..." : "Reset Password"}
        {!isLoading && (
          <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        )}
      </Button>
    </form>
  );
}
