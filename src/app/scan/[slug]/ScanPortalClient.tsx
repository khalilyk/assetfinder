"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import jsQR from "jsqr";
import { IconQr } from "@/components/icons";

type Status = "COMPLIANT" | "DUE_SOON" | "OVERDUE" | "UNKNOWN";

type AssetEvent = { id: string; type: string; label: string; occurredAt: string };

type Asset = {
  id: string;
  barcode: string;
  name: string;
  type: string;
  location: string | null;
  status: Status;
  lastInspectedAt: string | null;
  nextDueAt: string | null;
  notes: string | null;
  events: AssetEvent[];
};

const STATUS_META: Record<Status, { label: string; badge: string; dot: string }> = {
  COMPLIANT: { label: "Compliant", badge: "bg-brand-lime/15 text-brand-lime", dot: "bg-brand-lime" },
  DUE_SOON: { label: "Due Soon", badge: "bg-brand-orange/15 text-brand-orange", dot: "bg-brand-orange" },
  OVERDUE: { label: "Overdue", badge: "bg-rose-500/15 text-rose-400", dot: "bg-rose-400" },
  UNKNOWN: { label: "Unknown", badge: "bg-white/10 text-white/50", dot: "bg-white/40" },
};

const RECENT_KEY = "af_scan_recent";
const SEARCH_ANIMATION_MS = 5000;

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLocation(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
      enableHighAccuracy: true,
      timeout: 4000,
      maximumAge: 60000,
    });
  });
}

const SEARCH_COUNT_TARGET = 10000;

function QrScanLoader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const progress = Math.min(1, (Date.now() - start) / SEARCH_ANIMATION_MS);
      setCount(Math.floor(progress * SEARCH_COUNT_TARGET));
      if (progress >= 1) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-modal-in mt-6 flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-brand-dark-2/95 px-6 py-10 text-center shadow-2xl shadow-black/40">
      <div className="relative h-24 w-24 overflow-hidden rounded-lg">
        <IconQr className="animate-qr-pulse h-24 w-24 text-brand-lime" />
        <div className="animate-qr-scanline pointer-events-none absolute inset-x-0 h-0.5 bg-brand-lime shadow-[0_0_10px_2px_rgba(200,230,0,0.7)]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Searching {count.toLocaleString()} codes…</p>
        <p className="mt-1 text-xs text-white/40">Cross-checking your barcode against the AssetFinder registry.</p>
      </div>
    </div>
  );
}

function CameraScanner({ onScan, onClose }: { onScan: (code: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        tick();
      } catch {
        if (!cancelled) setError("Camera access was denied or isn't available on this device.");
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = jsQR(imageData.data, imageData.width, imageData.height);
          if (result?.data) {
            onScan(result.data);
            return;
          }
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onScan intentionally excluded to avoid restarting the camera stream on every render
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full border border-white/20 p-2.5 text-white/70 transition hover:border-white/40 hover:text-white"
        aria-label="Close camera"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {error ? (
        <div className="max-w-xs text-center">
          <p className="text-sm text-white/70">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 rounded-full bg-brand-lime px-5 py-2.5 text-sm font-semibold text-brand-dark"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl">
          <video ref={videoRef} muted playsInline className="aspect-square w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          <div className="pointer-events-none absolute inset-8">
            <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-brand-lime" />
            <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-brand-lime" />
            <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-brand-lime" />
            <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-brand-lime" />
            <div className="animate-qr-scanline absolute inset-x-0 h-0.5 bg-brand-lime shadow-[0_0_10px_2px_rgba(200,230,0,0.7)]" />
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-white/40">Point your camera at the asset&apos;s QR code.</p>
    </div>
  );
}

export function ScanPortalClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const inputRef = useRef<HTMLInputElement>(null);

  const [clientName, setClientName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    fetch(`/api/scan/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setClientName(d.client.name))
      .catch(() => setNotFound(true));

    try {
      const stored = sessionStorage.getItem(RECENT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads client-only sessionStorage, unavailable during server render
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // ignore
    }

    inputRef.current?.focus();
  }, [slug]);

  function rememberScan(code: string) {
    setRecent((prev) => {
      const next = [code, ...prev.filter((c) => c !== code)].slice(0, 5);
      try {
        sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function handleCameraScan(code: string) {
    setShowCamera(false);
    search(undefined, code);
  }

  async function search(e?: React.FormEvent, codeOverride?: string) {
    e?.preventDefault();
    const code = (codeOverride ?? barcode).trim();
    if (!code) return;

    setSearching(true);
    setError(null);
    setAsset(null);

    try {
      const position = await getLocation();
      const query = new URLSearchParams({ barcode: code });
      if (position) {
        query.set("lat", String(position.coords.latitude));
        query.set("lng", String(position.coords.longitude));
        query.set("acc", String(position.coords.accuracy));
      }

      const [res] = await Promise.all([
        fetch(`/api/scan/${slug}/search?${query.toString()}`),
        delay(SEARCH_ANIMATION_MS),
      ]);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setAsset(data.asset);
      rememberScan(code);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
      setBarcode("");
      inputRef.current?.focus();
    }
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-dark px-6 text-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-brand-lime">ASSETFINDER</p>
          <h1 className="mt-4 text-2xl font-bold text-white">Portal not found</h1>
          <p className="mt-2 text-sm text-white/50">This asset search link isn&apos;t active. Contact your account manager.</p>
          <Link href="/" className="mt-6 inline-block text-sm font-semibold text-brand-lime hover:text-brand-lime-dark">
            ← Back to AssetFinder
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      <header className="flex items-center justify-between gap-4 px-6 py-6 sm:grid sm:grid-cols-[1fr_auto_1fr] md:px-10">
        <span className="hidden sm:block" />
        <Link href="/" className="flex items-center sm:justify-self-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assetfinder-logo.png" alt="AssetFinder" className="h-10 w-auto sm:h-12" />
        </Link>
        <a
          href="/contact"
          className="flex-shrink-0 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white sm:justify-self-end"
        >
          Support
        </a>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-6 md:px-10">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-lime">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" />
          {clientName ? clientName.toUpperCase() : "LOADING…"}
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          Asset Search
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
          Scan or enter a barcode to pull up the live compliance record for this asset.
        </p>

        <form
          onSubmit={search}
          className="mt-8 rounded-2xl border border-white/10 bg-brand-dark-2/95 p-5 shadow-2xl shadow-black/40"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white/60">Search by barcode</span>
            <span className="flex items-center gap-1.5 font-semibold text-brand-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" />
              {searching ? "Searching…" : "Ready"}
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
            <input
              ref={inputRef}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder={`Scan a ${clientName ?? ""} barcode…`}
              autoComplete="off"
              className="flex-1 rounded-xl border border-white/10 bg-brand-dark px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-brand-lime focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              disabled={searching}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none">
                <path
                  d="M4 8a2 2 0 012-2h1.2a1 1 0 00.85-.47l.9-1.44A1 1 0 0110 3.6h4a1 1 0 01.85.53l.9 1.4a1 1 0 00.85.47H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12.5" r="3.3" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              Scan
            </button>
            <button
              type="submit"
              disabled={searching || !barcode.trim()}
              className="btn-glow rounded-xl bg-brand-lime px-6 py-3.5 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-[1.02] hover:bg-brand-lime-dark active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              Search Asset
            </button>
          </div>

          {recent.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-4">
              <span className="text-[11px] font-semibold text-white/30">Recent:</span>
              {recent.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => search(undefined, code)}
                  className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </form>

        {searching && <QrScanLoader />}

        {!searching && error && (
          <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {!searching && asset && (
          <div className="animate-modal-in mt-6 rounded-2xl border border-white/10 bg-brand-dark-2/95 p-6 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{asset.name}</p>
                <p className="text-sm text-white/50">{asset.type}</p>
              </div>
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${STATUS_META[asset.status].badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[asset.status].dot}`} />
                {STATUS_META[asset.status].label.toUpperCase()}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-sm">
              <Row label="Barcode" value={asset.barcode} />
              <Row label="Location" value={asset.location ?? "—"} />
              <Row label="Last inspected" value={formatDate(asset.lastInspectedAt)} />
              <Row label="Next due" value={formatDate(asset.nextDueAt)} />
            </div>

            {asset.notes && (
              <p className="mt-4 rounded-lg bg-white/5 px-3 py-2.5 text-[13px] text-white/60">{asset.notes}</p>
            )}

            {asset.events.length > 0 && (
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[10px] font-semibold tracking-wide text-white/40">MAINTENANCE TIMELINE</p>
                <ul className="mt-2.5 flex flex-col gap-2">
                  {asset.events.map((ev) => (
                    <li key={ev.id} className="flex items-start gap-2 text-xs">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lime" />
                      <span className="text-white/70">
                        <span className="text-white/40">{formatDate(ev.occurredAt)}</span> {ev.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-6 py-6 md:px-10">
        <p className="text-center text-xs text-white/30">
          Powered by{" "}
          <Link href="/" className="font-semibold text-white/50 hover:text-white/70">
            AssetFinder
          </Link>
        </p>
      </footer>

      {showCamera && <CameraScanner onScan={handleCameraScan} onClose={() => setShowCamera(false)} />}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="mt-0.5 font-medium text-white/90">{value}</p>
    </div>
  );
}
