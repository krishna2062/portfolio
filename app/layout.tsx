import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

import Header from "@/components/Header";
import Nav from "@/components/Nav";
import TopLeftImg from "@/components/TopLeftImg";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora-family",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Krishna Portfolio | Full Stack Developer",
  description: "Personal portfolio of Krishna - Full Stack Developer & Computer Engineering Student specializing in ASP.NET Core, React, and IoT Telemetry.",
  keywords: ["Krishna", "Krishna Portfolio", "Full Stack Developer", "Nepal", "React", "ASP.NET Core"],
  openGraph: {
    title: "Krishna Portfolio | Full Stack Developer",
    description: "Personal portfolio of Krishna - Full Stack Developer & Computer Engineering Student",
  },
  icons: {
    icon: "/assets/logo.png",
  },
  authors: [{ name: "Krishna" }],
  other: {
    "theme-color": "#f13024",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <head>
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RE7ER17RWK" strategy="afterInteractive" />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RE7ER17RWK', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
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
