"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  HiOutlineFolder,
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import { api, resolveImageUrl } from "@/lib/api";
import AdminImagePicker from "@/components/AdminImagePicker";

interface ProjectTechnology {
  id?: number;
  name: string;
}

interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  path: string;
  link: string;
  githubUrl?: string;
  description: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  technologies: ProjectTechnology[];
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPublished, setFilterPublished] = useState<string>("all");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [path, setPath] = useState("");
  const [link, setLink] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const fetchProjects = () => {
    setIsLoading(true);
    api
      .authFetch<ProjectItem[]>("/api/admin/projects")
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load projects: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setPath("/thumb1.jpg");
    setLink("");
    setGithubUrl("");
    setDescription("");
    setDisplayOrder(projects.length + 1);
    setIsFeatured(false);
    setIsPublished(true);
    setTechnologies(["React", "Next.js", "Tailwind CSS"]);
    setTechInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setPath(p.path);
    setLink(p.link || "");
    setGithubUrl(p.githubUrl || "");
    setDescription(p.description || "");
    setDisplayOrder(p.displayOrder);
    setIsFeatured(p.isFeatured);
    setIsPublished(p.isPublished);
    setTechnologies(p.technologies?.map((t) => t.name) || []);
    setTechInput("");
    setIsModalOpen(true);
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const split = techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const updated = Array.from(new Set([...technologies, ...split]));
    setTechnologies(updated);
    setTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Project title is required.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      path: path.trim() || "/thumb1.jpg",
      link: link.trim() || "https://krishnabhandari01.com.np",
      githubUrl: githubUrl.trim() || undefined,
      description: description.trim() || `${title.trim()} - Project showcase`,
      displayOrder,
      isFeatured,
      isPublished,
      technologies,
    };

    try {
      if (editingProject) {
        await api.authFetch(`/api/admin/projects/${editingProject.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Project updated successfully!");
      } else {
        await api.authFetch("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Project created successfully!");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const res = await api.authFetch<{ id: number; isPublished: boolean }>(`/api/admin/projects/${id}/publish`, {
        method: "PATCH",
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: res.isPublished } : p))
      );
      toast.success(res.isPublished ? "Project published!" : "Project unpublished.");
    } catch (err: any) {
      toast.error("Failed to toggle publish status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/projects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Project deleted successfully.");
      setDeleteTarget(null);
      fetchProjects();
    } catch (err: any) {
      toast.error("Failed to delete project: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies?.some((t) => t.name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        filterPublished === "all"
          ? true
          : filterPublished === "published"
          ? p.isPublished
          : !p.isPublished;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, filterPublished]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineFolder className="text-blue-600" /> Projects Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage showcase projects, technologies, demo links, and publication visibility.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <HiPlus className="text-base" /> New Project
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-96">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or technology..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Status:</label>
          <select
            value={filterPublished}
            onChange={(e) => setFilterPublished(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Projects ({projects.length})</option>
            <option value="published">Published Only ({projects.filter((p) => p.isPublished).length})</option>
            <option value="draft">Draft Only ({projects.filter((p) => !p.isPublished).length})</option>
          </select>
        </div>
      </div>

      {/* Projects Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineFolder className="mx-auto text-4xl text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No projects found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search or add a new project.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Technologies</th>
                  <th className="py-3 px-4">Links</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-500 w-12">
                      #{p.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={resolveImageUrl(p.path)}
                            alt={p.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {p.title}
                            {p.isFeatured && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm mt-0.5">
                            {p.description || "No description provided."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.technologies?.map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Live Demo <HiOutlineArrowTopRightOnSquare className="text-xs" />
                          </a>
                        )}
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800"
                          >
                            GitHub <HiOutlineArrowTopRightOnSquare className="text-xs" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                          p.isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle publish status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isPublished ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {p.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete project"
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

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingProject ? `Edit Project: ${editingProject.title}` : "Create New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingProject) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
                      }
                    }}
                    placeholder="e.g. HealthBridge Telemedicine"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug / URL Key</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. healthbridge-telemedicine"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <AdminImagePicker
                  label="Project Thumbnail Image"
                  value={path}
                  onChange={(newPath) => setPath(newPath)}
                  required
                  recommendedSize="1200x800 px (Upload or Paste URL)"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the application architecture, problem solved, and key achievements..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies & Stack</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="Type tech name (e.g. Next.js, C#, Docker) and press Enter"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-blue-200"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="text-blue-500 hover:text-blue-800"
                      >
                        <HiXMark className="text-sm" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Published (Visible on Portfolio)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Featured Showcase</span>
                </label>
              </div>

              {/* Modal Actions */}
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
                  {isSaving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
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
            <h3 className="text-sm font-bold text-slate-900">Delete Project?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-800">&quot;{deleteTarget.title}&quot;</strong>? This action cannot be undone.
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
