import { Star } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getPageSection, getTestimonials } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("testemunhos");
}

export default async function TestimonialsPage() {
  const [intro, testimonials] = await Promise.all([
    getPageSection("testemunhos", "intro"),
    getTestimonials(),
  ]);

  return (
    <div className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading eyebrow="Testemunhos" title={intro?.title ?? "Experiências reais de clientes."} description={intro?.content} />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="section-card rounded-[2rem] p-8">
              <div className="mb-5 flex gap-1 text-accent">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={`${testimonial.id}-${index}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-base leading-8 text-muted">“{testimonial.comment}”</p>
              <p className="mt-6 text-sm font-semibold text-foreground">{testimonial.clientName}</p>
              <p className="text-sm text-muted">{testimonial.serviceName}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
