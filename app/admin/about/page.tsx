"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineCheck, HiPlus, HiTrash, HiPencilSquare } from "react-icons/hi2";
import { api } from "@/lib/api";
import AdminImagePicker from "@/components/AdminImagePicker";

interface AboutData {
  id: number;
  headline: string;
  headlineAccent: string;
  description: string;
  imageUrl: string;
  yearsOfExperience: number;
  completedProjects: number;
  techMasteredCount: number;
  tabs: {
    id: number;
    tabKey: string;
    title: string;
    subtitle: string;
    description: string;
    displayOrder: number;
  }[];
}

export default function AboutAdmin() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Tab editor state
  const [editingTab, setEditingTab] = useState<{
    id?: number;
    tabKey: string;
    title: string;
    subtitle: string;
    description: string;
    displayOrder: number;
  } | null>(null);

  const fetchAbout = () => {
    setIsLoading(true);
    api
      .authFetch<AboutData>("/api/admin/about")
      .then((data) => {
        setAbout(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load about section.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setIsSaving(true);
    try {
      await api.authFetch("/api/admin/about", {
        method: "PUT",
        body: JSON.stringify({
          headline: about.headline,
          headlineAccent: about.headlineAccent,
          description: about.description,
          imageUrl: about.imageUrl,
          yearsOfExperience: Number(about.yearsOfExperience),
          completedProjects: Number(about.completedProjects),
          techMasteredCount: Number(about.techMasteredCount),
        }),
      });
      toast.success("About section updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update about section.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTab || !editingTab.tabKey || !editingTab.title || !editingTab.description) {
      toast.error("Please fill in required tab fields.");
      return;
    }

    try {
      if (editingTab.id) {
        // Update existing tab
        await api.authFetch(`/api/admin/about/tabs/${editingTab.id}`, {
          method: "PUT",
          body: JSON.stringify(editingTab),
        });
        toast.success("Tab updated!");
      } else {
        // Create new tab
        await api.authFetch("/api/admin/about/tabs", {
          method: "POST",
          body: JSON.stringify(editingTab),
        });
        toast.success("Tab created!");
      }
      setEditingTab(null);
      fetchAbout();
    } catch (err: any) {
      toast.error(err.message || "Failed to save tab.");
    }
  };

  const handleDeleteTab = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tab?")) return;
    try {
      await api.authFetch(`/api/admin/about/tabs/${id}`, { method: "DELETE" });
      toast.success("Tab deleted.");
      fetchAbout();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tab.");
    }
  };

  if (isLoading || !about) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-md w-48" />
        <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">About Section & Stats</h1>
        <p className="text-sm text-slate-500">Manage headline typography, metric counters, and timeline tabs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details Form */}
        <form onSubmit={handleAboutSubmit} className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Headline</label>
              <input
                type="text"
                value={about.headline}
                onChange={(e) => setAbout({ ...about, headline: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Headline Highlight (Red)</label>
              <input
                type="text"
                value={about.headlineAccent}
                onChange={(e) => setAbout({ ...about, headlineAccent: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none text-[#f13024] font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description Paragraph</label>
            <textarea
              rows={3}
              value={about.description}
              onChange={(e) => setAbout({ ...about, description: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
            />
          </div>

          {/* Portrait Image */}
          <div className="pt-2 border-t border-slate-100">
            <AdminImagePicker
              label="About Section Portrait Image"
              value={about.imageUrl || ""}
              onChange={(url) => setAbout({ ...about, imageUrl: url })}
              recommendedSize="Portrait (e.g. 600x800px, PNG with transparent bg or JPG)"
            />
          </div>

          {/* Metric Counters */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Live Animated Metric Counters</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Years Experience</label>
                <input
                  type="number"
                  min="0"
                  value={about.yearsOfExperience}
                  onChange={(e) => setAbout({ ...about, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Completed Projects</label>
                <input
                  type="number"
                  min="0"
                  value={about.completedProjects}
                  onChange={(e) => setAbout({ ...about, completedProjects: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tech Mastered</label>
                <input
                  type="number"
                  min="0"
                  value={about.techMasteredCount}
                  onChange={(e) => setAbout({ ...about, techMasteredCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <HiOutlineCheck className="text-lg" />
              <span>{isSaving ? "Saving..." : "Save About Changes"}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Tab Content Items */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">About Tabs (Experience / Status)</h3>
              <button
                type="button"
                onClick={() =>
                  setEditingTab({
                    tabKey: "new_tab",
                    title: "",
                    subtitle: "",
                    description: "",
                    displayOrder: (about.tabs.length || 0) + 1,
                  })
                }
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <HiPlus className="text-sm" />
                <span>Add Tab</span>
              </button>
            </div>

            {/* Tab Editor Modal/Inline Form */}
            {editingTab && (
              <form onSubmit={handleSaveTab} className="py-4 border-b border-slate-100 space-y-3 bg-slate-50/70 p-3 rounded-xl mt-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Tab Key (e.g. experience)"
                    value={editingTab.tabKey}
                    onChange={(e) => setEditingTab({ ...editingTab, tabKey: e.target.value.toLowerCase().trim() })}
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Order"
                    value={editingTab.displayOrder}
                    onChange={(e) => setEditingTab({ ...editingTab, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Main Title"
                  value={editingTab.title}
                  onChange={(e) => setEditingTab({ ...editingTab, title: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="text"
                  placeholder="Subtitle / Tech stack"
                  value={editingTab.subtitle}
                  onChange={(e) => setEditingTab({ ...editingTab, subtitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <textarea
                  rows={2}
                  placeholder="Description..."
                  value={editingTab.description}
                  onChange={(e) => setEditingTab({ ...editingTab, description: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs resize-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingTab(null)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                  >
                    Save Tab
                  </button>
                </div>
              </form>
            )}

            {/* Tabs List */}
            <div className="divide-y divide-slate-100 mt-2">
              {about.tabs.map((tab) => (
                <div key={tab.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{tab.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] uppercase font-semibold">
                        {tab.tabKey}
                      </span>
                    </div>
                    {tab.subtitle && <p className="text-[11px] text-[#f13024] font-medium mt-0.5">{tab.subtitle}</p>}
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{tab.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingTab(tab)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded"
                      title="Edit tab"
                    >
                      <HiPencilSquare className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteTab(tab.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete tab"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

