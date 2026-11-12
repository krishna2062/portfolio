import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me | Full-Stack Software Engineer",
  description:
    "Learn about Krishna Prasad Bhandari - Full-Stack Developer & Computer Engineering student with extensive experience in Next.js, React, Node.js, and ASP.NET Core.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
