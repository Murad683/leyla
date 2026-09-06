import { useQuery } from "@tanstack/react-query";
import { getHero, getSettings, getServices } from "../services/settingsService";
import { getPortfolioItems } from "../services/portfolioService";

const OPTS = { staleTime: 60_000, retry: 1 };

/** Raw site settings (or null while loading / on error). */
export function useSiteSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: getSettings, ...OPTS }).data ?? null;
}

/** Hero content, falling back to `defaults` ({ title, accentText }). */
export function useHero(defaults) {
  const { data } = useQuery({ queryKey: ["hero"], queryFn: getHero, ...OPTS });
  if (!data || !data.title) return defaults;
  return { title: data.title, accentText: data.accentText || "" };
}

/**
 * Services mapped to the shape the v2 pages expect:
 * { n, title, desc, includes[], outcome, tags[] }.  Falls back to `defaults`.
 */
export function useServices(defaults) {
  const { data } = useQuery({ queryKey: ["services"], queryFn: getServices, ...OPTS });
  if (!Array.isArray(data) || data.length === 0) return defaults;
  return data.map((s, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: s.title || "",
    desc: s.description || "",
    includes: Array.isArray(s.features) ? s.features : [],
    outcome: s.outcome || "",
    tags: (Array.isArray(s.features) ? s.features : []).slice(0, 3),
  }));
}

function normMetrics(r) {
  if (!Array.isArray(r)) return [];
  return r
    .map((m) => (Array.isArray(m) ? { label: m[0], value: m[1] } : m))
    .filter((m) => m && (m.label || m.value))
    .map((m) => ({ label: m.label || "", value: m.value || "" }));
}

/**
 * Portfolio mapped to the v2 shape:
 * { n, name, year, img, tint, cats[], brief, result, metrics:[{label,value}] }.
 * Falls back to `defaults`.
 */
export function usePortfolio(defaults) {
  const { data } = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => getPortfolioItems(),
    ...OPTS,
  });
  const items = data?.items;
  if (!Array.isArray(items) || items.length === 0) return defaults;
  return items.map((p, i) => ({
    n: String(i + 1).padStart(2, "0"),
    name: p.title || "",
    year: p.year || "",
    img: p.thumbnail || "",
    tint: p.tint || "var(--field-1)",
    cats: Array.isArray(p.tags) ? p.tags : [],
    brief: p.summary || "",
    result: p.resultHeadline || "",
    metrics: normMetrics(p.results),
  }));
}
