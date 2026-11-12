import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = "https://krishnabhandari01.com.np";

  try {
    const settings = await query<{ Key: string; Value: string }>(
      'SELECT "Key", "Value" FROM "WebsiteSettings" WHERE "Key" = \'CanonicalUrl\' LIMIT 1'
    );
    if (settings.length > 0 && settings[0].Value?.trim()) {
      baseUrl = settings[0].Value.trim().replace(/\/$/, "");
    }
  } catch (err) {
    console.error("Failed to load CanonicalUrl from settings for sitemap:", err);
  }

  const currentDate = new Date();

  // Core static pages with SEO priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  try {
    // Dynamic published projects
    const projects = await query<{
      Slug: string | null;
      Title: string | null;
      UpdatedAtUtc: string | null;
      CreatedAtUtc: string | null;
    }>('SELECT "Slug", "Title", "UpdatedAtUtc", "CreatedAtUtc" FROM "Projects" WHERE "IsPublished" = true');

    const projectRoutes: MetadataRoute.Sitemap = projects
      .filter((p) => p.Slug)
      .map((p) => ({
        url: `${baseUrl}/work#${encodeURIComponent(p.Slug!)}`,
        lastModified: p.UpdatedAtUtc
          ? new Date(p.UpdatedAtUtc)
          : p.CreatedAtUtc
          ? new Date(p.CreatedAtUtc)
          : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    // Dynamic published blogs
    const blogs = await query<{
      Slug: string | null;
      UpdatedAtUtc: string | null;
      PublishedAtUtc: string | null;
    }>('SELECT "Slug", "UpdatedAtUtc", "PublishedAtUtc" FROM "BlogPosts" WHERE "IsPublished" = true');

    const blogRoutes: MetadataRoute.Sitemap = blogs
      .filter((b) => b.Slug)
      .map((b) => ({
        url: `${baseUrl}/blogs/${encodeURIComponent(b.Slug!)}`,
        lastModified: b.UpdatedAtUtc
          ? new Date(b.UpdatedAtUtc)
          : b.PublishedAtUtc
          ? new Date(b.PublishedAtUtc)
          : currentDate,
        changeFrequency: "weekly",
        priority: 0.75,
      }));

    return [...staticRoutes, ...projectRoutes, ...blogRoutes];
  } catch (err) {
    console.error("Error generating dynamic routes for sitemap:", err);
    return staticRoutes;
  }
}
