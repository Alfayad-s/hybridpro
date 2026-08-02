"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import ElasticSlider from "@/components/ui/ElasticSlider";
import { SquigglyText } from "@/components/ui/squiggly-text";
import { IconVolume, IconVolumeOff } from "@tabler/icons-react";
import {
  hasCompletedFrameCache,
  loadFrameBlobUrl,
  pruneOldFrameCaches,
  writeFrameCacheMeta,
} from "@/lib/frameCache";

gsap.registerPlugin(ScrollTrigger);

export type ScrollFrameAnimationProps = {
  frameCount: number;
  folderPath: string;
  imageExtension: string;
  scrollLength: number;
  className?: string;
};

type FrameImage = HTMLImageElement | undefined;
type MutableNumberRef = { current: number };
type Quote = { start: number; end: number; text: string; sub?: string };

const FLUORO_GREEN = "var(--brand-green)";
const MUSIC_SRC = "/audio/gym-cinematic.mp3";
/** 1-based numbers matching frame_XXXX.png */
const MUSIC_START_FRAME = 198;
const MUSIC_STOP_FRAME = 190;
const MUSIC_MAX_VOLUME = 0.85;
const MUSIC_FADE_IN_SEC = 4.5;
const MUSIC_FADE_OUT_SEC = 1.2;
/** Skip READY overlay on later visits */
const ENTERED_STORAGE_KEY = "hybridpro-hero-entered";

function hasEnteredBefore() {
  try {
    return localStorage.getItem(ENTERED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markEntered() {
  try {
    localStorage.setItem(ENTERED_STORAGE_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}

/** Quote ranges use 1-based frame numbers, a Hybrid Pro story told while you scroll. */
const QUOTES: Quote[] = [
  {
    start: 1,
    end: 120,
    text: "Welcome to Hybrid Pro",
    sub: "Where ordinary routines end, and real transformation begins.",
  },
  {
    start: 150,
    end: 260,
    text: "Not another template",
    sub: "A complete coaching system engineered around your body, your schedule, your goals.",
  },
  {
    start: 290,
    end: 400,
    text: "What is Hybrid Pro?",
    sub: "The place where strength, fat loss, muscle, mobility, and lasting habits finally move as one.",
  },
  {
    start: 430,
    end: 540,
    text: "Guided by Akash",
    sub: "Founder & CEO, certified, proven, and committed to the version of you that doesn’t quit.",
  },
  {
    start: 570,
    end: 680,
    text: "Train with purpose",
    sub: "Consistency compounds. Show up with intent, and let the results speak for themselves.",
  },
  {
    start: 710,
    end: 820,
    text: "Built for your life",
    sub: "No generic plans. Every session is shaped to fit the life you actually live.",
  },
  {
    start: 850,
    end: 960,
    text: "More than the gym",
    sub: "Progressive training. Intelligent nutrition. Accountability that holds you when motivation fades.",
  },
  {
    start: 990,
    end: 1100,
    text: "Who we coach",
    sub: "From first-timers to athletes, busy professionals to postpartum rebuilds, online and in person.",
  },
  {
    start: 1130,
    end: 1240,
    text: "No quick fixes",
    sub: "We build a stronger body, a sharper mindset, and confidence that outlasts any program.",
  },
  {
    start: 1270,
    end: 1380,
    text: "Every rep. Every check-in.",
    sub: "Expert guidance in your corner, through every setback, every PR, every breakthrough.",
  },
  {
    start: 1410,
    end: 1523,
    text: "This is Hybrid Pro",
    sub: "Your next chapter starts now. Keep scrolling, then take the first step.",
  },
];

const quoteEase = [0.16, 1, 0.3, 1] as const;

function quoteIndexForFrame(frameNumber: number): number {
  return QUOTES.findIndex(
    (q) => frameNumber >= q.start && frameNumber <= q.end,
  );
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  );
}

function getLoadStrategy(frameCount: number) {
  const mobile = isMobileDevice();
  const connection =
    typeof navigator !== "undefined"
      ? (
          navigator as Navigator & {
            connection?: { effectiveType?: string; saveData?: boolean };
          }
        ).connection
      : undefined;

  const slowNetwork =
    connection?.saveData === true ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";

  // Unlock early so mobile users are not stuck downloading ~650MB first.
  const readyCount = mobile
    ? Math.min(frameCount, slowNetwork ? 36 : 60)
    : Math.min(frameCount, 120);

  const concurrency = mobile ? (slowNetwork ? 4 : 6) : 10;

  return { mobile, readyCount, concurrency };
}

function getFrameUrl(
  folderPath: string,
  imageExtension: string,
  index: number,
): string {
  const folder = folderPath.replace(/\/+$/, "");
  const extension = imageExtension.replace(/^\./, "");
  const frameNumber = String(index + 1).padStart(4, "0");
  return `${folder}/frame_${frameNumber}.${extension}`;
}

function loadImageFromObjectUrl(objectUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";

    image.onload = () => {
      image.onload = null;
      image.onerror = null;
      resolve(image);
    };

    image.onerror = () => {
      image.onload = null;
      image.onerror = null;
      reject(new Error("Failed to decode cached frame"));
    };

    image.src = objectUrl;
  });
}

/**
 * Cache-first frame load:
 * 1) Read from Cache Storage when present (instant on refresh)
 * 2) Otherwise fetch once, store on-device, then decode
 * Falls back to a plain <img> request if Cache API / fetch is unavailable.
 */
async function loadSingleImage(
  folderPath: string,
  imageExtension: string,
  index: number,
  objectUrls: string[],
): Promise<{ image: HTMLImageElement; fromCache: boolean }> {
  const path = getFrameUrl(folderPath, imageExtension, index);

  try {
    const { objectUrl, fromCache } = await loadFrameBlobUrl(path);
    objectUrls.push(objectUrl);
    const image = await loadImageFromObjectUrl(objectUrl);
    return { image, fromCache };
  } catch {
    // Last-resort path for odd environments without Cache/fetch support.
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        image.onload = null;
        image.onerror = null;
        resolve({ image, fromCache: false });
      };
      image.onerror = () => {
        image.onload = null;
        image.onerror = null;
        reject(new Error(`Failed to load frame: ${path}`));
      };
      image.src = path;
    });
  }
}

type FrameProgressHandler = (
  loaded: number,
  total: number,
  fromCacheCount: number,
) => void;

/**
 * Progressive loader:
 * 1) Loads an early contiguous chunk so the experience can start quickly.
 * 2) Continues loading the remaining frames in the background.
 * Uses on-device Cache Storage so a later refresh skips the network.
 */
async function preloadImagesProgressive(
  frameCount: number,
  folderPath: string,
  imageExtension: string,
  concurrency: number,
  readyCount: number,
  onProgress: FrameProgressHandler,
  onReady: (images: FrameImage[]) => void,
  isCancelled: () => boolean,
  objectUrls: string[],
): Promise<FrameImage[]> {
  const images = new Array<FrameImage>(frameCount);
  let loaded = 0;
  let fromCacheCount = 0;
  let readyFired = false;

  const markLoaded = (
    index: number,
    image: HTMLImageElement,
    fromCache: boolean,
  ) => {
    images[index] = image;
    loaded += 1;
    if (fromCache) fromCacheCount += 1;
    onProgress(loaded, frameCount, fromCacheCount);

    if (!readyFired) {
      let contiguous = 0;
      while (contiguous < readyCount && images[contiguous]) contiguous += 1;
      if (contiguous >= readyCount) {
        readyFired = true;
        onReady(images);
      }
    }
  };

  const runQueue = async (start: number, end: number): Promise<void> => {
    let nextIndex = start;

    const loadNext = async (): Promise<void> => {
      while (!isCancelled()) {
        const index = nextIndex;
        nextIndex += 1;
        if (index >= end) return;

        try {
          const { image, fromCache } = await loadSingleImage(
            folderPath,
            imageExtension,
            index,
            objectUrls,
          );
          if (isCancelled()) return;
          markLoaded(index, image, fromCache);
        } catch (error) {
          loaded += 1;
          onProgress(loaded, frameCount, fromCacheCount);
          console.warn(error);
        }
      }
    };

    const workerCount = Math.min(concurrency, Math.max(1, end - start));
    await Promise.all(Array.from({ length: workerCount }, () => loadNext()));
  };

  // Phase 1: unlock as soon as the opening stretch is ready.
  await runQueue(0, readyCount);
  if (isCancelled()) {
    throw new DOMException("Frame loading cancelled", "AbortError");
  }
  if (!readyFired) onReady(images);

  // Phase 2: fill the rest while the user can already enter / scroll.
  if (readyCount < frameCount) {
    await runQueue(readyCount, frameCount);
  }

  if (isCancelled()) {
    throw new DOMException("Frame loading cancelled", "AbortError");
  }

  return images;
}

function findDrawableFrame(images: FrameImage[], target: number): number {
  const clamped = Math.max(0, Math.min(images.length - 1, target));
  const direct = images[clamped];
  if (direct?.complete && direct.naturalWidth > 0) return clamped;

  for (let i = clamped - 1; i >= 0; i -= 1) {
    const image = images[i];
    if (image?.complete && image.naturalWidth > 0) return i;
  }

  for (let i = clamped + 1; i < images.length; i += 1) {
    const image = images[i];
    if (image?.complete && image.naturalWidth > 0) return i;
  }

  return -1;
}

/** Draws an image with CSS object-fit: cover behavior. */
function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
): void {
  const scale = Math.max(
    canvasWidth / image.naturalWidth,
    canvasHeight / image.naturalHeight,
  );
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (canvasWidth - width) / 2;
  const y = (canvasHeight - height) / 2;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, x, y, width, height);
}

/** Draws only the requested frame (or nearest loaded fallback). */
function renderFrame(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  images: FrameImage[],
  frame: number,
  lastRenderedFrame: MutableNumberRef,
): void {
  const target = Math.max(0, Math.min(images.length - 1, Math.round(frame)));
  const drawable = findDrawableFrame(images, target);
  if (drawable < 0) return;
  if (drawable === lastRenderedFrame.current) return;

  const image = images[drawable];
  if (!image?.complete || image.naturalWidth === 0) return;

  lastRenderedFrame.current = drawable;
  drawImageCover(context, image, canvas.width, canvas.height);
}

/** Sizes the backing canvas for Retina displays while keeping viewport CSS size. */
function resizeCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  images: FrameImage[],
  currentFrame: number,
  lastRenderedFrame: MutableNumberRef,
): void {
  // Cap DPR on phones to reduce GPU/memory pressure while scrolling.
  const maxDpr = isMobileDevice() ? 1.5 : 2;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  lastRenderedFrame.current = -1;
  renderFrame(context, canvas, images, currentFrame, lastRenderedFrame);
}

export default function ScrollFrameAnimation({
  frameCount,
  folderPath,
  imageExtension,
  scrollLength,
  className = "",
}: ScrollFrameAnimationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<FrameImage[]>([]);
  const currentFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const drawRafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTweenRef = useRef<gsap.core.Tween | null>(null);
  const userVolumeRef = useRef(MUSIC_MAX_VOLUME);
  const musicArmedRef = useRef(false);
  const fadeTargetRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const activeQuoteRef = useRef(-1);
  const applyMusicRef = useRef<(zeroBasedFrame: number) => void>(() => {});
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const skippingRef = useRef(false);
  const skipScrollTweenRef = useRef<gsap.core.Tween | null>(null);

  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [entering, setEntering] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [activeQuote, setActiveQuote] = useState(-1);
  const [loadingFromCache, setLoadingFromCache] = useState(false);

  // Create + preload audio once.
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    audio.load();

    return () => {
      volumeTweenRef.current?.kill();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Progressive preload: unlock after the first chunk, keep loading the rest.
  // Frames are stored in Cache Storage so a refresh reuses the on-device copy.
  useEffect(() => {
    let cancelled = false;
    let lastPercentage = -1;
    const objectUrls: string[] = [];
    const { readyCount, concurrency } = getLoadStrategy(frameCount);
    const preferCacheUi = hasCompletedFrameCache(
      frameCount,
      folderPath,
      imageExtension,
    );

    imagesRef.current = new Array(frameCount);

    queueMicrotask(() => {
      if (cancelled) return;
      setIsReady(false);
      setIsFullyLoaded(false);
      setLoadError(null);
      setLoadingPercentage(0);
      setLoadingFromCache(preferCacheUi);
    });

    void pruneOldFrameCaches();

    void preloadImagesProgressive(
      frameCount,
      folderPath,
      imageExtension,
      concurrency,
      readyCount,
      (loaded, total, fromCacheCount) => {
        if (cancelled) return;
        const percentage = Math.round((loaded / total) * 100);
        if (percentage !== lastPercentage) {
          lastPercentage = percentage;
          setLoadingPercentage(percentage);
        }
        // Flip the label once we can tell most of this visit is cache hits.
        if (loaded >= 8) {
          setLoadingFromCache(fromCacheCount / loaded >= 0.7);
        }
      },
      (images) => {
        if (cancelled) return;
        imagesRef.current = images;
        setIsReady(true);
      },
      () => cancelled,
      objectUrls,
    )
      .then((images) => {
        if (cancelled) return;
        imagesRef.current = images;
        setIsFullyLoaded(true);
        setIsReady(true);
        writeFrameCacheMeta({
          complete: true,
          count: frameCount,
          folderPath,
          extension: imageExtension,
          updatedAt: Date.now(),
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        const message =
          error instanceof Error ? error.message : "Unable to load frames.";
        setLoadError(message);
      });

    return () => {
      cancelled = true;
      for (const image of imagesRef.current) {
        if (!image) continue;
        image.onload = null;
        image.onerror = null;
        image.src = "";
      }
      imagesRef.current = [];
      for (const url of objectUrls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [frameCount, folderPath, imageExtension]);

  const fadeVolume = (to: number, duration: number, ease: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeTargetRef.current === to) return;
    fadeTargetRef.current = to;
    volumeTweenRef.current?.kill();
    volumeTweenRef.current = gsap.to(audio, {
      volume: Math.max(0, Math.min(1, to)),
      duration,
      ease,
      onComplete: () => {
        if (fadeTargetRef.current === to) fadeTargetRef.current = null;
        if (to <= 0.01) {
          audio.pause();
        }
      },
    });
  };

  const stopMusic = (duration = MUSIC_FADE_OUT_SEC) => {
    musicArmedRef.current = false;
    const audio = audioRef.current;
    if (!audio) return;
    fadeVolume(0, duration, "power2.in");
  };

  /** Sync music from scroll frame updates via refs, no React re-renders. */
  const applyMusicForFrame = (zeroBasedFrame: number) => {
    const audio = audioRef.current;
    if (!audio || !startedRef.current) return;

    const frame = Math.round(zeroBasedFrame) + 1;
    const keepPlaying =
      frame >= MUSIC_START_FRAME ||
      (musicArmedRef.current && frame > MUSIC_STOP_FRAME);
    const targetVolume = userVolumeRef.current;

    if (keepPlaying) {
      if (audio.paused) {
        audio.loop = false;
        void audio.play().catch(() => {});
      }

      if (!musicArmedRef.current) {
        musicArmedRef.current = true;
        audio.loop = false;
        try {
          audio.currentTime = 0;
        } catch {
          // ignore seek errors
        }
        fadeVolume(targetVolume, MUSIC_FADE_IN_SEC, "sine.in");
      } else if (
        targetVolume > 0.01 &&
        audio.volume < targetVolume * 0.5 &&
        fadeTargetRef.current !== targetVolume
      ) {
        fadeVolume(targetVolume, MUSIC_FADE_IN_SEC, "sine.in");
      }
      return;
    }

    if (
      musicArmedRef.current ||
      audio.volume > 0.01 ||
      fadeTargetRef.current === 0
    ) {
      musicArmedRef.current = false;
      fadeVolume(0, MUSIC_FADE_OUT_SEC, "sine.out");
    }
  };

  useEffect(() => {
    applyMusicRef.current = applyMusicForFrame;
  });

  /** Returning visitors: skip READY gate once frames are ready. */
  useEffect(() => {
    if (!isReady || started || entering || loadError) return;
    if (!hasEnteredBefore()) return;

    startedRef.current = true;
    setStarted(true);
  }, [isReady, started, entering, loadError]);

  /** Unlock / resume music after returning visitors interact (browser autoplay policy). */
  useEffect(() => {
    if (!started || !hasEnteredBefore()) return;

    const unlock = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused && musicArmedRef.current) {
        void audio.play().catch(() => {});
      } else if (audio.paused) {
        audio.volume = 0;
        void audio.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [started]);

  /** Must run inside a click/tap, unlocks audio and keeps silent playback alive. */
  const enterExperience = async () => {
    if (!isReady || entering || started) return;
    setEntering(true);

    try {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        audio.loop = true;
        audio.currentTime = 0;
        await audio.play();
      }
      markEntered();
      startedRef.current = true;
      setStarted(true);
    } catch {
      markEntered();
      startedRef.current = true;
      setStarted(true);
    } finally {
      setEntering(false);
    }
  };

  const handleVolumeChange = (sliderValue: number) => {
    const next = Math.max(
      0,
      Math.min(1, (sliderValue / 100) * MUSIC_MAX_VOLUME),
    );
    userVolumeRef.current = next;

    const audio = audioRef.current;
    if (!audio || !startedRef.current) return;

    fadeTargetRef.current = null;
    volumeTweenRef.current?.kill();

    // Live volume while music is in the audible frame range.
    if (musicArmedRef.current) {
      audio.volume = next;
    }
  };

  /** Jump past the pinned frame experience into About, no frame scrub. */
  const skipHero = () => {
    if (!startedRef.current || skippingRef.current) return;

    skippingRef.current = true;
    setSkipped(true);
    stopMusic(0.45);
    skipScrollTweenRef.current?.kill();

    // Hide frames immediately (before React re-renders).
    if (canvasRef.current) {
      canvasRef.current.style.opacity = "0";
    }

    const trigger = scrollTriggerRef.current;

    // Snap scrub + playhead to the end so frames don't catch up mid-skip.
    if (trigger) {
      trigger.getTween?.()?.progress(1);
      trigger.animation?.progress(1);
      window.scrollTo(0, trigger.end + 1);
      ScrollTrigger.update();
    }

    // Short smooth settle into About (pin is already cleared).
    requestAnimationFrame(() => {
      const about = document.getElementById("about");
      if (!about) return;

      const targetY = about.getBoundingClientRect().top + window.scrollY - 8;
      const proxy = { y: window.scrollY };

      skipScrollTweenRef.current = gsap.to(proxy, {
        y: Math.max(0, targetY),
        duration: 0.9,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => {
          window.scrollTo(0, proxy.y);
        },
        onComplete: () => {
          skipScrollTweenRef.current = null;
        },
      });
    });
  };

  // Set up canvas rendering and the scoped GSAP ScrollTrigger after enter.
  useLayoutEffect(() => {
    if (!isReady || !started) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!section || !canvas || images.length !== frameCount) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const scheduleFrame = (frame: number) => {
      currentFrameRef.current = frame;
      applyMusicRef.current(frame);

      const nextQuote = quoteIndexForFrame(Math.round(frame) + 1);
      if (nextQuote !== activeQuoteRef.current) {
        activeQuoteRef.current = nextQuote;
        setActiveQuote(nextQuote);
      }

      if (drawRafRef.current !== null) return;

      drawRafRef.current = window.requestAnimationFrame(() => {
        drawRafRef.current = null;
        renderFrame(
          context,
          canvas,
          images,
          currentFrameRef.current,
          lastRenderedFrameRef,
        );
      });
    };

    const handleResize = () => {
      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
      }

      resizeRafRef.current = window.requestAnimationFrame(() => {
        resizeRafRef.current = null;
        resizeCanvas(
          canvas,
          context,
          images,
          currentFrameRef.current,
          lastRenderedFrameRef,
        );
        ScrollTrigger.refresh();
      });
    };

    resizeCanvas(canvas, context, images, 0, lastRenderedFrameRef);
    // Seed welcome quote on first paint.
    scheduleFrame(0);

    // Cap how fast frames/quotes can advance, even on rapid scroll.
    const MAX_FRAMES_PER_SEC = 36;
    let targetFrame = 0;
    let displayFrame = 0;
    let lastTickTs = performance.now();
    let rateRafId: number | null = null;

    const tickPlayhead = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTickTs) / 1000));
      lastTickTs = now;
      const maxStep = MAX_FRAMES_PER_SEC * dt;
      const delta = targetFrame - displayFrame;

      if (Math.abs(delta) <= maxStep) {
        displayFrame = targetFrame;
      } else {
        displayFrame += Math.sign(delta) * maxStep;
      }

      scheduleFrame(displayFrame);

      if (Math.abs(targetFrame - displayFrame) > 0.05) {
        rateRafId = window.requestAnimationFrame(tickPlayhead);
      } else {
        rateRafId = null;
        scheduleFrame(targetFrame);
      }
    };

    const setTargetFrame = (frame: number) => {
      // Skip jumps straight to the end, never scrub through frames.
      if (skippingRef.current) {
        targetFrame = frame;
        displayFrame = frame;
        if (rateRafId !== null) {
          window.cancelAnimationFrame(rateRafId);
          rateRafId = null;
        }
        scheduleFrame(frame);
        return;
      }

      targetFrame = frame;
      if (rateRafId === null) {
        lastTickTs = performance.now();
        rateRafId = window.requestAnimationFrame(tickPlayhead);
      }
    };

    const gsapContext = gsap.context(() => {
      const playhead = { frame: 0 };

      const tween = gsap.to(playhead, {
        frame: frameCount - 1,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollLength}`,
          pin: true,
          // Higher scrub = smoother catch-up; rate limiter still caps visual speed
          scrub: 2.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            musicArmedRef.current = false;
            const audio = audioRef.current;
            if (!audio) return;
            volumeTweenRef.current?.kill();
            fadeTargetRef.current = null;
            gsap.to(audio, {
              volume: 0,
              duration: 0.6,
              ease: "power2.in",
              onComplete: () => audio.pause(),
            });
          },
          onEnterBack: () => {
            // Re-enable hero if the user scrolls back up after Skip.
            if (skippingRef.current) {
              skippingRef.current = false;
              setSkipped(false);
              if (canvasRef.current) {
                canvasRef.current.style.opacity = "";
              }
            }
          },
          onLeaveBack: () => {
            musicArmedRef.current = false;
            const audio = audioRef.current;
            if (!audio) return;
            volumeTweenRef.current?.kill();
            fadeTargetRef.current = null;
            audio.pause();
            audio.volume = 0;
          },
        },
        onUpdate: () => setTargetFrame(playhead.frame),
      });

      scrollTriggerRef.current = tween.scrollTrigger ?? null;
    }, section);

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      scrollTriggerRef.current = null;
      gsapContext.revert();

      if (rateRafId !== null) {
        window.cancelAnimationFrame(rateRafId);
        rateRafId = null;
      }

      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
        drawRafRef.current = null;
      }
      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };
  }, [frameCount, isReady, scrollLength, started]);

  return (
    <section
      ref={sectionRef}
      className={`relative h-screen w-full overflow-hidden bg-black ${className}`}
      aria-label="Scroll-controlled frame animation"
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block h-full w-full transition-opacity duration-300 ${
          started && !skipped ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Top shade */}
      {started && !skipped && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[38vh]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}

      {/* Welcome logo, sits behind the first quote, fades out with it */}
      <AnimatePresence>
        {started && !skipped && activeQuote === 0 && (
          <motion.div
            key="welcome-logo"
            className="pointer-events-none absolute inset-0 z-[15] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <motion.img
              src="/brand/logo-grey-border.svg"
              alt=""
              draggable={false}
              className="h-auto w-[min(78vw,420px)] select-none sm:w-[min(62vw,520px)] md:w-[min(48vw,580px)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quotes */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {started && !skipped && activeQuote >= 0 && (
            <motion.div
              key={QUOTES[activeQuote].text}
              className="relative flex max-w-5xl flex-col items-center text-center"
              initial={{ opacity: 0, y: 48, filter: "blur(16px)", scale: 0.97 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{
                opacity: 0,
                y: -36,
                filter: "blur(14px)",
                scale: 1.02,
                transition: { duration: 0.55, ease: quoteEase },
              }}
              transition={{ duration: 0.95, ease: quoteEase }}
            >
              <motion.div
                className="mb-6 h-px w-10 origin-center sm:mb-7 sm:w-14"
                style={{ background: FLUORO_GREEN }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.85 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.12, ease: quoteEase }}
                aria-hidden
              />

              <motion.p
                className="text-center leading-[0.92] text-white uppercase"
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  textShadow: "0 2px 40px rgba(0,0,0,0.65)",
                  letterSpacing: "0.06em",
                  wordSpacing: "0.12em",
                }}
              >
                {activeQuote === 0 ? (
                  <>
                    <motion.span
                      className="block text-2xl text-white/80 sm:text-3xl md:text-4xl lg:text-5xl"
                      style={{ letterSpacing: "0.22em", wordSpacing: "0.2em" }}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, ease: quoteEase }}
                    >
                      Welcome to
                    </motion.span>
                    <SquigglyText
                      stepDuration={70}
                      scale={[5, 8]}
                      className="mt-2 block text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem]"
                      style={{ color: FLUORO_GREEN, letterSpacing: "0.04em" }}
                    >
                      Hybrid Pro
                    </SquigglyText>
                  </>
                ) : (
                  <span
                    className="inline-block max-w-[15ch] text-4xl sm:max-w-[22ch] sm:text-6xl md:max-w-none md:text-7xl lg:text-8xl xl:text-9xl"
                    style={{ letterSpacing: "0.07em", wordSpacing: "0.18em" }}
                  >
                    {QUOTES[activeQuote].text.split(" ").map((word, i, arr) => (
                      <motion.span
                        key={`${word}-${i}`}
                        className="inline-block"
                        initial={{
                          opacity: 0,
                          y: "0.55em",
                          filter: "blur(8px)",
                        }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                          duration: 0.7,
                          delay: 0.06 + i * 0.07,
                          ease: quoteEase,
                        }}
                      >
                        {word}
                        {i < arr.length - 1 ? "\u00A0" : null}
                      </motion.span>
                    ))}
                  </span>
                )}
              </motion.p>

              {QUOTES[activeQuote].sub && (
                <motion.p
                  className="mt-6 max-w-2xl text-sm leading-[1.7] text-balance text-white/75 sm:mt-7 sm:text-base md:text-lg md:leading-[1.65]"
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    letterSpacing: "0.02em",
                    wordSpacing: "0.06em",
                  }}
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.38, duration: 0.85, ease: quoteEase }}
                >
                  {QUOTES[activeQuote].sub}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll hint, sits above the bottom-center sound control */}
      <AnimatePresence>
        {started && activeQuote < 0 && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center sm:bottom-24"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="text-xs tracking-[0.3em] text-white/55 uppercase"
              animate={{ opacity: [0.35, 0.85, 0.35], y: [0, -4, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Scroll
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume slider, bottom center */}
      {started && !skipped && (
        <div
          className="absolute bottom-6 left-1/2 z-40 w-[min(14rem,calc(100vw-2.5rem))] -translate-x-1/2 sm:bottom-8"
          style={{
            marginBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <ElasticSlider
            startingValue={0}
            defaultValue={100}
            maxValue={100}
            isStepped
            stepSize={1}
            leftIcon={<IconVolumeOff stroke={1.75} />}
            rightIcon={<IconVolume stroke={1.75} />}
            onValueChange={handleVolumeChange}
          />
        </div>
      )}

      {/* Skip hero, jumps past the pin into About without scrubbing frames */}
      <AnimatePresence>
        {started && !skipped && (
          <motion.button
            key="skip-hero"
            type="button"
            onClick={skipHero}
            className="absolute right-4 z-40 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-[11px] tracking-[0.22em] text-white/75 uppercase backdrop-blur-sm transition hover:border-[color:var(--brand-green)]/60 hover:text-[var(--brand-green)] sm:right-6 sm:text-xs"
            style={{
              bottom:
                "max(5.75rem, calc(env(safe-area-inset-bottom, 0px) + 5.25rem))",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Skip intro and go to about"
          >
            Skip
          </motion.button>
        )}
      </AnimatePresence>

      {/* Loading / click-to-enter gate (unlocks audio) */}
      <AnimatePresence>
        {!started && (
          <motion.button
            key="gate"
            type="button"
            className="absolute inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            }}
            onClick={() => void enterExperience()}
            disabled={!isReady || entering || Boolean(loadError)}
          >
            {loadError ? (
              <p className="max-w-md px-6 text-center text-sm text-red-400">
                {loadError}
              </p>
            ) : !isReady ? (
              <>
                <p className="mb-6 text-xs tracking-[0.35em] text-white/60 uppercase">
                  {loadingFromCache
                    ? "Loading from device"
                    : "Downloading frames"}
                </p>
                <div className="h-px w-52 overflow-hidden bg-white/15">
                  <div
                    className="h-full bg-white transition-[width] duration-150"
                    style={{ width: `${Math.max(loadingPercentage, 4)}%` }}
                  />
                </div>
                <span className="mt-4 font-mono text-xs text-white/45 tabular-nums">
                  {loadingPercentage}%
                </span>
                {loadingFromCache && (
                  <p className="mt-3 max-w-xs px-6 text-center text-[10px] tracking-[0.2em] text-white/35 uppercase">
                    Saved on this device, no re-download
                  </p>
                )}
              </>
            ) : (
              <>
                <motion.p
                  className="mb-3 text-sm tracking-[0.4em] uppercase"
                  style={{ color: FLUORO_GREEN }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Ready
                </motion.p>
                <motion.p
                  className="text-xs tracking-[0.35em] text-white/70 uppercase"
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {entering ? "Starting…" : "Click to enter"}
                </motion.p>
                {!isFullyLoaded && (
                  <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                    Loading remaining {loadingPercentage}%
                  </p>
                )}
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
