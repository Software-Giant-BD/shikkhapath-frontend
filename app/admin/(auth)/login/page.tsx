import { KeyRound } from "lucide-react";
import { LoginForm } from "@/components/admin/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/40 blur-[120px] opacity-60" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-900/40 blur-[120px] opacity-60" />
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[100px] opacity-40" />
      </div>

      <div className="z-10 w-full max-w-md px-6">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl mb-6 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-500 hover:scale-110">
            <KeyRound className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
