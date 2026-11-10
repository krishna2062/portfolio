"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiOutlineFolder,
  HiOutlineBriefcase,
  HiOutlineCodeBracket,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiArrowRight,
  HiCheckCircle,
  HiClock,
} from "react-icons/hi2";
import { api } from "@/lib/api";

interface DashboardData {
  totalProjects: number;
  publishedProjects: number;
  totalServices: number;
  totalSkills: number;
  totalEducation: number;
  totalBlogs: number;
  publishedBlogs: number;
  unreadMessages: number;
  totalMessages: number;
  recentMessages: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAtUtc: string;
  }[];
  recentLogs: {
    id: string;
    username: string;
    action: string;
    entityName: string;
    details: string;
    timestampUtc: string;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .authFetch<DashboardData>("/api/admin/dashboard/summary")
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-md w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Projects",
      value: data?.totalProjects || 0,
      subtext: `${data?.publishedProjects || 0} published`,
      icon: HiOutlineFolder,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      href: "/admin/projects",
    },
    {
      title: "Services",
      value: data?.totalServices || 0,
      subtext: "active offerings",
      icon: HiOutlineBriefcase,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      href: "/admin/services",
    },
    {
      title: "Skills Mastered",
      value: data?.totalSkills || 0,
      subtext: "across 6 domains",
      icon: HiOutlineCodeBracket,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      href: "/admin/skills",
    },
    {
      title: "Contact Messages",
      value: data?.totalMessages || 0,
      subtext: `${data?.unreadMessages || 0} unread`,
      icon: HiOutlineEnvelope,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time management for Krishna Bhandari&apos;s live database portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>+ Add Project</span>
          </Link>
          <Link
            href="/admin/profile"
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Metrics Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.title}</span>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg ${s.color}`}>
                <s.icon />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-between">
                <span>{s.subtext}</span>
                <HiArrowRight className="text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all text-sm" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Grid: Recent Messages & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Messages */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HiOutlineEnvelope className="text-lg text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900">Recent Inquiries</h2>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {!data?.recentMessages || data.recentMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No contact submissions received yet.
                </div>
              ) : (
                data.recentMessages.map((msg) => (
                  <div key={msg.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">{msg.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            msg.status === "Unread"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{msg.subject}</p>
                      <p className="text-[11px] text-slate-400 truncate">{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(msg.createdAtUtc).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Audit Trail */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <HiClock className="text-lg text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900">Activity Log</h2>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {!data?.recentLogs || data.recentLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">No recent activity logged.</div>
            ) : (
              data.recentLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="py-2.5 flex items-start gap-2.5 text-xs">
                  <HiCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800">
                      {log.action} <span className="text-slate-400 font-normal">on {log.entityName}</span>
                    </div>
                    {log.details && <p className="text-[11px] text-slate-500 truncate">{log.details}</p>}
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestampUtc).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • by {log.username}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

