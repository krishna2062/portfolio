import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Skills & Technologies",
  description:
    "Explore the technical stack, frameworks, programming languages, and engineering tools mastered by Krishna Prasad Bhandari.",
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
