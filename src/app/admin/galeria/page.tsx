import { deleteGalleryItemAction, saveGalleryItemAction, uploadMediaAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminGalleryData } from "@/lib/admin-data";

export default async function AdminGalleryPage() {
  const data = await getAdminGalleryData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Galeria e media"
        description="Faça upload de imagens, guarde assets e organize os trabalhos mostrados no portfólio público."
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <form action={uploadMediaAction} className="section-card space-y-4 rounded-[2rem] p-6" encType="multipart/form-data">
          <h2 className="text-2xl font-semibold text-foreground">Upload de media</h2>
          <input name="title" placeholder="Título do ficheiro" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="altText" placeholder="Alt text" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="kind" defaultValue="gallery" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="file" type="file" accept="image/*" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Enviar imagem</button>
        </form>

        <div className="section-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-foreground">Biblioteca</h2>
          <div className="mt-6 space-y-3 text-sm text-muted">
            {data.media.length ? data.media.map((asset) => (
              <div key={asset.id} className="rounded-2xl border border-line bg-white px-4 py-3">
                <p className="font-semibold text-foreground">{asset.title}</p>
                <p>{asset.filePath}</p>
              </div>
            )) : <p>Nenhum asset carregado ainda.</p>}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Itens da galeria</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          {data.gallery.map((item) => (
            <form key={item.id} action={saveGalleryItemAction} className="section-card space-y-4 rounded-[2rem] p-6">
              <input type="hidden" name="id" value={item.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <input name="title" defaultValue={item.title} placeholder="Título" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="category" defaultValue={item.category} placeholder="Categoria" className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="imageUrl" defaultValue={item.imageUrl} placeholder="Imagem" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
                <input name="altText" defaultValue={item.altText ?? ""} placeholder="Alt text" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
              </div>
              <textarea name="description" defaultValue={item.description ?? ""} rows={4} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-muted"><input name="isFeatured" type="checkbox" defaultChecked={item.isFeatured ?? false} /> Destaque</label>
                <input name="sortOrder" defaultValue={item.sortOrder ?? 0} type="number" className="w-24 rounded-2xl border border-line bg-white px-4 py-3" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
                <button formAction={deleteGalleryItemAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
              </div>
            </form>
          ))}
          <form action={saveGalleryItemAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Novo item</h3>
            <input name="title" placeholder="Título" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <input name="category" placeholder="Categoria" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <input name="imageUrl" placeholder="URL da imagem" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <textarea name="description" rows={4} placeholder="Descrição" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar item</button>
          </form>
        </div>
      </section>
    </div>
  );
}
