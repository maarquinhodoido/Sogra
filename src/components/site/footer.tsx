import Link from "next/link";
import { Camera, Clock3, MapPin, Phone, Send } from "lucide-react";
import type { BusinessHourData, SiteSettingsData } from "@/lib/demo-data";
import { weekdayLabel } from "@/lib/utils";

type SiteFooterProps = {
  settings: SiteSettingsData;
  hours: BusinessHourData[];
};

export function SiteFooter({ settings, hours }: SiteFooterProps) {
  return (
    <footer className="mt-20 border-t border-line bg-[#22181a] py-16 text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr,0.9fr,0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Luxe Nails Atelier</p>
          <h3 className="mt-4 font-[family-name:var(--font-geist-mono)] text-4xl text-white">
            Beleza premium, agenda organizada e atendimento caloroso.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">{settings.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white"
            >
              <Camera className="mr-2 inline h-4 w-4" /> Instagram
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D+/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white"
            >
              <Send className="mr-2 inline h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="space-y-4 text-sm text-white/75">
          <h4 className="text-lg font-semibold text-white">Contactos</h4>
          <p>
            <Phone className="mr-2 inline h-4 w-4 text-primary" /> {settings.phone}
          </p>
          <p>{settings.businessEmail}</p>
          <p>
            <MapPin className="mr-2 inline h-4 w-4 text-primary" /> {settings.address}, {settings.postalCode} {settings.city}
          </p>
          <div className="flex flex-wrap gap-4 pt-3">
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
            <Link href="/termos" className="hover:text-white">Termos</Link>
            <Link href="/admin/login" className="hover:text-white">Admin</Link>
          </div>
        </div>

        <div className="space-y-4 text-sm text-white/75">
          <h4 className="text-lg font-semibold text-white">Horário</h4>
          {hours.map((hour) => (
            <div key={`${hour.weekday}-${hour.professionalSlug ?? "general"}`} className="flex items-start justify-between gap-4 border-b border-white/10 pb-2">
              <span>
                <Clock3 className="mr-2 inline h-4 w-4 text-primary" /> {weekdayLabel(hour.weekday)}
              </span>
              <span>
                {hour.isClosed ? "Fechado" : `${hour.opensAt} - ${hour.closesAt}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
