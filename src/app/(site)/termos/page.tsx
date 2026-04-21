import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getPageSection } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("termos");
}

export default async function TermsPage() {
  const section = await getPageSection("termos", "main");

  return (
    <div className="section-space">
      <div className="container-shell max-w-4xl">
        <div className="section-card rounded-[2rem] p-10">
          <SectionHeading eyebrow="Legal" title={section?.title ?? "Termos e Condições"} />
          <div className="mt-8 space-y-5 text-base leading-8 text-muted">
            <p>{section?.content}</p>
            <p>
              O painel administrativo permite atualizar estas condições, metas SEO e textos legais sem necessidade de alterar código.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
