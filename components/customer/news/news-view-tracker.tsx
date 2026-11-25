"use client";

import { useEffect, useRef } from "react";

interface NewsViewTrackerProps {
  newsId: number;
}

function getOrCreateVisitorId(): string {
  try {
    const key = "sp_visitor_id";
    let vid = localStorage.getItem(key);
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem(key, vid);
    }
    return vid;
  } catch {
    return "anon_" + Date.now();
  }
}

function getOrCreateSessionId(): string {
  try {
    const key = "sp_session_id";
    let sid = sessionStorage.getItem(key);
    if (!sid) {
      sid = "s_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      sessionStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return "sess_" + Date.now();
  }
}

export function NewsViewTracker({ newsId }: NewsViewTrackerProps) {
  const readSecondsRef = useRef(0);
  const isCompletedRef = useRef(false);
  const initialSentRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!newsId || typeof window === "undefined") return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const referer = document.referrer || "";

    const sendTrack = (seconds: number, completed: boolean, useBeacon = false) => {
      const endpoint = `${apiBaseUrl}/news/${newsId}/track-view`;
      const payload = {
        visitor_id: visitorId,
        session_id: sessionId,
        referer: referer,
        read_time_seconds: seconds,
        is_completed: completed,
      };

      if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(payload)], {
            type: "application/json",
          });
          navigator.sendBeacon(endpoint, blob);
          return;
        } catch {
          // fallback to fetch
        }
      }

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently ignore network failure to avoid affecting user experience
      });
    };

    // Track scroll depth to mark completion
    const handleScroll = () => {
      if (isCompletedRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0 && scrollTop / scrollHeight >= 0.65) {
        isCompletedRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial ping after 3 seconds of viewing
    const initialTimeout = setTimeout(() => {
      readSecondsRef.current = 3;
      initialSentRef.current = true;
      sendTrack(3, isCompletedRef.current);

      // Start periodic timer every 10 seconds for active reading duration
      timerRef.current = setInterval(() => {
        if (!document.hidden) {
          readSecondsRef.current += 10;
          // Every 30 seconds update server with accumulated read time
          if (readSecondsRef.current % 30 === 0) {
            sendTrack(readSecondsRef.current, isCompletedRef.current);
          }
        }
      }, 10000);
    }, 3000);

    // Send final reading time when leaving or hiding page
    const handleLeave = () => {
      if (initialSentRef.current && readSecondsRef.current > 0) {
        sendTrack(readSecondsRef.current, isCompletedRef.current, true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && initialSentRef.current) {
        sendTrack(readSecondsRef.current, isCompletedRef.current, true);
      }
    };

    window.addEventListener("pagehide", handleLeave);
    window.addEventListener("beforeunload", handleLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(initialTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handleLeave);
      window.removeEventListener("beforeunload", handleLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      handleLeave();
    };
  }, [newsId]);

  return null;
}
