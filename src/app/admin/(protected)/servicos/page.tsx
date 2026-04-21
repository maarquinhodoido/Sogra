import {
  deleteServiceAction,
  deleteServiceCategoryAction,
  saveServiceAction,
  saveServiceCategoryAction,
} from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminServicesData } from "@/lib/admin-data";
import { formatPrice } from "@/lib/utils";

export default async function AdminServicesPage() {
  const data = await getAdminServicesData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Serviços"
        description="Crie categorias, defina preços, duração, imagens e estado ativo de cada serviço."
      />

      <section className="grid gap-6 2xl:grid-cols-2">
        <div className="min-w-0 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Categorias</h2>
          {data.categories.map((category) => (
            <form key={category.id} action={saveServiceCategoryAction} className="section-card grid gap-4 rounded-[2rem] p-6 lg:grid-cols-[1fr,1fr,120px]">
              <input type="hidden" name="id" value={category.id} />
              <input name="name" defaultValue={category.name} placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="slug" defaultValue={category.slug} placeholder="Slug" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="sortOrder" defaultValue={category.sortOrder ?? 0} type="number" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <textarea name="description" defaultValue={category.description ?? ""} placeholder="Descrição" rows={3} className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-3" />
              <label className="flex items-center gap-2 text-sm text-muted md:col-span-2"><input name="isActive" type="checkbox" defaultChecked={category.isActive ?? true} /> Ativa</label>
              <div className="flex gap-3 md:justify-end">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
                <button formAction={deleteServiceCategoryAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
              </div>
            </form>
          ))}
          <form action={saveServiceCategoryAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Nova categoria</h3>
            <input name="name" placeholder="Nome" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <textarea name="description" placeholder="Descrição" rows={3} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked /> Ativa</label>
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar categoria</button>
          </form>
        </div>

        <div className="min-w-0 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Serviços</h2>
          {data.services.map((service) => (
            <form key={service.id} action={saveServiceAction} className="section-card space-y-4 rounded-[2rem] p-6">
              <input type="hidden" name="id" value={service.id} />
              <div className="flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-foreground">{service.name}</p>
                <p className="text-sm font-semibold text-primary-strong">{formatPrice(Number(service.price))}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input name="name" defaultValue={service.name} placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="slug" defaultValue={service.slug} placeholder="Slug" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <select name="categoryId" defaultValue={service.categoryId} className="rounded-2xl border border-line bg-white px-4 py-3">
                  {data.categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <input name="imageUrl" defaultValue={service.imageUrl ?? ""} placeholder="Imagem" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="price" defaultValue={Number(service.price)} type="number" step="0.01" placeholder="Preço" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="durationMinutes" defaultValue={service.durationMinutes} type="number" placeholder="Duração" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="sortOrder" defaultValue={service.sortOrder ?? 0} type="number" placeholder="Ordem" className="rounded-2xl border border-line bg-white px-4 py-3" />
              </div>
              <textarea name="description" defaultValue={service.description} rows={4} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked={service.isActive ?? true} /> Ativo</label>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
                <button formAction={deleteServiceAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
              </div>
            </form>
          ))}
          <form action={saveServiceAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Novo serviço</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="name" placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <select name="categoryId" className="rounded-2xl border border-line bg-white px-4 py-3">
                {data.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input name="price" type="number" step="0.01" placeholder="Preço" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="durationMinutes" type="number" placeholder="Duração" className="rounded-2xl border border-line bg-white px-4 py-3" />
            </div>
            <textarea name="description" rows={4} placeholder="Descrição" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked /> Ativo</label>
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar serviço</button>
          </form>
        </div>
      </section>
    </div>
  );
}
