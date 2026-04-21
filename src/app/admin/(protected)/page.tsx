import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminDashboardData } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardData();

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Visão geral operacional do salão, com acesso rápido às principais áreas de gestão."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Marcações", stats.appointments],
          ["Clientes", stats.customers],
          ["Serviços ativos", stats.services],
          ["Profissionais", stats.professionals],
          ["Contactos", stats.messages],
        ].map(([label, value]) => (
          <article key={label} className="section-card rounded-[2rem] p-6">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-3 text-4xl font-semibold text-foreground">{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          ["Gestão de conteúdos", "/admin/conteudo", "Editar homepage, banners, promoções e textos."],
          ["Agenda e equipa", "/admin/marcacoes", "Confirmar, reagendar e acompanhar a agenda completa."],
          ["Configurações", "/admin/configuracoes", "SEO, contactos, branding e regras do salão."],
        ].map(([title, href, text]) => (
          <article key={String(href)} className="section-card rounded-[2rem] p-6">
            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
            <Link href={String(href)} className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">
              Abrir módulo
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
