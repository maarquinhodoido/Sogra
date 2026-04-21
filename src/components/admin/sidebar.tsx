"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const groups = [
  {
    title: "Geral",
    items: [["/admin", "Dashboard"]],
  },
  {
    title: "Conteudo",
    items: [
      ["/admin/conteudo", "Conteúdo"],
      ["/admin/servicos", "Serviços"],
      ["/admin/galeria", "Galeria"],
      ["/admin/testemunhos", "Testemunhos"],
      ["/admin/faq", "FAQ"],
    ],
  },
  {
    title: "Operacao",
    items: [
      ["/admin/marcacoes", "Marcações"],
      ["/admin/clientes", "Clientes"],
      ["/admin/contactos", "Contactos"],
      ["/admin/equipa", "Equipa"],
      ["/admin/disponibilidade", "Disponibilidade"],
    ],
  },
  {
    title: "Sistema",
    items: [
      ["/admin/configuracoes", "Configurações"],
      ["/admin/utilizadores", "Utilizadores"],
    ],
  },
];

export function AdminSidebar({ className }: { className?: string }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <aside className={cn("section-card overflow-visible rounded-[1.5rem] p-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Painel Admin</p>
      <div className="mt-4 flex flex-wrap items-start gap-2">
        {groups.map((group) => (
          <div key={group.title} className="relative">
            <button
              type="button"
              onClick={() => setOpenGroup((value) => (value === group.title ? null : group.title))}
              className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted hover:text-foreground"
            >
              {group.title}
            </button>
            <div
              className={cn(
                "admin-animate-pop absolute left-0 top-[calc(100%+0.5rem)] z-30 min-w-[220px] rounded-2xl border border-line bg-white p-2 shadow-[0_14px_36px_rgba(102,63,73,0.14)]",
                openGroup === group.title ? "block" : "hidden",
              )}
            >
              <div className="flex flex-col gap-1">
                {group.items.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpenGroup(null)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-strong hover:text-foreground"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
