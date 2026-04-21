import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getPageSection, getServiceCategoriesWithServices } from "@/lib/site-data";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata() {
  return buildPageMetadata("servicos");
}

export default async function ServicesPage() {
  const [intro, categories] = await Promise.all([
    getPageSection("servicos", "intro"),
    getServiceCategoriesWithServices(),
  ]);

  return (
    <div className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Serviços"
          title={intro?.title ?? "Serviços completos de unhas e cuidado premium."}
          description={intro?.content}
        />

        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category.id} className="section-card rounded-[2rem] p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-strong">Categoria</p>
                  <h2 className="mt-2 font-[family-name:var(--font-geist-mono)] text-4xl text-foreground">{category.name}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{category.description}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {category.services.map((service) => (
                  <article key={service.id} className="overflow-hidden rounded-[1.75rem] border border-line bg-white">
                    <div className="grid md:grid-cols-[0.9fr,1.1fr]">
                      <div className="relative min-h-[240px]">
                        <Image src={service.imageUrl ?? "/placeholders/service-classic.svg"} alt={service.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-4 p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-2xl font-semibold text-foreground">{service.name}</h3>
                          <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-muted">{service.description}</p>
                        <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
                          <span>Duração: {service.durationMinutes} min</span>
                          <Link href="/marcacoes" className="font-semibold text-foreground">
                            Marcar este serviço
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
