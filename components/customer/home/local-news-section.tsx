"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search, Clock, ChevronRight, Loader2 } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  getDivisionsAction,
  getDistrictsAction,
  getUpazilasAction,
  getLocalNewsAction,
  type LocationOption,
  type NewsItem,
} from "@/lib/api/location-actions";

// Prepend an "all" option
function withAll(label: string, items: LocationOption[]): LocationOption[] {
  return [{ id: "", name: label }, ...items];
}

export function LocalNewsSection({
  initialDivisions = [],
}: {
  initialDivisions?: LocationOption[];
}) {
  const [divisions, setDivisions] = useState<LocationOption[]>(initialDivisions);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [upazilas, setUpazilas] = useState<LocationOption[]>([]);

  const [isDivisionLoading, setDivisionLoading] = useState(
    initialDivisions.length === 0,
  );
  const [isDistrictLoading, setDistrictLoading] = useState(false);
  const [isUpazilaLoading, setUpazilaLoading] = useState(false);

  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");

  const [news, setNews] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch divisions on mount if not provided
  useEffect(() => {
    if (initialDivisions.length > 0) return;
    getDivisionsAction().then((res) => {
      if (res.ok) {
        setDivisions(res.items);
      }
      setDivisionLoading(false);
    });
  }, [initialDivisions]);

  const handleDivisionChange = useCallback(async (val: string) => {
    setDivisionId(val);
    setDistrictId("");
    setUpazilaId("");
    setDistricts([]);
    setUpazilas([]);
    if (!val) return;
    setDistrictLoading(true);
    const res = await getDistrictsAction(val);
    if (res.ok) {
      setDistricts(res.items);
    }
    setDistrictLoading(false);
  }, []);

  const handleDistrictChange = useCallback(async (val: string) => {
    setDistrictId(val);
    setUpazilaId("");
    setUpazilas([]);
    if (!val) return;
    setUpazilaLoading(true);
    const res = await getUpazilasAction(val);
    if (res.ok) {
      setUpazilas(res.items);
    }
    setUpazilaLoading(false);
  }, []);

  function handleSearch() {
    if (!divisionId) return;
    startTransition(async () => {
      try {
        const res = await getLocalNewsAction({
          division_id: divisionId,
          district_id: districtId,
          upazila_id: upazilaId,
          page: 1,
        });
        if (res.ok) {
          setNews(res.news);
          setPagination(res.pagination || null);
        } else {
          setNews([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Search error:", error);
        setNews([]);
        setPagination(null);
      } finally {
        setSearched(true);
      }
    });
  }

  async function handleLoadMore() {
    if (!pagination || pagination.current_page >= pagination.last_page || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const res = await getLocalNewsAction({
        division_id: divisionId,
        district_id: districtId,
        upazila_id: upazilaId,
        page: pagination.current_page + 1,
      });
      
      if (res.ok) {
        setNews(prev => [...prev, ...res.news]);
        setPagination(res.pagination || null);
      }
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const selectedDivision = divisions.find((d) => d.id === divisionId);
  const selectedDistrict = districts.find((d) => d.id === districtId);
  const selectedUpazila = upazilas.find((u) => u.id === upazilaId);

  return (
    <section className="my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#036735]" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            আমার এলাকার খবর
          </h2>
        </div>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#036735] to-transparent" />
      </div>

      {/* Filter Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {/* Division */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              বিভাগ{" "}
              {isDivisionLoading && (
                <Loader2 className="inline w-3 h-3 animate-spin ml-1" />
              )}
            </label>
            <SearchableSelect
              options={withAll("সকল বিভাগ", divisions)}
              value={divisionId}
              onChange={handleDivisionChange}
              placeholder={
                isDivisionLoading ? "লোড হচ্ছে..." : "বিভাগ নির্বাচন করুন"
              }
              searchPlaceholder="বিভাগ খুঁজুন..."
              disabled={isDivisionLoading}
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              জেলা{" "}
              {isDistrictLoading && (
                <Loader2 className="inline w-3 h-3 animate-spin ml-1" />
              )}
            </label>
            <SearchableSelect
              options={withAll(
                isDistrictLoading
                  ? "লোড হচ্ছে..."
                  : divisionId
                    ? "সকল জেলা"
                    : "আগে বিভাগ নির্বাচন করুন",
                districts,
              )}
              value={districtId}
              onChange={handleDistrictChange}
              placeholder={
                isDistrictLoading
                  ? "লোড হচ্ছে..."
                  : divisionId
                    ? "জেলা নির্বাচন করুন"
                    : "আগে বিভাগ নির্বাচন করুন"
              }
              searchPlaceholder="জেলা খুঁজুন..."
              disabled={!divisionId || isDistrictLoading}
            />
          </div>

          {/* Upazila */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              উপজেলা{" "}
              {isUpazilaLoading && (
                <Loader2 className="inline w-3 h-3 animate-spin ml-1" />
              )}
            </label>
            <SearchableSelect
              options={withAll(
                isUpazilaLoading
                  ? "লোড হচ্ছে..."
                  : districtId
                    ? "সকল উপজেলা"
                    : "আগে জেলা নির্বাচন করুন",
                upazilas,
              )}
              value={upazilaId}
              onChange={setUpazilaId}
              placeholder={
                isUpazilaLoading
                  ? "লোড হচ্ছে..."
                  : districtId
                    ? "উপজেলা নির্বাচন করুন"
                    : "আগে জেলা নির্বাচন করুন"
              }
              searchPlaceholder="উপজেলা খুঁজুন..."
              disabled={!districtId || isUpazilaLoading}
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isPending || !divisionId}
          className="w-full flex items-center justify-center gap-2 bg-[#036735] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {isPending ? "খুঁজছি..." : "খুঁজুন"}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {/* Location breadcrumb */}
          {(selectedDivision || selectedDistrict || selectedUpazila) && (
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {selectedDivision && (
                <span>
                  {selectedDivision.bn_name
                    ? `${selectedDivision.bn_name} (${selectedDivision.name})`
                    : selectedDivision.name}
                </span>
              )}
              {selectedDistrict && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span>
                    {selectedDistrict.bn_name
                      ? `${selectedDistrict.bn_name} (${selectedDistrict.name})`
                      : selectedDistrict.name}
                  </span>
                </>
              )}
              {selectedUpazila && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span>
                    {selectedUpazila.bn_name
                      ? `${selectedUpazila.bn_name} (${selectedUpazila.name})`
                      : selectedUpazila.name}
                  </span>
                </>
              )}
            </div>
          )}

          {news.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                এই এলাকায় কোনো সংবাদ পাওয়া যায়নি
              </p>
              <p className="text-sm text-gray-400 mt-1">
                অন্য এলাকা নির্বাচন করুন
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.url_slug || item.slug}`}
                    className="group flex gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#036735]/30 dark:hover:border-[#036735]/50 hover:shadow-md p-3 transition-all duration-200"
                  >
                    {item.feature_image_url && (
                      <div className="w-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 aspect-[4/3]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.feature_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {item.category && (
                        <span className="text-xs font-semibold text-[#036735] dark:text-[#036735] uppercase tracking-wide">
                          {item.category.title}
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-[#036735] dark:group-hover:text-[#036735] transition-colors mt-0.5 leading-snug">
                        {item.title}
                      </h3>
                      {item.publish_at && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(item.publish_at).toLocaleDateString(
                              "bn-BD",
                              { day: "numeric", month: "long" },
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {pagination && pagination.current_page < pagination.last_page && (
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "আরো সংবাদ দেখুন"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
