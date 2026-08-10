/**
 * SerpAPI Google Images helper — fetches accurate photos for workouts & meals.
 * Dedupes queries in-process and runs with limited concurrency.
 */

const SERP_URL = "https://serpapi.com/search.json";

const cache = new Map<string, string | null>();

function getApiKey(): string {
  return (
    process.env.SERPAPI_API_KEY?.trim() ||
    process.env.SERP_API_KEY?.trim() ||
    ""
  );
}

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Prefer real photos; bias toward clean food / gym exercise shots. */
function buildSearchQuery(query: string, kind: "exercise" | "meal" | "cover") {
  const base = query.trim();
  if (kind === "meal") {
    return `${base} plated meal food photography high resolution`;
  }
  if (kind === "cover") {
    return `${base} gym workout training session photography`;
  }
  return `${base} exercise form gym demonstration`;
}

async function fetchOneImage(
  query: string,
  kind: "exercise" | "meal" | "cover",
): Promise<string | null> {
  const key = getApiKey();
  if (!key) return null;

  const cacheKey = `${kind}:${normalizeQuery(query)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  const params = new URLSearchParams({
    engine: "google_images",
    q: buildSearchQuery(query, kind),
    api_key: key,
    hl: "en",
    gl: "us",
    // Real photos, larger images where possible
    tbs: "itp:photos,isz:m",
  });

  try {
    const res = await fetch(`${SERP_URL}?${params.toString()}`, {
      method: "GET",
      // SerpAPI is server-side only
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[serpapi] ${res.status} for "${query}"`);
      cache.set(cacheKey, null);
      return null;
    }

    const data = (await res.json()) as {
      images_results?: {
        original?: string;
        thumbnail?: string;
        unsafe?: boolean;
      }[];
    };

    const pick =
      data.images_results?.find(
        (img) => !img.unsafe && (img.original || img.thumbnail),
      ) ?? null;

    const url = pick?.original || pick?.thumbnail || null;
    cache.set(cacheKey, url);
    return url;
  } catch (err) {
    console.warn(`[serpapi] failed for "${query}"`, err);
    cache.set(cacheKey, null);
    return null;
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

export type ImageJob = {
  id: string;
  query: string;
  kind: "exercise" | "meal" | "cover";
};

/**
 * Resolve many image queries → map of id → image URL (or empty string).
 */
export async function resolveImageJobs(
  jobs: ImageJob[],
  concurrency = 4,
): Promise<Record<string, string>> {
  if (!getApiKey() || jobs.length === 0) return {};

  // Deduplicate by normalized query+kind while keeping ids
  const unique = new Map<string, ImageJob>();
  const idToKey = new Map<string, string>();

  for (const job of jobs) {
    const key = `${job.kind}:${normalizeQuery(job.query)}`;
    idToKey.set(job.id, key);
    if (!unique.has(key)) unique.set(key, job);
  }

  const uniqueJobs = Array.from(unique.values());
  await mapPool(uniqueJobs, concurrency, async (job) => {
    await fetchOneImage(job.query, job.kind);
    return null;
  });

  const out: Record<string, string> = {};
  for (const [id, key] of idToKey) {
    const url = cache.get(key);
    if (url) out[id] = url;
  }
  return out;
}
