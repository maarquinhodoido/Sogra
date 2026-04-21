import { ContactForm } from "@/components/site/contact-form";
import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getPageSection, getSiteSettings } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("contactos");
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const [settings, intro, params] = await Promise.all([
    getSiteSettings(),
    getPageSection("contactos", "intro"),
    searchParams,
  ]);

  return (
    <div className="section-space">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Contactos"
            title={intro?.title ?? "Fale connosco com rapidez."}
            description={intro?.content}
          />
          <div className="section-card rounded-[2rem] p-8 text-sm leading-7 text-muted">
            <p><strong className="text-foreground">Telefone:</strong> {settings.phone}</p>
            <p><strong className="text-foreground">Email:</strong> {settings.businessEmail}</p>
            <p><strong className="text-foreground">Morada:</strong> {settings.address}, {settings.postalCode} {settings.city}</p>
            <p><strong className="text-foreground">WhatsApp:</strong> {settings.whatsapp}</p>
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-line">
              <iframe
                title="Mapa do salão"
                src={`${settings.googleMapsUrl}&output=embed`}
                className="h-[280px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          {params.sent === "1" ? (
            <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
              Mensagem enviada com sucesso.
            </p>
          ) : null}
        </div>

        <ContactForm consentLabel={settings.consentLabel} />
      </div>
    </div>
  );
}