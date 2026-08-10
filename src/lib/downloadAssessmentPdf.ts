"use client";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function isExternalImage(src: string) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return false;
  if (src.startsWith("/")) return false;
  try {
    const url = new URL(src, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

async function proxyExternalImages(root: HTMLElement) {
  const imgs = Array.from(root.querySelectorAll("img"));
  const originals: { img: HTMLImageElement; src: string }[] = [];

  await Promise.all(
    imgs.map(async (img) => {
      const src = img.currentSrc || img.getAttribute("src") || "";
      if (!isExternalImage(src)) return;

      originals.push({ img, src });
      const proxied = `/api/image-proxy?url=${encodeURIComponent(src)}`;

      await new Promise<void>((resolve) => {
        const onDone = () => {
          img.removeEventListener("load", onDone);
          img.removeEventListener("error", onDone);
          resolve();
        };
        img.addEventListener("load", onDone);
        img.addEventListener("error", onDone);
        img.crossOrigin = "anonymous";
        img.src = proxied;
        if (img.complete) onDone();
      });
    }),
  );

  return () => {
    for (const { img, src } of originals) {
      img.src = src;
    }
  };
}

function fileSafeName(name: string) {
  return (
    name
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "client"
  );
}

const COLOR_PROPS = [
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "column-rule-color",
  "caret-color",
  "fill",
  "stroke",
] as const;

function needsFlatten(value: string) {
  return /oklab|oklch|color-mix|lab\(|lch\(|color\(/i.test(value);
}

/**
 * Browsers may expose oklab/oklch/color-mix in computed styles (Tailwind v4).
 * Force hex/rgb via a temporary canvas fill so PDF capture never sees modern functions.
 */
function flattenToRgb(value: string): string | null {
  if (!value || value === "transparent" || value === "none") return null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    const normalized = ctx.fillStyle;
    if (typeof normalized !== "string" || needsFlatten(normalized)) return null;
    return normalized;
  } catch {
    return null;
  }
}

function sanitizeCloneColors(liveRoot: HTMLElement, clonedRoot: HTMLElement) {
  const liveNodes = [liveRoot, ...Array.from(liveRoot.querySelectorAll("*"))];
  const clonedNodes = [
    clonedRoot,
    ...Array.from(clonedRoot.querySelectorAll("*")),
  ];

  const count = Math.min(liveNodes.length, clonedNodes.length);
  for (let i = 0; i < count; i++) {
    const live = liveNodes[i] as HTMLElement;
    const cloned = clonedNodes[i] as HTMLElement;
    if (!(live instanceof HTMLElement) || !(cloned instanceof HTMLElement)) {
      continue;
    }

    const cs = window.getComputedStyle(live);
    for (const prop of COLOR_PROPS) {
      const raw = cs.getPropertyValue(prop);
      if (!raw || !needsFlatten(raw)) continue;
      const flat = flattenToRgb(raw);
      if (flat) cloned.style.setProperty(prop, flat, "important");
    }

    // Gradients / shadows can also embed oklab
    const bgImage = cs.backgroundImage;
    if (bgImage && needsFlatten(bgImage)) {
      cloned.style.setProperty("background-image", "none", "important");
      const bg = flattenToRgb(cs.backgroundColor) || "#ffffff";
      cloned.style.setProperty("background-color", bg, "important");
    }

    const shadow = cs.boxShadow;
    if (shadow && needsFlatten(shadow)) {
      cloned.style.setProperty("box-shadow", "none", "important");
    }

    const textShadow = cs.textShadow;
    if (textShadow && needsFlatten(textShadow)) {
      cloned.style.setProperty("text-shadow", "none", "important");
    }
  }

  // Replace CSS variables that may resolve to oklab in the clone
  clonedRoot.style.setProperty("--brand-green", "#93E200", "important");
  clonedRoot.style.setProperty("--brand-green-rgb", "147, 226, 0", "important");
}

/**
 * Capture the live assessment DOM (same design) into a multi-page A4 PDF.
 */
export async function downloadAssessmentPdf(
  element: HTMLElement,
  clientName: string,
) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const restoreImages = await proxyExternalImages(element);
  await wait(350);

  try {
    const canvas = await html2canvas(element, {
      scale: Math.min(2, window.devicePixelRatio || 1.5),
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (_doc, clonedElement) => {
        const cloned =
          (clonedElement as HTMLElement).matches?.("[data-assessment-pdf-root]")
            ? (clonedElement as HTMLElement)
            : ((clonedElement as HTMLElement).querySelector?.(
                "[data-assessment-pdf-root]",
              ) as HTMLElement | null) || (clonedElement as HTMLElement);

        cloned.querySelectorAll("[data-pdf-hide]").forEach((node) => {
          (node as HTMLElement).style.display = "none";
        });
        cloned.style.maxWidth = "900px";
        cloned.style.margin = "0 auto";
        cloned.style.paddingBottom = "32px";
        cloned.style.backgroundColor = "#ffffff";

        sanitizeCloneColors(element, cloned);
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 6;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
    heightLeft -= usableHeight;

    while (heightLeft > 0.5) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
      heightLeft -= usableHeight;
    }

    pdf.save(`Hybrid-Pro-Assessment-${fileSafeName(clientName)}.pdf`);
  } finally {
    restoreImages();
  }
}
