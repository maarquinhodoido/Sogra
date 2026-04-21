import { BookingForm } from "@/components/site/booking-form";
import { SectionHeading } from "@/components/site/section-heading";
import { buildPageMetadata, getProfessionals, getServices, getSiteSettings } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("marcacoes");
}

export default async function BookingPage() {
  const [services, professionals, settings] = await Promise.all([
    getServices(),
    getProfessionals(),
    getSiteSettings(),
  ]);

  return (
    <div className="section-space">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Marcação online"
            title="Escolha serviço, profissional, data e hora sem chamadas nem espera."
            description="O sistema valida disponibilidade real, evita conflitos de agenda e envia confirmação de marcação."
          />
          <div className="section-card rounded-[2rem] p-8 text-sm leading-7 text-muted">
            <p className="font-semibold text-foreground">O que está preparado no sistema</p>
            <ul className="mt-4 space-y-2">
              <li>Disponibilidade por agenda, pausas e bloqueios.</li>
              <li>Estados da marcação: pendente, confirmada, concluída, cancelada e não compareceu.</li>
              <li>Link para gerir, cancelar ou reagendar a marcação.</li>
              <li>Estrutura pronta para ativação de sinal, cupões e fidelização.</li>
            </ul>
          </div>
        </div>
        <BookingForm services={services} professionals={professionals} consentLabel={settings.consentLabel} />
      </div>
    </div>
  );
}
