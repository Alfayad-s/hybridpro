/**
 * Persistent frame storage via the Cache API.
 *
 * First visit: fetch each frame from the network and store it on-device.
 * Later visits / refresh: read from Cache Storage (no re-download).
 *
 * Bump FRAME_CACHE_VERSION when you replace the frame pack so old
 * blobs are dropped and the new set is fetched once.
 */

export const FRAME_CACHE_VERSION = "v1";
export const FRAME_CACHE_NAME = `hybrid-pro-frames-${FRAME_CACHE_VERSION}`;

const META_KEY = `hybrid-pro-frames-meta-${FRAME_CACHE_VERSION}`;

export type FrameCacheMeta = {
  complete: boolean;
  count: number;
  folderPath: string;
  extension: string;
  updatedAt: number;
};

export function cachesAvailable(): boolean {
  return typeof window !== "undefined" && "caches" in window;
}

export function readFrameCacheMeta(): FrameCacheMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FrameCacheMeta;
  } catch {
    return null;
  }
}

export function writeFrameCacheMeta(meta: FrameCacheMeta): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // Quota / private mode — ignore; Cache API still works without the flag.
  }
}

export function clearFrameCacheMeta(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(META_KEY);
  } catch {
    // ignore
  }
}

async function openFrameCache(): Promise<Cache | null> {
  if (!cachesAvailable()) return null;
  try {
    return await caches.open(FRAME_CACHE_NAME);
  } catch {
    return null;
  }
}

/** Drop older frame-cache versions so storage does not pile up. */
export async function pruneOldFrameCaches(): Promise<void> {
  if (!cachesAvailable()) return;
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(
          (key) =>
            key.startsWith("hybrid-pro-frames-") && key !== FRAME_CACHE_NAME,
        )
        .map((key) => caches.delete(key)),
    );
  } catch {
    // ignore
  }
}

/**
 * Resolve a frame URL to an absolute URL suitable for Cache API keys.
 */
export function toAbsoluteFrameUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).href;
}

/**
 * Cache-first frame fetch.
 * Returns a blob URL the caller must revoke when finished with the image.
 */
export async function loadFrameBlobUrl(path: string): Promise<{
  objectUrl: string;
  fromCache: boolean;
}> {
  const absoluteUrl = toAbsoluteFrameUrl(path);
  const cache = await openFrameCache();

  if (cache) {
    try {
      const cached = await cache.match(absoluteUrl);
      if (cached && cached.ok) {
        const blob = await cached.blob();
        return {
          objectUrl: URL.createObjectURL(blob),
          fromCache: true,
        };
      }
    } catch {
      // Fall through to network.
    }
  }

  const response = await fetch(absoluteUrl, {
    credentials: "same-origin",
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch frame: ${path} (${response.status})`);
  }

  // Store a clone before consuming the body.
  if (cache) {
    try {
      await cache.put(absoluteUrl, response.clone());
    } catch {
      // QuotaExceeded or private mode — still use the network response.
    }
  }

  const blob = await response.blob();
  return {
    objectUrl: URL.createObjectURL(blob),
    fromCache: false,
  };
}

/**
 * How many of the given frame paths are already in Cache Storage.
 * Uses cache.keys() once instead of N match() calls.
 */
export async function countCachedFrames(paths: string[]): Promise<number> {
  const cache = await openFrameCache();
  if (!cache) return 0;

  try {
    const requests = await cache.keys();
    const cached = new Set(
      requests.map((request) => {
        try {
          return new URL(request.url).pathname;
        } catch {
          return request.url;
        }
      }),
    );

    let count = 0;
    for (const path of paths) {
      const pathname = toAbsoluteFrameUrl(path);
      let pathOnly = path;
      try {
        pathOnly = new URL(pathname).pathname;
      } catch {
        // keep relative
      }
      if (cached.has(pathOnly)) count += 1;
    }
    return count;
  } catch {
    return 0;
  }
}

/**
 * True when a previous visit finished caching this frame pack.
 * Used only for UI messaging — actual loads still verify Cache API.
 */
export function hasCompletedFrameCache(
  frameCount: number,
  folderPath: string,
  imageExtension: string,
): boolean {
  const meta = readFrameCacheMeta();
  if (!meta?.complete) return false;
  return (
    meta.count === frameCount &&
    meta.folderPath === folderPath &&
    meta.extension === imageExtension
  );
}
