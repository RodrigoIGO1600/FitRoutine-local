export function getYouTubeThumbnail(url: string | null): string | null {
  if (!url) return null;

  let videoId: string | null = null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      videoId = parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }

  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
