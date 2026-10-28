import type { Metadata } from "next";
import { LinksBoard } from "@/components/links-board";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Links",
  description:
    "Every live URL in one place — repo, site, profiles, exam resources and the free tools this journey runs on.",
};

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <SectionHeading
        eyebrow="Links"
        title="Everything, one click away"
        description="The site, the source, my profiles, the exam resources and the free tools the whole system runs on. Every one of these is free — the constraint was a feature, not a budget problem."
      />
      <LinksBoard />
    </div>
  );
}
