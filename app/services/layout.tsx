import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Technical Solutions",
  description:
    "Full-stack web development, REST API architecture, cloud database integration, and UI/UX design services by Krishna Prasad Bhandari.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

