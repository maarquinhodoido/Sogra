import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getFooterData, getSiteSettings } from "@/lib/site-data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, footerData] = await Promise.all([getSiteSettings(), getFooterData()]);

  return (
    <>
      <SiteHeader
        businessName={settings.businessName}
        instagramUrl={settings.instagramUrl}
        phone={settings.phone}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={footerData.settings} hours={footerData.hours} />
    </>
  );
}
