import { saveAppointmentAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminAppointmentsData } from "@/lib/admin-data";

function toInputDateTime(value: Date) {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const appointments = await getAdminAppointmentsData();
  const filtered = appointments.filter((appointment) => {
    const matchesStatus = params.status ? appointment.status === params.status : true;
    const term = params.q?.toLowerCase() ?? "";
    const matchesQuery = term
      ? [appointment.customer.name, appointment.customer.email ?? "", appointment.service.name, appointment.professional.name]
          .join(" ")
          .toLowerCase()
          .includes(term)
      : true;
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Marcações"
        description="Acompanhe a agenda, pesquise clientes e altere o estado, notas internas ou data da marcação."
      />

      <form className="section-card grid gap-4 rounded-[2rem] p-6 md:grid-cols-[1fr,220px,160px]">
        <input name="q" defaultValue={params.q ?? ""} placeholder="Pesquisar cliente, serviço ou profissional" className="rounded-2xl border border-line bg-white px-4 py-3" />
        <select name="status" defaultValue={params.status ?? ""} className="rounded-2xl border border-line bg-white px-4 py-3">
          <option value="">Todos os estados</option>
          <option value="PENDING">Pendente</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="COMPLETED">Concluída</option>
          <option value="CANCELED">Cancelada</option>
          <option value="NO_SHOW">Não compareceu</option>
        </select>
        <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Filtrar</button>
      </form>

      <div className="space-y-6">
        {filtered.map((appointment) => (
          <form key={appointment.id} action={saveAppointmentAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <input type="hidden" name="id" value={appointment.id} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">{appointment.customer.name}</p>
                <p className="text-sm text-muted">{appointment.service.name} com {appointment.professional.name}</p>
              </div>
              <StatusBadge value={appointment.status} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input name="startAt" type="datetime-local" defaultValue={toInputDateTime(appointment.startAt)} className="rounded-2xl border border-line bg-white px-4 py-3" />
              <select name="status" defaultValue={appointment.status} className="rounded-2xl border border-line bg-white px-4 py-3">
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELED">Cancelada</option>
                <option value="NO_SHOW">Não compareceu</option>
              </select>
              <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">{appointment.customer.email}</div>
              <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">{appointment.customer.phone}</div>
            </div>
            <textarea name="internalNotes" defaultValue={appointment.internalNotes ?? ""} rows={4} placeholder="Notas internas" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Atualizar marcação</button>
          </form>
        ))}
      </div>
    </div>
  );
}
