import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getPageSection, getProfessionals } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("sobre");
}

export default async function AboutPage() {
  const [story, values, professionals] = await Promise.all([
    getPageSection("sobre", "story"),
    getPageSection("sobre", "values"),
    getProfessionals(),
  ]);

  return (
    <div className="section-space">
      <div className="container-shell space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1fr,1fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading eyebrow="Sobre nós" title={story?.title ?? "Um espaço pensado para o detalhe."} description={story?.subtitle} />
            <p className="text-base leading-8 text-muted">{story?.content}</p>
          </div>
          <div className="section-card overflow-hidden rounded-[2.5rem] p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image src={story?.imageUrl ?? "/placeholders/studio-space.svg"} alt="Espaço do salão" fill className="object-cover" />
            </div>
          </div>
        </div>

        <section className="section-card rounded-[2rem] p-8">
          <SectionHeading eyebrow="Missão e valores" title={values?.title ?? "O que orienta cada visita."} description={values?.content} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "Missão", text: "Elevar a experiência de cuidado de unhas com técnica, organização e hospitalidade." },
              { title: "Visão", text: "Ser referência em atendimento premium, confiança e consistência estética." },
              { title: "Valores", text: "Higiene, detalhe, empatia, pontualidade, transparência e atualização constante." },
            ].map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-line bg-white p-6">
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading eyebrow="Equipa" title="Profissionais preparadas para diferentes estilos e necessidades." />
          <div className="grid gap-6 lg:grid-cols-3">
            {professionals.map((professional) => (
              <article key={professional.id} className="section-card overflow-hidden rounded-[2rem]">
                <div className="relative aspect-[4/5]">
                  <Image src={professional.imageUrl ?? "/placeholders/team-ana.svg"} alt={professional.name} fill className="object-cover" />
                </div>
                <div className="space-y-3 p-6">
                  <h3 className="text-2xl font-semibold text-foreground">{professional.name}</h3>
                  <p className="text-sm font-semibold text-primary-strong">{professional.specialty}</p>
                  <p className="text-sm leading-7 text-muted">{professional.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
