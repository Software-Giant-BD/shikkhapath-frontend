"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Select } from "@/components/admin/ui/select";

type RoleOption = {
  id: string;
  name: string;
};

type UsersListFiltersProps = {
  roles: RoleOption[];
  initialSearch: string;
  initialRoleId: string;
};

function normalizeSearchForQuery(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    return trimmed;
  }

  return "";
}

export function UsersListFilters({ roles, initialSearch, initialRoleId }: UsersListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  const [search, setSearch] = useState(initialSearch);
  const [roleId, setRoleId] = useState(initialRoleId);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setRoleId(initialRoleId);
  }, [initialRoleId]);

  const navigateWithFilters = (searchValue: string, roleValue: string) => {
    const query = new URLSearchParams();
    const normalizedSearch = normalizeSearchForQuery(searchValue);

    query.set("page", "1");

    if (normalizedSearch) {
      query.set("search", normalizedSearch);
    }

    if (roleValue) {
      query.set("role_id", roleValue);
    }

    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = search.trim();
    if (trimmed.length > 0 && trimmed.length < 2) {
      return;
    }

    const timeoutId = setTimeout(() => {
      navigateWithFilters(search, roleId);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, roleId]);

  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-end md:p-6">
      <div className="relative w-full md:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search..."
          className="h-10 pl-9"
        />
      </div>

      <Select
        value={roleId}
        onChange={(event) => setRoleId(event.target.value)}
        className="h-10 w-full md:w-44"
      >
        <option value="">All Roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </Select>

      <Button
        type="button"
        variant="secondary"
        className="h-10"
        onClick={() => {
          setSearch("");
          setRoleId("");
          router.replace(`${pathname}?page=1`, { scroll: false });
        }}
      >
        Reset
      </Button>
    </div>
  );
}
