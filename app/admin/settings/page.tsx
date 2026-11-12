"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCog6Tooth,
  HiOutlineKey,
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiOutlineUserCircle,
  HiOutlineGlobeAlt,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineShare,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { api, resolveImageUrl } from "@/lib/api";
import AdminImagePicker from "@/components/AdminImagePicker";

interface WebsiteSetting {
  key: string;
  value: string;
  updatedAtUtc?: string;
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingSeo, setIsSavingSeo] = useState(false);

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
      const res = await api.authFetch<{
        message: string;
        token: string;
        user: { id: string; username: string; email: string; role: string };
      }>("/api/auth/update-account", {
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

  const saveSettingsSubset = async (keys: string[], setLoading: (val: boolean) => void, successMsg: string) => {
    setLoading(true);
    try {
      const promises = keys.map((k) =>
        api.authFetch(`/api/admin/settings/${encodeURIComponent(k)}`, {
          method: "PUT",
          body: JSON.stringify({ value: settings[k] ?? "" }),
        })
      );
      await Promise.all(promises);
      toast.success(successMsg);
      fetchSettings();
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const generalKeys = [
      "LogoUrl",
      "SiteTitle",
      "CopyrightText",
      "ContactEmail",
      "DomainEmail",
      "PhoneWhatsApp",
      "ThemeColor",
      "GoogleAnalyticsId",
    ];
    await saveSettingsSubset(generalKeys, setIsSavingSettings, "Website configuration saved successfully!");
  };

  const handleSaveSeoSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const seoKeys = [
      "MetaTitle",
      "MetaDescription",
      "MetaKeywords",
      "CanonicalUrl",
      "OgImageUrl",
      "TwitterHandle",
      "GoogleSiteVerification",
      "BingSiteVerification",
      "RobotsDirective",
    ];
    await saveSettingsSubset(seoKeys, setIsSavingSeo, "SEO & Search Engine ranking settings saved successfully!");
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

  // SEO Preview computations
  const currentTitle =
    settings["MetaTitle"] ||
    settings["SiteTitle"] ||
    "Krishna Prasad Bhandari | Full-Stack Software Engineer & System Architect";
  const currentDesc =
    settings["MetaDescription"] ||
    settings["SiteDescription"] ||
    "Official portfolio of Krishna Prasad Bhandari - Full-Stack Software Engineer specializing in Next.js, React, Node.js, and ASP.NET Core cloud architectures based in Nepal.";
  const currentUrl = (settings["CanonicalUrl"] || "https://krishnabhandari01.com.np").replace(/\/$/, "");
  const currentOgImage = resolveImageUrl(settings["OgImageUrl"] || settings["LogoUrl"] || "/assets/logo.png");
  const currentKeywords = (
    settings["MetaKeywords"] ||
    "Krishna Prasad Bhandari, Full Stack Developer Nepal, React Developer, Next.js Developer, ASP.NET Core"
  )
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const titleLength = currentTitle.length;
  const descLength = currentDesc.length;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HiOutlineCog6Tooth className="text-blue-600" /> Platform & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure site-wide preferences, search engine ranking (SEO), contact routing, and administrative security credentials.
        </p>
      </div>

      {/* SEO & SEARCH ENGINE RANKING OPTIMIZATION CENTER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-blue-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

        <div className="pb-4 mb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineGlobeAlt className="text-blue-600 text-lg" />
              SEO & Search Engine Ranking Optimization Center
            </h2>
            <p className="text-[11px] text-slate-400">
              Optimize how Google, Bing, and Social Media networks discover, index, and rank your portfolio.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <HiOutlineSparkles /> Top-Rank Ready
            </span>
          </div>
        </div>

        {/* Live Google SERP Snippet Preview Card */}
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5 text-blue-700">
              <HiOutlineMagnifyingGlass className="text-sm" /> Google Search Live Snippet Preview
            </span>
            <span className="text-[10px] text-slate-400">Previewing how your site appears in Google Search</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs max-w-2xl font-sans">
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
              <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={resolveImageUrl(settings["LogoUrl"] || "/assets/logo.png")}
                  alt="Favicon"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-medium text-slate-800 text-[11px]">Krishna Prasad Bhandari</span>
              <span className="text-slate-400 text-[10px]">›</span>
              <span className="text-slate-500 text-[10px] truncate">{currentUrl}</span>
            </div>

            <h3 className="text-blue-700 text-base font-medium hover:underline cursor-pointer leading-tight mb-1">
              {currentTitle}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {currentDesc}
            </p>
          </div>

          {/* Character Counters / Health Indicators */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Title length:</span>
              <span
                className={`font-mono font-semibold px-1.5 py-0.5 rounded ${
                  titleLength >= 50 && titleLength <= 65
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : titleLength < 50
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {titleLength} / 60 chars
              </span>
              <span className="text-[10px] text-slate-400">(Ideal: 50-60)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Description length:</span>
              <span
                className={`font-mono font-semibold px-1.5 py-0.5 rounded ${
                  descLength >= 140 && descLength <= 165
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : descLength < 140
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {descLength} / 160 chars
              </span>
              <span className="text-[10px] text-slate-400">(Ideal: 140-160)</span>
            </div>
          </div>
        </div>

        {/* SEO Management Form */}
        <form onSubmit={handleSaveSeoSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Meta Title (Google Headline)</label>
                <span className="text-[10px] text-slate-400 font-mono">{titleLength} chars</span>
              </div>
              <input
                type="text"
                value={
                  settings["MetaTitle"] ||
                  "Krishna Prasad Bhandari | Full-Stack Software Engineer & System Architect"
                }
                onChange={(e) => handleSettingChange("MetaTitle", e.target.value)}
                placeholder="Krishna Prasad Bhandari | Full-Stack Software Engineer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Appears as the clickable headline in Google search results.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Canonical Base URL</label>
              <input
                type="url"
                value={settings["CanonicalUrl"] || "https://krishnabhandari01.com.np"}
                onChange={(e) => handleSettingChange("CanonicalUrl", e.target.value)}
                placeholder="https://krishnabhandari01.com.np"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Prevents duplicate content penalties by declaring your official domain.</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Meta Description (SERP Snippet)</label>
              <span className="text-[10px] text-slate-400 font-mono">{descLength} chars</span>
            </div>
            <textarea
              rows={2}
              value={
                settings["MetaDescription"] ||
                "Official portfolio of Krishna Prasad Bhandari - Full-Stack Software Engineer specializing in Next.js, React, Node.js, and ASP.NET Core cloud architectures based in Nepal."
              }
              onChange={(e) => handleSettingChange("MetaDescription", e.target.value)}
              placeholder="Concise summary including your core skills, title, and location..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Displays beneath the headline in search results. Recommend 140–160 characters.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Ranking Keywords</label>
            <textarea
              rows={2}
              value={
                settings["MetaKeywords"] ||
                "Krishna Prasad Bhandari, Krishna Bhandari, Full Stack Developer Nepal, React Developer, Next.js Developer, ASP.NET Core Engineer, Software Engineer Butwal Kathmandu Nepal, Portfolio, Web Developer Nepal"
              }
              onChange={(e) => handleSettingChange("MetaKeywords", e.target.value)}
              placeholder="e.g. Krishna Prasad Bhandari, Full Stack Developer Nepal, React, Next.js"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Separate keywords with commas. Search engines use these to index your skills.</p>
            {currentKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentKeywords.slice(0, 10).map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    #{kw}
                  </span>
                ))}
                {currentKeywords.length > 10 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{currentKeywords.length - 10} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Social Share & OpenGraph Image */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <HiOutlineShare className="text-blue-600" /> OpenGraph & Social Media Share Image
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  The preview banner shown when your portfolio link is shared on Facebook, WhatsApp, LinkedIn, or Twitter/X.
                </p>
              </div>
              <div className="w-24 h-14 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0 shadow-xs flex items-center justify-center">
                <img
                  src={currentOgImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <AdminImagePicker
              label="Social Banner Image (Upload or Paste URL)"
              value={settings["OgImageUrl"] || "/assets/logo.png"}
              onChange={(val) => handleSettingChange("OgImageUrl", val)}
              recommendedSize="Recommended: 1200x630 pixels (PNG, JPG, or WebP)"
            />
          </div>

          {/* Search Console & Webmaster Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Search Console Verification Code
              </label>
              <input
                type="text"
                value={settings["GoogleSiteVerification"] || ""}
                onChange={(e) => handleSettingChange("GoogleSiteVerification", e.target.value)}
                placeholder="e.g. google-site-verification=abc123xyz"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                From Google Search Console &gt; HTML Tag verification. Paste the token or full tag.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bing Webmaster Verification Code
              </label>
              <input
                type="text"
                value={settings["BingSiteVerification"] || ""}
                onChange={(e) => handleSettingChange("BingSiteVerification", e.target.value)}
                placeholder="e.g. 1234567890ABCDEF"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">For Bing & Yahoo search engine verification (msvalidate.01).</p>
            </div>
          </div>

          {/* Twitter Handle & Robots Directive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Twitter / X Creator Handle</label>
              <input
                type="text"
                value={settings["TwitterHandle"] || "@krishnabhandari"}
                onChange={(e) => handleSettingChange("TwitterHandle", e.target.value)}
                placeholder="@krishnabhandari"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Used for Twitter Card attribution metadata.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Search Engine Indexing Directive</label>
              <select
                value={settings["RobotsDirective"] || "index, follow"}
                onChange={(e) => handleSettingChange("RobotsDirective", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="index, follow">index, follow (Recommended - Allow all search engines)</option>
                <option value="noindex, nofollow">noindex, nofollow (Block search engines - Private / Under Maintenance)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Instructs search crawlers how to index this site.</p>
            </div>
          </div>

          {/* Dynamic Technical SEO Files Links */}
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-900">
              <HiOutlineDocumentText className="text-base text-blue-600 shrink-0" />
              <span>
                <strong>Technical SEO Live Files:</strong> Sitemap and Robots are dynamically generated from Supabase database.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`${currentUrl}/sitemap.xml`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 border border-blue-200 rounded-lg text-[11px] font-medium hover:bg-blue-50"
              >
                View sitemap.xml <HiOutlineArrowTopRightOnSquare />
              </a>
              <a
                href={`${currentUrl}/robots.txt`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 border border-blue-200 rounded-lg text-[11px] font-medium hover:bg-blue-50"
              >
                View robots.txt <HiOutlineArrowTopRightOnSquare />
              </a>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingSeo}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition"
            >
              <HiOutlineCheck className="text-base" />
              {isSavingSeo ? "Saving SEO Settings..." : "Save SEO & Ranking Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* Website Configuration Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Website Configuration</h2>
            <p className="text-[11px] text-slate-400">Global site metadata, contact info, and branding.</p>
          </div>
          <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            PostgreSQL • Supabase Live
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading settings...</div>
        ) : (
          <form onSubmit={handleSaveAllSettings} className="space-y-4">
            {/* Website Logo Picker */}
            <div className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Website Header Logo</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload an image file from your device (PNG, SVG, JPG) or enter an external image URL to display on the public header.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <span className="text-[10px] font-semibold text-slate-400">Header Preview:</span>
                  <div className="w-7 h-7 flex items-center justify-center">
                    <img
                      src={resolveImageUrl(settings["LogoUrl"] || "/assets/logo.png")}
                      alt="Logo Preview"
                      className="max-w-full max-h-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {settings["BrandTitle"] || "Krishna"}<span className="text-[#f13024]">.</span>
                  </span>
                </div>
              </div>

              <AdminImagePicker
                label="Header Logo (Upload or Paste URL)"
                value={settings["LogoUrl"] || "/assets/logo.png"}
                onChange={(val) => handleSettingChange("LogoUrl", val)}
                recommendedSize="Transparent PNG or SVG, Square (e.g. 200x200px or 512x512px)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio Brand Title</label>
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
                  value={settings["ContactEmail"] || "krrishbhandari2062@gmail.com"}
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
                  value={settings["PhoneWhatsApp"] || "+977 9867165211"}
                  onChange={(e) => handleSettingChange("PhoneWhatsApp", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Google Analytics ID (GA4)</label>
                <input
                  type="text"
                  value={settings["GoogleAnalyticsId"] || "G-RE7ER17RWK"}
                  onChange={(e) => handleSettingChange("GoogleAnalyticsId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings["ThemeColor"] || "#f13024"}
                  onChange={(e) => handleSettingChange("ThemeColor", e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={settings["ThemeColor"] || "#f13024"}
                  onChange={(e) => handleSettingChange("ThemeColor", e.target.value)}
                  className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
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
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Search Engine</span>
            <span className="font-semibold text-slate-800">Dynamic XML & JSON-LD</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Database</span>
            <span className="font-semibold text-slate-800">Supabase PostgreSQL 15</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">ORM / Query</span>
            <span className="font-semibold text-slate-800">Direct Pool (pg)</span>
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
