import { getPexelsPhoto } from "@/lib/pexels";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

export async function StockPhoto({
  query,
  orientation = "landscape",
  variant,
  icon,
  alt,
  className = "",
}: {
  query: string;
  orientation?: "landscape" | "portrait" | "square";
  variant: Parameters<typeof PhotoPlaceholder>[0]["variant"];
  icon: string;
  alt: string;
  className?: string;
}) {
  const url = await getPexelsPhoto(query, orientation);

  if (!url) {
    return <PhotoPlaceholder variant={variant} icon={icon} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={`h-full w-full object-cover ${className}`} />
  );
}
