"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Rss,
  Check,
  AlertCircle,
  Sliders,
  Tag,
  History,
  Save,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Radio,
  Image as ImageIcon,
  Play,
  Layers,
  ChevronDown,
  ChevronRight,
  ListPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { PageHeader } from "@/components/admin/ui/page-header";
import {
  getAutoNewsSettingsAction,
  updateAutoNewsSettingsAction,
  getNewsSourcesAction,
  detectNewsSourceRssAction,
  createNewsSourceAction,
  updateNewsSourceAction,
  deleteNewsSourceAction,
  toggleNewsSourceAction,
  createNewsSourceSectionAction,
  updateNewsSourceSectionAction,
  deleteNewsSourceSectionAction,
  toggleNewsSourceSectionAction,
  getCategoryKeywordsAction,
  updateCategoryKeywordsAction,
  getAutoNewsLogsAction,
  triggerAutoNewsAction,
  type AutoNewsSettings,
  type NewsSourceItem,
  type NewsSourceSectionItem,
  type CategoryWithKeywords,
  type AutoNewsLogItem,
} from "@/lib/api/admin/auto-news-actions";

type ActiveTab = "settings" | "sources" | "categories" | "logs";

export default function AutoNewsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("settings");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Settings state
  const [settings, setSettings] = useState<AutoNewsSettings>({
    enabled: true,
    daily_limit: 20,
    default_status: "published",
    generate_image: true,
    image_provider: "pollinations",
    gemini_api_key: "",
    gemini_model: "gemini-2.5-flash",
    openrouter_api_key: "",
    openrouter_model: "google/gemini-2.5-flash",
    today_processed: 0,
    active_sources_count: 0,
    total_sources_count: 0,
  });
  const [showApiKey, setShowApiKey] = useState(false);

  // Sources state
  const [sources, setSources] = useState<NewsSourceItem[]>([]);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [isDetectingRss, setIsDetectingRss] = useState(false);
  const [rssDetectionResult, setRssDetectionResult] = useState<{
    tested: boolean;
    found: boolean;
    feed_url: string | null;
    method?: string | null;
    message?: string;
  } | null>(null);
  const [newSource, setNewSource] = useState({
    name: "",
    website_url: "",
    has_rss: false,
    rss_feed_url: "",
    filter_mode: "none" as "none" | "keyword",
    target_section_name: "",
    default_category_id: "" as string | number,
    status: "active" as "active" | "inactive",
  });

  // Section Management State
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});
  const [activePortalForSection, setActivePortalForSection] = useState<NewsSourceItem | null>(null);
  const [newSection, setNewSection] = useState({
    name: "",
    section_url: "",
    feed_type: "scraper" as "scraper" | "rss",
    category_id: "" as string | number,
    filter_mode: "none" as "none" | "keyword",
  });

  // Categories state
  const [categories, setCategories] = useState<CategoryWithKeywords[]>([]);
  const [newKeywordInput, setNewKeywordInput] = useState<Record<number, string>>({});

  // Logs state
  const [logs, setLogs] = useState<AutoNewsLogItem[]>([]);
  const [logPage, setLogPage] = useState(1);
  const [logPagination, setLogPagination] = useState<any>(null);

  // Manual Trigger state
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerLimit, setTriggerLimit] = useState<number>(3);

  // Load Initial Data
  async function loadData() {
    setIsLoading(true);
    try {
      const [settingsRes, sourcesRes, categoriesRes, logsRes] = await Promise.all([
        getAutoNewsSettingsAction(),
        getNewsSourcesAction(),
        getCategoryKeywordsAction(),
        getAutoNewsLogsAction(1, 15),
      ]);

      if (settingsRes.success && settingsRes.settings) {
        setSettings(settingsRes.settings);
      }
      if (sourcesRes.success) {
        setSources(sourcesRes.sources);
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.categories);
      }
      if (logsRes.success) {
        setLogs(logsRes.items);
        setLogPagination(logsRes.pagination);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Handle ESC key and scroll lock when Add Portal modal is open
  useEffect(() => {
    if (!isAddingSource) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        setIsAddingSource(false);
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddingSource, isPending]);

  // Save Settings Handler
  async function handleSaveSettings() {
    startTransition(async () => {
      const res = await updateAutoNewsSettingsAction({
        enabled: settings.enabled,
        daily_limit: Number(settings.daily_limit),
        default_status: settings.default_status,
        generate_image: settings.generate_image,
        image_provider: settings.image_provider,
        openrouter_api_key: settings.openrouter_api_key,
        openrouter_model: settings.openrouter_model,
        gemini_api_key: settings.gemini_api_key,
        gemini_model: settings.gemini_model,
      });

      if (res.success) {
        toast.success("Auto News settings saved successfully");
      } else {
        toast.error(res.message);
      }
    });
  }

  // Toggle Source Status
  async function handleToggleSource(id: number) {
    const res = await toggleNewsSourceAction(id);
    if (res.success) {
      toast.success(res.message);
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s))
      );
    } else {
      toast.error(res.message);
    }
  }

  // Delete Source
  async function handleDeleteSource(id: number) {
    if (!confirm("Are you sure you want to delete this news source?")) return;
    const res = await deleteNewsSourceAction(id);
    if (res.success) {
      toast.success(res.message);
      setSources((prev) => prev.filter((s) => s.id !== id));
    } else {
      toast.error(res.message);
    }
  }

  // Auto-detect RSS Feed for News Portal
  async function runDetectRss(urlToTest?: string) {
    const targetUrl = (urlToTest ?? newSource.website_url).trim();
    if (!targetUrl || !targetUrl.includes(".")) return;

    setIsDetectingRss(true);
    try {
      const res = await detectNewsSourceRssAction(targetUrl);
      if (res.success && res.found && res.feed_url) {
        setRssDetectionResult({
          tested: true,
          found: true,
          feed_url: res.feed_url,
          method: res.method,
          message: res.message,
        });
        setNewSource((prev) => ({
          ...prev,
          has_rss: true,
          rss_feed_url: res.feed_url || "",
        }));
      } else {
        setRssDetectionResult({
          tested: true,
          found: false,
          feed_url: null,
          method: null,
          message: res.message || "No RSS feed found. Content will be gathered via Web Scraper.",
        });
        setNewSource((prev) => ({
          ...prev,
          has_rss: false,
          rss_feed_url: "",
        }));
      }
    } catch {
      setRssDetectionResult({
        tested: true,
        found: false,
        feed_url: null,
        message: "Failed to scan portal for RSS feeds.",
      });
    } finally {
      setIsDetectingRss(false);
    }
  }

  // Add Source
  async function handleAddSource(e: React.FormEvent) {
    e.preventDefault();
    if (!newSource.name || !newSource.website_url) {
      toast.error("Please fill in the name and website URL");
      return;
    }

    startTransition(async () => {
      const res = await createNewsSourceAction({
        name: newSource.name,
        website_url: newSource.website_url,
        has_rss: newSource.has_rss,
        rss_feed_url: newSource.rss_feed_url || undefined,
        default_category_id: newSource.default_category_id ? Number(newSource.default_category_id) : null,
        filter_mode: newSource.filter_mode,
        target_section_name: newSource.target_section_name || null,
        status: newSource.status,
      });
      if (res.success) {
        toast.success("New news source added successfully");
        setIsAddingSource(false);
        setRssDetectionResult(null);
        setNewSource({
          name: "",
          website_url: "",
          has_rss: false,
          rss_feed_url: "",
          filter_mode: "none",
          target_section_name: "",
          default_category_id: "",
          status: "active",
        });
        const updated = await getNewsSourcesAction();
        if (updated.success) setSources(updated.sources);
      } else {
        toast.error(res.message);
      }
    });
  }

  // Toggle Source Expansion
  function toggleExpandSource(id: number) {
    setExpandedSources((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Toggle Section Status
  async function handleToggleSection(sourceId: number, sectionId: number) {
    const res = await toggleNewsSourceSectionAction(sourceId, sectionId);
    if (res.success) {
      toast.success(res.message);
      setSources((prev) =>
        prev.map((s) => {
          if (s.id !== sourceId) return s;
          return {
            ...s,
            sections: s.sections?.map((sec) =>
              sec.id === sectionId ? { ...sec, status: sec.status === "active" ? "inactive" : "active" } : sec
            ),
          };
        })
      );
    } else {
      toast.error(res.message);
    }
  }

  // Delete Section
  async function handleDeleteSection(sourceId: number, sectionId: number) {
    if (!confirm("Are you sure you want to delete this category section?")) return;
    const res = await deleteNewsSourceSectionAction(sourceId, sectionId);
    if (res.success) {
      toast.success(res.message);
      setSources((prev) =>
        prev.map((s) => {
          if (s.id !== sourceId) return s;
          return {
            ...s,
            sections: s.sections?.filter((sec) => sec.id !== sectionId),
          };
        })
      );
    } else {
      toast.error(res.message);
    }
  }

  // Add Section to Portal
  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!activePortalForSection) return;
    if (!newSection.name || !newSection.section_url) {
      toast.error("Please enter section name and URL");
      return;
    }

    startTransition(async () => {
      const res = await createNewsSourceSectionAction(activePortalForSection.id, {
        name: newSection.name,
        section_url: newSection.section_url,
        feed_type: newSection.feed_type,
        category_id: newSection.category_id ? Number(newSection.category_id) : null,
        filter_mode: newSection.filter_mode,
        status: "active",
      });

      if (res.success && res.section) {
        toast.success(res.message);
        const added = res.section;
        setSources((prev) =>
          prev.map((s) => {
            if (s.id !== activePortalForSection.id) return s;
            return {
              ...s,
              sections: [...(s.sections || []), added],
            };
          })
        );
        setExpandedSources((prev) => ({ ...prev, [activePortalForSection.id]: true }));
        setActivePortalForSection(null);
        setNewSection({
          name: "",
          section_url: "",
          feed_type: "scraper",
          category_id: "",
          filter_mode: "none",
        });
      } else {
        toast.error(res.message);
      }
    });
  }

  // Add Keyword to Category
  function handleAddKeyword(categoryId: number) {
    const word = (newKeywordInput[categoryId] || "").trim();
    if (!word) return;

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const current = cat.match_keywords || [];
          if (!current.includes(word)) {
            return { ...cat, match_keywords: [...current, word] };
          }
        }
        return cat;
      })
    );
    setNewKeywordInput((prev) => ({ ...prev, [categoryId]: "" }));
  }

  // Remove Keyword from Category
  function handleRemoveKeyword(categoryId: number, keywordToRemove: string) {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            match_keywords: (cat.match_keywords || []).filter((k) => k !== keywordToRemove),
          };
        }
        return cat;
      })
    );
  }

  // Save Category Keywords to Server
  async function handleSaveKeywords(categoryId: number) {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    startTransition(async () => {
      const res = await updateCategoryKeywordsAction(categoryId, cat.match_keywords || []);
      if (res.success) {
        toast.success(`Tags for '${cat.title}' saved successfully`);
      } else {
        toast.error(res.message);
      }
    });
  }

  // Manual Trigger Handler
  async function handleTriggerNow() {
    setIsTriggering(true);
    try {
      const res = await triggerAutoNewsAction(triggerLimit);
      if (res.success) {
        toast.success(res.message || "খবর সংগ্রহ ও AI প্রক্রিয়াকরণ ব্যাকগ্রাউন্ড কিউতে যুক্ত হয়েছে।");
        loadData();
        // Auto-refresh logs as the background queue worker processes articles
        setTimeout(() => loadData(), 8000);
        setTimeout(() => loadData(), 18000);
        setTimeout(() => loadData(), 30000);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Manual run failed");
    } finally {
      setIsTriggering(false);
    }
  }

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Auto News & AI Configuration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated news aggregation from Bangladeshi portals with copyright-free Gemini AI rewriting and publishing
          </p>
        </div>

        {/* Action Trigger Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
            <span className="text-xs text-slate-500 mr-2 font-medium">Batch Limit:</span>
            <select
              value={triggerLimit}
              onChange={(e) => setTriggerLimit(Number(e.target.value))}
              className="text-xs bg-transparent border-0 focus:ring-0 font-semibold text-slate-800 cursor-pointer"
            >
              <option value={1}>1 Article</option>
              <option value={3}>3 Articles</option>
              <option value={5}>5 Articles</option>
              <option value={10}>10 Articles</option>
            </select>
          </div>

          <Button
            onClick={handleTriggerNow}
            disabled={isTriggering || !settings.enabled}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-sm"
          >
            {isTriggering ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Dispatching...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" /> Fetch & Post Now
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Quota */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Today&apos;s Post Quota
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                {settings.daily_limit} Max
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{settings.today_processed}</span>
              <span className="text-xs text-slate-500">/ {settings.daily_limit} articles</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((settings.today_processed / (settings.daily_limit || 1)) * 100))}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Engine Status */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Auto News Engine
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  settings.enabled ? "bg-emerald-500 animate-pulse" : "bg-rose-400"
                }`}
              />
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                  settings.enabled ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {settings.enabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {settings.enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Runs automatically in background every hour</p>
          </CardContent>
        </Card>

        {/* Card 3: Sources Count */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                News Portal Sources
              </span>
              <Globe className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{sources.filter((s) => s.status === "active").length}</span>
              <span className="text-xs text-slate-500">/ {sources.length} active sources</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Prothom Alo, Daily Campus, etc.</p>
          </CardContent>
        </Card>

        {/* Card 4: Post Status Mode */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Default Publishing
              </span>
              <Radio className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                  settings.default_status === "published"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {settings.default_status === "published" ? "Direct Live (Published)" : "Draft Review (Draft)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {settings.generate_image ? "AI feature image generation active" : "Image generation disabled"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "settings"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" /> General Settings & AI
        </button>

        <button
          onClick={() => setActiveTab("sources")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "sources"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Globe className="w-4 h-4" /> News Sources ({sources.length})
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "categories"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Tag className="w-4 h-4" /> Category & Keyword Mapping
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "logs"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="w-4 h-4" /> History & Fetching Logs
        </button>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" /> Automation & Publication Rules
              </CardTitle>
              <CardDescription className="text-xs">
                Configure daily publication quotas and default article status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Enable / Disable Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <Label className="text-xs font-semibold text-slate-900">Keep Auto News Engine Active</Label>
                  <p className="text-[11px] text-slate-500">When disabled, the background scheduler will not fetch news</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Daily Limit Input */}
              <div className="space-y-1.5">
                <Label htmlFor="daily_limit" className="text-xs font-semibold text-slate-700">
                  Daily Target Post Quota
                </Label>
                <div className="relative">
                  <Input
                    id="daily_limit"
                    type="number"
                    min={1}
                    max={100}
                    value={settings.daily_limit}
                    onChange={(e) => setSettings({ ...settings, daily_limit: Number(e.target.value) })}
                    className="font-bold text-base"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">posts / day</span>
                </div>
                <p className="text-[11px] text-slate-400">Typically 15 to 20 articles per day is optimal</p>
              </div>

              {/* Default Post Status */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Default Post Status</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSettings({ ...settings, default_status: "published" })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      settings.default_status === "published"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${settings.default_status === "published" ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                        {settings.default_status === "published" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                      Publish Directly (Published)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Articles become immediately visible on the site after AI rewriting</p>
                  </div>

                  <div
                    onClick={() => setSettings({ ...settings, default_status: "draft" })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      settings.default_status === "draft"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${settings.default_status === "draft" ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                        {settings.default_status === "draft" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                      Save as Draft (Draft)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Admin will review and publish with a single click</p>
                  </div>
                </div>
              </div>

              {/* Generate Image Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <Label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" /> Generate AI Featured Image
                  </Label>
                  <p className="text-[11px] text-slate-500">Generates a 16:9 featured image based on article context</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.generate_image}
                  onChange={(e) => setSettings({ ...settings, generate_image: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" /> OpenRouter (Gemini Model) Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                Rewrite Bengali news and remove copyright duplication using Gemini via OpenRouter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* OpenRouter API Key */}
              <div className="space-y-1.5">
                <Label htmlFor="openrouter_key" className="text-xs font-semibold text-slate-700">
                  OpenRouter API Key *
                </Label>
                <div className="relative">
                  <Input
                    id="openrouter_key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="sk-or-v1-..."
                    value={settings.openrouter_api_key || ""}
                    onChange={(e) => setSettings({ ...settings, openrouter_api_key: e.target.value })}
                    className="font-mono text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter your OpenRouter API key (sk-or-v1-...) here.
                </p>
              </div>

              {/* OpenRouter Gemini Model */}
              <div className="space-y-1.5">
                <Label htmlFor="openrouter_model" className="text-xs font-semibold text-slate-700">
                  Gemini Model (Via OpenRouter)
                </Label>
                <select
                  id="openrouter_model"
                  value={settings.openrouter_model || "google/gemini-2.5-flash"}
                  onChange={(e) => setSettings({ ...settings, openrouter_model: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2.5 font-medium text-slate-800"
                >
                  <option value="google/gemini-2.5-flash">google/gemini-2.5-flash (Best Bangla quality & high speed)</option>
                  <option value="google/gemini-2.0-flash-001">google/gemini-2.0-flash-001 (Ultra fast & cost efficient)</option>
                  <option value="google/gemini-flash-1.5">google/gemini-flash-1.5 (Gemini 1.5 Flash)</option>
                  <option value="google/gemini-pro-1.5">google/gemini-pro-1.5 (Gemini 1.5 Pro)</option>
                </select>
              </div>

              {/* Image Provider */}
              <div className="space-y-1.5">
                <Label htmlFor="image_provider" className="text-xs font-semibold text-slate-700">
                  Image Generator Engine
                </Label>
                <select
                  id="image_provider"
                  value={settings.image_provider || "pollinations"}
                  onChange={(e) => setSettings({ ...settings, image_provider: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2.5 font-medium text-slate-800"
                >
                  <option value="pollinations">FLUX / Pollinations.ai (Fast, Photorealistic & Free)</option>
                  <option value="gemini">Google Imagen 3 (Via Gemini)</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isPending}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm py-2.5"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: NEWS SOURCES & CATEGORY SECTIONS MANAGEMENT */}
      {activeTab === "sources" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">News Portals & Category Sections</h2>
              <p className="text-xs text-slate-500">
                Link multiple category section pages or RSS feeds under portals for automated news aggregation
              </p>
            </div>
            <Button
              onClick={() => {
                setIsAddingSource(true);
                setRssDetectionResult(null);
                setActivePortalForSection(null);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium self-start sm:self-auto gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Portal
            </Button>
          </div>

          {/* Add Section to Portal Modal/Card */}
          {activePortalForSection && (
            <Card className="border-indigo-300 bg-indigo-50/30 shadow-md animate-in fade-in duration-200">
              <CardContent className="p-4 sm:p-5">
                <form onSubmit={handleAddSection} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                        <ListPlus className="w-4 h-4 text-indigo-600" />
                        <span>{activePortalForSection.name}</span> — Link New Category Section
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Map a specific section page or feed of this portal to a category on your site
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActivePortalForSection(null)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Filter Mode Selector */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-800">Collection Filter Policy *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setNewSection({ ...newSection, filter_mode: "none" })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          newSection.filter_mode === "none"
                            ? "border-purple-600 bg-purple-50/60 text-purple-900 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              newSection.filter_mode === "none" ? "border-purple-600 bg-purple-600" : "border-slate-300"
                            }`}
                          >
                            {newSection.filter_mode === "none" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </span>
                          Category Page (No Filter — Direct Ingestion)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          All news from this section page will be directly posted to your selected category.
                        </p>
                      </div>

                      <div
                        onClick={() => setNewSection({ ...newSection, filter_mode: "keyword" })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          newSection.filter_mode === "keyword"
                            ? "border-amber-600 bg-amber-50/60 text-amber-900 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              newSection.filter_mode === "keyword" ? "border-amber-600 bg-amber-600" : "border-slate-300"
                            }`}
                          >
                            {newSection.filter_mode === "keyword" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </span>
                          General Feed / Homepage (Keyword Filter)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          News from this feed will be filtered and mapped matching your category keywords.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section Name, Feed Type & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Section Name *</Label>
                      <Input
                        placeholder="e.g. Admission Test or Jobs"
                        value={newSection.name}
                        onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                        required
                        className="bg-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Feed Type *</Label>
                      <select
                        value={newSection.feed_type}
                        onChange={(e) => setNewSection({ ...newSection, feed_type: e.target.value as "scraper" | "rss" })}
                        className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-800"
                      >
                        <option value="scraper">Web Scraper</option>
                        <option value="rss">RSS Feed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        {newSection.filter_mode === "none" ? "Target Category (Where to post) *" : "Mapped Category (Optional)"}
                      </Label>
                      <select
                        value={newSection.category_id}
                        onChange={(e) => setNewSection({ ...newSection, category_id: e.target.value })}
                        required={newSection.filter_mode === "none"}
                        className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-800"
                      >
                        <option value="">Select Category...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Section URL */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Full Section Page / Feed URL *</Label>
                    <Input
                      placeholder="https://thedailycampus.com/section/admission-test/110"
                      type="url"
                      value={newSection.section_url}
                      onChange={(e) => setNewSection({ ...newSection, section_url: e.target.value })}
                      required
                      className="bg-white text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActivePortalForSection(null)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                      {isPending ? "Adding..." : "Add Section"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Add Portal Modal */}
          {isAddingSource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                onClick={() => {
                  if (!isPending) setIsAddingSource(false);
                }}
                aria-hidden="true"
              />

              {/* Modal Box */}
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-portal-title"
                className="relative w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto z-10"
              >
                <form onSubmit={handleAddSource} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 id="add-portal-title" className="text-sm font-bold text-slate-900">
                          Add New News Portal
                        </h3>
                        <p className="text-xs text-slate-500">
                          Link a news portal to manage its feeds and category sections
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingSource(false)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Portal Name *</Label>
                      <Input
                        placeholder="e.g. Prothom Alo or The Daily Star"
                        value={newSource.name}
                        onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                        required
                        className="bg-white text-xs h-9"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-slate-700">Main Website URL *</Label>
                        {newSource.website_url.trim().length > 4 && !isDetectingRss && !rssDetectionResult?.tested && (
                          <button
                            type="button"
                            onClick={() => runDetectRss()}
                            className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" /> Auto-Detect Feed
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="https://www.prothomalo.com"
                          type="url"
                          value={newSource.website_url}
                          onChange={(e) => {
                            setNewSource({ ...newSource, website_url: e.target.value });
                            if (rssDetectionResult) setRssDetectionResult(null);
                          }}
                          onBlur={() => {
                            if (newSource.website_url.trim().length > 6 && !rssDetectionResult && !isDetectingRss) {
                              runDetectRss();
                            }
                          }}
                          required
                          className="bg-white text-xs h-9 pr-8"
                        />
                        {isDetectingRss && (
                          <div className="absolute right-2.5 top-2.5">
                            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RSS Auto-Detection Status Card (Automated, no manual URL entry) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-slate-700">Feed Ingestion Mode</Label>
                        {rssDetectionResult?.tested && (
                          <button
                            type="button"
                            onClick={() => runDetectRss()}
                            disabled={isDetectingRss}
                            className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                          >
                            <RefreshCw className={`w-3 h-3 ${isDetectingRss ? "animate-spin" : ""}`} /> Re-scan
                          </button>
                        )}
                      </div>

                      {/* State 1: Scanning in progress */}
                      {isDetectingRss && (
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5 flex items-start gap-3 animate-pulse">
                          <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-indigo-950">Auto-Detecting RSS Feed...</div>
                            <div className="text-[11px] text-indigo-700 mt-0.5">
                              Scanning HTML alternate tags, WordPress endpoints, and standard paths.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* State 2: Feed Auto-Detected & Validated */}
                      {!isDetectingRss && rssDetectionResult?.found && rssDetectionResult.feed_url && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              RSS Feed Auto-Detected & Validated
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              Active RSS
                            </span>
                          </div>
                          <div className="font-mono text-[11px] text-emerald-950 bg-white/90 p-2 rounded-lg border border-emerald-100 truncate select-all">
                            {rssDetectionResult.feed_url}
                          </div>
                          <p className="text-[11px] text-emerald-700">
                            Legitimate XML feed verified. New articles will be collected automatically through this feed.
                          </p>
                        </div>
                      )}

                      {/* State 3: Tested and No RSS Feed Found */}
                      {!isDetectingRss && rssDetectionResult?.tested && !rssDetectionResult.found && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                              <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                              No RSS Feed Available
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                              Web Scraper
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            No valid RSS/Atom feed was published on this portal. Articles will be automatically aggregated using the Web Scraper engine.
                          </p>
                        </div>
                      )}

                      {/* State 4: Idle (not scanned yet) */}
                      {!isDetectingRss && !rssDetectionResult?.tested && (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <Rss className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Auto RSS Discovery</p>
                              <p className="text-[11px] text-slate-500">
                                You don't need to provide an RSS URL. The system scans and validates feeds automatically.
                              </p>
                            </div>
                          </div>
                          {newSource.website_url.trim().length > 3 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => runDetectRss()}
                              className="h-7 text-[11px] px-2.5 font-medium shrink-0 bg-white hover:bg-slate-50"
                            >
                              Scan Feed
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingSource(false)}
                      disabled={isPending}
                      className="text-xs h-9 px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 px-4 gap-1.5"
                    >
                      {isPending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Save Portal
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Sources Table: Single Portal Rows with Nested Category Sections */}
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5 w-10"></th>
                    <th className="p-3.5">News Portal</th>
                    <th className="p-3.5">Linked Category Sections</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Total Fetched</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sources.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">
                        No news sources found
                      </td>
                    </tr>
                  ) : (
                    sources.map((source) => {
                      const isExpanded = !!expandedSources[source.id];
                      const sectionsCount = source.sections?.length || 0;

                      return (
                        <div key={source.id} className="contents">
                          {/* Portal Main Row */}
                          <tr className={`transition-colors ${isExpanded ? "bg-slate-50/90 font-medium" : "hover:bg-slate-50/70"}`}>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => toggleExpandSource(source.id)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-transform"
                                title={isExpanded ? "Collapse" : "View category sections"}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-slate-700" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-500" />
                                )}
                              </button>
                            </td>

                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs sm:text-sm">{source.name}</span>
                              </div>
                              <a
                                href={source.website_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 mt-0.5"
                              >
                                {source.website_url.replace(/^https?:\/\//, "")}
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                            </td>

                            <td className="p-3.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {sectionsCount} sections
                                </span>
                                {source.sections && source.sections.length > 0 ? (
                                  source.sections.map((sec) => (
                                    <span
                                      key={sec.id}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                                      title={`Link: ${sec.section_url}`}
                                    >
                                      {sec.name}
                                      {sec.category && (
                                        <span className="text-slate-400 font-normal">➔ {sec.category.title}</span>
                                      )}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic">No sections linked</span>
                                )}
                              </div>
                            </td>

                            <td className="p-3.5">
                              {source.has_rss ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Rss className="w-3 h-3" /> RSS Feed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                  <Globe className="w-3 h-3" /> Scraper
                                </span>
                              )}
                            </td>

                            <td className="p-3.5 font-bold text-slate-900">{source.total_fetched || 0} items</td>

                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleSource(source.id)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                                  source.status === "active"
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                              >
                                {source.status === "active" ? "Active" : "Inactive"}
                              </button>
                            </td>

                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setActivePortalForSection(source);
                                    setNewSection({
                                      name: "",
                                      section_url: source.website_url ? `${source.website_url}/section/` : "",
                                      feed_type: source.has_rss ? "rss" : "scraper",
                                      category_id: "",
                                      filter_mode: "none",
                                    });
                                  }}
                                  className="h-7 text-[11px] px-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                                  title="Add new category section to this portal"
                                >
                                  <Plus className="w-3.5 h-3.5 mr-1" />
                                  Link Section
                                </Button>
                                <button
                                  onClick={() => handleDeleteSource(source.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Delete portal"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Nested Accordion for Linked Category Sections */}
                          {isExpanded && (
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                              <td colSpan={7} className="p-3 sm:p-4">
                                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                                  <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-slate-800">
                                        {source.name} Category Pages & Feeds ({sectionsCount})
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setActivePortalForSection(source);
                                        setNewSection({
                                          name: "",
                                          section_url: source.website_url ? `${source.website_url}/section/` : "",
                                          feed_type: source.has_rss ? "rss" : "scraper",
                                          category_id: "",
                                          filter_mode: "none",
                                        });
                                      }}
                                      className="h-6 text-[11px] px-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                    >
                                      <Plus className="w-3 h-3 mr-1" /> Add Section
                                    </Button>
                                  </div>

                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                      <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100 text-[10px] uppercase font-semibold">
                                        <tr>
                                          <th className="p-2.5 pl-4">Section Name</th>
                                          <th className="p-2.5">Target Category</th>
                                          <th className="p-2.5">Filter Policy</th>
                                          <th className="p-2.5">Feed Type</th>
                                          <th className="p-2.5">Page / Feed Link</th>
                                          <th className="p-2.5">Fetched</th>
                                          <th className="p-2.5">Status</th>
                                          <th className="p-2.5 text-right pr-4">Delete</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {!source.sections || source.sections.length === 0 ? (
                                          <tr>
                                            <td colSpan={8} className="p-4 text-center text-slate-400 italic">
                                              No category sections added yet. Click &apos;Add Section&apos; to add one.
                                            </td>
                                          </tr>
                                        ) : (
                                          source.sections.map((section) => (
                                            <tr key={section.id} className="hover:bg-slate-50/70 transition-colors">
                                              <td className="p-2.5 pl-4 font-bold text-slate-900">{section.name}</td>
                                              <td className="p-2.5">
                                                {section.category ? (
                                                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                    {section.category.title}
                                                  </span>
                                                ) : (
                                                  <span className="text-slate-400 italic">General</span>
                                                )}
                                              </td>
                                              <td className="p-2.5">
                                                {section.filter_mode === "none" ? (
                                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                                    No Filter (Direct)
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                    Keyword Filter
                                                  </span>
                                                )}
                                              </td>
                                              <td className="p-2.5">
                                                {section.feed_type === "rss" ? (
                                                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                                                    <Rss className="w-3 h-3" /> RSS
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-medium">
                                                    <Globe className="w-3 h-3" /> Scraper
                                                  </span>
                                                )}
                                              </td>
                                              <td className="p-2.5 max-w-[220px] truncate">
                                                <a
                                                  href={section.section_url}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 hover:underline"
                                                  title={section.section_url}
                                                >
                                                  <span className="truncate">{section.section_url.replace(/^https?:\/\//, "")}</span>
                                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                </a>
                                              </td>
                                              <td className="p-2.5 font-semibold text-slate-800">{section.total_fetched || 0} items</td>
                                              <td className="p-2.5">
                                                <button
                                                  onClick={() => handleToggleSection(source.id, section.id)}
                                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                                    section.status === "active"
                                                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                  }`}
                                                >
                                                  {section.status === "active" ? "Active" : "Inactive"}
                                                </button>
                                              </td>
                                              <td className="p-2.5 text-right pr-4">
                                                <button
                                                  onClick={() => handleDeleteSection(source.id, section.id)}
                                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                                  title="Delete section"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </td>
                                            </tr>
                                          ))
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </div>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: CATEGORY KEYWORDS MAPPING */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Category & Keyword Mapping (Keyword Matching Rules)</h2>
              <p className="text-xs text-slate-500">
                Add relevant tags/keywords to each category. The AI model will match articles to categories based on these tags.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {categories.map((cat) => (
              <Card key={cat.id} className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="md:w-1/4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      <h3 className="font-bold text-sm text-slate-900">{cat.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 ml-4.5 block mt-0.5">
                      /{cat.slug}
                    </span>
                  </div>

                  {/* Keywords Tag List & Input */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                      {(cat.match_keywords || []).length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No tags added</span>
                      ) : (
                        cat.match_keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            {kw}
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(cat.id, kw)}
                              className="text-slate-400 hover:text-rose-600 ml-1 text-sm font-bold leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Add Keyword Input Box */}
                    <div className="flex items-center gap-2 max-w-md">
                      <Input
                        placeholder="Type a new tag (e.g. Admission, Jobs)..."
                        value={newKeywordInput[cat.id] || ""}
                        onChange={(e) => setNewKeywordInput({ ...newKeywordInput, [cat.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddKeyword(cat.id);
                          }
                        }}
                        className="text-xs h-8"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddKeyword(cat.id)}
                        variant="outline"
                        className="h-8 text-xs px-2.5"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    </div>
                  </div>

                  {/* Save button for this category */}
                  <div className="flex md:flex-col justify-end">
                    <Button
                      onClick={() => handleSaveKeywords(cat.id)}
                      disabled={isPending}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-3"
                    >
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Save
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FETCH LOGS & HISTORY */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">News Ingestion History & Logs</h2>
              <p className="text-xs text-slate-500">Recent aggregated articles and AI processing status</p>
            </div>
            <Button
              onClick={() => {
                getAutoNewsLogsAction(1, 15).then((res) => {
                  if (res.success) setLogs(res.items);
                });
              }}
              variant="outline"
              className="text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Original Article & Source</th>
                    <th className="p-3.5">AI Rewritten Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        No news articles collected yet
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 text-slate-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString("en-US", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="p-3.5 max-w-[220px]">
                          <div className="font-semibold text-slate-900 truncate" title={log.original_title}>
                            {log.original_title}
                          </div>
                          <span className="text-[11px] text-indigo-600 block truncate font-medium">
                            {log.news_source?.name || "External Portal"}
                          </span>
                        </td>
                        <td className="p-3.5 max-w-[260px]">
                          {log.news ? (
                            <Link
                              href={`/admin/news/${log.news.id}/edit`}
                              className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                              title={log.news.title}
                            >
                              {log.news.title}
                            </Link>
                          ) : (
                            <span className="text-slate-400 italic">Not processed</span>
                          )}
                          {log.error_message && (
                            <span className="text-[11px] text-rose-600 line-clamp-1 font-mono mt-0.5">
                              {log.error_message}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {log.assigned_category ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                              {log.assigned_category.title}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {log.status === "success" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" /> Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700">
                              <XCircle className="w-3 h-3" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <a
                            href={log.original_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-600 font-medium"
                            title="View original article"
                          >
                            Original <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
