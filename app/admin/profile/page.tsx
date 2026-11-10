"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineUser, HiOutlineCheck, HiPlus, HiTrash } from "react-icons/hi2";
import { api, resolveImageUrl } from "@/lib/api";
import AdminImagePicker from "@/components/AdminImagePicker";

interface ProfileData {
  id: number;
  fullName: string;
  brandTitle: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroHighlight: string;
  subtitle: string;
  profileImageUrl: string;
  cvDownloadUrl?: string;
  location: string;
  phoneWhatsApp: string;
  contactEmail: string;
  domainEmail: string;
  socialLinks: { id: number; name: string; link: string; iconKey: string; displayOrder: number }[];
}

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New social link form state
  const [newSocial, setNewSocial] = useState({ name: "", link: "", iconKey: "RiGlobalLine", displayOrder: 1 });
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  const fetchProfile = () => {
    setIsLoading(true);
    api
      .authFetch<ProfileData>("/api/admin/profile")
      .then((data) => {
        setProfile(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load profile.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      await api.authFetch("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: profile.fullName,
          brandTitle: profile.brandTitle,
          heroTitleLine1: profile.heroTitleLine1,
          heroTitleLine2: profile.heroTitleLine2,
          heroHighlight: profile.heroHighlight,
          subtitle: profile.subtitle,
          profileImageUrl: profile.profileImageUrl,
          cvDownloadUrl: profile.cvDownloadUrl,
          location: profile.location,
          phoneWhatsApp: profile.phoneWhatsApp,
          contactEmail: profile.contactEmail,
          domainEmail: profile.domainEmail,
        }),
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.name || !newSocial.link) {
      toast.error("Please enter a name and link.");
      return;
    }

    try {
      await api.authFetch("/api/admin/profile/socials", {
        method: "POST",
        body: JSON.stringify(newSocial),
      });
      toast.success("Social link added!");
      setNewSocial({ name: "", link: "", iconKey: "RiGlobalLine", displayOrder: 1 });
      setIsAddingSocial(false);
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to add social link.");
    }
  };

  const handleDeleteSocial = async (id: number) => {
    if (!confirm("Are you sure you want to remove this social link?")) return;
    try {
      await api.authFetch(`/api/admin/profile/socials/${id}`, { method: "DELETE" });
      toast.success("Social link removed.");
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete link.");
    }
  };

  if (isLoading || !profile) {
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
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile & Identity</h1>
          <p className="text-sm text-slate-500">Manage hero headers, personal biography, and contact details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details Form */}
        <form onSubmit={handleProfileSubmit} className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand Logo Title</label>
              <input
                type="text"
                value={profile.brandTitle}
                onChange={(e) => setProfile({ ...profile, brandTitle: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Title Line 1</label>
              <input
                type="text"
                value={profile.heroTitleLine1}
                onChange={(e) => setProfile({ ...profile, heroTitleLine1: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Title Line 2</label>
              <input
                type="text"
                value={profile.heroTitleLine2}
                onChange={(e) => setProfile({ ...profile, heroTitleLine2: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Accent Word</label>
              <input
                type="text"
                value={profile.heroHighlight}
                onChange={(e) => setProfile({ ...profile, heroHighlight: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none text-[#f13024] font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Subtitle / Bio</label>
            <textarea
              rows={3}
              value={profile.subtitle}
              onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone / WhatsApp</label>
              <input
                type="text"
                value={profile.phoneWhatsApp}
                onChange={(e) => setProfile({ ...profile, phoneWhatsApp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Direct Contact Email</label>
            <input
              type="email"
              value={profile.contactEmail}
              onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <AdminImagePicker
              label="Profile Photo (Avatar)"
              value={profile.profileImageUrl}
              onChange={(url) => setProfile({ ...profile, profileImageUrl: url })}
              recommendedSize="Square / Portrait (e.g. 700x700px, PNG or JPG)"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <HiOutlineCheck className="text-lg" />
              <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Social Links & Photo Preview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Preview Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Profile Photo Preview</h3>
            <div className="w-32 h-32 rounded-2xl bg-slate-900 mx-auto overflow-hidden border border-slate-200 flex items-center justify-center p-2">
              <img
                src={resolveImageUrl(profile.profileImageUrl || "/assets/krishna.png")}
                alt={profile.fullName}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">{profile.fullName}</p>
          </div>

          {/* Social Links Manager */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Social Links</h3>
              <button
                type="button"
                onClick={() => setIsAddingSocial(!isAddingSocial)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <HiPlus className="text-sm" />
                <span>Add</span>
              </button>
            </div>

            {isAddingSocial && (
              <form onSubmit={handleAddSocial} className="py-3 border-b border-slate-100 space-y-3">
                <input
                  type="text"
                  placeholder="Platform Name (e.g. GitHub)"
                  value={newSocial.name}
                  onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={newSocial.link}
                  onChange={(e) => setNewSocial({ ...newSocial, link: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSocial(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-slate-100 mt-2">
              {profile.socialLinks.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="truncate min-w-0">
                    <span className="font-semibold text-slate-800">{s.name}</span>
                    <p className="text-[11px] text-slate-400 truncate">{s.link}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSocial(s.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Delete link"
                  >
                    <HiTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

