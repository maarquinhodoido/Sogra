import { deleteAdminUserAction, saveAdminUserAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminUsersData } from "@/lib/admin-data";

export default async function AdminUsersPage() {
  const users = await getAdminUsersData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Utilizadores admin"
        description="Gerir perfis com permissões, password, notas internas e estado ativo."
      />
      <div className="grid gap-6 2xl:grid-cols-2">
        {users.map((user) => (
          <form key={user.id} action={saveAdminUserAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <input type="hidden" name="id" value={user.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="name" defaultValue={user.name} placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="email" defaultValue={user.email} placeholder="Email" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <select name="role" defaultValue={user.role} className="rounded-2xl border border-line bg-white px-4 py-3">
                <option value="SUPER_ADMIN">Admin principal</option>
                <option value="MANAGER">Colaborador</option>
                <option value="RECEPTION">Receção</option>
              </select>
              <input name="password" type="password" placeholder="Nova password" className="rounded-2xl border border-line bg-white px-4 py-3" />
            </div>
            <textarea name="notes" defaultValue={user.notes ?? ""} rows={4} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked={user.isActive} /> Ativo</label>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
              <button formAction={deleteAdminUserAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
            </div>
          </form>
        ))}
        <form action={saveAdminUserAction} className="section-card space-y-4 rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-foreground">Novo utilizador</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" placeholder="Nome" className="rounded-2xl border border-line bg-white px-4 py-3" />
            <input name="email" placeholder="Email" className="rounded-2xl border border-line bg-white px-4 py-3" />
            <select name="role" defaultValue="MANAGER" className="rounded-2xl border border-line bg-white px-4 py-3">
              <option value="SUPER_ADMIN">Admin principal</option>
              <option value="MANAGER">Colaborador</option>
              <option value="RECEPTION">Receção</option>
            </select>
            <input name="password" type="password" placeholder="Password" className="rounded-2xl border border-line bg-white px-4 py-3" />
          </div>
          <textarea name="notes" rows={4} placeholder="Notas" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <label className="flex items-center gap-2 text-sm text-muted"><input name="isActive" type="checkbox" defaultChecked /> Ativo</label>
          <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar utilizador</button>
        </form>
      </div>
    </div>
  );
}
