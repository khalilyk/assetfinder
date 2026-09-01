const cache = new Map<string, string | null>();

export async function getPexelsPhoto(
  query: string,
  orientation: "landscape" | "portrait" | "square" = "landscape",
): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  const cacheKey = `${orientation}:${query}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`,
      { headers: { Authorization: key }, next: { revalidate: 60 * 60 * 24 * 7 } },
    );
    if (!res.ok) {
      cache.set(cacheKey, null);
      return null;
    }
    const data = (await res.json()) as {
      photos?: { src?: { large2x?: string; large?: string; medium?: string } }[];
    };
    const src = data.photos?.[0]?.src;
    const url = src?.large2x ?? src?.large ?? src?.medium ?? null;
    cache.set(cacheKey, url);
    return url;
  } catch {
    cache.set(cacheKey, null);
    return null;
  }
}
