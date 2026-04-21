import { deleteProfessionalAction, saveProfessionalAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminTeamData } from "@/lib/admin-data";

export default async function AdminTeamPage() {
  const data = await getAdminTeamData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Equipa"
        description="Crie perfis de profissionais, associe serviços, horários e indisponibilidades."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {data.professionals.map((professional) => (
          <form key={professional.id} action={saveProfessionalAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <input type="hidden" name="id" value={professional.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="name" defaultValue={professional.name} placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="slug" defaultValue={professional.slug} placeholder="Slug" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="specialty" defaultValue={professional.specialty} placeholder="Especialidade" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
              <input name="email" defaultValue={professional.email ?? ""} placeholder="Email" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="phone" defaultValue={professional.phone ?? ""} placeholder="Telefone" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="imageUrl" defaultValue={professional.imageUrl ?? ""} placeholder="Imagem" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
            </div>
            <textarea name="bio" defaultValue={professional.bio} rows={4} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Serviços associados</p>
              <div className="grid gap-2 md:grid-cols-2">
                {data.services.map((service) => (
                  <label key={`${professional.id}-${service.id}`} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
                    <input
                      type="checkbox"
                      name="serviceIds"
                      value={service.id}
                      defaultChecked={professional.services?.some((entry) => entry.serviceId === service.id)}
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked={professional.isActive ?? true} /> Ativa</label>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
              <button formAction={deleteProfessionalAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
            </div>
          </form>
        ))}

        <form action={saveProfessionalAction} className="section-card space-y-4 rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-foreground">Nova profissional</h2>
          <input name="name" placeholder="Nome" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="specialty" placeholder="Especialidade" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <textarea name="bio" rows={4} placeholder="Biografia" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <div className="grid gap-2 md:grid-cols-2">
            {data.services.map((service) => (
              <label key={`new-${service.id}`} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
                <input type="checkbox" name="serviceIds" value={service.id} />
                {service.name}
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked /> Ativa</label>
          <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar perfil</button>
        </form>
      </div>
    </div>
  );
}