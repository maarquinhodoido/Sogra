import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getFaqs, getPageSection } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("faq");
}

export default async function FaqPage() {
  const [intro, items] = await Promise.all([getPageSection("faq", "intro"), getFaqs()]);

  return (
    <div className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading eyebrow="FAQ" title={intro?.title ?? "Dúvidas frequentes antes da sua visita."} description={intro?.content} />
        <div className="space-y-4">
          {items.map((item) => (
            <details key={item.id} className="section-card rounded-[1.75rem] p-6">
              <summary className="cursor-pointer list-none text-lg font-semibold text-foreground">{item.question}</summary>
              <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
