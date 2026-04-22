"use client";

import { useMemo, useState } from "react";

type TeamService = {
  id: string;
  name: string;
};

type TeamProfessional = {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  bio: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  isActive: boolean;
  services?: Array<{ serviceId: string; service: { id: string; name: string } }>;
};

type TeamManagerProps = {
  professionals: TeamProfessional[];
  services: TeamService[];
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function TeamManager({ professionals, services, saveAction, deleteAction }: TeamManagerProps) {
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<TeamProfessional | null>(null);

  const filteredProfessionals = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return professionals;
    }

    return professionals.filter((professional) => {
      const haystack = [
        professional.name,
        professional.specialty,
        professional.email ?? "",
        professional.phone ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [professionals, query]);

  return (
    <div className="space-y-6">
      <div className="section-card rounded-[1.5rem] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">Pesquisar equipa</p>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar membro da equipa"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white"
          >
            Nova profissional
          </button>
        </div>
      </div>

      <div className="section-card rounded-[1.5rem] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <p className="text-sm font-semibold text-foreground">Quadro da equipa</p>
          <p className="text-xs text-muted">{filteredProfessionals.length} membro(s)</p>
        </div>

        <div className="max-h-[62vh] overflow-y-auto pr-1 sm:pr-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProfessionals.map((professional) => (
              <article key={professional.id} className="rounded-[1.25rem] border border-line bg-white p-5 shadow-[0_10px_24px_rgba(102,63,73,0.08)]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">{professional.name}</h2>
                    <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
                      {professional.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{professional.specialty}</p>
                  <p className="text-sm text-muted">{professional.email ?? "Sem email"}</p>
                  <p className="text-sm text-muted">{professional.phone ?? "Sem telefone"}</p>
                  <p className="text-xs text-muted">
                    Serviços: {professional.services?.map((entry) => entry.service.name).join(", ") || "Sem serviços associados"}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingProfessional(professional)}
                    className="rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted hover:text-foreground"
                  >
                    Editar
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredProfessionals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
              Nenhuma profissional encontrada para essa pesquisa.
            </div>
          ) : null}
        </div>
      </div>

      {isCreateOpen ? (
        <div className="admin-animate-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="admin-animate-pop w-full max-w-3xl rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Criar nova profissional</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted"
              >
                Fechar
              </button>
            </div>

            <form action={saveAction} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input name="name" required placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="slug" placeholder="Slug (opcional)" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="specialty" required placeholder="Especialidade" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
                <input name="email" placeholder="Email" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="phone" placeholder="Telefone" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="imageUrl" placeholder="Imagem" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
              </div>

              <textarea name="bio" rows={4} placeholder="Biografia" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Serviços associados</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {services.map((service) => (
                    <label key={service.id} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
                      <input type="checkbox" name="serviceIds" value={service.id} />
                      {service.name}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted">
                <input name="isActive" type="checkbox" defaultChecked /> Ativa
              </label>

              <div className="flex justify-end">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">
                  Criar profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editingProfessional ? (
        <div className="admin-animate-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="admin-animate-pop w-full max-w-3xl rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Editar profissional</h3>
              <button
                type="button"
                onClick={() => setEditingProfessional(null)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted"
              >
                Fechar
              </button>
            </div>

            <form action={saveAction} className="space-y-4">
              <input type="hidden" name="id" value={editingProfessional.id} />

              <div className="grid gap-4 md:grid-cols-2">
                <input name="name" required defaultValue={editingProfessional.name} placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="slug" defaultValue={editingProfessional.slug} placeholder="Slug" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="specialty" required defaultValue={editingProfessional.specialty} placeholder="Especialidade" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
                <input name="email" defaultValue={editingProfessional.email ?? ""} placeholder="Email" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="phone" defaultValue={editingProfessional.phone ?? ""} placeholder="Telefone" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="imageUrl" defaultValue={editingProfessional.imageUrl ?? ""} placeholder="Imagem" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
              </div>

              <textarea name="bio" rows={4} defaultValue={editingProfessional.bio} placeholder="Biografia" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Serviços associados</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {services.map((service) => (
                    <label key={`edit-${editingProfessional.id}-${service.id}`} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
                      <input
                        type="checkbox"
                        name="serviceIds"
                        value={service.id}
                        defaultChecked={editingProfessional.services?.some((entry) => entry.serviceId === service.id)}
                      />
                      {service.name}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted">
                <input name="isActive" type="checkbox" defaultChecked={editingProfessional.isActive} /> Ativa
              </label>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white"
                >
                  Guardar alterações
                </button>

                <button
                  type="submit"
                  formAction={deleteAction}
                  className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700"
                >
                  Excluir membro
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}