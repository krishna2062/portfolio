"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  HiOutlineDocumentText,
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import { api, resolveImageUrl } from "@/lib/api";
import AdminImagePicker from "@/components/AdminImagePicker";

interface BlogItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl?: string;
  category?: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAtUtc?: string;
  createdAtUtc: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPublished, setFilterPublished] = useState("all");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<BlogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [author, setAuthor] = useState("Krishna Prasad Bhandari");
  const [isPublished, setIsPublished] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const fetchBlogs = () => {
    setIsLoading(true);
    api
      .authFetch<BlogItem[]>("/api/admin/blogs")
      .then((data) => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load blogs: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setThumbnailUrl("");
    setCategory("Engineering");
    setAuthor("Krishna Prasad Bhandari");
    setIsPublished(false);
    setTags(["Architecture", "Web Development"]);
    setTagInput("");
    setSeoTitle("");
    setSeoDescription("");
    setActiveTab("content");
    setIsModalOpen(true);
  };

  const openEditModal = async (b: BlogItem) => {
    try {
      // Fetch full blog details including Content & SEO
      const full = await api.authFetch<BlogItem>(`/api/admin/blogs/${b.id}`);
      setEditingBlog(full);
      setTitle(full.title);
      setSlug(full.slug);
      setSummary(full.summary || "");
      setContent(full.content || "");
      setThumbnailUrl(full.thumbnailUrl || "");
      setCategory(full.category || "Engineering");
      setAuthor(full.author || "Krishna Prasad Bhandari");
      setIsPublished(full.isPublished);
      setTags(full.tags || []);
      setTagInput("");
      setSeoTitle(full.seoTitle || "");
      setSeoDescription(full.seoDescription || "");
      setActiveTab("content");
      setIsModalOpen(true);
    } catch (err: any) {
      toast.error("Failed to load blog details: " + err.message);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const split = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const updated = Array.from(new Set([...tags, ...split]));
    setTags(updated);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      content,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      category: category.trim(),
      tags,
      author: author.trim(),
      isPublished,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    };

    try {
      if (editingBlog) {
        await api.authFetch(`/api/admin/blogs/${editingBlog.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Blog article updated successfully!");
      } else {
        await api.authFetch("/api/admin/blogs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Blog article created successfully!");
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const res = await api.authFetch<{ id: number; isPublished: boolean }>(`/api/admin/blogs/${id}/publish`, {
        method: "PATCH",
      });
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isPublished: res.isPublished } : b))
      );
      toast.success(res.isPublished ? "Article published!" : "Article converted to draft.");
    } catch (err: any) {
      toast.error("Failed to toggle publish status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/blogs/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Article deleted successfully.");
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err: any) {
      toast.error("Failed to delete article: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.summary?.toLowerCase().includes(search.toLowerCase()) ||
        b.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        filterPublished === "all"
          ? true
          : filterPublished === "published"
          ? b.isPublished
          : !b.isPublished;

      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, filterPublished]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineDocumentText className="text-blue-600" /> Blog CMS Articles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and publish technical essays, engineering insights, and tutorials.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <HiPlus className="text-base" /> Write Article
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
            placeholder="Search articles by title, tag, or summary..."
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
            <option value="all">All Articles ({blogs.length})</option>
            <option value="published">Published ({blogs.filter((b) => b.isPublished).length})</option>
            <option value="draft">Drafts ({blogs.filter((b) => !b.isPublished).length})</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading articles...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineDocumentText className="mx-auto text-4xl text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No blog posts found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Write Article&quot; to draft your first article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{b.title}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm mt-0.5">
                        {b.summary || "No summary provided."}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                        {b.category || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {b.tags?.map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(b.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                          b.isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle publish status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${b.isPublished ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {b.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(b.createdAtUtc).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit article"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete article"
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

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingBlog ? `Edit Article: ${editingBlog.title}` : "Write New Article"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 pt-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                  activeTab === "content"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Article Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                  activeTab === "seo"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                SEO & Metadata
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 pt-4">
              {activeTab === "content" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (!editingBlog) {
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
                          }
                        }}
                        placeholder="e.g. Architecting Resilient Full-Stack Systems"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Slug / URL</label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="architecting-resilient-systems"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Architecture"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Author</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Krishna Prasad Bhandari"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <AdminImagePicker
                      label="Blog Thumbnail / Cover Image"
                      value={thumbnailUrl}
                      onChange={(newUrl) => setThumbnailUrl(newUrl)}
                      recommendedSize="1200x630 px (Upload or Paste URL)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Summary / Excerpt</label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Brief overview summarizing the core takeaways of this article..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Article Content (Markdown supported) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={10}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your article in Markdown. Supports # headings, **bold**, `code`, lists, links..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Type tag & press Enter"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-lg border border-slate-200"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <HiXMark className="text-sm" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Custom page title for search engines (defaults to article title)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Description</label>
                    <textarea
                      rows={4}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="150-160 character description optimized for Google search snippets..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Publish Article (Live)</span>
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
                  {isSaving ? "Saving..." : editingBlog ? "Update Article" : "Save Article"}
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
            <h3 className="text-sm font-bold text-slate-900">Delete Article?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to delete <strong className="text-slate-800">&quot;{deleteTarget.title}&quot;</strong>?
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

