export type FieldErrors = Record<string, string[]>;

export type BasePagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

export function normalizeImageUrl(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.path === "string") return obj.path;
    if (typeof obj.image === "string") return obj.image;
  }
  return null;
}

export function extractFieldErrors(data: any): FieldErrors | null {
  const errors = data?.errors;
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return null;
  }
  const result: FieldErrors = {};
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      result[key] = value.map((v) => String(v));
    } else if (typeof value === "string") {
      result[key] = [value];
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

export function extractPagination(
  payload: any,
  fallbackPage: number,
  fallbackper_page: number,
): BasePagination {
  const pagination = payload?.pagination ?? {};
  const current_page = Math.max(
    1,
    Number(pagination?.current_page ?? fallbackPage),
  );
  const last_page = Math.max(1, Number(pagination?.last_page ?? fallbackPage));
  const per_page = Math.max(
    1,
    Number(pagination?.per_page ?? fallbackper_page) || fallbackper_page,
  );
  const total = Math.max(0, Number(pagination?.total ?? 0) || 0);

  return {
    current_page: current_page,
    last_page: last_page,
    per_page: per_page,
    total: total,
  };
}
