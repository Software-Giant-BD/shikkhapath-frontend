"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Map, Sun, Moon, Sunrise, Clock, Calendar, AlertCircle } from "lucide-react";

const MAJOR_CITIES_BD = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj"
];

// Map API keys to Display names and icons
const PRAYERS = [
  { key: "Fajr", label: "Fajr", icon: Sunrise, color: "text-indigo-400", bg: "bg-indigo-50", border: "border-indigo-100" },
  { key: "Dhuhr", label: "Dhuhr", icon: Sun, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
  { key: "Asr", label: "Asr", icon: Sun, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  { key: "Maghrib", label: "Maghrib", icon: Moon, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" },
  { key: "Isha", label: "Isha", icon: Moon, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
];

interface Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export function PrayerTimesClient() {
  const [city, setCity] = useState("Dhaka");
  const [timings, setTimings] = useState<Timings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [nextPrayerName, setNextPrayerName] = useState<string>("");
  const [countdownText, setCountdownText] = useState<string>("");

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh`);
        const data = await response.json();
        
        if (data.code === 200) {
          setTimings(data.data.timings);
        } else {
          setError("Failed to load timings. Please try again.");
        }
      } catch (err) {
        setError("Network error. Could not connect to timing service.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [city]);

  // Handle countdown calculation
  useEffect(() => {
    if (!timings) return;

    const timer = setInterval(() => {
      const now = new Date();
      let nextFound = false;

      for (let i = 0; i < PRAYERS.length; i++) {
        const prayer = PRAYERS[i];
        const timeStr = timings[prayer.key as keyof Timings];
        if (!timeStr) continue;

        const [hours, mins] = timeStr.split(":").map(Number);
        
        // We assume target time is today
        const targetTime = new Date();
        targetTime.setHours(hours, mins, 0, 0);

        if (now.getTime() < targetTime.getTime()) {
          setNextPrayerName(prayer.label);
          const diffMs = targetTime.getTime() - now.getTime();
          const hrs = Math.floor(diffMs / (1000 * 60 * 60));
          const mns = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const scs = Math.floor((diffMs % (1000 * 60)) / 1000);

          setCountdownText(
            `- ${hrs.toString().padStart(2, "0")} : ${mns.toString().padStart(2, "0")} : ${scs.toString().padStart(2, "0")}`
          );
          nextFound = true;
          break;
        }
      }

      // If no next prayer found today, next must be Fajr tomorrow
      if (!nextFound && timings.Fajr) {
        setNextPrayerName("Fajr (Tomorrow)");
        const [hours, mins] = timings.Fajr.split(":").map(Number);
        const targetTime = new Date();
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(hours, mins, 0, 0);
        
        const diffMs = targetTime.getTime() - now.getTime();
        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mns = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const scs = Math.floor((diffMs % (1000 * 60)) / 1000);

        setCountdownText(
           `- ${hrs.toString().padStart(2, "0")} : ${mns.toString().padStart(2, "0")} : ${scs.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  // Convert "15:30" to "3:30 PM" formatting natively without complex libraries
  const format12Hour = (timeStr: string) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hours = parseInt(h, 10);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${m} ${suffix}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-4 mb-4">
          <Moon className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black md:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
          Namaz Time <span className="text-emerald-600">Bangladesh</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Get the most accurate, daily updated 5 times prayer schedule for your district based on your local timezone.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-slate-950 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col items-center md:items-start text-white">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-emerald-400" />
              {new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
            </h2>
            <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Selected Region: {city}, BD
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[240px]">
            <label className="sr-only">Select City</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none rounded-xl border-none bg-white/10 px-5 py-3.5 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold backdrop-blur-sm cursor-pointer"
              >
                {MAJOR_CITIES_BD.map((c) => (
                  <option key={c} value={c} className="text-slate-900 font-medium">{c}</option>
                ))}
              </select>
              <Map className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 bg-slate-50 relative">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 font-bold animate-pulse">Calculating local timings...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 bg-red-50 rounded-2xl border border-red-100">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <p className="text-red-700 font-bold">{error}</p>
              <button 
                onClick={() => setCity(city)} 
                className="mt-2 px-4 py-2 bg-white text-slate-800 rounded-lg shadow-sm font-medium hover:bg-slate-50 ring-1 ring-slate-200"
              >
                Try Again
              </button>
            </div>
          ) : timings ? (
            <div className="space-y-8">
              {/* Highlight Countdown Box */}
              <div className="flex flex-col items-center text-center p-8 bg-white border border-emerald-100 ring-4 ring-emerald-50 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Moon className="w-48 h-48 rotate-12" />
                </div>
                
                <p className="text-sm font-bold tracking-widest uppercase text-emerald-600 mb-2 relative z-10">Time remaining until</p>
                <h3 className="text-4xl font-black text-slate-900 mb-4 relative z-10">{nextPrayerName}</h3>
                <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg relative z-10 font-mono text-2xl font-bold">
                  <Clock className="w-6 h-6 text-emerald-400" />
                  {countdownText || "00 : 00 : 00"}
                </div>
              </div>

              {/* Prayer Times Grid */}
              <div className="w-full">
                <h3 className="text-lg font-bold text-slate-700 mb-4 px-1">Daily Prayer Schedule</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {PRAYERS.map((prayer) => {
                    const timeValue = timings[prayer.key as keyof Timings];
                    const Icon = prayer.icon;
                    return (
                      <div 
                        key={prayer.key} 
                        className={`flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-transform hover:-translate-y-1 hover:shadow-md ${prayer.border}`}
                      >
                        <div className={`p-3 rounded-xl mb-4 ${prayer.bg} ${prayer.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{prayer.label}</h4>
                        <p className="text-xl font-black text-slate-900">
                          {format12Hour(timeValue)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sunrise & Sunset Extra Info */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100">
                  <Sunrise className="w-6 h-6 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Sunrise</p>
                    <p className="font-bold text-slate-900">{format12Hour(timings.Sunrise)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100">
                  <Sun className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Sunset</p>
                    <p className="font-bold text-slate-900">{format12Hour(timings.Sunset)}</p>
                  </div>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
