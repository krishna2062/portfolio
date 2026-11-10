"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCog6Tooth,
  HiOutlineKey,
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { api } from "@/lib/api";

interface WebsiteSetting {
  key: string;
  value: string;
  updatedAtUtc?: string;
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // User Account Profile state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fetchSettings = () => {
    setIsLoading(true);
    api
      .authFetch<WebsiteSetting[]>("/api/admin/settings")
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((s) => {
          map[s.key] = s.value;
        });
        setSettings(map);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load settings: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
    try {
      const stored = localStorage.getItem("krishna_admin_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUsername(u.username || "");
        setEmail(u.email || "");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      toast.error("Username and Email are required.");
      return;
    }

    setIsUpdatingAccount(true);
    try {
      const res = await api.authFetch<{ message: string; token: string; user: { id: string; username: string; email: string; role: string } }>("/api/auth/update-account", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), email: email.trim() }),
      });
      if (res.token) api.setToken(res.token);
      if (res.user) localStorage.setItem("krishna_admin_user", JSON.stringify(res.user));
      toast.success("Account username and email updated successfully in database!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update account credentials.");
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAllSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      // Save each setting
      const promises = Object.entries(settings).map(([k, v]) =>
        api.authFetch(`/api/admin/settings/${encodeURIComponent(k)}`, {
          method: "PUT",
          body: JSON.stringify({ value: v }),
        })
      );
      await Promise.all(promises);
      toast.success("Settings saved successfully!");
      fetchSettings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.authFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HiOutlineCog6Tooth className="text-blue-600" /> Platform & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure site-wide preferences, contact routing, and administrative security credentials.
        </p>
      </div>

      {/* Website Configuration Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Website Configuration</h2>
            <p className="text-[11px] text-slate-400">Global site metadata, domain routing, and SEO defaults.</p>
          </div>
          <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            PostgreSQL • Supabase Live
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading settings...</div>
        ) : (
          <form onSubmit={handleSaveAllSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio Title</label>
                <input
                  type="text"
                  value={settings["SiteTitle"] || "Krishna Prasad Bhandari | Full-Stack Software Engineer"}
                  onChange={(e) => handleSettingChange("SiteTitle", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Copyright Footer Text</label>
                <input
                  type="text"
                  value={settings["CopyrightText"] || "© 2026 Krishna Prasad Bhandari. All rights reserved."}
                  onChange={(e) => handleSettingChange("CopyrightText", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Contact Email</label>
                <input
                  type="email"
                  value={settings["ContactEmail"] || "krrishbhandari01@gmail.com"}
                  onChange={(e) => handleSettingChange("ContactEmail", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Email (Inquiries)</label>
                <input
                  type="email"
                  value={settings["DomainEmail"] || "info@krishnabhandari01.com.np"}
                  onChange={(e) => handleSettingChange("DomainEmail", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone</label>
                <input
                  type="text"
                  value={settings["PhoneWhatsApp"] || "+977 9825406086"}
                  onChange={(e) => handleSettingChange("PhoneWhatsApp", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canonical Base URL</label>
                <input
                  type="url"
                  value={settings["CanonicalUrl"] || "https://krishnabhandari01.com.np"}
                  onChange={(e) => handleSettingChange("CanonicalUrl", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={
                  settings["MetaDescription"] ||
                  "Krishna Prasad Bhandari - Full-Stack Software Engineer specializing in Next.js, React, Node.js, and ASP.NET Core cloud architectures."
                }
                onChange={(e) => handleSettingChange("MetaDescription", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                <HiOutlineCheck className="text-base" />
                {isSavingSettings ? "Saving Settings..." : "Save Website Settings"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Admin Account Profile (Username & Email) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineUserCircle className="text-blue-600 text-lg" /> Admin Account Identity
            </h2>
            <p className="text-[11px] text-slate-400">Change your login username and email directly in the database.</p>
          </div>
          <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            Database Sync
          </span>
        </div>

        <form onSubmit={handleUpdateAccount} className="space-y-4 max-w-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. krishna"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingAccount}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              <HiOutlineCheck className="text-base" />
              {isUpdatingAccount ? "Saving Username..." : "Save Account Identity"}
            </button>
          </div>
        </form>
      </div>

      {/* Admin Security / Password Change */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineShieldCheck className="text-blue-600" /> Admin Security & Credentials
            </h2>
            <p className="text-[11px] text-slate-400">Update your administrative dashboard password.</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            BCrypt Salted Hash
          </span>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              <HiOutlineKey className="text-base" />
              {isChangingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Infrastructure Telemetry */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4">System Telemetry & Architecture</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Backend</span>
            <span className="font-semibold text-slate-800">ASP.NET Core 8 Web API</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Database</span>
            <span className="font-semibold text-slate-800">Supabase PostgreSQL 15</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">ORM</span>
            <span className="font-semibold text-slate-800">EF Core 8 (Npgsql)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Frontend</span>
            <span className="font-semibold text-slate-800">Next.js 16 (React 19)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

