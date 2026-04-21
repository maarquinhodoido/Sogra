import Link from "next/link";

const items = [
  ["/admin", "Dashboard"],
  ["/admin/conteudo", "Conteúdo"],
  ["/admin/servicos", "Serviços"],
  ["/admin/galeria", "Galeria"],
  ["/admin/marcacoes", "Marcações"],
  ["/admin/clientes", "Clientes"],
  ["/admin/equipa", "Equipa"],
  ["/admin/disponibilidade", "Disponibilidade"],
  ["/admin/testemunhos", "Testemunhos"],
  ["/admin/faq", "FAQ"],
  ["/admin/configuracoes", "Configurações"],
  ["/admin/utilizadores", "Utilizadores"],
  ["/admin/contactos", "Contactos recebidos"],
];

export function AdminSidebar() {
  return (
    <aside className="section-card sticky top-6 hidden h-[calc(100vh-3rem)] rounded-[2rem] p-6 xl:block">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Painel Admin</p>
      <div className="mt-6 flex flex-col gap-2">
        {items.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm font-semibold text-muted hover:bg-white hover:text-foreground">
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
