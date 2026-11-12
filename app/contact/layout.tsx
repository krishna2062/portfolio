import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Hire Krishna Prasad Bhandari",
  description:
    "Get in touch with Krishna Prasad Bhandari for freelance projects, software engineering opportunities, or technical consultations.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

