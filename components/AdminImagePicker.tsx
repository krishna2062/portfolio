"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  HiOutlinePhoto,
  HiOutlineArrowUpTray,
  HiOutlineLink,
  HiOutlineTrash,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { api, resolveImageUrl } from "@/lib/api";

interface AdminImagePickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  recommendedSize?: string;
}

export default function AdminImagePicker({
  label,
  value,
  onChange,
  required = false,
  recommendedSize = "1200x800 px recommended",
}: AdminImagePickerProps) {
  const [mode, setMode] = useState<"upload" | "url">(value?.startsWith("http") ? "url" : "upload");
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB.");
      return;
    }

    setIsUploading(true);
    setImageError(false);
    try {
      const res = await api.uploadMedia(file, file.name);
      onChange(res.relativeUrl);
      toast.success("Image uploaded successfully!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (val: string) => {
    let clean = val;
    if (clean.includes("google.") && clean.includes("/imgres") && clean.includes("imgurl=")) {
      try {
        const match = clean.match(/[?&]imgurl=([^&]+)/);
        if (match && match[1]) {
          clean = decodeURIComponent(match[1]);
          toast.success("Google Images link detected! Converted to direct image URL.");
        }
      } catch {
        // ignore
      }
    }
    setImageError(false);
    onChange(clean);
  };

  const previewSrc = value ? resolveImageUrl(value) : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-[10px] text-slate-400">{recommendedSize}</span>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            mode === "upload"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <HiOutlineArrowUpTray className="text-sm" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            mode === "url"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <HiOutlineLink className="text-sm" /> Paste Image URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" ? (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl p-4 text-center cursor-pointer transition-colors"
          >
            <HiOutlinePhoto className="mx-auto text-2xl text-slate-400 mb-1" />
            <p className="text-xs font-semibold text-slate-700">
              {isUploading ? "Uploading to storage..." : "Click to choose image from your computer"}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, WebP, SVG, GIF up to 10MB</p>
          </div>
        </div>
      ) : (
        /* URL Mode */
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Paste URL (e.g. https://... or /thumb1.jpg)"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Accepts any direct image URL (Unsplash, Cloudinary, Imgur, Supabase, Google Images, etc.) or relative path.
          </p>
        </div>
      )}

      {/* Live Preview Card */}
      {value && (
        <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
            {!imageError ? (
              <Image
                src={previewSrc}
                alt="Image Preview"
                fill
                unoptimized
                onError={() => setImageError(true)}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] text-red-500 text-center font-bold">
                Failed to load
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
              {!imageError ? (
                <>
                  <HiOutlineCheckCircle className="text-emerald-500 text-sm" />
                  <span className="text-emerald-700">Valid Image</span>
                </>
              ) : (
                <span className="text-red-500">Broken or inaccessible URL</span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{value}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              onChange("");
              setImageError(false);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Clear image"
          >
            <HiOutlineTrash className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
