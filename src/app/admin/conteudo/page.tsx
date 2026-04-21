import {
  deleteBannerAction,
  deletePageContentAction,
  deletePromotionAction,
  saveBannerAction,
  savePageContentAction,
  savePromotionAction,
} from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminContentData } from "@/lib/admin-data";

export default async function AdminContentPage() {
  const data = await getAdminContentData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Conteúdo"
        description="Edite textos, blocos de página, banners e promoções sem alterar o código do site."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Secções das páginas</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          {data.pages.map((page) => (
            <form key={page.id ?? `${page.slug}-${page.sectionKey}`} action={savePageContentAction} className="section-card space-y-4 rounded-[2rem] p-6">
              <input type="hidden" name="id" value={page.id ?? ""} />
              <div className="grid gap-4 md:grid-cols-2">
                <input name="slug" defaultValue={page.slug} placeholder="Slug" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="sectionKey" defaultValue={page.sectionKey} placeholder="Chave" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="title" defaultValue={page.title} placeholder="Título" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
                <input name="subtitle" defaultValue={page.subtitle ?? ""} placeholder="Subtítulo" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
                <input name="imageUrl" defaultValue={page.imageUrl ?? ""} placeholder="Imagem" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
                <input name="ctaLabel" defaultValue={page.ctaLabel ?? ""} placeholder="Botão" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="ctaHref" defaultValue={page.ctaHref ?? ""} placeholder="Link do botão" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="metaTitle" defaultValue={page.metaTitle ?? ""} placeholder="Meta title" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
                <input name="metaKeywords" defaultValue={page.metaKeywords ?? ""} placeholder="Keywords" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
              </div>
              <textarea name="metaDescription" defaultValue={page.metaDescription ?? ""} placeholder="Meta description" rows={3} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <textarea name="content" defaultValue={page.content ?? ""} placeholder="Conteúdo" rows={6} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input name="isActive" type="checkbox" defaultChecked={page.isActive ?? true} /> Ativa
                </label>
                <input name="sortOrder" defaultValue={page.sortOrder ?? 0} type="number" className="w-24 rounded-2xl border border-line bg-white px-4 py-3" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
              </div>
            </form>
          ))}
          <form action={savePageContentAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Nova secção</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="slug" placeholder="Slug" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="sectionKey" placeholder="Chave" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="title" placeholder="Título" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
              <input name="subtitle" placeholder="Subtítulo" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
            </div>
            <textarea name="content" rows={6} placeholder="Conteúdo" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked /> Ativa</label>
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar secção</button>
          </form>
        </div>
        <div className="grid gap-3">
          {data.pages.filter((page) => page.id).map((page) => (
            <form key={`delete-${page.id}`} action={deletePageContentAction} className="inline-flex">
              <input type="hidden" name="id" value={page.id} />
              <button type="submit" className="text-sm font-semibold text-red-700">Remover {page.slug}/{page.sectionKey}</button>
            </form>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Banners</h2>
          {data.banners.map((banner) => (
            <form key={banner.id} action={saveBannerAction} className="section-card space-y-4 rounded-[2rem] p-6">
              <input type="hidden" name="id" value={banner.id} />
              <input name="title" defaultValue={banner.title} placeholder="Título" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="subtitle" defaultValue={banner.subtitle ?? ""} placeholder="Subtítulo" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="imageUrl" defaultValue={banner.imageUrl ?? ""} placeholder="Imagem" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <div className="grid gap-4 md:grid-cols-2">
                <input name="placement" defaultValue={banner.placement} placeholder="Placement" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="ctaLabel" defaultValue={banner.ctaLabel ?? ""} placeholder="Texto botão" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="ctaHref" defaultValue={banner.ctaHref ?? ""} placeholder="Link botão" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked={banner.isActive ?? true} /> Ativo</label>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
                <button formAction={deleteBannerAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
              </div>
            </form>
          ))}
          <form action={saveBannerAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Novo banner</h3>
            <input name="title" placeholder="Título" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <input name="placement" defaultValue="home-hero" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked /> Ativo</label>
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar banner</button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Promoções</h2>
          {data.promotions.map((promotion) => (
            <form key={promotion.id} action={savePromotionAction} className="section-card space-y-4 rounded-[2rem] p-6">
              <input type="hidden" name="id" value={promotion.id} />
              <input name="title" defaultValue={promotion.title} placeholder="Título" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="subtitle" defaultValue={promotion.subtitle ?? ""} placeholder="Subtítulo" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <textarea name="description" defaultValue={promotion.description} rows={4} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <div className="grid gap-4 md:grid-cols-2">
                <input name="badge" defaultValue={promotion.badge ?? ""} placeholder="Badge" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="imageUrl" defaultValue={promotion.imageUrl ?? ""} placeholder="Imagem" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="ctaLabel" defaultValue={promotion.ctaLabel ?? ""} placeholder="Botão" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="ctaHref" defaultValue={promotion.ctaHref ?? ""} placeholder="Link" className="rounded-2xl border border-line bg-white px-4 py-3" />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked={promotion.isActive ?? true} /> Ativa</label>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
                <button formAction={deletePromotionAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
              </div>
            </form>
          ))}
          <form action={savePromotionAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Nova promoção</h3>
            <input name="title" placeholder="Título" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <textarea name="description" rows={4} placeholder="Descrição" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked /> Ativa</label>
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar promoção</button>
          </form>
        </div>
      </section>
    </div>
  );
}
