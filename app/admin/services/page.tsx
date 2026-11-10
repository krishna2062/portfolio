"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineBriefcase,
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import {
  RxCrop,
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
  RxLayers,
  RxCode,
  RxGear,
} from "react-icons/rx";
import { api, resolveImageUrl } from "@/lib/api";
import AdminImagePicker from "@/components/AdminImagePicker";

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconKey: string;
  displayOrder: number;
  isPublished: boolean;
}

const AVAILABLE_ICONS = [
  { key: "RxCrop", name: "Branding / Crop", Icon: RxCrop },
  { key: "RxPencil2", name: "Design / Pencil", Icon: RxPencil2 },
  { key: "RxDesktop", name: "Development / Desktop", Icon: RxDesktop },
  { key: "RxReader", name: "SEO / Content", Icon: RxReader },
  { key: "RxRocket", name: "Performance / Launch", Icon: RxRocket },
  { key: "RxLayers", name: "Architecture / Layers", Icon: RxLayers },
  { key: "RxCode", name: "Code / API", Icon: RxCode },
  { key: "RxGear", name: "Settings / System", Icon: RxGear },
];

export default function ServicesAdmin() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconKey, setIconKey] = useState("RxDesktop");
  const [iconSource, setIconSource] = useState<"preset" | "custom">("preset");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isPublished, setIsPublished] = useState(true);

  const fetchServices = () => {
    setIsLoading(true);
    api
      .authFetch<ServiceItem[]>("/api/admin/services")
      .then((data) => {
        setServices(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load services: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setIconKey("RxDesktop");
    setIconSource("preset");
    setDisplayOrder(services.length + 1);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setTitle(s.title);
    setDescription(s.description);
    const key = s.iconKey || "RxDesktop";
    setIconKey(key);
    const isCustom = !AVAILABLE_ICONS.some((i) => i.key === key);
    setIconSource(isCustom ? "custom" : "preset");
    setDisplayOrder(s.displayOrder);
    setIsPublished(s.isPublished);
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title,
      description,
      iconKey,
      displayOrder,
      isPublished,
    };

    try {
      if (editingService) {
        await api.authFetch(`/api/admin/services/${editingService.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Service updated successfully!");
      } else {
        await api.authFetch("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Service created successfully!");
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to save service.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const res = await api.authFetch<{ id: number; isPublished: boolean }>(`/api/admin/services/${id}/publish`, {
        method: "PATCH",
      });
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPublished: res.isPublished } : s))
      );
      toast.success(res.isPublished ? "Service published!" : "Service unpublished.");
    } catch (err: any) {
      toast.error("Failed to toggle publish status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/services/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Service deleted successfully.");
      setDeleteTarget(null);
      fetchServices();
    } catch (err: any) {
      toast.error("Failed to delete service: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderIcon = (key: string) => {
    if (key?.startsWith("http://") || key?.startsWith("https://") || key?.startsWith("/") || key?.startsWith("data:")) {
      return (
        <img
          src={resolveImageUrl(key)}
          alt="icon"
          className="w-5 h-5 object-contain rounded"
        />
      );
    }
    const found = AVAILABLE_ICONS.find((i) => i.key === key);
    if (found) {
      const IconComponent = found.Icon;
      return <IconComponent className="text-xl text-blue-600" />;
    }
    return <RxDesktop className="text-xl text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineBriefcase className="text-blue-600" /> Services Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the professional service offerings displayed on the Services page slider.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <HiPlus className="text-base" /> New Service
        </button>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs font-medium">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <HiOutlineBriefcase className="mx-auto text-4xl text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-600">No services configured</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;New Service&quot; to add your first offering.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    {renderIcon(s.iconKey)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">Order #{s.displayOrder}</span>
                    <button
                      onClick={() => handleTogglePublish(s.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                        s.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${s.isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {s.isPublished ? "Active" : "Hidden"}
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{s.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400">{s.iconKey}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <HiOutlinePencilSquare className="text-base" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <HiOutlineTrash className="text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingService ? `Edit Service: ${editingService.title}` : "Add New Service"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Web Development"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">Icon / Graphic Representation</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setIconSource("preset");
                        if (!AVAILABLE_ICONS.some((i) => i.key === iconKey)) setIconKey("RxDesktop");
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        iconSource === "preset" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Preset Icons
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIconSource("custom");
                        if (AVAILABLE_ICONS.some((i) => i.key === iconKey)) setIconKey("");
                      }}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        iconSource === "custom" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Upload / Custom URL
                    </button>
                  </div>
                </div>

                {iconSource === "preset" ? (
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_ICONS.map((i) => {
                      const IconComponent = i.Icon;
                      const isSelected = iconKey === i.key;
                      return (
                        <button
                          type="button"
                          key={i.key}
                          onClick={() => setIconKey(i.key)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <IconComponent className="text-xl" />
                          <span className="text-[10px] truncate max-w-full">{i.name.split("/")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <AdminImagePicker
                    label="Service Icon / Graphic"
                    value={iconKey}
                    onChange={(url) => setIconKey(url)}
                    recommendedSize="Square icon (128x128px or PNG/SVG)"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clear description of what deliverables and business value this service provides..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Published (Visible on Portfolio)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <HiOutlineCheck className="text-base" />
                  {isSaving ? "Saving..." : editingService ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
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
            <h3 className="text-sm font-bold text-slate-900">Delete Service?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to delete <strong className="text-slate-800">&quot;{deleteTarget.title}&quot;</strong>?
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

