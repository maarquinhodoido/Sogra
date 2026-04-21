import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getPageSection } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("privacidade");
}

export default async function PrivacyPage() {
  const section = await getPageSection("privacidade", "main");

  return (
    <div className="section-space">
      <div className="container-shell max-w-4xl">
        <div className="section-card rounded-[2rem] p-10">
          <SectionHeading eyebrow="Legal" title={section?.title ?? "Política de Privacidade"} />
          <div className="mt-8 space-y-5 text-base leading-8 text-muted">
            <p>{section?.content}</p>
            <p>
              Os formulários deste site pedem consentimento explícito antes do envio e armazenam apenas a informação estritamente necessária para prestação do serviço.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
