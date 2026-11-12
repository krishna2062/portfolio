import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education & Qualifications",
  description:
    "Academic background, degrees, certifications, and engineering education of Krishna Prasad Bhandari.",
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
