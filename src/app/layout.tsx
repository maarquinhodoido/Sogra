import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getSiteSettings } from "@/lib/site-data";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    keywords: settings.metaKeywords?.split(",").map((keyword) => keyword.trim()),
    applicationName: settings.businessName,
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      siteName: settings.businessName,
      locale: "pt_PT",
      type: "website",
      images: settings.heroImageUrl ? [settings.heroImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: settings.heroImageUrl ? [settings.heroImageUrl] : undefined,
    },
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
