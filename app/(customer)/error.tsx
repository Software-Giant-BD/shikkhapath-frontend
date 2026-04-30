"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 ring-8 ring-rose-50">
        <AlertCircle className="h-10 w-10 text-rose-600" />
      </div>
      <h2 className="mb-3 text-3xl font-bold text-slate-800 tracking-tight">
        Server is not responding
      </h2>
      <p className="mb-8 max-w-md text-slate-500 leading-relaxed">
        We're having trouble connecting to our servers right now. Please check your internet connection or try again later.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0"
      >
        <RefreshCcw size={18} />
        Try Again
      </button>
      
      {process.env.NODE_ENV === "development" && (
        <div className="mt-12 max-w-2xl rounded-xl bg-slate-900 p-4 text-left shadow-xl w-full overflow-hidden">
          <p className="mb-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            Developer Error Details
          </p>
          <p className="text-sm font-mono text-slate-300 break-words whitespace-pre-wrap">
            {error.message || "Unknown error"}
          </p>
        </div>
      )}
    </div>
  );
}
