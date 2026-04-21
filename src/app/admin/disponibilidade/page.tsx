import { deleteTimeOffAction, saveBusinessHourAction, saveTimeOffAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminAvailabilityData } from "@/lib/admin-data";
import { weekdayLabel } from "@/lib/utils";

function toInputDateTime(value: Date) {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default async function AdminAvailabilityPage() {
  const data = await getAdminAvailabilityData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Disponibilidade"
        description="Defina horários gerais, pausas, fechos, feriados e indisponibilidades por profissional."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Horários</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          {data.hours.map((hour) => (
            <form key={hour.id} action={saveBusinessHourAction} className="section-card grid gap-4 rounded-[2rem] p-6 md:grid-cols-2">
              <input type="hidden" name="id" value={hour.id} />
              <select name="weekday" defaultValue={String(hour.weekday)} className="rounded-2xl border border-line bg-white px-4 py-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <option key={index} value={index}>{weekdayLabel(index)}</option>
                ))}
              </select>
              <select name="professionalId" defaultValue={hour.professionalId ?? ""} className="rounded-2xl border border-line bg-white px-4 py-3">
                <option value="">Horário geral</option>
                {data.professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>{professional.name}</option>
                ))}
              </select>
              <input name="opensAt" defaultValue={hour.opensAt} placeholder="Abertura" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="closesAt" defaultValue={hour.closesAt} placeholder="Fecho" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="breakStart" defaultValue={hour.breakStart ?? ""} placeholder="Início pausa" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="breakEnd" defaultValue={hour.breakEnd ?? ""} placeholder="Fim pausa" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <label className="flex items-center gap-2 text-sm text-muted md:col-span-2"><input name="isClosed" type="checkbox" defaultChecked={hour.isClosed} /> Fechado</label>
              <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white md:col-span-2">Guardar horário</button>
            </form>
          ))}
          <form action={saveBusinessHourAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Novo horário</h3>
            <select name="weekday" className="w-full rounded-2xl border border-line bg-white px-4 py-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <option key={index} value={index}>{weekdayLabel(index)}</option>
              ))}
            </select>
            <select name="professionalId" className="w-full rounded-2xl border border-line bg-white px-4 py-3">
              <option value="">Horário geral</option>
              {data.professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>{professional.name}</option>
              ))}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="opensAt" placeholder="09:30" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="closesAt" placeholder="19:00" className="rounded-2xl border border-line bg-white px-4 py-3" />
            </div>
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar horário</button>
          </form>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Bloqueios e folgas</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          {data.timeOffs.map((timeOff) => (
            <form key={timeOff.id} action={saveTimeOffAction} className="section-card space-y-4 rounded-[2rem] p-6">
              <input type="hidden" name="id" value={timeOff.id} />
              <input name="title" defaultValue={timeOff.title} placeholder="Título" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <textarea name="reason" defaultValue={timeOff.reason ?? ""} rows={3} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
              <select name="professionalId" defaultValue={timeOff.professionalId ?? ""} className="w-full rounded-2xl border border-line bg-white px-4 py-3">
                <option value="">Bloqueio geral</option>
                {data.professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>{professional.name}</option>
                ))}
              </select>
              <div className="grid gap-4 md:grid-cols-2">
                <input name="startsAt" type="datetime-local" defaultValue={toInputDateTime(timeOff.startsAt)} className="rounded-2xl border border-line bg-white px-4 py-3" />
                <input name="endsAt" type="datetime-local" defaultValue={toInputDateTime(timeOff.endsAt)} className="rounded-2xl border border-line bg-white px-4 py-3" />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted"><input name="isAllDay" type="checkbox" defaultChecked={timeOff.isAllDay} /> Dia inteiro</label>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
                <button formAction={deleteTimeOffAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
              </div>
            </form>
          ))}
          <form action={saveTimeOffAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <h3 className="text-xl font-semibold text-foreground">Novo bloqueio</h3>
            <input name="title" placeholder="Título" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <textarea name="reason" rows={3} placeholder="Motivo" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="startsAt" type="datetime-local" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="endsAt" type="datetime-local" className="rounded-2xl border border-line bg-white px-4 py-3" />
            </div>
            <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar bloqueio</button>
          </form>
        </div>
      </section>
    </div>
  );
}
