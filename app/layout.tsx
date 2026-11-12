import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

import Header from "@/components/Header";
import Nav from "@/components/Nav";
import TopLeftImg from "@/components/TopLeftImg";
import { getWebsiteSettings } from "@/lib/settings";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora-family",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const revalidate = 3600; // Cache page metadata and revalidate hourly

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings();

  const title =
    settings["MetaTitle"] ||
    settings["SiteTitle"] ||
    "Krishna Prasad Bhandari | Full-Stack Software Engineer & System Architect";

  const description =
    settings["MetaDescription"] ||
    settings["SiteDescription"] ||
    "Official portfolio of Krishna Prasad Bhandari - Full-Stack Software Engineer specializing in Next.js, React, Node.js, and ASP.NET Core cloud architectures based in Nepal.";

  const rawKeywords =
    settings["MetaKeywords"] ||
    "Krishna Prasad Bhandari, Krishna Bhandari, Full Stack Developer Nepal, React Developer, Next.js Developer, ASP.NET Core Engineer, Software Engineer Butwal Kathmandu Nepal, Portfolio, Web Developer Nepal";

  const keywords = rawKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const rawCanonical = settings["CanonicalUrl"] || "https://krishnabhandari01.com.np";
  const canonicalUrl = rawCanonical.replace(/\/$/, "");

  const ogImageRaw = settings["OgImageUrl"] || "/assets/logo.png";
  const ogImageUrl = ogImageRaw.startsWith("http")
    ? ogImageRaw
    : `${canonicalUrl}${ogImageRaw.startsWith("/") ? "" : "/"}${ogImageRaw}`;

  const twitterHandle = settings["TwitterHandle"] || "@krishnabhandari";
  let googleVerification = settings["GoogleSiteVerification"]?.trim() || "";
  const tagMatch = googleVerification.match(/content=["']([^"']+)["']/i);
  if (tagMatch) {
    googleVerification = tagMatch[1];
  } else if (googleVerification.includes(".html")) {
    googleVerification = "";
  } else {
    googleVerification = googleVerification.replace(/^google-site-verification[:=]\s*/i, "").trim();
  }

  const bingVerification = settings["BingSiteVerification"]?.trim() || "";
  const isNoIndex = (settings["RobotsDirective"] || "").toLowerCase().includes("noindex");

  return {
    metadataBase: new URL(canonicalUrl),
    title: {
      default: title,
      template: "%s | Krishna Prasad Bhandari",
    },
    description,
    keywords,
    authors: [{ name: "Krishna Prasad Bhandari", url: canonicalUrl }],
    creator: "Krishna Prasad Bhandari",
    publisher: "Krishna Prasad Bhandari",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      title,
      description,
      siteName: "Krishna Prasad Bhandari Portfolio",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterHandle,
      images: [ogImageUrl],
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoIndex,
      googleBot: {
        index: !isNoIndex,
        follow: !isNoIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: googleVerification || undefined,
      other: bingVerification ? { "msvalidate.01": bingVerification } : undefined,
    },
    icons: {
      icon: settings["LogoUrl"] || "/assets/logo.svg",
      shortcut: settings["LogoUrl"] || "/assets/logo.svg",
      apple: settings["LogoUrl"] || "/assets/logo.svg",
    },
    other: {
      "theme-color": settings["ThemeColor"] || "#f13024",
      "format-detection": "telephone=no",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f13024",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getWebsiteSettings();
  const gaId = settings["GoogleAnalyticsId"] || "G-RE7ER17RWK";
  const canonicalUrl = (settings["CanonicalUrl"] || "https://krishnabhandari01.com.np").replace(/\/$/, "");
  const logoUrl = settings["LogoUrl"]?.startsWith("http")
    ? settings["LogoUrl"]
    : `${canonicalUrl}${settings["LogoUrl"]?.startsWith("/") ? "" : "/"}${settings["LogoUrl"] || "/assets/logo.png"}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${canonicalUrl}/#person`,
        name: "Krishna Prasad Bhandari",
        alternateName: ["Krishna Bhandari", "krrish"],
        url: canonicalUrl,
        image: logoUrl,
        jobTitle: "Full-Stack Software Engineer & System Architect",
        description:
          settings["MetaDescription"] ||
          "Full-Stack Software Engineer specializing in Next.js, React, Node.js, and ASP.NET Core cloud architectures.",
        worksFor: {
          "@type": "Organization",
          name: "Software Engineering & Cloud Architecture",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Tribhuvan University (IOE)",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Butwal / Kathmandu",
          addressCountry: "NP",
        },
        sameAs: [
          "https://github.com/krishnabhandari01",
          "https://www.linkedin.com/in/krishnabhandari01",
        ],
        knowsAbout: [
          "Full-Stack Web Development",
          "Next.js",
          "React",
          "TypeScript",
          "ASP.NET Core",
          "C#",
          "Supabase PostgreSQL",
          "Cloud Architecture",
          "REST APIs",
          "IoT Telemetry",
          "Tailwind CSS",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${canonicalUrl}/#website`,
        url: canonicalUrl,
        name: "Krishna Prasad Bhandari Portfolio",
        description:
          settings["MetaDescription"] ||
          "Official engineering portfolio of Krishna Prasad Bhandari - Full-Stack Developer & Software Architect.",
        publisher: {
          "@id": `${canonicalUrl}/#person`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}/#profilepage`,
        url: canonicalUrl,
        name: "Krishna Prasad Bhandari Profile",
        isPartOf: {
          "@id": `${canonicalUrl}/#website`,
        },
        mainEntity: {
          "@id": `${canonicalUrl}/#person`,
        },
      },
    ],
  };

  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics (gtag.js) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${sora.variable} font-sora page bg-site text-white bg-cover bg-no-repeat relative`}
      >
        <TopLeftImg />
        <Nav />
        <Header />
        {children}
        <aside>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#393a47",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              },
            }}
          />
        </aside>
      </body>
    </html>
  );
}
