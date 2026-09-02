"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ROTATE_MS = 5 * 60 * 1000; // 5 minutes

function LoginImagePane() {
  const [images, setImages] = useState<string[]>(["/af-header.png"]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/api/admin/login-media")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [images]);

  return (
    <div className="relative hidden overflow-hidden bg-brand-dark lg:block lg:w-1/2">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-brand-dark/40" />
      <div className="absolute bottom-10 left-10 right-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-lime">ASSETFINDER</p>
        <p className="mt-3 max-w-sm text-2xl font-bold leading-tight text-white">
          Know every asset. Prove every check.
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="flex items-center justify-center lg:justify-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assetfinder-logo.png" alt="AssetFinder" className="h-8 w-auto" />
      </Link>

      <div className="mt-10">
        <h1 className="text-xl font-bold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-white/50">Sign in with your AssetFinder admin account.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-xs font-semibold tracking-wide text-white/50">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-brand-dark-2 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-lime focus:outline-none"
              placeholder="you@assetfinder.au"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-wide text-white/50"
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-brand-dark-2 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-lime focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand-lime px-5 py-3 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-[1.02] hover:bg-brand-lime-dark active:scale-95 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <Link
        href="/"
        className="mt-8 block text-center text-sm text-white/40 transition hover:text-white/70 lg:text-left"
      >
        ← Back to site
      </Link>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen bg-brand-dark">
      <LoginImagePane />
      <div
        className="flex flex-1 items-center justify-center px-6 py-16"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
