import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const params = await props.params;
  const actionParts = params.action || [];
  const action = actionParts[0];

  try {
    // 1. PROFILE
    if (action === "profile") {
      const profiles = await query<any>('SELECT * FROM "Profiles" LIMIT 1');
      if (profiles.length === 0) return NextResponse.json(null);
      const p = profiles[0];

      const socials = await query<any>(
        'SELECT "Id" AS id, "Name" AS name, "Link" AS link, "IconKey" AS "iconKey", "DisplayOrder" AS "displayOrder" FROM "SocialLinks" WHERE "ProfileId" = $1 ORDER BY "DisplayOrder"',
        [p.Id]
      );

      const badges = await query<any>(
        'SELECT "Id" AS id, "BadgeKey" AS "badgeKey", "ContentJson" AS "contentJson", "DisplayOrder" AS "displayOrder" FROM "TelemetryBadges" WHERE "ProfileId" = $1 ORDER BY "DisplayOrder"',
        [p.Id]
      );

      return NextResponse.json({
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
        socialLinks: socials,
        badges: badges,
      });
    }

    // 2. ABOUT
    if (action === "about") {
      const abouts = await query<any>('SELECT * FROM "AboutSections" LIMIT 1');
      if (abouts.length === 0) return NextResponse.json(null);
      const a = abouts[0];

      const tabs = await query<any>(
        'SELECT "Id" AS id, "TabKey" AS "tabKey", "Title" AS title, "Subtitle" AS subtitle, "Description" AS description, "DisplayOrder" AS "displayOrder" FROM "AboutTabs" WHERE "AboutSectionId" = $1 ORDER BY "DisplayOrder"',
        [a.Id]
      );

      return NextResponse.json({
        headline: a.Headline,
        headlineAccent: a.HeadlineAccent,
        description: a.Description,
        imageUrl: a.ImageUrl,
        yearsOfExperience: a.YearsOfExperience,
        completedProjects: a.CompletedProjects,
        techMasteredCount: a.TechMasteredCount,
        tabs: tabs,
      });
    }

    // 3. SERVICES
    if (action === "services") {
      const services = await query<any>(
        'SELECT "Id" AS id, "Title" AS title, "Description" AS description, "IconKey" AS "iconKey", "DisplayOrder" AS "displayOrder" FROM "Services" WHERE "IsPublished" = true ORDER BY "DisplayOrder"'
      );
      return NextResponse.json(services);
    }

    // 4. PROJECTS
    if (action === "projects") {
      const slug = actionParts[1];
      if (slug) {
        const decoded = decodeURIComponent(slug);
        const projects = await query<any>(
          'SELECT * FROM "Projects" WHERE "Slug" = $1 AND "IsPublished" = true LIMIT 1',
          [decoded]
        );
        if (projects.length === 0) return NextResponse.json({ message: "Project not found" }, { status: 404 });
        const p = projects[0];
        const techs = await query<any>('SELECT "Name" FROM "ProjectTechnologies" WHERE "ProjectId" = $1', [p.Id]);

        return NextResponse.json({
          id: p.Id,
          title: p.Title,
          slug: p.Slug,
          path: p.Path,
          link: p.Link,
          githubUrl: p.GithubUrl,
          description: p.Description,
          tech: techs.map((t) => t.Name),
          displayOrder: p.DisplayOrder,
        });
      }

      const projects = await query<any>(
        'SELECT * FROM "Projects" WHERE "IsPublished" = true ORDER BY "DisplayOrder"'
      );
      const projectIds = projects.map((p) => p.Id);
      let techMap: Record<number, string[]> = {};
      if (projectIds.length > 0) {
        const allTechs = await query<any>(
          `SELECT "ProjectId", "Name" FROM "ProjectTechnologies" WHERE "ProjectId" = ANY($1::int[])`,
          [projectIds]
        );
        allTechs.forEach((t) => {
          if (!techMap[t.ProjectId]) techMap[t.ProjectId] = [];
          techMap[t.ProjectId].push(t.Name);
        });
      }

      const result = projects.map((p) => ({
        id: p.Id,
        title: p.Title,
        slug: p.Slug,
        path: p.Path,
        link: p.Link,
        githubUrl: p.GithubUrl,
        description: p.Description,
        tech: techMap[p.Id] || [],
        displayOrder: p.DisplayOrder,
      }));

      return NextResponse.json(result);
    }

    // 5. SKILLS
    if (action === "skills") {
      const cats = await query<any>('SELECT * FROM "SkillCategories" ORDER BY "DisplayOrder"');
      const catIds = cats.map((c) => c.Id);
      let itemsMap: Record<number, string[]> = {};
      if (catIds.length > 0) {
        const allItems = await query<any>(
          `SELECT "SkillCategoryId", "Name" FROM "SkillItems" WHERE "SkillCategoryId" = ANY($1::int[]) ORDER BY "DisplayOrder"`,
          [catIds]
        );
        allItems.forEach((i) => {
          if (!itemsMap[i.SkillCategoryId]) itemsMap[i.SkillCategoryId] = [];
          itemsMap[i.SkillCategoryId].push(i.Name);
        });
      }

      const result = cats.map((c) => ({
        id: c.Id,
        category: c.Category,
        skillsJoined: (itemsMap[c.Id] || []).join(" • "),
        skillsList: itemsMap[c.Id] || [],
      }));

      return NextResponse.json(result);
    }

    // 6. EDUCATION
    if (action === "education") {
      const edu = await query<any>(
        'SELECT "Id" AS id, "Degree" AS degree, "Institution" AS institution, "Status" AS status, "DisplayOrder" AS "displayOrder" FROM "EducationRecords" WHERE "IsPublished" = true ORDER BY "DisplayOrder"'
      );
      return NextResponse.json(edu);
    }

    // 7. BLOGS
    if (action === "blogs") {
      const blogs = await query<any>(
        `SELECT b."Id" AS id, b."Title" AS title, b."Slug" AS slug, b."Summary" AS summary, b."Content" AS content, b."ThumbnailUrl" AS "thumbnailUrl", b."Author" AS author, b."PublishedAtUtc" AS "publishedAtUtc", c."Name" AS category
         FROM "BlogPosts" b
         LEFT JOIN "BlogCategories" c ON b."CategoryId" = c."Id"
         WHERE b."IsPublished" = true
         ORDER BY b."PublishedAtUtc" DESC NULLS LAST, b."CreatedAtUtc" DESC`
      );
      return NextResponse.json(blogs);
    }

    return NextResponse.json({ message: "Endpoint not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed to fetch data." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const params = await props.params;
  const action = params.action ? params.action[0] : "";

  if (action === "contact") {
    try {
      const body = await request.json();
      const name = (body.name || "").trim();
      const email = (body.email || "").trim().toLowerCase();
      const subject = (body.subject || "").trim();
      const message = (body.message || "").trim();

      if (!name || !email || !message) {
        return NextResponse.json({ message: "Name, email, and message are required." }, { status: 400 });
      }

      const clientIp = request.headers.get("x-forwarded-for") || "unknown";
      const userAgent = request.headers.get("user-agent") || "";

      const res = await query<any>(
        `INSERT INTO "ContactMessages" ("Id", "Name", "Email", "Subject", "Message", "ClientIp", "UserAgent", "Status", "CreatedAtUtc")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'Unread', $7)
         RETURNING "Id"`,
        [name, email, subject, message, clientIp, userAgent, new Date().toISOString()]
      );

      return NextResponse.json({
        success: true,
        messageId: res[0]?.Id,
        message: "Thank you! Your message has been received securely.",
      });
    } catch (err: any) {
      return NextResponse.json({ message: err.message || "Failed to submit message." }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Endpoint not found" }, { status: 404 });
}

