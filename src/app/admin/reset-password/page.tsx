"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-white/60">This reset link is missing a token.</p>
        <Link href="/admin/login" className="mt-4 inline-block text-sm font-semibold text-brand-lime hover:text-brand-lime-dark">
          ← Back to sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm font-semibold text-brand-lime">Password updated</p>
        <p className="mt-2 text-sm text-white/50">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assetfinder-logo.png" alt="AssetFinder" className="h-8 w-auto" />
      </Link>

      <div className="mt-10">
        <h1 className="text-xl font-bold text-white">Set a new password</h1>
        <p className="mt-1 text-sm text-white/50">Choose a new password for your admin account.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="text-xs font-semibold tracking-wide text-white/50">
              NEW PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-brand-dark-2 px-4 py-3 text-sm text-white focus:border-brand-lime focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="text-xs font-semibold tracking-wide text-white/50">
              CONFIRM PASSWORD
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-brand-dark-2 px-4 py-3 text-sm text-white focus:border-brand-lime focus:outline-none"
            />
          </div>

          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand-lime px-5 py-3 text-sm font-semibold text-brand-dark transition duration-200 hover:scale-[1.02] hover:bg-brand-lime-dark active:scale-95 disabled:opacity-60"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-dark px-6">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
