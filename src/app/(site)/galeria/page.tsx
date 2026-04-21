import { GalleryBrowser } from "@/components/site/gallery-browser";
import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getGalleryItems, getPageSection } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("galeria");
}

export default async function GalleryPage() {
  const [intro, items] = await Promise.all([getPageSection("galeria", "intro"), getGalleryItems()]);

  return (
    <div className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Galeria"
          title={intro?.title ?? "Portfólio premium de trabalhos recentes."}
          description={intro?.content}
        />
        <GalleryBrowser items={items} />
      </div>
    </div>
  );
}
