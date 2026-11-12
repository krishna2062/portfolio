import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio & Engineering Projects",
  description:
    "Explore engineering projects, web applications, and enterprise solutions built by Krishna Prasad Bhandari using React, Next.js, ASP.NET Core, and PostgreSQL.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
