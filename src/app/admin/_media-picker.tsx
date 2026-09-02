"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Btn, Icons, Card } from "./_ui";

type Asset = { id: string; url: string; filename: string; type: string };

export function MediaPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setAssets((d.assets ?? []).filter((a: Asset) => a.type === "IMAGE")))
      .catch(() => setAssets([]));
  }, [open]);

  async function handleUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
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
          type: contentType.startsWith("image/") ? "IMAGE" : "OTHER",
          contentType,
          size: file.size,
        }),
      });
      onChange(blob.url);
      setOpen(false);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="text-[11px] font-semibold tracking-wide text-slate-500">{label.toUpperCase()}</label>
      <div className="mt-1.5 flex items-center gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <Icons.media size={20} className="text-slate-300" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Btn type="button" variant="outline" onClick={() => setOpen(true)}>
              Choose from Library
            </Btn>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[12px] font-semibold text-slate-400 hover:text-rose-600"
              >
                Remove
              </button>
            )}
          </div>
          {value && <p className="max-w-xs truncate text-[11px] text-slate-400">{value}</p>}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">Choose an image</p>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <Btn type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <Icons.upload size={15} /> {uploading ? "Uploading…" : "Upload New"}
                </Btn>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {assets === null ? (
                <p className="text-sm text-slate-400">Loading…</p>
              ) : assets.length === 0 ? (
                <Card className="p-8 text-center text-sm text-slate-400">
                  No images yet. Upload one to get started.
                </Card>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {assets.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        onChange(a.url);
                        setOpen(false);
                      }}
                      className="group aspect-square overflow-hidden rounded-lg border border-slate-200 transition hover:border-brand-lime"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.url} alt={a.filename} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
