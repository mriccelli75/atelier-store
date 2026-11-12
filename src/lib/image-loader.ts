"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * next/image loader. Unsplash images are resized on Unsplash's CDN;
 * anything else (e.g. files in /public) is served as-is.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }
  return src;
}
