import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials & Client Feedback",
  description:
    "Read client testimonials and recommendations for Krishna Prasad Bhandari's engineering and software development work.",
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
