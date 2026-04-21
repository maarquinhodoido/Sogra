import { deleteFaqAction, saveFaqAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminFaqData } from "@/lib/admin-data";

export default async function AdminFaqPage() {
  const items = await getAdminFaqData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="FAQ"
        description="Ordene perguntas frequentes e mantenha respostas claras sobre horários, atrasos e políticas."
      />
      <div className="grid gap-6 2xl:grid-cols-2">
        {items.map((item) => (
          <form key={item.id} action={saveFaqAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <input type="hidden" name="id" value={item.id} />
            <input name="question" defaultValue={item.question} placeholder="Pergunta" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <textarea name="answer" defaultValue={item.answer} rows={5} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked={item.isActive ?? true} /> Ativa</label>
              <input name="sortOrder" defaultValue={item.sortOrder ?? 0} type="number" className="w-24 rounded-2xl border border-line bg-white px-4 py-3" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
              <button formAction={deleteFaqAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
            </div>
          </form>
        ))}
        <form action={saveFaqAction} className="section-card space-y-4 rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-foreground">Nova pergunta</h2>
          <input name="question" placeholder="Pergunta" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <textarea name="answer" rows={5} placeholder="Resposta" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar pergunta</button>
        </form>
      </div>
    </div>
  );
}
