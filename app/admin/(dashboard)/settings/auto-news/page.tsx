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
  Radio,
  Image as ImageIcon,
  Play,
  Layers,
  ChevronDown,
  ChevronRight,
  ListPlus,
  X,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Crown,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  reorderNewsSourcesAction,
  createNewsSourceSectionAction,
  updateNewsSourceSectionAction,
  deleteNewsSourceSectionAction,
  toggleNewsSourceSectionAction,
  aiDetectPortalSectionsAction,
  batchSaveNewsSourceSectionsAction,
  getCategoryKeywordsAction,
  updateCategoryKeywordsAction,
  generateCategoryKeywordsAction,
  getAutoNewsLogsAction,
  triggerAutoNewsAction,
  type AutoNewsSettings,
  type NewsSourceItem,
  type NewsSourceSectionItem,
  type AiDetectedCategoryItem,
  type CategoryWithKeywords,
  type AutoNewsLogItem,
} from "@/lib/api/admin/auto-news-actions";
import { AiNewsCreator } from "@/components/admin/auto-news/AiNewsCreator";

type ActiveTab = "creator" | "settings" | "sources" | "categories";

type SortableNewsSourceTBodyProps = {
  source: NewsSourceItem;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onToggleStatus: () => void;
  onOpenAddSection: () => void;
  onEditSection?: (source: NewsSourceItem, section: NewsSourceSectionItem) => void;
  onDeleteSource: () => void;
  onDeleteSection: (sourceId: number, sectionId: number) => void;
  onToggleSection: (sourceId: number, sectionId: number) => void;
};

function SortableNewsSourceTBody({
  source,
  index,
  total,
  isExpanded,
  onToggleExpand,
  onMove,
  onToggleStatus,
  onOpenAddSection,
  onEditSection,
  onDeleteSource,
  onDeleteSection,
  onToggleSection,
}: SortableNewsSourceTBodyProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: source.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 40 : undefined,
    position: isDragging ? "relative" : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  const sectionsCount = source.sections?.length || 0;

  return (
    <tbody
      ref={setNodeRef}
      style={style}
      className={`divide-y divide-slate-100 transition-colors ${
        isDragging ? "bg-indigo-50/80 shadow-md ring-1 ring-indigo-300" : ""
      }`}
    >
      {/* Portal Main Row */}
      <tr className={`transition-colors ${isExpanded ? "bg-slate-50/90 font-medium" : "hover:bg-slate-50/70"}`}>
        {/* Order / Priority Controls */}
        <td className="p-3 text-center whitespace-nowrap">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              aria-label={`Drag to reorder ${source.name}`}
              className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 cursor-grab active:cursor-grabbing touch-none transition-colors"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onMove(index, -1)}
                title="Move Up"
                className="p-0.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={index === total - 1}
                onClick={() => onMove(index, 1)}
                title="Move Down"
                className="p-0.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200/70 transition-colors disabled:opacity-20 disabled:pointer-events-none"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </td>

        {/* Expand Caret */}
        <td className="p-3 text-center">
          <button
            type="button"
            onClick={onToggleExpand}
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

        {/* News Portal Name & Link */}
        <td className="p-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 text-xs sm:text-sm">{source.name}</span>
            {index === 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                #1 Top Priority
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                #{index + 1}
              </span>
            )}
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

        {/* Linked Category Sections */}
        <td className="p-3.5">
          {sectionsCount > 0 ? (
            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors"
              title={isExpanded ? "Collapse sections" : "Click to view sections"}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {sectionsCount} {sectionsCount === 1 ? "section" : "sections"}
              </span>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </button>
          ) : (
            <span className="text-xs text-slate-400 italic">0 sections</span>
          )}
        </td>

        {/* Type */}
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

        {/* Total Fetched */}
        <td className="p-3.5 font-bold text-slate-900">{source.total_fetched || 0} items</td>

        {/* Status */}
        <td className="p-3.5">
          <button
            onClick={onToggleStatus}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
              source.status === "active"
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {source.status === "active" ? "Active" : "Inactive"}
          </button>
        </td>

        {/* Actions */}
        <td className="p-3.5 text-right whitespace-nowrap">
          <div className="inline-flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenAddSection}
              className="h-7 text-[11px] px-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              title="Add new category section to this portal"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Link Section
            </Button>
            <button
              onClick={onDeleteSource}
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
          <td colSpan={8} className="p-3 sm:p-4">
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
                  onClick={onOpenAddSection}
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
                              onClick={() => onToggleSection(source.id, section.id)}
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
                            <div className="inline-flex items-center gap-1">
                              {onEditSection && (
                                <button
                                  type="button"
                                  onClick={() => onEditSection(source, section)}
                                  className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                  title="Edit section"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => onDeleteSection(source.id, section.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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
    </tbody>
  );
}

export default function AutoNewsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("settings");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Settings state
  const [settings, setSettings] = useState<AutoNewsSettings>({
    enabled: true,
    daily_limit: 20,
    calculated_category_limit: 4,
    base_category_share: 2,
    active_categories_count: 12,
    categories_distribution: [],
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
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [newSection, setNewSection] = useState({
    name: "",
    section_url: "",
    feed_type: "scraper" as "scraper" | "rss",
    category_id: "" as string | number,
    filter_mode: "none" as "none" | "keyword",
    status: "active" as "active" | "inactive",
  });

  // AI Category Detection State
  const [isDetectingAi, setIsDetectingAi] = useState(false);
  const [isBatchSaving, setIsBatchSaving] = useState(false);
  const [aiDetectedList, setAiDetectedList] = useState<
    (AiDetectedCategoryItem & { selected: boolean })[]
  >([]);

  // Categories state
  const [categories, setCategories] = useState<CategoryWithKeywords[]>([]);
  const [newKeywordInput, setNewKeywordInput] = useState<Record<number, string>>({});
  const [generatingCatId, setGeneratingCatId] = useState<number | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Manual Trigger state
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerLimit, setTriggerLimit] = useState<number>(1);

  // Load Initial Data
  async function loadData() {
    setIsLoading(true);
    try {
      const [settingsRes, sourcesRes, categoriesRes] = await Promise.all([
        getAutoNewsSettingsAction(),
        getNewsSourcesAction(),
        getCategoryKeywordsAction(),
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
    } catch {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as ActiveTab;
      if (tabParam && ["creator", "settings", "sources", "categories"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Handle ESC key and scroll lock when Add Portal or Link Section modal is open
  useEffect(() => {
    if (!isAddingSource && !activePortalForSection) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        setIsAddingSource(false);
        setActivePortalForSection(null);
        setEditingSectionId(null);
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddingSource, activePortalForSection, isPending]);

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

  // Drag and drop sensors for news source priority reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sources.findIndex((s) => s.id === active.id);
    const newIndex = sources.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newSources = arrayMove(sources, oldIndex, newIndex);
    setSources(newSources);

    startTransition(async () => {
      const res = await reorderNewsSourcesAction(newSources.map((s) => s.id));
      if (!res.success) {
        toast.error(res.message || "Failed to update source priority");
        loadData();
      } else {
        toast.success(`Priority updated: ${newSources[0].name} is now #1 (Top Priority)`);
      }
    });
  }

  function handleMoveSource(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sources.length) return;

    const newSources = arrayMove(sources, index, newIndex);
    setSources(newSources);

    startTransition(async () => {
      const res = await reorderNewsSourcesAction(newSources.map((s) => s.id));
      if (!res.success) {
        toast.error(res.message || "Failed to update source priority");
        loadData();
      } else {
        toast.success(`Priority updated: ${newSources[0].name} is now #1 (Top Priority)`);
      }
    });
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
      if (editingSectionId === sectionId) {
        handleCancelEditSection();
      }
    } else {
      toast.error(res.message);
    }
  }

  // Start editing a section
  function handleStartEditSection(section: NewsSourceSectionItem) {
    setEditingSectionId(section.id);
    setNewSection({
      name: section.name,
      section_url: section.section_url,
      feed_type: section.feed_type,
      category_id: section.category_id ? String(section.category_id) : "",
      filter_mode: section.filter_mode,
      status: section.status || "active",
    });
  }

  // Cancel edit mode and reset form
  function handleCancelEditSection() {
    setEditingSectionId(null);
    setNewSection({
      name: "",
      section_url: activePortalForSection?.website_url
        ? `${activePortalForSection.website_url.replace(/\/+$/, "")}/section/`
        : "",
      feed_type: activePortalForSection?.has_rss ? "rss" : "scraper",
      category_id: "",
      filter_mode: "none",
      status: "active",
    });
  }

  // Open section modal (optionally in edit mode)
  function handleOpenSectionModal(source: NewsSourceItem, editSection?: NewsSourceSectionItem) {
    setActivePortalForSection(source);
    if (editSection) {
      setEditingSectionId(editSection.id);
      setNewSection({
        name: editSection.name,
        section_url: editSection.section_url,
        feed_type: editSection.feed_type,
        category_id: editSection.category_id ? String(editSection.category_id) : "",
        filter_mode: editSection.filter_mode,
        status: editSection.status || "active",
      });
    } else {
      setEditingSectionId(null);
      setNewSection({
        name: "",
        section_url: source.website_url ? `${source.website_url.replace(/\/+$/, "")}/section/` : "",
        feed_type: source.has_rss ? "rss" : "scraper",
        category_id: "",
        filter_mode: "none",
        status: "active",
      });
    }
  }

  // Save (Add or Update) Section to Portal
  async function handleSaveSection(e: React.FormEvent) {
    e.preventDefault();
    if (!activePortalForSection) return;
    if (!newSection.name.trim() || !newSection.section_url.trim()) {
      toast.error("Please enter section name and URL");
      return;
    }

    startTransition(async () => {
      if (editingSectionId) {
        const res = await updateNewsSourceSectionAction(activePortalForSection.id, editingSectionId, {
          name: newSection.name.trim(),
          section_url: newSection.section_url.trim(),
          feed_type: newSection.feed_type,
          category_id: newSection.category_id ? Number(newSection.category_id) : null,
          filter_mode: newSection.filter_mode,
          status: newSection.status,
        });

        if (res.success && res.section) {
          toast.success(res.message);
          const updated = res.section;
          setSources((prev) =>
            prev.map((s) => {
              if (s.id !== activePortalForSection.id) return s;
              return {
                ...s,
                sections: (s.sections || []).map((sec) => (sec.id === editingSectionId ? updated : sec)),
              };
            })
          );
          handleCancelEditSection();
        } else {
          toast.error(res.message || "Failed to update section");
        }
      } else {
        const res = await createNewsSourceSectionAction(activePortalForSection.id, {
          name: newSection.name.trim(),
          section_url: newSection.section_url.trim(),
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
          // Reset form to add another section without closing modal
          setNewSection({
            name: "",
            section_url: activePortalForSection.website_url
              ? `${activePortalForSection.website_url.replace(/\/+$/, "")}/section/`
              : "",
            feed_type: activePortalForSection.has_rss ? "rss" : "scraper",
            category_id: "",
            filter_mode: "none",
            status: "active",
          });
        } else {
          toast.error(res.message || "Failed to add section");
        }
      }
    });
  }

  // Trigger AI Auto-Detection of Portal Categories
  async function handleRunAiDetection() {
    if (!activePortalForSection) return;
    setIsDetectingAi(true);
    try {
      const res = await aiDetectPortalSectionsAction(activePortalForSection.id);
      if (res.success && res.categories.length > 0) {
        setAiDetectedList(
          res.categories.map((c) => ({
            ...c,
            selected: !c.already_linked && c.matched_category_id !== null,
          }))
        );
        toast.success(`Discovered ${res.total_detected} sections and mapped with AI`);
      } else {
        toast.error(res.message || "No categories discovered for this portal");
      }
    } catch {
      toast.error("Failed to run AI category detection");
    } finally {
      setIsDetectingAi(false);
    }
  }

  // Toggle select in AI detected list
  function toggleAiDetectedItem(index: number) {
    setAiDetectedList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  }

  // Change mapped category for AI detected item
  function changeAiDetectedCategory(index: number, categoryId: string) {
    setAiDetectedList((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const catNum = categoryId ? Number(categoryId) : null;
        const matched = categories.find((c) => c.id === catNum);
        return {
          ...item,
          matched_category_id: catNum,
          matched_category_title: matched?.title || null,
          selected: catNum !== null,
        };
      })
    );
  }

  // Change filter mode for AI detected item
  function changeAiDetectedFilterMode(index: number, mode: "none" | "keyword") {
    setAiDetectedList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, filter_mode: mode } : item))
    );
  }

  // Batch Save Selected AI Detected Sections
  async function handleBatchSaveAiSections() {
    if (!activePortalForSection) return;
    const selected = aiDetectedList.filter((item) => item.selected);
    if (selected.length === 0) {
      toast.error("Please select at least one section to import");
      return;
    }

    const missingUrl = selected.find((item) => !item.section_url || !item.section_url.trim().startsWith("http"));
    if (missingUrl) {
      toast.error(`"${missingUrl.external_name}" is missing a valid section URL`);
      return;
    }

    setIsBatchSaving(true);
    try {
      const payload = selected.map((s) => ({
        name: s.external_name,
        section_url: s.section_url,
        feed_type: s.feed_type,
        category_id: s.matched_category_id,
        filter_mode: s.filter_mode,
        status: "active" as const,
      }));

      const res = await batchSaveNewsSourceSectionsAction(activePortalForSection.id, payload);
      if (res.success && res.sections) {
        toast.success(res.message);
        const imported = res.sections;
        setSources((prev) =>
          prev.map((s) => {
            if (s.id !== activePortalForSection.id) return s;
            const existingMap = new Map((s.sections || []).map((sec) => [sec.section_url, sec]));
            imported.forEach((sec) => existingMap.set(sec.section_url, sec));
            return {
              ...s,
              sections: Array.from(existingMap.values()),
            };
          })
        );
        setAiDetectedList([]);
      } else {
        toast.error(res.message || "Failed to import sections");
      }
    } catch {
      toast.error("Failed to save sections");
    } finally {
      setIsBatchSaving(false);
    }
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

  // Generate 6-10 pure Bangla keywords for a single category using AI
  async function handleGenerateAiKeywords(categoryId: number) {
    setGeneratingCatId(categoryId);
    try {
      const res = await generateCategoryKeywordsAction(categoryId, false);
      if (res.success && res.keywords && res.keywords.length > 0) {
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === categoryId) {
              return { ...cat, match_keywords: res.keywords };
            }
            return cat;
          })
        );
        toast.success(res.message || `${res.keywords.length} tags generated successfully`);
      } else {
        toast.error(res.message || "Failed to generate AI keywords");
      }
    } catch {
      toast.error("Server error, could not generate keywords");
    } finally {
      setGeneratingCatId(null);
    }
  }

  // Bulk generate 6-10 pure Bangla keywords for all categories sequentially
  async function handleGenerateAllAiKeywords() {
    if (categories.length === 0) return;
    setIsGeneratingAll(true);
    let successCount = 0;
    try {
      for (const cat of categories) {
        const res = await generateCategoryKeywordsAction(cat.id, true);
        if (res.success && res.keywords) {
          successCount++;
          setCategories((prev) =>
            prev.map((c) => (c.id === cat.id ? { ...c, match_keywords: res.keywords } : c))
          );
        }
      }
      toast.success(`${successCount}/${categories.length} categories updated with AI tags successfully`);
    } catch {
      toast.error("Failed to generate AI tags for some categories");
    } finally {
      setIsGeneratingAll(false);
    }
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
          onClick={() => setActiveTab("creator")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "creator"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-600" /> AI News Creator (লিঙ্ক / কনটেন্ট)
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

        <Link
          href="/admin/reports/auto-news-logs"
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap ml-auto"
        >
          <History className="w-4 h-4" /> View Logs in Reports &rarr;
        </Link>
      </div>

      {/* TAB 0: AI NEWS CREATOR */}
      {activeTab === "creator" && (
        <AiNewsCreator
          categories={categories}
          defaultStatus={settings.default_status}
          onSuccess={() => {
            loadData();
          }}
        />
      )}

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

              {/* Daily Limit & Auto-calculated Category Quota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Daily Limit Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="daily_limit" className="text-xs font-semibold text-slate-700">
                    Daily Total Post Quota (দৈনিক মোট পোস্ট কোটা)
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

                {/* Auto Calculated Category Cap Card */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Category Max Limit (স্বয়ংক্রিয় হিসাব)</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Auto 2x Rule
                    </span>
                  </div>
                  <div className="my-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-slate-800">
                      সর্বোচ্চ {Math.max(2, Math.round((Number(settings.daily_limit) || 20) / Math.max(1, settings.active_categories_count || 10)) * 2)}টি
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ ক্যাটাগরি</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    হিসাব: (দৈনিক কোটা {settings.daily_limit || 20} ÷ মোট ক্যাটাগরি {settings.active_categories_count || 10}) × ২
                  </p>
                </div>
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

              {/* Category Post Distribution & Quota Balance Card */}
              {settings.categories_distribution && settings.categories_distribution.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        Today&apos;s Category Quota Balance (আজকের ক্যাটাগরি ভারসাম্য)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        ক্যাটাগরি ক্যাপ পূর্ণ হলে ({settings.calculated_category_limit ?? 4}টি) নতুন খবর এলে অন্যান্য ক্যাটাগরি অগ্রাধিকার পাবে
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 w-fit">
                      Max Cap: {settings.calculated_category_limit ?? 4} / category
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                    {settings.categories_distribution.map((cat) => {
                      const isFull = cat.count >= cat.max_limit;
                      const percent = Math.min(100, Math.round((cat.count / (cat.max_limit || 1)) * 100));

                      return (
                        <div
                          key={cat.id}
                          className={`p-2.5 rounded-lg border text-xs transition-all ${
                            isFull
                              ? "bg-rose-50/70 border-rose-200 text-rose-950"
                              : cat.count > 0
                              ? "bg-white border-slate-200 text-slate-800"
                              : "bg-white/60 border-dashed border-slate-200 text-slate-500"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 font-semibold">
                            <span className="truncate" title={cat.title}>
                              {cat.title}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                                isFull
                                  ? "bg-rose-100 text-rose-800"
                                  : cat.count > 0
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {cat.count} / {cat.max_limit}
                            </span>
                          </div>
                          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull ? "bg-rose-500" : cat.count > 0 ? "bg-indigo-600" : "bg-transparent"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{isFull ? "ক্যাপ পূর্ণ (Full)" : `${cat.max_limit - cat.count} স্লট বাকি`}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
                <div>
                  <Input
                    id="openrouter_key"
                    type="password"
                    autoComplete="new-password"
                    placeholder="sk-or-v1-..."
                    value={settings.openrouter_api_key || ""}
                    onChange={(e) => setSettings({ ...settings, openrouter_api_key: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter your OpenRouter API key (sk-or-v1-...). For security, the key remains hidden and cannot be viewed.
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

          {/* Link Category Section Modal */}
          {activePortalForSection && (() => {
            const currentModalPortal =
              sources.find((s) => s.id === activePortalForSection.id) || activePortalForSection;
            const portalSections = currentModalPortal.sections || [];

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                  onClick={() => {
                    if (!isPending) {
                      setActivePortalForSection(null);
                      handleCancelEditSection();
                    }
                  }}
                  aria-hidden="true"
                />

                {/* Modal Box */}
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="link-section-title"
                  className="relative w-full max-w-4xl lg:max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col z-10 overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4 bg-slate-50/70 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 id="link-section-title" className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {currentModalPortal.name} — Category Sections & Feeds
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {portalSections.length} Linked
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePortalForSection(null);
                        handleCancelEditSection();
                      }}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors shrink-0"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
                    {/* TOP SECTION: Existing Linked Sections */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-indigo-600" />
                          Already Linked Sections ({portalSections.length})
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleRunAiDetection}
                            disabled={isDetectingAi || isPending}
                            className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-2xs"
                            title="Auto-scan portal navigation and map categories with AI"
                          >
                            {isDetectingAi ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" /> Scanning with AI...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-amber-300" /> AI Auto-Detect & Map
                              </>
                            )}
                          </Button>
                          {editingSectionId && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEditSection}
                              className="h-7 text-xs border-dashed text-slate-600 hover:text-slate-900"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" /> Switch to Add New Section
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* AI DISCOVERED CATEGORIES REVIEW PANEL */}
                      {aiDetectedList.length > 0 && (
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3.5 sm:p-4 space-y-3 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-indigo-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-indigo-600 text-white">
                                <Sparkles className="w-3.5 h-3.5" />
                              </span>
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                AI Discovered Category Mappings ({aiDetectedList.length})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setAiDetectedList((prev) =>
                                    prev.map((item) => ({ ...item, selected: !item.already_linked && item.matched_category_id !== null }))
                                  )
                                }
                                className="text-[11px] font-semibold text-indigo-700 hover:underline cursor-pointer"
                              >
                                Select All
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAiDetectedList((prev) =>
                                    prev.map((item) => ({ ...item, selected: false }))
                                  )
                                }
                                className="text-[11px] font-semibold text-slate-500 hover:underline cursor-pointer"
                              >
                                Unselect All
                              </button>
                              <button
                                type="button"
                                onClick={() => setAiDetectedList([])}
                                className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                                title="Dismiss AI suggestions"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto max-h-[280px]">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-semibold sticky top-0 z-10">
                                  <tr>
                                    <th className="p-2.5 pl-3 w-8 text-center">Import</th>
                                    <th className="p-2.5">Portal Section</th>
                                    <th className="p-2.5">Mapped Shikkhapath Category</th>
                                    <th className="p-2.5">Policy</th>
                                    <th className="p-2.5">Confidence</th>
                                    <th className="p-2.5 pr-3 text-right">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {aiDetectedList.map((item, idx) => (
                                    <tr
                                      key={idx}
                                      className={`transition-colors ${
                                        item.selected
                                          ? "bg-indigo-50/60"
                                          : item.already_linked
                                          ? "bg-slate-50/50 opacity-60"
                                          : "hover:bg-slate-50/50"
                                      }`}
                                    >
                                      <td className="p-2.5 pl-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={item.selected}
                                          disabled={item.already_linked}
                                          onChange={() => toggleAiDetectedItem(idx)}
                                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer disabled:opacity-40"
                                        />
                                      </td>
                                      <td className="p-2.5 font-bold text-slate-900">
                                        <div>{item.external_name}</div>
                                        <a
                                          href={item.section_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-600 font-normal truncate max-w-[200px]"
                                          title={item.section_url}
                                        >
                                          <span className="truncate">{item.section_url.replace(/^https?:\/\//, "")}</span>
                                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                        </a>
                                      </td>
                                      <td className="p-2.5 min-w-[170px]">
                                        <select
                                          value={item.matched_category_id !== null ? String(item.matched_category_id) : ""}
                                          onChange={(e) => changeAiDetectedCategory(idx, e.target.value)}
                                          className="w-full text-xs rounded-md border border-slate-300 bg-white p-1.5 h-8 font-medium text-slate-800"
                                        >
                                          <option value="">No Match (Skip)</option>
                                          {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                              {cat.title}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td className="p-2.5">
                                        <select
                                          value={item.filter_mode}
                                          onChange={(e) =>
                                            changeAiDetectedFilterMode(idx, e.target.value as "none" | "keyword")
                                          }
                                          className="text-[11px] rounded-md border border-slate-300 bg-white p-1 h-8 text-slate-700"
                                        >
                                          <option value="none">Direct Ingestion</option>
                                          <option value="keyword">Keyword Filter</option>
                                        </select>
                                      </td>
                                      <td className="p-2.5">
                                        {item.confidence === "high" ? (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                            High
                                          </span>
                                        ) : item.confidence === "medium" ? (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                            Medium
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                            Low / None
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-2.5 pr-3 text-right whitespace-nowrap">
                                        {item.already_linked ? (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">
                                            Already Linked
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                                            New Section
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                            <span className="text-xs text-slate-600 font-medium">
                              {aiDetectedList.filter((i) => i.selected).length} sections selected for import
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setAiDetectedList([])}
                                disabled={isBatchSaving}
                                className="text-xs h-8 px-3"
                              >
                                Discard
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={handleBatchSaveAiSections}
                                disabled={isBatchSaving || aiDetectedList.filter((i) => i.selected).length === 0}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 px-4 gap-1.5 shadow-xs"
                              >
                                {isBatchSaving ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" /> Importing...
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3" /> Save Mapped Sections (
                                    {aiDetectedList.filter((i) => i.selected).length})
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {portalSections.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center">
                          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                            <Layers className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-slate-700">No category sections linked yet</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Use the form below to link your first category section or RSS feed for {currentModalPortal.name}.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                          <div className="overflow-x-auto max-h-[260px]">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-semibold sticky top-0 z-10">
                                <tr>
                                  <th className="p-2.5 pl-3.5">Section Name</th>
                                  <th className="p-2.5">Target Category</th>
                                  <th className="p-2.5">Filter Policy</th>
                                  <th className="p-2.5">Feed Type</th>
                                  <th className="p-2.5">Page / Feed URL</th>
                                  <th className="p-2.5 text-center">Status</th>
                                  <th className="p-2.5 text-right pr-3.5">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                                {portalSections.map((sec) => {
                                  const isBeingEdited = editingSectionId === sec.id;
                                  return (
                                    <tr
                                      key={sec.id}
                                      className={`transition-colors ${
                                        isBeingEdited
                                          ? "bg-indigo-50/90 font-medium"
                                          : "hover:bg-slate-50/80"
                                      }`}
                                    >
                                      <td className="p-2.5 pl-3.5 font-bold text-slate-900">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span>{sec.name}</span>
                                          {isBeingEdited && (
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-600 text-white">
                                              Editing Now
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="p-2.5">
                                        {sec.category ? (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            {sec.category.title}
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 italic text-[11px]">General</span>
                                        )}
                                      </td>
                                      <td className="p-2.5">
                                        {sec.filter_mode === "none" ? (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                            Direct Ingestion
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                            Keyword Filter
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-2.5">
                                        {sec.feed_type === "rss" ? (
                                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                                            <Rss className="w-3 h-3" /> RSS
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-semibold">
                                            <Globe className="w-3 h-3" /> Scraper
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-2.5 max-w-[200px] truncate">
                                        <a
                                          href={sec.section_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 truncate max-w-full"
                                          title={sec.section_url}
                                        >
                                          <span className="truncate">{sec.section_url.replace(/^https?:\/\//, "")}</span>
                                          <ExternalLink className="w-3 h-3 shrink-0" />
                                        </a>
                                      </td>
                                      <td className="p-2.5 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleSection(currentModalPortal.id, sec.id)}
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                            sec.status === "active"
                                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                          }`}
                                          title="Click to toggle status"
                                        >
                                          {sec.status === "active" ? "Active" : "Inactive"}
                                        </button>
                                      </td>
                                      <td className="p-2.5 text-right pr-3.5 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1">
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleStartEditSection(sec)}
                                            className={`h-7 px-2 text-xs gap-1 ${
                                              isBeingEdited
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                            }`}
                                            title="Edit this section"
                                          >
                                            <Pencil className="w-3 h-3" />
                                            <span>Edit</span>
                                          </Button>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteSection(currentModalPortal.id, sec.id)}
                                            className="h-7 px-2 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                                            title="Delete this section"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BOTTOM SECTION: Add New Entry / Edit Section Form */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-1.5 rounded-lg ${
                              editingSectionId
                                ? "bg-amber-100 text-amber-800"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {editingSectionId ? <Pencil className="w-4 h-4" /> : <ListPlus className="w-4 h-4" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {editingSectionId ? "Edit Category Section" : "Add New Category Section Entry"}
                            </h4>
                          </div>
                        </div>
                        {editingSectionId && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEditSection}
                            className="h-7 text-xs text-slate-600 hover:text-slate-900"
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </div>

                      <form onSubmit={handleSaveSection} className="space-y-4">
                        {/* Filter Mode Selector */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-700">Collection Filter Policy *</Label>
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
                                    newSection.filter_mode === "none"
                                      ? "border-purple-600 bg-purple-600"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {newSection.filter_mode === "none" && (
                                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                  )}
                                </span>
                                Category Page (Direct Ingestion)
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
                                    newSection.filter_mode === "keyword"
                                      ? "border-amber-600 bg-amber-600"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {newSection.filter_mode === "keyword" && (
                                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                  )}
                                </span>
                                General Feed (Keyword Filter)
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                News from this feed will be filtered and mapped matching your category keywords.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Section Name, Feed Type, Target Category & Optional Status */}
                        <div
                          className={`grid grid-cols-1 ${
                            editingSectionId ? "sm:grid-cols-4" : "sm:grid-cols-3"
                          } gap-3`}
                        >
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-slate-700">Section Name *</Label>
                            <Input
                              placeholder="e.g. Admission Test or Jobs"
                              value={newSection.name}
                              onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                              required
                              className="bg-white text-xs h-9"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-slate-700">Feed Type *</Label>
                            <select
                              value={newSection.feed_type}
                              onChange={(e) =>
                                setNewSection({
                                  ...newSection,
                                  feed_type: e.target.value as "scraper" | "rss",
                                })
                              }
                              className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 h-9 font-medium text-slate-800"
                            >
                              <option value="scraper">Web Scraper</option>
                              <option value="rss">RSS Feed</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-slate-700">
                              {newSection.filter_mode === "none" ? "Target Category *" : "Mapped Category"}
                            </Label>
                            <select
                              value={newSection.category_id}
                              onChange={(e) => setNewSection({ ...newSection, category_id: e.target.value })}
                              required={newSection.filter_mode === "none"}
                              className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 h-9 font-medium text-slate-800"
                            >
                              <option value="">Select Category...</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {editingSectionId && (
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-slate-700">Status *</Label>
                              <select
                                value={newSection.status || "active"}
                                onChange={(e) =>
                                  setNewSection({
                                    ...newSection,
                                    status: e.target.value as "active" | "inactive",
                                  })
                                }
                                className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 h-9 font-medium text-slate-800"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Section URL */}
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">Full Section Page / Feed URL *</Label>
                          <Input
                            placeholder="https://example.com/section/..."
                            type="url"
                            value={newSection.section_url}
                            onChange={(e) => setNewSection({ ...newSection, section_url: e.target.value })}
                            required
                            className="bg-white text-xs h-9"
                          />
                        </div>

                        {/* Form Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                          {editingSectionId ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancelEditSection}
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
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating...
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" /> Update Section
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="submit"
                              disabled={isPending}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 px-4 gap-1.5"
                            >
                              {isPending ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Adding...
                                </>
                              ) : (
                                <>
                                  <ListPlus className="w-3.5 h-3.5" /> Add Section
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="border-t border-slate-200 px-5 sm:px-6 py-3 bg-slate-50/70 flex items-center justify-end shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setActivePortalForSection(null);
                        handleCancelEditSection();
                      }}
                      disabled={isPending}
                      className="text-xs h-9 px-5"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}

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

          {/* Priority Explanation Banner */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 flex items-start gap-3 text-xs text-indigo-950">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Prioritized Aggregation Pipeline</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Portals are aggregated in the exact priority order listed below. The source at position <strong className="text-amber-800 font-bold">#1 (Top Priority)</strong> gets first quota preference, its duplicate news topics take precedence over lower sources, and its news is published at the top of the feed. Drag rows by the <GripVertical className="w-3.5 h-3.5 inline mx-0.5 text-slate-500" /> handle or use the <ArrowUp className="w-3 h-3 inline text-slate-600" /> <ArrowDown className="w-3 h-3 inline text-slate-600" /> buttons to adjust priority.
              </p>
            </div>
          </div>

          {/* Sources Table: Single Portal Rows with Nested Category Sections & Drag-Drop Reorder */}
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sources.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                      <tr>
                        <th className="p-3 w-16 text-center" title="Reorder Priority">Priority</th>
                        <th className="p-3 w-10 text-center"></th>
                        <th className="p-3.5">News Portal</th>
                        <th className="p-3.5">Linked Category Sections</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Total Fetched</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    {sources.length === 0 ? (
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400">
                            No news sources found
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      sources.map((source, index) => (
                        <SortableNewsSourceTBody
                          key={source.id}
                          source={source}
                          index={index}
                          total={sources.length}
                          isExpanded={!!expandedSources[source.id]}
                          onToggleExpand={() => toggleExpandSource(source.id)}
                          onMove={handleMoveSource}
                          onToggleStatus={() => handleToggleSource(source.id)}
                          onOpenAddSection={() => handleOpenSectionModal(source)}
                          onEditSection={(src, sec) => handleOpenSectionModal(src, sec)}
                          onDeleteSource={() => handleDeleteSource(source.id)}
                          onDeleteSection={handleDeleteSection}
                          onToggleSection={handleToggleSection}
                        />
                      ))
                    )}
                  </table>
                </div>
              </SortableContext>
            </DndContext>
          </Card>
        </div>
      )}

      {/* TAB 3: CATEGORY KEYWORDS MAPPING */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Category & Keyword Mapping (Keyword Matching Rules)</h2>
              <p className="text-xs text-slate-500">
                Add relevant tags/keywords to each category. The AI model will match articles to categories based on these tags.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleGenerateAllAiKeywords}
              disabled={isGeneratingAll || isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 px-3.5 shadow-sm inline-flex items-center gap-1.5 self-start sm:self-auto font-medium"
            >
              {isGeneratingAll ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate AI Tags for All
                </>
              )}
            </Button>
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

                  {/* Actions for this category */}
                  <div className="flex md:flex-col items-stretch gap-2 justify-end">
                    <Button
                      type="button"
                      onClick={() => handleGenerateAiKeywords(cat.id)}
                      disabled={generatingCatId === cat.id || isPending || isGeneratingAll}
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 text-xs h-8 px-2.5 font-medium whitespace-nowrap"
                    >
                      {generatingCatId === cat.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-indigo-600" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                          AI Tags (6-10)
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleSaveKeywords(cat.id)}
                      disabled={isPending || generatingCatId === cat.id}
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
    </div>
  );
}
