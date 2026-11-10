"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineEnvelope,
  HiOutlineEnvelopeOpen,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowUturnLeft,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import { api } from "@/lib/api";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  clientIp?: string;
  status: "Unread" | "Read" | "Replied" | string;
  createdAtUtc: string;
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail Modal
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<MessageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = () => {
    setIsLoading(true);
    api
      .authFetch<MessageItem[]>("/api/admin/contact/messages")
      .then((data) => {
        setMessages(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load messages: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessageDetail = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    // If unread, mark as read on server
    if (msg.status === "Unread") {
      try {
        await api.authFetch(`/api/admin/contact/messages/${msg.id}`);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "Read" } : m))
        );
      } catch {
        // ignore
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.authFetch(`/api/admin/contact/messages/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      toast.success(`Message marked as ${newStatus}.`);
    } catch (err: any) {
      toast.error("Failed to update message status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/contact/messages/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Message deleted.");
      if (selectedMessage?.id === deleteTarget.id) {
        setSelectedMessage(null);
      }
      setDeleteTarget(null);
      fetchMessages();
    } catch (err: any) {
      toast.error("Failed to delete message: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : m.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineEnvelope className="text-blue-600" /> Inquiries & Contact Messages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Incoming communication from clients, recruiters, and collaborators submitted via the Contact form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
            {unreadCount} Unread
          </span>
          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
            {messages.length} Total
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-96">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by sender, email, subject, or message text..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Messages ({messages.length})</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read ({messages.filter((m) => m.status === "Read").length})</option>
            <option value="replied">Replied ({messages.filter((m) => m.status === "Replied").length})</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineEnvelope className="mx-auto text-4xl text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No contact messages found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              When visitors submit the contact form, inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Snippet</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredMessages.map((m) => {
                  const isUnread = m.status === "Unread";
                  return (
                    <tr
                      key={m.id}
                      onClick={() => openMessageDetail(m)}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                        isUnread ? "bg-blue-50/40 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            m.status === "Unread"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : m.status === "Replied"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              m.status === "Unread"
                                ? "bg-red-500"
                                : m.status === "Replied"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{m.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-900 max-w-xs truncate">{m.subject}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-normal max-w-sm truncate">{m.message}</td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap font-normal">
                        {new Date(m.createdAtUtc).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDeleteTarget(m)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <HiOutlineTrash className="text-base" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    selectedMessage.status === "Unread"
                      ? "bg-red-100 text-red-700"
                      : selectedMessage.status === "Replied"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Status: {selectedMessage.status}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{selectedMessage.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">From:</span>
                  <strong className="text-slate-800">{selectedMessage.name}</strong>
                  <div className="text-blue-600 font-mono text-[11px] mt-0.5">{selectedMessage.email}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Received:</span>
                  <span className="text-slate-700 font-medium">
                    {new Date(selectedMessage.createdAtUtc).toLocaleString()}
                  </span>
                  {selectedMessage.clientIp && (
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                      IP: {selectedMessage.clientIp}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] font-semibold block mb-1">Message Body:</span>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Change Status:</span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "Unread")}
                  className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Unread
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "Read")}
                  className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Read
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "Replied")}
                  className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer"
                >
                  Replied
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "Replied")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <HiOutlineArrowUturnLeft className="text-base" /> Reply via Email
                </a>
              </div>
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
            <h3 className="text-sm font-bold text-slate-900">Delete Message?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to permanently delete inquiry from{" "}
              <strong className="text-slate-800">{deleteTarget.name}</strong>?
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

