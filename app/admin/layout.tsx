"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineInformationCircle,
  HiOutlineFolder,
  HiOutlineBriefcase,
  HiOutlineCodeBracket,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlinePhoto,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUsers,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { api } from "@/lib/api";

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: HiOutlineHome },
  { name: "Profile", href: "/admin/profile", icon: HiOutlineUser },
  { name: "About", href: "/admin/about", icon: HiOutlineInformationCircle },
  { name: "Projects", href: "/admin/projects", icon: HiOutlineFolder },
  { name: "Services", href: "/admin/services", icon: HiOutlineBriefcase },
  { name: "Skills", href: "/admin/skills", icon: HiOutlineCodeBracket },
  { name: "Education", href: "/admin/education", icon: HiOutlineAcademicCap },
  { name: "Blogs", href: "/admin/blogs", icon: HiOutlineDocumentText },
  { name: "Messages", href: "/admin/messages", icon: HiOutlineEnvelope },
  { name: "Media Library", href: "/admin/media", icon: HiOutlinePhoto },
  { name: "Admin Users", href: "/admin/users", icon: HiOutlineUsers },
  { name: "Settings", href: "/admin/settings", icon: HiOutlineCog6Tooth },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (pathname === "/admin/login") return;

    const token = api.getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const stored = localStorage.getItem("krishna_admin_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }

    // Fetch unread count for badge
    api
      .authFetch<{ unreadMessages: number }>("/api/admin/dashboard/summary")
      .then((data) => setUnreadCount(data.unreadMessages || 0))
      .catch(() => {});
  }, [pathname, router]);

  // If on login route, render standalone login view
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    api.removeToken();
    localStorage.removeItem("krishna_admin_user");
    router.push("/admin/login");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row antialiased font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-slate-900 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            KB
          </div>
          <span className="font-bold text-sm tracking-tight">Admin CMS</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <HiOutlineXMark className="text-2xl" /> : <HiOutlineBars3 className="text-2xl" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-sm md:shadow-none ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Logo & Name */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                KB
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">Krishna Bhandari</h2>
                <span className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider">CMS Console</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <HiOutlineXMark className="text-xl" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const isMessages = item.href === "/admin/messages";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-xs border border-blue-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`text-lg ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isMessages && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Actions */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <span className="flex items-center gap-2">
              <HiArrowTopRightOnSquare className="text-sm" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">↗</span>
          </a>

          <div className="flex items-center justify-between px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.username?.charAt(0).toUpperCase() || "K"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.username || "krishna"}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.role || "Owner"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="text-lg" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

