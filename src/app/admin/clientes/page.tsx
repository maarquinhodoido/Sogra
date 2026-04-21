import { saveCustomerNotesAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminCustomersData } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomersData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Clientes"
        description="Consulte histórico de marcações, contactos e observações internas de cada cliente."
      />
      <div className="space-y-6">
        {customers.map((customer) => (
          <article key={customer.id} className="section-card rounded-[2rem] p-6">
            <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">{customer.name}</h2>
                <p className="text-sm text-muted">{customer.email}</p>
                <p className="text-sm text-muted">{customer.phone}</p>
                <p className="text-sm text-muted">Total de marcações: {customer.appointments.length}</p>
                <form action={saveCustomerNotesAction} className="space-y-3">
                  <input type="hidden" name="id" value={customer.id} />
                  <textarea name="notes" defaultValue={customer.notes ?? ""} rows={5} placeholder="Observações internas" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
                  <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar notas</button>
                </form>
              </div>
              <div className="space-y-3">
                {customer.appointments.length ? customer.appointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-[1.5rem] border border-line bg-white p-4 text-sm text-muted">
                    <p className="font-semibold text-foreground">{appointment.service.name}</p>
                    <p>{formatDateTime(appointment.startAt)}</p>
                    <p>{appointment.professional.name}</p>
                    <p>Estado: {appointment.status}</p>
                  </div>
                )) : <p className="text-sm text-muted">Sem histórico de marcações.</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
