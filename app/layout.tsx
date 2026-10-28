import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(
    `https://${process.env.NEXT_PUBLIC_SITE_HOST ?? "pabitra27706-oss.github.io"}${basePath}`,
  ),
  title: {
    default: `${site.name} — Skill-readiness journey`,
    template: `%s · ${site.name}`,
  },
  description: site.intro,
  keywords: [
    "portfolio",
    "CS student",
    "AI learning",
    "skill readiness",
    "web development",
    "Kolkata",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.intro,
    type: "website",
    url: basePath || "/",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#06070c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <div className="grid-bg pointer-events-none fixed inset-0 -z-10" />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
