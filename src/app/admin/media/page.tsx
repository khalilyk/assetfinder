"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Card, PageHeader, Btn, Icons } from "../_ui";

type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER";

type Asset = {
  id: string;
  url: string;
  pathname: string;
  filename: string;
  type: MediaType;
  contentType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  folder: string | null;
  createdAt: string;
};

const FILTERS: { label: string; value: MediaType | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Images", value: "IMAGE" },
  { label: "Videos", value: "VIDEO" },
  { label: "Documents", value: "DOCUMENT" },
];

function typeFromContentType(contentType: string): MediaType {
  if (contentType.startsWith("image/")) return "IMAGE";
  if (contentType.startsWith("video/")) return "VIDEO";
  if (contentType === "application/pdf") return "DOCUMENT";
  return "OTHER";
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [filter, setFilter] = useState<MediaType | "ALL">("ALL");
  const [uploading, setUploading] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setAssets(d.assets ?? []))
      .catch(() => setAssets([]));
  };

  useEffect(load, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploadTotal(files.length);
    setUploading(1);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploading(i + 1);
      try {
        const dimensions = await readImageDimensions(file);
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/media/upload-token",
        });
        const contentType = blob.contentType || file.type || "application/octet-stream";

        await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: blob.url,
            pathname: blob.pathname,
            filename: file.name,
            type: typeFromContentType(contentType),
            contentType,
            size: file.size,
            width: dimensions?.width ?? null,
            height: dimensions?.height ?? null,
          }),
        });
      } catch {
        setError(`Failed to upload "${file.name}".`);
      }
    }

    setUploading(0);
    setUploadTotal(0);
    load();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deleteAsset(id: string) {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  }

  async function saveAlt() {
    if (!selected) return;
    setSavingAlt(true);
    await fetch(`/api/admin/media/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: altDraft }),
    });
    setSavingAlt(false);
    setSelected({ ...selected, alt: altDraft });
    load();
  }

  const filtered = (assets ?? []).filter((a) => filter === "ALL" || a.type === filter);

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="Upload and manage images, videos, and documents used across the site."
        action={
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Btn onClick={() => fileInputRef.current?.click()} disabled={uploading > 0}>
              <Icons.upload size={16} />
              {uploading > 0 ? `Uploading ${uploading}/${uploadTotal}…` : "Upload Files"}
            </Btn>
          </>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="mb-5 flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
              filter === f.value ? "bg-brand-lime text-brand-dark" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {assets === null ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-400">
          {assets.length === 0 ? "No media yet. Upload your first file to get started." : "No files match this filter."}
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setSelected(a);
                setAltDraft(a.alt ?? "");
              }}
              className="group text-left"
            >
              <Card className="aspect-square overflow-hidden transition group-hover:border-slate-300">
                {a.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.alt ?? ""} className="h-full w-full object-cover" />
                ) : a.type === "VIDEO" ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50">
                    <Icons.media size={28} className="text-slate-300" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50">
                    <Icons.pages size={28} className="text-slate-300" />
                  </div>
                )}
              </Card>
              <p className="mt-1.5 truncate text-[12px] font-medium text-slate-600">{a.filename}</p>
              <p className="text-[11px] text-slate-400">{formatBytes(a.size)}</p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="truncate text-sm font-semibold text-slate-900">{selected.filename}</p>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {selected.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.url} alt={selected.alt ?? ""} className="max-h-80 w-full object-contain" />
                ) : selected.type === "VIDEO" ? (
                  <video src={selected.url} controls className="max-h-80 w-full" />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center">
                    <Icons.pages size={40} className="text-slate-300" />
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Type</p>
                  <p className="mt-1 text-slate-700">{selected.contentType ?? selected.type}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Size</p>
                  <p className="mt-1 text-slate-700">{formatBytes(selected.size)}</p>
                </div>
                {selected.width && selected.height && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Dimensions</p>
                    <p className="mt-1 text-slate-700">
                      {selected.width} × {selected.height}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Uploaded</p>
                  <p className="mt-1 text-slate-700">
                    {new Date(selected.createdAt).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-[11px] font-semibold tracking-wide text-slate-500">ALT TEXT</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    value={altDraft}
                    onChange={(e) => setAltDraft(e.target.value)}
                    placeholder="Describe this image for accessibility and SEO"
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-lime focus:bg-white focus:outline-none"
                  />
                  <Btn variant="outline" onClick={saveAlt} disabled={savingAlt}>
                    {savingAlt ? "Saving…" : "Save"}
                  </Btn>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-[11px] font-semibold tracking-wide text-slate-500">URL</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    readOnly
                    value={selected.url}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <Btn variant="outline" onClick={() => deleteAsset(selected.id)}>
                <Icons.trash size={15} /> Delete
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
