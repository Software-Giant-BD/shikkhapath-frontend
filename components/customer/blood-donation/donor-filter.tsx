import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants/blood-groups";
import { getDistrictsAction } from "@/lib/api/location-actions";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface DonorFilterProps {
  onFilterChange: (filters: {
    group: string;
    location: string;
    availableOnly: boolean;
  }) => void;
}

export function DonorFilter({ onFilterChange }: DonorFilterProps) {
  const [group, setGroup] = useState("All");
  const [location, setLocation] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [districts, setDistricts] = useState<
    { id: string; name: string; bn_name?: string }[]
  >([]);

  useEffect(() => {
    getDistrictsAction().then((res) => {
      if (res.ok) {
        setDistricts(res.items);
      }
    });
  }, []);

  const handleGroupChange = (newGroup: string) => {
    setGroup(newGroup);
    onFilterChange({ group: newGroup, location, availableOnly });
  };

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc);
    onFilterChange({ group, location: newLoc, availableOnly });
  };

  const toggleAvailability = () => {
    const newVal = !availableOnly;
    setAvailableOnly(newVal);
    onFilterChange({ group, location, availableOnly: newVal });
  };

  const bloodGroupOptions = [
    { id: "All", name: "All Blood Groups" },
    ...BLOOD_GROUPS.map(g => ({ id: g, name: g }))
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood Group Filter */}
        <div className="relative">
          <SearchableSelect
            options={bloodGroupOptions}
            value={group}
            onChange={handleGroupChange}
            placeholder="Select Blood Group"
            searchPlaceholder="Search blood group..."
            className="w-full"
          />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <SearchableSelect
            options={[{ id: "All", name: "All Locations" }, ...districts]}
            value={location}
            onChange={handleLocationChange}
            placeholder="Select Location"
            searchPlaceholder="Search districts..."
            className="w-full"
          />
        </div>

        {/* Availability Toggle */}
        <Button
          variant="outline"
          onClick={toggleAvailability}
          className={`h-full min-h-[54px] gap-2 rounded-2xl border-slate-200 px-6 font-bold transition-all active:scale-95 ${
            availableOnly
              ? "bg-red-50 text-red-600 border-red-200 shadow-sm"
              : "bg-white text-slate-600"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${availableOnly ? "bg-red-500 animate-pulse" : "bg-slate-300"}`}
          />
          Available Only
        </Button>

        {/* Results Counter/Status */}
        <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest sm:justify-end">
          <Filter className="h-3 w-3" />
          Searching Donors
        </div>
      </div>
    </div>
  );
}
