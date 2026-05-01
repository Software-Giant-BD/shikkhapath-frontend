"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { getDivisionsAction, getDistrictsAction, getUpazilasAction, type LocationOption } from "@/lib/api/location-actions";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";

export function PoliceStationListFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [divisionId, setDivisionId] = useState(searchParams.get("division_id") || "");
  const [districtId, setDistrictId] = useState(searchParams.get("district_id") || "");
  const [upazilaId, setUpazilaId] = useState(searchParams.get("upazila_id") || "");

  const [divisions, setDivisions] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [upazilas, setUpazilas] = useState<LocationOption[]>([]);

  useEffect(() => {
    getDivisionsAction().then((res) => {
      if (res.ok) setDivisions(res.items);
    });
  }, []);

  useEffect(() => {
    if (divisionId) {
      getDistrictsAction(divisionId).then((res) => {
        if (res.ok) setDistricts(res.items);
      });
    } else {
      setDistricts([]);
      setDistrictId("");
    }
  }, [divisionId]);

  useEffect(() => {
    if (districtId) {
      getUpazilasAction(districtId).then((res) => {
        if (res.ok) setUpazilas(res.items);
      });
    } else {
      setUpazilas([]);
      setUpazilaId("");
    }
  }, [districtId]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    
    if (search) params.set("search", search);
    else params.delete("search");
    
    if (divisionId) params.set("division_id", divisionId);
    else params.delete("division_id");
    
    if (districtId) params.set("district_id", districtId);
    else params.delete("district_id");
    
    if (upazilaId) params.set("upazila_id", upazilaId);
    else params.delete("upazila_id");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setDivisionId("");
    setDistrictId("");
    setUpazilaId("");
    router.push(pathname);
  };

  return (
    <div className="space-y-4 p-4 md:p-6 border-b border-slate-100">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="pl-9"
          />
        </div>

        <SearchableSelect
          options={[
            { id: "", name: "All Divisions" },
            ...divisions
          ]}
          value={divisionId}
          onChange={setDivisionId}
          placeholder="Select Division"
          searchPlaceholder="Search Division..."
        />

        <SearchableSelect
          options={[
            { id: "", name: "All Districts" },
            ...districts
          ]}
          value={districtId}
          disabled={!divisionId}
          onChange={setDistrictId}
          placeholder="Select District"
          searchPlaceholder="Search District..."
        />

        <SearchableSelect
          options={[
            { id: "", name: "All Upazilas" },
            ...upazilas
          ]}
          value={upazilaId}
          disabled={!districtId}
          onChange={setUpazilaId}
          placeholder="Select Upazila"
          searchPlaceholder="Search Upazila..."
        />

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="secondary" onClick={handleReset} className="px-3">
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
