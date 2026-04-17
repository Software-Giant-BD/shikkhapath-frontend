"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, MapPin, Search, List, Calendar as CalendarIcon, 
  Map, Share2, Bell, ExternalLink, Loader2, Filter, ChevronLeft, ChevronRight, GraduationCap
} from "lucide-react";
import { fetchUniversityEventsAction } from "@/lib/api/event-actions";
import type { UniversityEventModel, EventType } from "@/lib/api/events";

// Helper for monthly calendar
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const EVENT_TYPES = ["All", "Admission Event", "Seminar", "Workshop", "Competition", "Webinar", "Campus Program"];
const CITIES = ["All", "Dhaka", "Rajshahi", "Savar", "Chattogram", "Sylhet"];

export function EventsClient() {
  const [events, setEvents] = useState<UniversityEventModel[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  // Filters
  const [filterType, setFilterType] = useState<string>("All");
  const [filterCity, setFilterCity] = useState<string>("All");

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Day Selection for calendar popup/underlist
  const [selectedDayEvents, setSelectedDayEvents] = useState<UniversityEventModel[] | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const res = await fetchUniversityEventsAction({
           type: filterType !== "All" ? filterType : undefined,
           city: filterCity !== "All" ? filterCity : undefined,
        });
        setEvents(res.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [filterType, filterCity]);

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleShare = (title: string) => {
    alert(`Mock Share Triggered: Share "${title}" to Facebook/WhatsApp!`);
  };

  const handleRemindMe = (title: string) => {
    alert(`Reminder Set! You will be notified before "${title}" starts.`);
  };

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
       const cd = new Date(e.start_date);
       return cd.getFullYear() === year && cd.getMonth() === month && cd.getDate() === day;
    });
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
    } else {
      setSelectedDayEvents(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header section */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center rounded-2xl bg-rose-100 p-4 mb-4">
          <CalendarDays className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="text-3xl font-black md:text-5xl text-slate-900 tracking-tight mb-4">
          University <span className="text-rose-600">Events</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Discover admission timelines, workshops, tech olympiads, and campus seminars matching your interests. Keep track of crucial academic dates easily.
        </p>
      </div>

      {/* Control Ribbon (Filters & Views) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
         
         {/* Filters */}
         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-400 pl-2">
               <Filter className="w-4 h-4" />
               <span className="text-sm font-bold uppercase tracking-widest hidden md:inline">Filters</span>
            </div>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select 
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {CITIES.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
            </select>
         </div>

         {/* View Toggles */}
         <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setViewMode("list")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "list" ? "bg-white text-rose-600 shadow ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
               <List className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "calendar" ? "bg-white text-rose-600 shadow ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
               <CalendarIcon className="w-4 h-4" /> Calendar
            </button>
         </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500 mb-4" />
          <p className="text-slate-500 font-bold">Loading university events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
           <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <h3 className="text-lg font-bold text-slate-700">No events found matching your criteria.</h3>
           <button onClick={() => {setFilterType("All"); setFilterCity("All");}} className="mt-4 text-rose-600 font-bold hover:underline">Clear filters</button>
        </div>
      ) : (
        <>
          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-500">
               {events.map(event => (
                 <div key={event.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <GraduationCap className="w-32 h-32 rotate-12" />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                       <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600">
                         {event.type}
                       </span>
                       <span className="inline-flex items-center text-xs font-bold text-slate-400">
                         <MapPin className="w-3 h-3 mr-1" /> {event.location}
                       </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{event.title}</h2>
                    <p className="text-indigo-600 font-bold text-sm mb-4">{event.university_name}</p>
                    
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                       {event.description}
                    </p>

                    <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <CalendarDays className="w-5 h-5 text-rose-400" />
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                         <p className="text-sm font-bold text-slate-700">{new Date(event.start_date).toLocaleDateString()} - {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <a href={event.registration_url} target="_blank" rel="noreferrer" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-colors">
                          <ExternalLink className="w-4 h-4" /> Register Now
                       </a>
                       <button onClick={() => handleRemindMe(event.title)} className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors tooltip" title="Remind Me">
                          <Bell className="w-5 h-5" />
                       </button>
                       <button onClick={() => handleShare(event.title)} className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors tooltip" title="Share via WhatsApp/Facebook">
                          <Share2 className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* CALENDAR VIEW */}
          {viewMode === "calendar" && (
            <div className="animate-in fade-in duration-500">
               <div className="bg-white border md:border-slate-200 rounded-3xl p-4 md:p-8 shadow-sm">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-black text-slate-900">
                        {currentDate.toLocaleString('default', { month: 'long' })} {year}
                     </h2>
                     <div className="flex items-center gap-2">
                        <button onClick={handlePrevMonth} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={handleNextMonth} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50"><ChevronRight className="w-5 h-5" /></button>
                     </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center font-bold text-slate-400 text-xs uppercase tracking-widest py-2">
                           {d}
                        </div>
                     ))}
                     
                     {/* Empty Slots */}
                     {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-20 md:h-28 rounded-xl bg-slate-50/50 border border-slate-100/50 border-dashed"></div>
                     ))}

                     {/* Days */}
                     {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayEvents = getEventsForDay(day);
                        const hasEvents = dayEvents.length > 0;
                        const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                        return (
                          <div 
                            key={`day-${day}`}
                            onClick={() => handleDayClick(day)}
                            className={`h-20 md:h-28 rounded-xl border p-2 flex flex-col transition-colors cursor-pointer group
                              ${isToday ? "bg-rose-50 border-rose-200" : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"}
                            `}
                          >
                             <div className="flex justify-between items-start mb-1">
                               <span className={`font-bold text-sm ${isToday ? "text-rose-600" : "text-slate-700"}`}>
                                 {day}
                               </span>
                             </div>

                             {hasEvents && (
                               <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                  {dayEvents.map(e => (
                                    <div key={e.id} className="text-[9px] md:text-xs font-bold px-1.5 py-1 rounded bg-indigo-100 text-indigo-700 truncate" title={e.title}>
                                       {e.title}
                                    </div>
                                  ))}
                               </div>
                             )}
                          </div>
                        )
                     })}
                  </div>

                  {/* Selected Day popup list */}
                  {selectedDayEvents && selectedDayEvents.length > 0 && (
                     <div className="mt-8 bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative animate-in slide-in-from-bottom-2">
                        <button onClick={() => setSelectedDayEvents(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><XCircle className="w-6 h-6" /></button>
                        <h3 className="text-xl font-bold mb-6 text-rose-400 border-b border-white/10 pb-4">
                           Events on {new Date(selectedDayEvents[0].start_date).toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})}
                        </h3>
                        <div className="space-y-4">
                           {selectedDayEvents.map(e => (
                              <div key={e.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                 <div>
                                    <span className="bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded mb-2 inline-block">{e.type}</span>
                                    <h4 className="text-lg font-bold">{e.title}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{e.university_name} • {e.location}</p>
                                 </div>
                                 <a href={e.registration_url} target="_blank" rel="noreferrer" className="shrink-0 bg-rose-500 hover:bg-rose-600 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm">
                                    Details
                                 </a>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

               </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

import { XCircle } from "lucide-react";
