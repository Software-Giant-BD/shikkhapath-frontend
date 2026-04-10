"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  LayoutTemplate,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { type HomeCategoryItem, updateHomeCategoriesAction } from "@/lib/api/home-category-actions";
import { cn } from "@/lib/utils";

type CategoryOption = {
  id: string;
  title: string;
  slug: string;
};

type HomepageCategoryManagerProps = {
  allCategories: CategoryOption[];
  initialHomeCategories: HomeCategoryItem[];
};

export function HomepageCategoryManager({ allCategories, initialHomeCategories }: HomepageCategoryManagerProps) {
  const initialOrderedIds = useMemo(
    () => initialHomeCategories.map((category) => category.id),
    [initialHomeCategories],
  );
  const [orderedIds, setOrderedIds] = useState<string[]>(
    initialOrderedIds,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const categoryMap = useMemo(() => {
    return new Map(allCategories.map((category) => [category.id, category]));
  }, [allCategories]);

  const selectedIdSet = useMemo(() => new Set(orderedIds), [orderedIds]);

  const addableCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allCategories.filter((category) => {
      if (selectedIdSet.has(category.id)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [category.title, category.slug].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [allCategories, searchTerm, selectedIdSet]);

  const orderedCategories = useMemo(() => {
    return orderedIds
      .map((id) => categoryMap.get(id))
      .filter((category): category is CategoryOption => Boolean(category));
  }, [orderedIds, categoryMap]);

  const reorderItems = (activeId: string, targetId: string) => {
    if (!activeId || !targetId || activeId === targetId) {
      return;
    }

    setOrderedIds((prev) => {
      const activeIndex = prev.indexOf(activeId);
      const targetIndex = prev.indexOf(targetId);

      if (activeIndex === -1 || targetIndex === -1) {
        return prev;
      }

      const next = [...prev];
      next.splice(activeIndex, 1);
      next.splice(targetIndex, 0, activeId);
      return next;
    });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedIds.length) {
      return;
    }

    setOrderedIds((prev) => {
      const next = [...prev];
      const current = next[index];
      next[index] = next[nextIndex];
      next[nextIndex] = current;
      return next;
    });
  };

  const removeItem = (id: string) => {
    setOrderedIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const addItem = (id: string) => {
    if (!id || selectedIdSet.has(id)) {
      return;
    }

    setOrderedIds((prev) => [...prev, id]);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-500">
            Homepage Configuration
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Category Layout
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Organize how news sections appear on the main landing page. Reorder the list to change editorial priority and add or remove categories when needed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setOrderedIds(initialOrderedIds);
              setSearchTerm("");
              setSubmitError("");
              setSubmitMessage("");
            }}
            disabled={isSaving}
          >
            <RotateCcw size={16} />
            Reset
          </Button>

          <Button
            type="button"
            onClick={() => {
              setSubmitError("");
              setSubmitMessage("");

              startSaving(async () => {
                const result = await updateHomeCategoriesAction(orderedIds);
                if (!result.ok) {
                  setSubmitError(result.message);
                  return;
                }

                setSubmitMessage(result.message);
              });
            }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Order"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_320px]">
        <div className="space-y-4">
          {orderedCategories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-indigo-200 bg-white px-8 py-16 text-center shadow-[0_14px_44px_rgba(99,102,241,0.08)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <LayoutTemplate size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No homepage categories yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Add categories from the right panel to build the homepage section layout.
              </p>
            </div>
          ) : (
            orderedCategories.map((category, index) => (
              <div
                key={category.id}
                onDragOver={(event) => {
                  if (!draggingId || draggingId === category.id) {
                    return;
                  }

                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (!draggingId) {
                    return;
                  }

                  reorderItems(draggingId, category.id);
                  setDraggingId(null);
                }}
              >
                <Card
                  className={cn(
                    "overflow-hidden rounded-[22px] border border-indigo-100/70 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]",
                    index === 0 && "ring-2 ring-indigo-200/80",
                    draggingId === category.id && "scale-[0.995] opacity-70",
                  )}
                >
                  <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex items-center gap-3 text-slate-300">
                        <button
                          type="button"
                          draggable
                          onDragStart={(event) => {
                            setDraggingId(category.id);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", category.id);
                          }}
                          onDragEnd={() => setDraggingId(null)}
                          aria-label={`Drag ${category.title}`}
                          className="cursor-grab rounded-xl p-1 text-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-500 active:cursor-grabbing"
                        >
                          <GripVertical size={18} />
                        </button>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-700 ring-1 ring-indigo-100">
                          {index + 1}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <h3 className="truncate text-base font-bold text-slate-900">{category.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          <span>/{category.slug}</span>
                          <span className="text-indigo-500">Always visible</span>
                          {index === 0 ? <span className="text-amber-600">High priority</span> : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move ${category.title} up`}
                        className="rounded-xl border border-slate-100 bg-slate-50 text-slate-500 hover:bg-white"
                      >
                        <ArrowUp size={16} />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === orderedCategories.length - 1}
                        aria-label={`Move ${category.title} down`}
                        className="rounded-xl border border-slate-100 bg-slate-50 text-slate-500 hover:bg-white"
                      >
                        <ArrowDown size={16} />
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        size="icon"
                        onClick={() => removeItem(category.id)}
                        aria-label={`Remove ${category.title}`}
                        className="rounded-xl"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}

          <div
            className={cn(
              "flex min-h-32 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.03)]",
              draggingId && "border-indigo-200 bg-indigo-50/40",
            )}
            onDragOver={(event) => {
              if (!draggingId) {
                return;
              }

              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!draggingId) {
                return;
              }

              setOrderedIds((prev) => {
                const next = prev.filter((id) => id !== draggingId);
                next.push(draggingId);
                return next;
              });
              setDraggingId(null);
            }}
          >
            <div>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Plus size={18} />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-400">Add more categories from the right panel</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="rounded-3xl border border-indigo-100/70 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <CardHeader className="pb-4">
              <CardTitle>Add To Homepage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search categories..."
                  className="rounded-2xl border-slate-200 bg-slate-50 pl-11 shadow-none"
                />
              </div>

              <div className="max-h-105 space-y-2 overflow-y-auto pr-1">
                {addableCategories.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    No more categories available to add.
                  </div>
                ) : (
                  addableCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => addItem(category.id)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{category.title}</p>
                        <p className="truncate text-xs text-slate-400">/{category.slug}</p>
                      </div>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                        <Plus size={14} />
                      </span>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-[0_18px_44px_rgba(79,70,229,0.24)]">
            <CardContent className="space-y-3 px-5 py-5">
              <div className="flex items-center gap-2 text-indigo-100">
                <Sparkles size={16} />
                <p className="text-xs font-black uppercase tracking-[0.18em]">Publishing Tip</p>
              </div>
              <p className="text-sm leading-6 text-indigo-50">
                Put the highest-priority editorial sections at the top. The first three categories usually get the strongest visibility on the homepage.
              </p>
            </CardContent>
          </Card>

          {submitError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {submitError}
            </div>
          ) : null}

          {submitMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {submitMessage}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
