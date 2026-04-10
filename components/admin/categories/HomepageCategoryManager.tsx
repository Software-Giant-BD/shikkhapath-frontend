"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Label } from "@/components/admin/ui/label";
import { Select } from "@/components/admin/ui/select";
import { type HomeCategoryItem, updateHomeCategoriesAction } from "@/lib/api/home-category-actions";

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
  const [orderedIds, setOrderedIds] = useState<string[]>(
    initialHomeCategories.map((category) => category.id),
  );
  const [pendingAddId, setPendingAddId] = useState("");
  const [isSaving, startSaving] = useTransition();
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const categoryMap = useMemo(() => {
    return new Map(allCategories.map((category) => [category.id, category]));
  }, [allCategories]);

  const selectedIdSet = useMemo(() => new Set(orderedIds), [orderedIds]);

  const addableCategories = useMemo(() => {
    return allCategories.filter((category) => !selectedIdSet.has(category.id));
  }, [allCategories, selectedIdSet]);

  const orderedCategories = useMemo(() => {
    return orderedIds
      .map((id) => categoryMap.get(id))
      .filter((category): category is CategoryOption => Boolean(category));
  }, [orderedIds, categoryMap]);

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

  const addItem = () => {
    if (!pendingAddId) {
      return;
    }

    if (selectedIdSet.has(pendingAddId)) {
      setPendingAddId("");
      return;
    }

    setOrderedIds((prev) => [...prev, pendingAddId]);
    setPendingAddId("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Home Page Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-slate-600">
            Add categories, reorder them, or remove them from homepage. The list order controls section order on homepage.
          </p>

          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="add_home_category">Add Category</Label>
              <Select
                id="add_home_category"
                value={pendingAddId}
                onChange={(event) => setPendingAddId(event.target.value)}
              >
                <option value="">Select a category</option>
                {addableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Select>
            </div>

            <Button type="button" variant="secondary" onClick={addItem} disabled={!pendingAddId}>
              <Plus size={16} />
              Add to Homepage
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50">
            {orderedCategories.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">No category is selected for homepage yet.</div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {orderedCategories.map((category, index) => (
                  <li key={category.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{category.title}</p>
                        <p className="truncate text-xs text-slate-500">/{category.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move ${category.title} up`}
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
                      >
                        <ArrowDown size={16} />
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        size="icon"
                        onClick={() => removeItem(category.id)}
                        aria-label={`Remove ${category.title}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {submitError ? <p className="text-sm font-medium text-rose-600">{submitError}</p> : null}
          {submitMessage ? <p className="text-sm font-medium text-emerald-700">{submitMessage}</p> : null}

          <div className="flex justify-end">
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
              {isSaving ? "Saving..." : "Save Homepage Categories"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
