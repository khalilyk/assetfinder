import Link from "next/link";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ok = status === "ok";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-dark px-6 text-center">
      <div>
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-lime">ASSETFINDER</p>
        <h1 className="mt-4 text-2xl font-bold text-white">
          {ok ? "You've been unsubscribed" : "We couldn't find that subscription"}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-white/50">
          {ok
            ? "You won't receive any more emails from us. You can resubscribe any time from our website."
            : "This unsubscribe link may have expired or already been used."}
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-brand-lime hover:text-brand-lime-dark">
          ← Back to AssetFinder
        </Link>
      </div>
    </main>
  );
}
