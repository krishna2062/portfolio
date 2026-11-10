import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

// Helper for slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = await props.params;
  const parts = params.action || [];
  const moduleName = parts[0];
  const sub = parts[1];
  const third = parts[2];

  try {
    // 1. DASHBOARD STATS / SUMMARY
    if (moduleName === "dashboard" && (sub === "summary" || sub === "stats" || !sub)) {
      const [pCount] = await query<any>('SELECT count(*) as total, count(*) FILTER (WHERE "IsPublished" = true) as pub, count(*) FILTER (WHERE "IsPublished" = false) as draft FROM "Projects"');
      const [sCount] = await query<any>('SELECT count(*) as total FROM "Services"');
      const [skCount] = await query<any>('SELECT count(*) as total FROM "SkillItems"');
      const [eduCount] = await query<any>('SELECT count(*) as total FROM "EducationRecords"');
      const [bCount] = await query<any>('SELECT count(*) as total, count(*) FILTER (WHERE "IsPublished" = true) as pub FROM "BlogPosts"');
      const [mCount] = await query<any>('SELECT count(*) as total, count(*) FILTER (WHERE "Status" = \'Unread\') as unread FROM "ContactMessages"');

      const recentMessages = await query<any>('SELECT * FROM "ContactMessages" ORDER BY "CreatedAtUtc" DESC LIMIT 5');
      const recentAudits = await query<any>('SELECT * FROM "AuditLogs" ORDER BY "TimestampUtc" DESC LIMIT 8');

      const formattedLogs = recentAudits.map((a) => ({
        id: String(a.Id),
        username: a.Username || "admin",
        action: a.Action || "Updated",
        entityName: a.EntityName || "System",
        details: a.Details || "",
        timestampUtc: a.TimestampUtc,
      }));

      return NextResponse.json({
        totalProjects: parseInt(pCount?.total || "0"),
        publishedProjects: parseInt(pCount?.pub || "0"),
        draftProjects: parseInt(pCount?.draft || "0"),
        totalServices: parseInt(sCount?.total || "0"),
        totalSkills: parseInt(skCount?.total || "0"),
        totalEducation: parseInt(eduCount?.total || "0"),
        totalBlogs: parseInt(bCount?.total || "0"),
        publishedBlogs: parseInt(bCount?.pub || "0"),
        totalMessages: parseInt(mCount?.total || "0"),
        unreadMessages: parseInt(mCount?.unread || "0"),
        recentMessages: recentMessages.map((m) => ({
          id: String(m.Id),
          name: m.Name || "",
          email: m.Email || "",
          subject: m.Subject || "",
          message: m.Message || "",
          status: m.Status || "Unread",
          createdAtUtc: m.CreatedAtUtc,
        })),
        recentLogs: formattedLogs,
        recentActivities: formattedLogs,
      });
    }

    // 2. PROFILE
    if (moduleName === "profile") {
      const profiles = await query<any>('SELECT * FROM "Profiles" LIMIT 1');
      if (profiles.length === 0) return NextResponse.json(null);
      const p = profiles[0];
      const socials = await query<any>('SELECT * FROM "SocialLinks" WHERE "ProfileId" = $1 ORDER BY "DisplayOrder"', [p.Id]);

      return NextResponse.json({
        id: p.Id,
        fullName: p.FullName,
        brandTitle: p.BrandTitle,
        heroTitleLine1: p.HeroTitleLine1,
        heroTitleLine2: p.HeroTitleLine2,
        heroHighlight: p.HeroHighlight,
        subtitle: p.Subtitle,
        profileImageUrl: p.ProfileImageUrl,
        cvDownloadUrl: p.CvDownloadUrl,
        location: p.Location,
        phoneWhatsApp: p.PhoneWhatsApp,
        contactEmail: p.ContactEmail,
        domainEmail: p.DomainEmail,
        socialLinks: socials.map((s) => ({
          id: s.Id,
          name: s.Name,
          link: s.Link,
          iconKey: s.IconKey,
          displayOrder: s.DisplayOrder,
        })),
      });
    }

    // 3. ABOUT
    if (moduleName === "about") {
      const abouts = await query<any>('SELECT * FROM "AboutSections" LIMIT 1');
      if (abouts.length === 0) return NextResponse.json(null);
      const a = abouts[0];
      const tabs = await query<any>('SELECT * FROM "AboutTabs" WHERE "AboutSectionId" = $1 ORDER BY "DisplayOrder"', [a.Id]);

      return NextResponse.json({
        id: a.Id,
        headline: a.Headline,
        headlineAccent: a.HeadlineAccent,
        description: a.Description,
        imageUrl: a.ImageUrl,
        yearsOfExperience: a.YearsOfExperience,
        completedProjects: a.CompletedProjects,
        techMasteredCount: a.TechMasteredCount,
        tabs: tabs.map((t) => ({
          id: t.Id,
          tabKey: t.TabKey,
          title: t.Title,
          subtitle: t.Subtitle,
          description: t.Description,
          displayOrder: t.DisplayOrder,
        })),
      });
    }

    // 4. PROJECTS
    if (moduleName === "projects") {
      if (sub && !isNaN(Number(sub))) {
        const id = Number(sub);
        const p = (await query<any>('SELECT * FROM "Projects" WHERE "Id" = $1', [id]))[0];
        if (!p) return NextResponse.json({ message: "Not found" }, { status: 404 });
        const techs = await query<any>('SELECT "Id" as id, "Name" as name FROM "ProjectTechnologies" WHERE "ProjectId" = $1', [id]);
        return NextResponse.json({
          id: p.Id,
          title: p.Title,
          slug: p.Slug,
          path: p.Path,
          link: p.Link,
          githubUrl: p.GithubUrl,
          description: p.Description,
          displayOrder: p.DisplayOrder,
          isFeatured: p.IsFeatured,
          isPublished: p.IsPublished,
          technologies: techs,
        });
      }

      const projects = await query<any>('SELECT * FROM "Projects" ORDER BY "DisplayOrder"');
      const projectIds = projects.map((p) => p.Id);
      let techMap: Record<number, any[]> = {};
      if (projectIds.length > 0) {
        const allTechs = await query<any>(
          `SELECT "Id" as id, "ProjectId", "Name" as name FROM "ProjectTechnologies" WHERE "ProjectId" = ANY($1::int[])`,
          [projectIds]
        );
        allTechs.forEach((t) => {
          if (!techMap[t.ProjectId]) techMap[t.ProjectId] = [];
          techMap[t.ProjectId].push({ id: t.id, name: t.name });
        });
      }

      return NextResponse.json(
        projects.map((p) => ({
          id: p.Id,
          title: p.Title,
          slug: p.Slug,
          path: p.Path,
          link: p.Link,
          githubUrl: p.GithubUrl,
          description: p.Description,
          displayOrder: p.DisplayOrder,
          isFeatured: p.IsFeatured,
          isPublished: p.IsPublished,
          technologies: techMap[p.Id] || [],
        }))
      );
    }

    // 5. SERVICES
    if (moduleName === "services") {
      const services = await query<any>(
        'SELECT "Id" AS id, "Title" AS title, "Description" AS description, "IconKey" AS "iconKey", "DisplayOrder" AS "displayOrder", "IsPublished" AS "isPublished" FROM "Services" ORDER BY "DisplayOrder"'
      );
      return NextResponse.json(services);
    }

    // 6. SKILLS
    if (moduleName === "skills") {
      const cats = await query<any>('SELECT * FROM "SkillCategories" ORDER BY "DisplayOrder"');
      const catIds = cats.map((c) => c.Id);
      let itemsMap: Record<number, any[]> = {};
      if (catIds.length > 0) {
        const allItems = await query<any>(
          `SELECT "Id" AS id, "SkillCategoryId", "Name" AS name, "DisplayOrder" AS "displayOrder" FROM "SkillItems" WHERE "SkillCategoryId" = ANY($1::int[]) ORDER BY "DisplayOrder"`,
          [catIds]
        );
        allItems.forEach((i) => {
          if (!itemsMap[i.SkillCategoryId]) itemsMap[i.SkillCategoryId] = [];
          itemsMap[i.SkillCategoryId].push({ id: i.id, name: i.name, displayOrder: i.displayOrder });
        });
      }

      return NextResponse.json(
        cats.map((c) => ({
          id: c.Id,
          category: c.Category,
          displayOrder: c.DisplayOrder,
          skills: itemsMap[c.Id] || [],
        }))
      );
    }

    // 7. EDUCATION
    if (moduleName === "education") {
      const edu = await query<any>(
        'SELECT "Id" AS id, "Degree" AS degree, "Institution" AS institution, "Status" AS status, "DisplayOrder" AS "displayOrder", "IsPublished" AS "isPublished" FROM "EducationRecords" ORDER BY "DisplayOrder"'
      );
      return NextResponse.json(edu);
    }

    // 8. BLOGS
    if (moduleName === "blogs") {
      if (sub && !isNaN(Number(sub))) {
        const id = Number(sub);
        const [b] = await query<any>(
          `SELECT b."Id" AS id, b."Title" AS title, b."Slug" AS slug, b."Summary" AS summary, b."Content" AS content, b."ThumbnailUrl" AS "thumbnailUrl", b."Author" AS author, b."IsPublished" AS "isPublished", b."PublishedAtUtc" AS "publishedAtUtc", b."CreatedAtUtc" AS "createdAtUtc", b."SeoTitle" AS "seoTitle", b."SeoDescription" AS "seoDescription", c."Name" AS category
           FROM "BlogPosts" b
           LEFT JOIN "BlogCategories" c ON b."CategoryId" = c."Id"
           WHERE b."Id" = $1`,
          [id]
        );
        if (!b) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json(b);
      }

      const blogs = await query<any>(
        `SELECT b."Id" AS id, b."Title" AS title, b."Slug" AS slug, b."Summary" AS summary, b."Content" AS content, b."ThumbnailUrl" AS "thumbnailUrl", b."Author" AS author, b."IsPublished" AS "isPublished", b."PublishedAtUtc" AS "publishedAtUtc", b."CreatedAtUtc" AS "createdAtUtc", b."SeoTitle" AS "seoTitle", b."SeoDescription" AS "seoDescription", c."Name" AS category
         FROM "BlogPosts" b
         LEFT JOIN "BlogCategories" c ON b."CategoryId" = c."Id"
         ORDER BY b."CreatedAtUtc" DESC`
      );
      return NextResponse.json(blogs);
    }

    // 9. CONTACT MESSAGES
    if (moduleName === "contact" && sub === "messages") {
      if (third) {
        const m = (await query<any>('SELECT * FROM "ContactMessages" WHERE "Id"::text = $1', [third]))[0];
        if (!m) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json({
          id: m.Id,
          name: m.Name,
          email: m.Email,
          subject: m.Subject,
          message: m.Message,
          status: m.Status,
          clientIp: m.ClientIp,
          createdAtUtc: m.CreatedAtUtc,
        });
      }

      const messages = await query<any>('SELECT * FROM "ContactMessages" ORDER BY "CreatedAtUtc" DESC');
      return NextResponse.json(
        messages.map((m) => ({
          id: m.Id,
          name: m.Name,
          email: m.Email,
          subject: m.Subject,
          message: m.Message,
          status: m.Status,
          clientIp: m.ClientIp,
          createdAtUtc: m.CreatedAtUtc,
        }))
      );
    }

    // 10. MEDIA ASSETS
    if (moduleName === "media") {
      const assets = await query<any>('SELECT * FROM "MediaAssets" ORDER BY "UploadedAtUtc" DESC');
      return NextResponse.json(
        assets.map((a) => ({
          id: a.Id,
          originalFileName: a.OriginalFileName,
          relativeUrl: a.RelativeUrl,
          mimeType: a.MimeType,
          fileSizeBytes: a.FileSizeBytes,
          altText: a.AltText,
          uploadedAtUtc: a.UploadedAtUtc,
        }))
      );
    }

    // 11. USERS
    if (moduleName === "users") {
      const users = await query<any>(
        'SELECT "Id" AS id, "Username" AS username, "Email" AS email, "Role" AS role, "IsActive" AS "isActive", "CreatedAtUtc" AS "createdAtUtc", "LastLoginUtc" AS "lastLoginUtc" FROM "Users" ORDER BY CASE WHEN "Role" = \'Owner\' THEN 0 ELSE 1 END, "Username"'
      );
      return NextResponse.json(users);
    }

    // 12. SETTINGS
    if (moduleName === "settings") {
      const settings = await query<any>('SELECT "Key" as key, "Value" as value, "UpdatedAtUtc" as "updatedAtUtc" FROM "WebsiteSettings"');
      return NextResponse.json(settings);
    }

    return NextResponse.json({ message: "Not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = await props.params;
  const parts = params.action || [];
  const moduleName = parts[0];
  const sub = parts[1];

  try {
    // 1. MEDIA UPLOAD
    if (moduleName === "media" && sub === "upload") {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const altText = (formData.get("altText") as string) || "";

      if (!file) {
        return NextResponse.json({ message: "No file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || ".png";
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext.toLowerCase()}`;
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, safeName), buffer);

      const relativeUrl = `/uploads/${safeName}`;

      await query(
        `INSERT INTO "MediaAssets" ("Id", "OriginalFileName", "RelativeUrl", "MimeType", "FileSizeBytes", "AltText", "UploadedAtUtc")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)`,
        [file.name, relativeUrl, file.type || "image/png", file.size, altText || file.name, new Date().toISOString()]
      );

      return NextResponse.json({
        relativeUrl,
        originalFileName: file.name,
      });
    }

    // 2. CREATE PROJECT
    if (moduleName === "projects") {
      const body = await request.json();
      const title = (body.title || "").trim();
      const slug = slugify(body.slug || title);
      const imagePath = body.path || "";
      const link = body.link || "https://krishnabhandari01.com.np";
      const githubUrl = body.githubUrl || null;
      const description = body.description || "";
      const displayOrder = Number(body.displayOrder) || 1;
      const isFeatured = body.isFeatured !== false;
      const isPublished = body.isPublished !== false;
      const technologies: string[] = body.technologies || [];

      const res = await query<any>(
        `INSERT INTO "Projects" ("Title", "Slug", "Path", "Link", "GithubUrl", "Description", "DisplayOrder", "IsFeatured", "IsPublished", "CreatedAtUtc")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING "Id"`,
        [title, slug, imagePath, link, githubUrl, description, displayOrder, isFeatured, isPublished, new Date().toISOString()]
      );

      const projectId = res[0].Id;
      for (const t of technologies) {
        if (t && t.trim()) {
          await query('INSERT INTO "ProjectTechnologies" ("ProjectId", "Name") VALUES ($1, $2)', [projectId, t.trim()]);
        }
      }

      return NextResponse.json({ id: projectId, title, slug });
    }

    // 3. CREATE SERVICE
    if (moduleName === "services") {
      const body = await request.json();
      const title = (body.title || "").trim();
      const description = body.description || "";
      const iconKey = body.iconKey || "RxDesktop";
      const displayOrder = Number(body.displayOrder) || 1;
      const isPublished = body.isPublished !== false;

      const res = await query<any>(
        `INSERT INTO "Services" ("Title", "Description", "IconKey", "DisplayOrder", "IsPublished", "CreatedAtUtc")
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING "Id"`,
        [title, description, iconKey, displayOrder, isPublished, new Date().toISOString()]
      );

      return NextResponse.json({ id: res[0].Id, title, isPublished });
    }

    // 4. CREATE SKILL
    if (moduleName === "skills") {
      const body = await request.json();
      if (body.type === "item") {
        const res = await query<any>(
          `INSERT INTO "SkillItems" ("SkillCategoryId", "Name", "DisplayOrder")
           VALUES ($1, $2, $3) RETURNING "Id"`,
          [body.categoryId, body.name.trim(), Number(body.displayOrder) || 1]
        );
        return NextResponse.json({ id: res[0].Id });
      }

      const res = await query<any>(
        `INSERT INTO "SkillCategories" ("Category", "DisplayOrder")
         VALUES ($1, $2) RETURNING "Id"`,
        [body.category.trim(), Number(body.displayOrder) || 1]
      );
      const catId = res[0].Id;
      if (body.skillNames && Array.isArray(body.skillNames)) {
        for (let i = 0; i < body.skillNames.length; i++) {
          const sName = body.skillNames[i];
          if (sName && sName.trim()) {
            await query(
              `INSERT INTO "SkillItems" ("SkillCategoryId", "Name", "DisplayOrder") VALUES ($1, $2, $3)`,
              [catId, sName.trim(), i + 1]
            );
          }
        }
      }
      return NextResponse.json({ id: catId });
    }

    // 5. CREATE EDUCATION
    if (moduleName === "education") {
      const body = await request.json();
      const res = await query<any>(
        `INSERT INTO "EducationRecords" ("Degree", "Institution", "Status", "DisplayOrder", "IsPublished", "CreatedAtUtc")
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING "Id"`,
        [
          body.degree.trim(),
          body.institution.trim(),
          body.status?.trim() || "Completed",
          Number(body.displayOrder) || 1,
          body.isPublished !== false,
          new Date().toISOString(),
        ]
      );
      return NextResponse.json({ id: res[0].Id });
    }

    // 6. CREATE BLOG
    if (moduleName === "blogs") {
      const body = await request.json();
      const title = body.title.trim();
      const slug = slugify(body.slug || title);
      const res = await query<any>(
        `INSERT INTO "BlogPosts" ("Title", "Slug", "Summary", "Content", "ThumbnailUrl", "Author", "IsPublished", "PublishedAtUtc", "SeoTitle", "SeoDescription", "CreatedAtUtc")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING "Id"`,
        [
          title,
          slug,
          body.summary || "",
          body.content || "",
          body.thumbnailUrl || null,
          body.author || "Krishna Prasad Bhandari",
          body.isPublished || false,
          body.isPublished ? new Date().toISOString() : null,
          body.seoTitle || null,
          body.seoDescription || null,
          new Date().toISOString(),
        ]
      );
      return NextResponse.json({ id: res[0].Id });
    }

    // 7. CREATE USER (Owner only)
    if (moduleName === "users") {
      if (auth.role !== "Owner") {
        return NextResponse.json({ message: "Only Owner can create admin users." }, { status: 403 });
      }
      const body = await request.json();
      const username = body.username.trim();
      const email = body.email.trim().toLowerCase();
      const password = body.password || "Admin@12345";
      const hash = await bcrypt.hash(password, 11);

      const res = await query<any>(
        `INSERT INTO "Users" ("Id", "Username", "Email", "PasswordHash", "Role", "IsActive", "CreatedAtUtc")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) RETURNING "Id"`,
        [username, email, hash, body.role || "Admin", body.isActive !== false, new Date().toISOString()]
      );
      return NextResponse.json({ id: res[0].Id });
    }

    // 8. ADD SOCIAL LINK
    if (moduleName === "profile" && sub === "socials") {
      const body = await request.json();
      const [prof] = await query<any>('SELECT "Id" FROM "Profiles" LIMIT 1');
      const res = await query<any>(
        `INSERT INTO "SocialLinks" ("ProfileId", "Name", "Link", "IconKey", "DisplayOrder")
         VALUES ($1, $2, $3, $4, $5) RETURNING "Id"`,
        [prof.Id, body.name.trim(), body.link.trim(), body.iconKey || "RiGlobalLine", Number(body.displayOrder) || 1]
      );
      return NextResponse.json({ id: res[0].Id });
    }

    // 9. ADD ABOUT TAB
    if (moduleName === "about" && sub === "tabs") {
      const body = await request.json();
      const [about] = await query<any>('SELECT "Id" FROM "AboutSections" LIMIT 1');
      const res = await query<any>(
        `INSERT INTO "AboutTabs" ("AboutSectionId", "TabKey", "Title", "Subtitle", "Description", "DisplayOrder")
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING "Id"`,
        [about.Id, body.tabKey.trim(), body.title.trim(), body.subtitle || "", body.description || "", Number(body.displayOrder) || 1]
      );
      return NextResponse.json({ id: res[0].Id });
    }

    return NextResponse.json({ message: "Not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed to create" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = await props.params;
  const parts = params.action || [];
  const moduleName = parts[0];
  const sub = parts[1];

  try {
    const body = await request.json();

    // 1. UPDATE PROFILE
    if (moduleName === "profile") {
      await query(
        `UPDATE "Profiles" SET
          "FullName" = $1, "BrandTitle" = $2, "HeroTitleLine1" = $3, "HeroTitleLine2" = $4,
          "HeroHighlight" = $5, "Subtitle" = $6, "ProfileImageUrl" = $7, "CvDownloadUrl" = $8,
          "Location" = $9, "PhoneWhatsApp" = $10, "ContactEmail" = $11, "DomainEmail" = $12,
          "UpdatedAtUtc" = $13`,
        [
          body.fullName,
          body.brandTitle,
          body.heroTitleLine1,
          body.heroTitleLine2,
          body.heroHighlight,
          body.subtitle,
          body.profileImageUrl,
          body.cvDownloadUrl || null,
          body.location,
          body.phoneWhatsApp,
          body.contactEmail,
          body.domainEmail,
          new Date().toISOString(),
        ]
      );
      return NextResponse.json({ success: true });
    }

    // 2. UPDATE ABOUT
    if (moduleName === "about") {
      if (sub === "tabs" && parts[2]) {
        const tabId = Number(parts[2]);
        await query(
          `UPDATE "AboutTabs" SET "TabKey" = $1, "Title" = $2, "Subtitle" = $3, "Description" = $4, "DisplayOrder" = $5 WHERE "Id" = $6`,
          [body.tabKey, body.title, body.subtitle || "", body.description || "", Number(body.displayOrder) || 1, tabId]
        );
        return NextResponse.json({ success: true });
      }

      await query(
        `UPDATE "AboutSections" SET
          "Headline" = $1, "HeadlineAccent" = $2, "Description" = $3, "ImageUrl" = $4,
          "YearsOfExperience" = $5, "CompletedProjects" = $6, "TechMasteredCount" = $7, "UpdatedAtUtc" = $8`,
        [
          body.headline,
          body.headlineAccent,
          body.description,
          body.imageUrl || "",
          Number(body.yearsOfExperience) || 0,
          Number(body.completedProjects) || 0,
          Number(body.techMasteredCount) || 0,
          new Date().toISOString(),
        ]
      );
      return NextResponse.json({ success: true });
    }

    // 3. UPDATE PROJECT
    if (moduleName === "projects" && sub) {
      const id = Number(sub);
      const title = body.title.trim();
      const slug = slugify(body.slug || title);

      await query(
        `UPDATE "Projects" SET
          "Title" = $1, "Slug" = $2, "Path" = $3, "Link" = $4, "GithubUrl" = $5,
          "Description" = $6, "DisplayOrder" = $7, "IsFeatured" = $8, "IsPublished" = $9, "UpdatedAtUtc" = $10
         WHERE "Id" = $11`,
        [
          title,
          slug,
          body.path,
          body.link,
          body.githubUrl || null,
          body.description,
          Number(body.displayOrder) || 1,
          body.isFeatured !== false,
          body.isPublished !== false,
          new Date().toISOString(),
          id,
        ]
      );

      if (body.technologies && Array.isArray(body.technologies)) {
        await query('DELETE FROM "ProjectTechnologies" WHERE "ProjectId" = $1', [id]);
        for (const t of body.technologies) {
          if (t && t.trim()) {
            await query('INSERT INTO "ProjectTechnologies" ("ProjectId", "Name") VALUES ($1, $2)', [id, t.trim()]);
          }
        }
      }

      return NextResponse.json({ success: true });
    }

    // 4. UPDATE SERVICE
    if (moduleName === "services" && sub) {
      const id = Number(sub);
      await query(
        `UPDATE "Services" SET "Title" = $1, "Description" = $2, "IconKey" = $3, "DisplayOrder" = $4, "IsPublished" = $5 WHERE "Id" = $6`,
        [body.title.trim(), body.description, body.iconKey, Number(body.displayOrder) || 1, body.isPublished !== false, id]
      );
      return NextResponse.json({ success: true });
    }

    // 5. UPDATE SKILL CATEGORY
    if (moduleName === "skills" && sub) {
      const catId = Number(sub);
      await query(
        `UPDATE "SkillCategories" SET "Category" = $1, "DisplayOrder" = $2 WHERE "Id" = $3`,
        [body.category.trim(), Number(body.displayOrder) || 1, catId]
      );
      if (body.skillNames && Array.isArray(body.skillNames)) {
        await query('DELETE FROM "SkillItems" WHERE "SkillCategoryId" = $1', [catId]);
        for (let i = 0; i < body.skillNames.length; i++) {
          const sName = body.skillNames[i];
          if (sName && sName.trim()) {
            await query(
              `INSERT INTO "SkillItems" ("SkillCategoryId", "Name", "DisplayOrder") VALUES ($1, $2, $3)`,
              [catId, sName.trim(), i + 1]
            );
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    // 6. UPDATE EDUCATION
    if (moduleName === "education" && sub) {
      const id = Number(sub);
      await query(
        `UPDATE "EducationRecords" SET "Degree" = $1, "Institution" = $2, "Status" = $3, "DisplayOrder" = $4, "IsPublished" = $5 WHERE "Id" = $6`,
        [
          body.degree.trim(),
          body.institution.trim(),
          body.status?.trim() || "Completed",
          Number(body.displayOrder) || 1,
          body.isPublished !== false,
          id,
        ]
      );
      return NextResponse.json({ success: true });
    }

    // 7. UPDATE BLOG
    if (moduleName === "blogs" && sub) {
      const id = Number(sub);
      const title = body.title.trim();
      const slug = slugify(body.slug || title);
      await query(
        `UPDATE "BlogPosts" SET
          "Title" = $1, "Slug" = $2, "Summary" = $3, "Content" = $4, "ThumbnailUrl" = $5,
          "Author" = $6, "IsPublished" = $7, "PublishedAtUtc" = $8, "SeoTitle" = $9, "SeoDescription" = $10,
          "UpdatedAtUtc" = $11
         WHERE "Id" = $12`,
        [
          title,
          slug,
          body.summary || "",
          body.content || "",
          body.thumbnailUrl || null,
          body.author || "Krishna Prasad Bhandari",
          body.isPublished || false,
          body.isPublished ? new Date().toISOString() : null,
          body.seoTitle || null,
          body.seoDescription || null,
          new Date().toISOString(),
          id,
        ]
      );
      return NextResponse.json({ success: true });
    }

    // 8. UPDATE SETTINGS
    if (moduleName === "settings") {
      if (sub) {
        const key = decodeURIComponent(sub);
        const val = typeof body.value !== "undefined" ? String(body.value) : String(body);
        await query(
          `INSERT INTO "WebsiteSettings" ("Key", "Value", "UpdatedAtUtc")
           VALUES ($1, $2, $3)
           ON CONFLICT ("Key") DO UPDATE SET "Value" = $2, "UpdatedAtUtc" = $3`,
          [key, val, new Date().toISOString()]
        );
      } else {
        const entries = Object.entries(body);
        for (const [k, v] of entries) {
          await query(
            `INSERT INTO "WebsiteSettings" ("Key", "Value", "UpdatedAtUtc")
             VALUES ($1, $2, $3)
             ON CONFLICT ("Key") DO UPDATE SET "Value" = $2, "UpdatedAtUtc" = $3`,
            [k, String(v), new Date().toISOString()]
          );
        }
      }
      return NextResponse.json({ success: true });
    }

    // 6. UPDATE USER
    if (moduleName === "users" && sub) {
      if (auth.role !== "Owner") {
        return NextResponse.json({ message: "Only Owner can edit admin users." }, { status: 403 });
      }
      const userId = sub;
      const username = body.username.trim();
      const email = body.email.trim().toLowerCase();

      if (body.newPassword && body.newPassword.length >= 8) {
        const hash = await bcrypt.hash(body.newPassword, 11);
        await query(
          `UPDATE "Users" SET "Username" = $1, "Email" = $2, "Role" = $3, "IsActive" = $4, "PasswordHash" = $5 WHERE "Id"::text = $6`,
          [username, email, body.role || "Admin", body.isActive !== false, hash, userId]
        );
      } else {
        await query(
          `UPDATE "Users" SET "Username" = $1, "Email" = $2, "Role" = $3, "IsActive" = $4 WHERE "Id"::text = $5`,
          [username, email, body.role || "Admin", body.isActive !== false, userId]
        );
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed to update" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = await props.params;
  const parts = params.action || [];
  const moduleName = parts[0];
  const id = Number(parts[1]);
  const action = parts[2];

  try {
    if (moduleName === "projects" && action === "publish") {
      const [p] = await query<any>('SELECT "IsPublished" FROM "Projects" WHERE "Id" = $1', [id]);
      const next = !p.IsPublished;
      await query('UPDATE "Projects" SET "IsPublished" = $1, "UpdatedAtUtc" = $2 WHERE "Id" = $3', [next, new Date().toISOString(), id]);
      return NextResponse.json({ id, isPublished: next });
    }

    if (moduleName === "projects" && action === "feature") {
      const [p] = await query<any>('SELECT "IsFeatured" FROM "Projects" WHERE "Id" = $1', [id]);
      const next = !p.IsFeatured;
      await query('UPDATE "Projects" SET "IsFeatured" = $1, "UpdatedAtUtc" = $2 WHERE "Id" = $3', [next, new Date().toISOString(), id]);
      return NextResponse.json({ id, isFeatured: next });
    }

    if (moduleName === "services" && action === "publish") {
      const [s] = await query<any>('SELECT "IsPublished" FROM "Services" WHERE "Id" = $1', [id]);
      const next = !s.IsPublished;
      await query('UPDATE "Services" SET "IsPublished" = $1 WHERE "Id" = $2', [next, id]);
      return NextResponse.json({ id, isPublished: next });
    }

    if (moduleName === "blogs" && action === "publish") {
      const [b] = await query<any>('SELECT "IsPublished" FROM "BlogPosts" WHERE "Id" = $1', [id]);
      const next = !b.IsPublished;
      await query('UPDATE "BlogPosts" SET "IsPublished" = $1, "PublishedAtUtc" = $2 WHERE "Id" = $3', [next, next ? new Date().toISOString() : null, id]);
      return NextResponse.json({ id, isPublished: next });
    }

    if (moduleName === "education" && action === "publish") {
      const [e] = await query<any>('SELECT "IsPublished" FROM "EducationRecords" WHERE "Id" = $1', [id]);
      const next = !e?.IsPublished;
      await query('UPDATE "EducationRecords" SET "IsPublished" = $1 WHERE "Id" = $2', [next, id]);
      return NextResponse.json({ id, isPublished: next });
    }

    if (moduleName === "contact" && parts[1] === "messages" && parts[3] === "status") {
      const msgId = parts[2];
      const body = await request.json();
      await query('UPDATE "ContactMessages" SET "Status" = $1 WHERE "Id"::text = $2', [body.status, msgId]);
      return NextResponse.json({ success: true, status: body.status });
    }

    return NextResponse.json({ message: "Not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed patch" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const auth = verifyAuth(request);
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = await props.params;
  const parts = params.action || [];
  const moduleName = parts[0];
  const sub = parts[1];

  try {
    if (moduleName === "projects" && sub) {
      const id = Number(sub);
      await query('DELETE FROM "ProjectTechnologies" WHERE "ProjectId" = $1', [id]);
      await query('DELETE FROM "Projects" WHERE "Id" = $1', [id]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "services" && sub) {
      await query('DELETE FROM "Services" WHERE "Id" = $1', [Number(sub)]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "blogs" && sub) {
      await query('DELETE FROM "BlogPosts" WHERE "Id" = $1', [Number(sub)]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "skills" && sub) {
      if (parts[2] === "item") {
        await query('DELETE FROM "SkillItems" WHERE "Id" = $1', [Number(sub)]);
      } else {
        await query('DELETE FROM "SkillItems" WHERE "SkillCategoryId" = $1', [Number(sub)]);
        await query('DELETE FROM "SkillCategories" WHERE "Id" = $1', [Number(sub)]);
      }
      return NextResponse.json({ success: true });
    }

    if (moduleName === "education" && sub) {
      await query('DELETE FROM "EducationRecords" WHERE "Id" = $1', [Number(sub)]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "profile" && sub === "socials" && parts[2]) {
      await query('DELETE FROM "SocialLinks" WHERE "Id" = $1', [Number(parts[2])]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "about" && sub === "tabs" && parts[2]) {
      await query('DELETE FROM "AboutTabs" WHERE "Id" = $1', [Number(parts[2])]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "contact" && sub === "messages" && parts[2]) {
      await query('DELETE FROM "ContactMessages" WHERE "Id"::text = $1', [parts[2]]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "media" && sub) {
      await query('DELETE FROM "MediaAssets" WHERE "Id"::text = $1', [sub]);
      return NextResponse.json({ success: true });
    }

    if (moduleName === "users" && sub) {
      if (auth.role !== "Owner") {
        return NextResponse.json({ message: "Only Owner can delete users." }, { status: 403 });
      }
      if (sub === auth.id) {
        return NextResponse.json({ message: "Cannot delete your own account." }, { status: 400 });
      }
      await query('DELETE FROM "Users" WHERE "Id"::text = $1', [sub]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed delete" }, { status: 500 });
  }
}

