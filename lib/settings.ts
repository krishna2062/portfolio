import { query } from "./db";

export interface WebsiteSettingsMap {
  [key: string]: string;
}

export const DEFAULT_SEO_SETTINGS = {
  MetaTitle: "Krishna Prasad Bhandari | Full-Stack Software Engineer & System Architect",
  SiteTitle: "Krishna Prasad Bhandari | Full-Stack Software Engineer",
  MetaDescription:
    "Official portfolio of Krishna Prasad Bhandari - Full-Stack Software Engineer specializing in Next.js, React, Node.js, and ASP.NET Core cloud architectures based in Nepal.",
  SiteDescription:
    "Official portfolio of Krishna Prasad Bhandari - Full-Stack Software Engineer & Computer Engineering Student specializing in ASP.NET Core, React, and IoT Telemetry.",
  MetaKeywords:
    "Krishna Prasad Bhandari, Krishna Bhandari, Full Stack Developer Nepal, React Developer, Next.js Developer, ASP.NET Core Engineer, Software Engineer Butwal Kathmandu Nepal, Portfolio, Web Developer Nepal",
  CanonicalUrl: "https://krishnabhandari01.com.np",
  OgImageUrl: "/assets/logo.png",
  TwitterHandle: "@krishnabhandari",
  GoogleSiteVerification: "",
  BingSiteVerification: "",
  RobotsDirective: "index, follow",
  ThemeColor: "#f13024",
  LogoUrl: "/assets/logo.png",
  GoogleAnalyticsId: "G-RE7ER17RWK",
  ContactEmail: "krrishbhandari2062@gmail.com",
  DomainEmail: "info@krishnabhandari01.com.np",
  PhoneWhatsApp: "+977 9867165211",
  CopyrightText: "© 2026 Krishna Prasad Bhandari. All rights reserved.",
};

export async function getWebsiteSettings(): Promise<WebsiteSettingsMap> {
  try {
    const rows = await query<{ Key: string; Value: string }>(
      'SELECT "Key", "Value" FROM "WebsiteSettings"'
    );
    const map: Record<string, string> = { ...DEFAULT_SEO_SETTINGS };
    for (const r of rows) {
      if (r.Key && r.Value !== null && r.Value !== undefined) {
        map[r.Key] = r.Value;
      }
    }
    return map;
  } catch (err) {
    console.error("Failed to query WebsiteSettings from database, using defaults:", err);
    return { ...DEFAULT_SEO_SETTINGS };
  }
}

