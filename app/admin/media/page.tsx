"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  HiOutlinePhoto,
  HiOutlineArrowUpTray,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineClipboardDocumentCheck,
  HiXMark,
} from "react-icons/hi2";
import { api } from "@/lib/api";

interface MediaAsset {
  id: string;
  originalFileName: string;
  relativeUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  altText?: string;
  uploadedAtUtc: string;
}

export default function MediaLibraryAdmin() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview & Delete state
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMedia = () => {
    setIsLoading(true);
    api
      .authFetch<MediaAsset[]>("/api/admin/media")
      .then((data) => {
        setMediaList(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load media: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name);

    setIsUploading(true);
    try {
      await api.authFetch<MediaAsset>("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      toast.success("File uploaded successfully!");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMedia();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/media/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Media asset deleted.");
      if (selectedAsset?.id === deleteTarget.id) setSelectedAsset(null);
      setDeleteTarget(null);
      fetchMedia();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete media asset.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFullUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith("http")) return relativeUrl;
    if (relativeUrl.startsWith("/")) return `${api.baseUrl}${relativeUrl}`;
    return `${api.baseUrl}/${relativeUrl}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlinePhoto className="text-blue-600" /> Media Asset Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and manage project screenshots, profile assets, and blog cover illustrations.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <HiOutlineArrowUpTray className="text-base" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {/* Upload Dropzone Banner */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center cursor-pointer transition-colors shadow-2xs group"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
          <HiOutlineArrowUpTray className="text-2xl" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Click or drag image here to upload</h3>
        <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WebP, SVG, and GIF up to 10MB</p>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Stored Assets ({mediaList.length})</h2>
          <span className="text-[11px] text-slate-400">Click any image to view details or copy link</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading media assets...</div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlinePhoto className="mx-auto text-4xl text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No media assets found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Uploaded project or profile images will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaList.map((asset) => {
              const fullUrl = getFullUrl(asset.relativeUrl);
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 aspect-video flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={fullUrl}
                      alt={asset.altText || asset.originalFileName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 text-white">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(fullUrl, asset.id);
                        }}
                        className="p-1 bg-white/20 hover:bg-white/40 rounded-md transition-colors"
                        title="Copy image link"
                      >
                        {copiedId === asset.id ? (
                          <HiOutlineClipboardDocumentCheck className="text-emerald-400 text-sm" />
                        ) : (
                          <HiOutlineClipboardDocument className="text-white text-sm" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(asset);
                        }}
                        className="p-1 bg-red-600/80 hover:bg-red-600 rounded-md transition-colors"
                        title="Delete image"
                      >
                        <HiOutlineTrash className="text-white text-sm" />
                      </button>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold truncate leading-tight">{asset.originalFileName}</p>
                      <span className="text-[10px] text-slate-300">{formatFileSize(asset.fileSizeBytes)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs">
                {selectedAsset.originalFileName}
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={getFullUrl(selectedAsset.relativeUrl)}
                  alt={selectedAsset.originalFileName}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Direct URL:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getFullUrl(selectedAsset.relativeUrl)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                    <button
                      onClick={() => handleCopyUrl(getFullUrl(selectedAsset.relativeUrl), selectedAsset.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg font-semibold text-xs whitespace-nowrap cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">File Size:</span>
                    <strong className="text-slate-700">{formatFileSize(selectedAsset.fileSizeBytes)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">MIME Type:</span>
                    <strong className="text-slate-700">{selectedAsset.mimeType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Uploaded Date:</span>
                    <strong className="text-slate-700">
                      {new Date(selectedAsset.uploadedAtUtc).toLocaleDateString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Relative Path:</span>
                    <strong className="text-slate-700 font-mono truncate block">
                      {selectedAsset.relativeUrl}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedAsset)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold cursor-pointer"
              >
                <HiOutlineTrash className="text-sm" /> Delete Asset
              </button>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <HiOutlineTrash className="text-2xl" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Delete Image Asset?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to delete <strong className="text-slate-800">{deleteTarget.originalFileName}</strong>?
              If this file is linked to any published project or blog, the deletion will be protected.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

