import { saveContactMessageAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminContactsData } from "@/lib/admin-data";

export default async function AdminContactsPage() {
  const contacts = await getAdminContactsData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Contactos recebidos"
        description="Consulte pedidos enviados pelo formulário público e assinale quais já tiveram resposta."
      />
      <div className="space-y-6">
        {contacts.map((message) => (
          <form key={message.id} action={saveContactMessageAction} className="section-card rounded-[2rem] p-6">
            <input type="hidden" name="id" value={message.id} />
            <div className="grid gap-4 xl:grid-cols-[0.8fr,1.2fr]">
              <div className="space-y-2 text-sm text-muted">
                <p className="text-lg font-semibold text-foreground">{message.name}</p>
                <p>{message.email}</p>
                <p>{message.phone}</p>
                <p>{message.subject}</p>
                <label className="mt-4 flex items-center gap-2 text-sm text-muted"><input name="replied" type="checkbox" defaultChecked={message.replied} /> Respondido</label>
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Atualizar</button>
              </div>
              <div className="rounded-[1.5rem] border border-line bg-white p-5 text-sm leading-7 text-muted">
                {message.message}
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}