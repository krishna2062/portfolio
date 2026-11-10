"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineAcademicCap,
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import { api } from "@/lib/api";

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  status: string;
  displayOrder: number;
  isPublished: boolean;
}

export default function EducationAdmin() {
  const [records, setRecords] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EducationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<EducationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [status, setStatus] = useState("Completed");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isPublished, setIsPublished] = useState(true);

  const fetchEducation = () => {
    setIsLoading(true);
    api
      .authFetch<EducationItem[]>("/api/admin/education")
      .then((data) => {
        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          setRecords([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load education records: " + err.message);
        setRecords([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreateModal = () => {
    setEditingRecord(null);
    setDegree("");
    setInstitution("");
    setStatus("Completed");
    setDisplayOrder((records?.length || 0) + 1);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EducationItem) => {
    setEditingRecord(item);
    setDegree(item.degree || "");
    setInstitution(item.institution || "");
    setStatus(item.status || "Completed");
    setDisplayOrder(item.displayOrder || 1);
    setIsPublished(item.isPublished !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim()) {
      toast.error("Degree and Institution are required.");
      return;
    }

    setIsSaving(true);
    const payload = {
      degree: degree.trim(),
      institution: institution.trim(),
      status: status.trim(),
      displayOrder,
      isPublished,
    };

    try {
      if (editingRecord) {
        await api.authFetch(`/api/admin/education/${editingRecord.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Education record updated successfully!");
      } else {
        await api.authFetch("/api/admin/education", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Education record added successfully!");
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      toast.error(err.message || "Failed to save education record.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/education/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Education record deleted.");
      setDeleteTarget(null);
      fetchEducation();
    } catch (err: any) {
      toast.error("Failed to delete record: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineAcademicCap className="text-blue-600" /> Education & Qualifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage academic milestones and degrees displayed on the Education page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <HiPlus className="text-base" /> Add Qualification
        </button>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading education...</div>
        ) : !records || records.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineAcademicCap className="mx-auto text-4xl text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No education records found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Add Qualification&quot; to list your degrees.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 w-16">Order</th>
                  <th className="py-3 px-4">Degree / Qualification</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {(records || []).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">#{r.displayOrder}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{r.degree}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.institution}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          r.isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${r.isPublished ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {r.isPublished ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <HiOutlineTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingRecord ? "Edit Qualification" : "Add Qualification"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree / Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Computer Application (BCA)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution / University <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Tribhuvan University, Nepal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Enrolled">Enrolled / Ongoing</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Certification">Certified</option>
                  </select>
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
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Published on Education Page</span>
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
                  {isSaving ? "Saving..." : editingRecord ? "Update Record" : "Save Record"}
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
            <h3 className="text-sm font-bold text-slate-900">Delete Record?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to remove <strong className="text-slate-800">&quot;{deleteTarget.degree}&quot;</strong>?
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

