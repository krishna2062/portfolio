"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCodeBracket,
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import { api } from "@/lib/api";

interface SkillItem {
  id: number;
  name: string;
  displayOrder: number;
}

interface SkillCategory {
  id: number;
  category: string;
  displayOrder: number;
  isActive: boolean;
  items: SkillItem[];
}

export default function SkillsAdmin() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<SkillCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [categoryName, setCategoryName] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [skillNames, setSkillNames] = useState<string[]>([]);

  const fetchSkills = () => {
    setIsLoading(true);
    api
      .authFetch<SkillCategory[]>("/api/admin/skills")
      .then((data) => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load skills: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setSkillNames([]);
    setSkillInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: SkillCategory) => {
    setEditingCategory(cat);
    setCategoryName(cat.category);
    setDisplayOrder(cat.displayOrder);
    setIsActive(cat.isActive);
    setSkillNames(cat.items.map((i) => i.name));
    setSkillInput("");
    setIsModalOpen(true);
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const split = skillInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const updated = Array.from(new Set([...skillNames, ...split]));
    setSkillNames(updated);
    setSkillInput("");
  };

  const handleRemoveSkill = (name: string) => {
    setSkillNames(skillNames.filter((s) => s !== name));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (skillNames.length === 0) {
      toast.error("Please add at least one skill or technology.");
      return;
    }

    setIsSaving(true);
    const payload = {
      category: categoryName.trim(),
      displayOrder,
      isActive,
      skillNames,
    };

    try {
      if (editingCategory) {
        await api.authFetch(`/api/admin/skills/${editingCategory.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Skill category updated successfully!");
      } else {
        await api.authFetch("/api/admin/skills", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Skill category created successfully!");
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message || "Failed to save skill category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/skills/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Skill category deleted successfully.");
      setDeleteTarget(null);
      fetchSkills();
    } catch (err: any) {
      toast.error("Failed to delete category: " + err.message);
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
            <HiOutlineCodeBracket className="text-blue-600" /> Skills & Tech Stack
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize core capabilities into domain categories and technology badges.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <HiPlus className="text-base" /> New Category
        </button>
      </div>

      {/* Categories Cards */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs font-medium">
          Loading skills...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <HiOutlineCodeBracket className="mx-auto text-4xl text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-600">No skill categories found</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;New Category&quot; to build your technology stack.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-mono font-bold flex items-center justify-center border border-blue-100">
                      #{cat.displayOrder}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{cat.category}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <HiOutlinePencilSquare className="text-base" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <HiOutlineTrash className="text-base" />
                    </button>
                  </div>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span
                      key={item.id}
                      className="bg-slate-50 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
                <span>{cat.items.length} technologies</span>
                <span className={cat.isActive ? "text-emerald-600 font-semibold" : "text-slate-400 font-semibold"}>
                  {cat.isActive ? "Active" : "Disabled"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingCategory ? `Edit Category: ${editingCategory.category}` : "Add Skill Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Front-End, Cloud & DevOps"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technologies / Skills <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type name (comma separated allowed) & press Enter"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {skillNames.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No technologies added yet.</span>
                  ) : (
                    skillNames.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 bg-white text-slate-800 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(name)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <HiXMark className="text-sm" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Active (Visible on Skills Page)</span>
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
                  {isSaving ? "Saving..." : editingCategory ? "Update Category" : "Save Category"}
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
            <h3 className="text-sm font-bold text-slate-900">Delete Category?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to delete <strong className="text-slate-800">&quot;{deleteTarget.category}&quot;</strong> and its {deleteTarget.items.length} skills?
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

