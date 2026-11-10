const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface PublicProfile {
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
  badges: { id: number; badgeKey: string; contentJson: string; displayOrder: number }[];
}

export interface PublicAbout {
  headline: string;
  headlineAccent: string;
  description: string;
  imageUrl: string;
  yearsOfExperience: number;
  completedProjects: number;
  techMasteredCount: number;
  tabs: { id: number; tabKey: string; title: string; subtitle: string; description: string; displayOrder: number }[];
}

export interface PublicSkillCategory {
  id: number;
  category: string;
  skillsJoined: string;
  skillsList: string[];
}

export interface PublicEducation {
  id: number;
  degree: string;
  institution: string;
  status: string;
  displayOrder: number;
}

export interface PublicService {
  id: number;
  title: string;
  description: string;
  iconKey: string;
  displayOrder: number;
}

export interface PublicProject {
  id: number;
  title: string;
  slug: string;
  path: string;
  link: string;
  githubUrl?: string;
  description: string;
  tech: string[];
  displayOrder: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.warn(`API ${url} returned ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`Failed to fetch ${url} from ${API_BASE_URL}:`, err);
    return null;
  }
}

// Public API Getters
export function resolveImageUrl(path?: string | null): string {
  if (!path) return "/thumb1.jpg";
  let trimmed = path.trim();

  // Smart extraction: If a user pastes a Google Image search result URL (google.com/imgres?imgurl=...)
  if (trimmed.includes("google.") && trimmed.includes("/imgres") && trimmed.includes("imgurl=")) {
    try {
      const match = trimmed.match(/[?&]imgurl=([^&]+)/);
      if (match && match[1]) {
        trimmed = decodeURIComponent(match[1]);
      }
    } catch {
      // ignore
    }
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const clean = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return API_BASE_URL ? `${API_BASE_URL}${clean}` : clean;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/${trimmed}`;
}

export const api = {
  baseUrl: API_BASE_URL,
  resolveImageUrl,

  async uploadMedia(file: File, altText?: string): Promise<{ relativeUrl: string; fullUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) formData.append("altText", altText);

    const asset = await this.authFetch<{ relativeUrl: string; originalFileName: string }>("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });

    const fullUrl = resolveImageUrl(asset.relativeUrl);
    return { relativeUrl: asset.relativeUrl, fullUrl };
  },

  async getProfile(): Promise<PublicProfile | null> {
    return fetchJson<PublicProfile>("/api/public/profile");
  },

  async getAbout(): Promise<PublicAbout | null> {
    return fetchJson<PublicAbout>("/api/public/about");
  },

  async getSkills(): Promise<PublicSkillCategory[] | null> {
    return fetchJson<PublicSkillCategory[]>("/api/public/skills");
  },

  async getEducation(): Promise<PublicEducation[] | null> {
    return fetchJson<PublicEducation[]>("/api/public/education");
  },

  async getServices(): Promise<PublicService[] | null> {
    return fetchJson<PublicService[]>("/api/public/services");
  },

  async getProjects(): Promise<PublicProject[] | null> {
    return fetchJson<PublicProject[]>("/api/public/projects");
  },

  async getProjectBySlug(slug: string): Promise<PublicProject | null> {
    return fetchJson<PublicProject>(`/api/public/projects/${encodeURIComponent(slug)}`);
  },

  async submitContact(payload: ContactPayload) {
    const res = await fetch(`${API_BASE_URL}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Auth Helpers
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("krishna_admin_token");
  },

  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("krishna_admin_token", token);
    }
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("krishna_admin_token");
    }
  },

  async authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
            "x-access-token": token,
            "x-authorization": `Bearer ${token}`,
          }
        : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401 && typeof window !== "undefined") {
      this.removeToken();
      window.location.href = "/admin/login";
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return res.json();
  },
};
