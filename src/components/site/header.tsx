import Link from "next/link";
import { CalendarDays, Camera, Menu, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/galeria", label: "Galeria" },
  { href: "/marcacoes", label: "Marcação" },
  { href: "/contactos", label: "Contactos" },
  { href: "/faq", label: "FAQ" },
];

type SiteHeaderProps = {
  businessName: string;
  instagramUrl: string;
  phone: string;
};

export function SiteHeader({ businessName, instagramUrl, phone }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[rgba(255,248,245,0.82)] backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
            LN
          </span>
          <div>
            <p className="font-[family-name:var(--font-geist-mono)] text-2xl leading-none text-foreground">
              {businessName}
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Beauty atelier</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line bg-surface p-3 text-muted hover:-translate-y-0.5 hover:text-foreground"
            aria-label="Instagram"
          >
            <Camera className="h-4 w-4" />
          </a>
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="rounded-full border border-line bg-surface px-4 py-3 text-sm font-semibold text-foreground hover:-translate-y-0.5"
          >
            <PhoneCall className="mr-2 inline h-4 w-4 text-primary-strong" />
            {phone}
          </a>
          <Link
            href="/marcacoes"
            className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5"
          >
            <CalendarDays className="mr-2 inline h-4 w-4" />
            Marcar agora
          </Link>
        </div>

        <details className="group lg:hidden">
          <summary className="list-none rounded-full border border-line bg-surface p-3 text-foreground">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute inset-x-4 top-[calc(100%+0.75rem)] rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className={cn("text-sm font-semibold text-muted", "hover:text-foreground")}>
                  {item.label}
                </Link>
              ))}
              <Link href="/marcacoes" className="rounded-full bg-foreground px-4 py-3 text-center text-sm font-semibold text-white">
                Marcar agora
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
